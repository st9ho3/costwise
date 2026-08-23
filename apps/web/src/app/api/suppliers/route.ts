import { getServerSession } from "@/app/lib/serverSession";
import { sendSuccess } from "../utils/responses";
import { NextRequest } from "next/server";
import { SupplierService } from "@costwise/domain/services/suppliersService";
import { SupplierUpdatePayload } from "@costwise/domain/types/context";
import { AuthenticationError } from "@costwise/domain/utils/errors";
import { errorHandler } from "@/app/utils/errorHandler";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const supplier: SupplierUpdatePayload = await req.json();

    const res = await service.create(supplier);

    revalidatePath("/suppliers");
    return sendSuccess("Supplier successfully created!", res, 201);
  } catch (err) {
    return errorHandler(err);
  }
};
