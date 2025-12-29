import { auth } from "@/auth"
import { sendError, sendSuccess } from "../utils/responses";
import { NextRequest } from "next/server";
import { SupplierService } from "@/app/services/suppliersService";
import { SupplierUpdatePayload } from "@/types/context";
import { AuthenticationError } from "@/app/utils/errors";

const session = await auth()
if (!session?.user?.id) {
    throw new AuthenticationError()
}

const service = new SupplierService(session?.user?.id)

export const POST = async(req: NextRequest) => {
    try {
        const supplier: SupplierUpdatePayload = await req.json()
        
        const res = await service.create(supplier)
        if (res) {
            return sendSuccess("Supplier successfully created!", res, 201);
        } else {
            return sendError("Invalid Data.", 404);
        }

    } catch(err) {
        console.log('error on the route: ', err)
        return sendError(`${err}`, 500)
    }
}