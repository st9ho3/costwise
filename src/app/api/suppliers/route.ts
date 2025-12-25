import { auth } from "@/auth"
import { sendError, sendSuccess } from "../utils/responses";
import { NextRequest } from "next/server";
import { SupplierService } from "@/app/services/suppliersService";
import { SupplierUpdatePayload } from "@/types/context";

export const POST = async(req: NextRequest) => {
    const session = await auth()

    try {
        if(!session?.user) {
            throw new Error("Can't take an action if not validated")
        }

        const supplier: SupplierUpdatePayload = await req.json()
        
        const service = new SupplierService()
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