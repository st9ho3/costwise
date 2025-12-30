import { NextRequest } from "next/server";
import { sendSuccess } from "../../utils/responses";
import { SupplierService } from "@/app/services/suppliersService";
import { auth } from "@/auth";
import { AuthenticationError } from "@/app/utils/errors";
import { errorHandler } from "@/app/utils/errorHandler";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const request = await req.json();
    const res = await service.update(request);

    return sendSuccess('supplier updated', res, 200);
  } catch (err) {
    return errorHandler(err);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const request = await req.json();
    const res = await service.delete(request);

    return sendSuccess('supplier deleted', res, 200);
  } catch (err) {
    return errorHandler(err);
  }
};