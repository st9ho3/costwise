import { relations } from "drizzle-orm";
import { date, numeric, pgEnum, uuid, pgTable, varchar, serial, text, integer, timestamp, primaryKey, boolean, PgTransaction } from "drizzle-orm/pg-core";
import { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import type { AdapterAccountType } from "@auth/core/adapters"
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;
export type Transaction = PgTransaction<NodePgQueryResultHKT, typeof schema>;

// Defines an enum for recipe categories.
export const recipeCategoryEnum = pgEnum("recipe_category", ["starter", "main", "dessert"])

export const unitEnum = pgEnum('unit', ['' , 'g', 'ml', 'kg', 'L', 'piece'])

export const ingredientCategoryEnum = pgEnum("ingredient_category", [
  'Produce',
  'Meat & Poultry',
  'Fish & Seafood',
  'Dairy & Alternatives',
  'Dry Goods',
  'Spices & Seasonings',
  'Oils, Vinegars, & Condiments',
  'Frozen',
  'Coffee & Tea',
  'Beverages (Other)',
  'Bakery',
  'Other',
  '', // For default/unset
]);

export const deliveryTimeEnum = pgEnum("delivery_time", [
  'Same Day',
  '1-2 Days',
  '2-3 Days',
  'Up to 5 days',
  'Weekly'
])

export const paymentTermsEnum = pgEnum("payment_terms", [
  'Net 30',
  'Net 60',
  'Net 90',
  'Due on Receipt',
  'Prepaid',
  'COD'
])

// Defines the 'recipes' table schema.
export const recipesTable = pgTable("recipes", {
  id: uuid("id").primaryKey(),
  title: varchar("name", {length: 200}).notNull(),
  totalCost: numeric("total_cost", { precision: 5, scale: 2 }).notNull(),
  createdBy: varchar("created_by").notNull(),
  dateCreated: date("date").notNull(),
  category: recipeCategoryEnum("category").notNull(),
  imgPath: varchar("img_path").notNull(),
  tax: numeric("tax").notNull(),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }).notNull(),
  profitMargin: numeric("profit_margin", { precision: 10, scale: 2 }).notNull(),
  foodCost: numeric("food_cost", { precision: 10, scale: 2 }).notNull(),

  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
});

// Defines the 'ingredients' table schema for individual ingredients.
export const ingredientsTable = pgTable('ingredients', {
  id: uuid('id').primaryKey(), 
  icon: varchar('icon'), 
  name: varchar('name', { length: 255 }).notNull(), 
  unit: unitEnum('unit').notNull(), 
  unitPrice: numeric('unit_price', { precision: 10, scale: 5 }).notNull(),
  quantity: numeric('quantity').notNull(),
  usage: numeric('usage').notNull().default('1'),

  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: uuid('category').notNull().references(() => categories.id)
});

// Defines the 'recipeIngredients' table schema, linking recipes and ingredients.
export const recipeIngredientsTable = pgTable("recipeIngredients", {
id: serial("id").unique(),  
recipeId: uuid("recipe_id").notNull().references(() =>  recipesTable.id, {onDelete: 'cascade'}),
ingredientId: uuid("ingredient_id").notNull().references(() =>  ingredientsTable.id),
quantity: numeric("quantity").notNull()
});

export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey(),
  name: varchar('name', {length: 255}).notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, {onDelete: 'cascade'} ),

  contactPerson: varchar('contact_person', {length: 255}),
  email: varchar('email').unique(),
  phone: varchar('phone').unique(),
  website: varchar('website'),

  deliveryTime: deliveryTimeEnum('delivery_time'),

  isActive: boolean('is_active').notNull(),
  dateAdded: timestamp('date_added')
})

export const suppplierAddresses = pgTable('supplier_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  street: varchar('street', {length: 100}),
  city: varchar('city', {length: 100}),
  state: varchar('state', {length: 30}),
  postalCode: varchar('postal_code', {length: 10}),
  country: varchar('country', {length: 50}),
  suppliersId: uuid('suppliers_id').notNull().references(() => suppliers.id, {onDelete: 'cascade'})
})

export const supplierFinancialData = pgTable('supplier_financial_data', {
  supplierId: uuid("supplier_id").primaryKey().references(() => suppliers.id, { onDelete: 'cascade' }),
  vatNumber: varchar("vat_number", {length: 50}),
  paymentTerms: paymentTermsEnum('payment_terms'),
  defaultCurrency: varchar("default_currency", {length: 3}).default("EUR"), 
})

export const supplierCategories = pgTable('supplier_categories', {
  suplierId: uuid('suplier_id').references(() => suppliers.id, {onDelete: 'cascade'}),
  categoryId: uuid('category_id').references(() => categories.id, {onDelete: 'cascade'})
},(t) => [primaryKey({columns: [t.suplierId, t.categoryId]})])

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey(),
  category: ingredientCategoryEnum('category').notNull()
})

export const recipeRelations = relations(recipesTable,({many, one}) => ({
  recipeIngredients: many(recipeIngredientsTable),
  user: one(users, {
    fields: [recipesTable.userId],
    references: [users.id]
  })
}))

export const ingredientRelations = relations(ingredientsTable, ({many, one}) => ({
  recipeIngredients: many(recipeIngredientsTable),
  user: one(users, {
    fields: [ingredientsTable.userId],
    references: [users.id]
  })
}))

export const recipeIngredientsRelations = relations(recipeIngredientsTable, ({one}) => ({
  recipes: one(recipesTable, {
    fields: [recipeIngredientsTable.recipeId],
    references: [recipesTable.id]
  }),
  ingredients: one(ingredientsTable, {
    fields: [recipeIngredientsTable.ingredientId],
    references: [ingredientsTable.id]
  })
}))











// Auth.js

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: varchar("password"),
})

export const udersRelations = relations(users, ({many}) => ({
  recipes: many(recipesTable),
  ingredients: many(ingredientsTable)
}))
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)