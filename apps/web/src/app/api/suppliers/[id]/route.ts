import { NextRequest } from "next/server";
import { sendSuccess } from "../../utils/responses";
import { SupplierService } from "@costwise/domain/services/suppliersService";
import { getServerSession } from "@/app/lib/serverSession";
import { AuthenticationError } from "@costwise/domain/utils/errors";
import { errorHandler } from "@/app/utils/errorHandler";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const request = await req.json();
    const res = await service.update(request);

    return sendSuccess("supplier updated", res, 200);
  } catch (err) {
    return errorHandler(err);
  }
};
export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const service = new SupplierService(session.user.id);
    const { id } = await context.params;

    console.log("DELETE", id);
    const res = await service.delete(id);

    return sendSuccess("supplier deleted", res, 200);
  } catch (err) {
    return errorHandler(err);
  }
};
