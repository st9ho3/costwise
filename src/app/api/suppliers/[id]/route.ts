import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "../../utils/responses";
import { SupplierService } from "@/app/services/suppliersService";

const service = new SupplierService()

export const PATCH = async(req: NextRequest) => {

    const request = await req.json()
    const res = await service.update(request)

    if (!res) {
        return sendError('Invalid Data')
    } 

    return sendSuccess('supplier created', 'Patch', 201)
}