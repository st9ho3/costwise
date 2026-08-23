import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { ingredientsTable, supplierIngredients } from "../src/schema";

// One-shot, idempotent: copies each ingredient's unit/unit_price/quantity
// from its supplier_ingredients rows (duplicates by construction) onto the
// restored canonical columns. Rolls back on any inconsistency.
const run = async () => {
  await db.transaction(async (tx) => {
    const supRows = await tx.select().from(supplierIngredients);
    const allIngredients = await tx.select().from(ingredientsTable);

    const byIngredient = new Map<string, typeof supRows>();
    for (const row of supRows) {
      const list = byIngredient.get(row.ingredientId) ?? [];
      list.push(row);
      byIngredient.set(row.ingredientId, list);
    }

    let updated = 0;
    const disagreements: string[] = [];
    for (const [ingredientId, rows] of byIngredient) {
      const first = rows[0];
      const disagree = rows.some(
        (r) =>
          r.unit !== first.unit ||
          Number(r.unitPrice) !== Number(first.unitPrice) ||
          Number(r.quantity) !== Number(first.quantity),
      );
      if (disagree) {
        disagreements.push(ingredientId);
        continue;
      }
      await tx
        .update(ingredientsTable)
        .set({
          unit: first.unit,
          unitPrice: first.unitPrice,
          quantity: first.quantity,
        })
        .where(eq(ingredientsTable.id, ingredientId));
      updated++;
    }

    console.log(`ingredients total:               ${allIngredients.length}`);
    console.log(`ingredients with supplier rows:  ${byIngredient.size}`);
    console.log(`ingredients backfilled:          ${updated}`);
    console.log(`supplier-row disagreements:      ${disagreements.length}`);
    if (disagreements.length > 0) {
      console.log("NOT backfilled (rows disagree):", disagreements);
      throw new Error(
        "Disagreeing supplier rows — resolve manually, tx rolled back",
      );
    }
    if (updated !== byIngredient.size) {
      throw new Error(
        "Assertion failed: updated != ingredients-with-rows, tx rolled back",
      );
    }
  });
  console.log("backfill committed");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
