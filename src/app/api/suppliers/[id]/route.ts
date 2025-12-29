import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "../../utils/responses";
import { SupplierService } from "@/app/services/suppliersService";
import { auth } from "@/auth";
import { AuthenticationError } from "@/app/utils/errors";

const session = await auth()
if (!session?.user?.id) {
    throw new AuthenticationError()
}

const service = new SupplierService(session?.user?.id)

export const PATCH = async(req: NextRequest) => {

    const request = await req.json()
    const res = await service.update(request)

    if (!res) {
        return sendError('Invalid Data')
    } 

    return sendSuccess('supplier created', 'Patch', 201)
}