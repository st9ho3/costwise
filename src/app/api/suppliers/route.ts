import { auth } from "@/auth";
import { sendSuccess } from "../utils/responses";
import { NextRequest } from "next/server";
import { SupplierService } from "@/app/services/suppliersService";
import { SupplierUpdatePayload } from "@/types/context";
import { AuthenticationError } from "@/app/utils/errors";
import { errorHandler } from "@/app/utils/errorHandler";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const supplier: SupplierUpdatePayload = await req.json();

    const res = await service.create(supplier);

    return sendSuccess("Supplier successfully created!", res, 201);
  } catch (err) {
    return errorHandler(err);
  }
};