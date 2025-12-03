import { auth } from "@/auth"
import { sendError, sendSuccess } from "../utils/responses";
import { NextRequest } from "next/server";
import { Supplier } from "@/shemas/recipe";
import { SupplierService } from "@/app/services/suppliersService";

export const POST = async(req: NextRequest) => {
    const session = await auth()

    try {
        if(!session?.user) {
            throw new Error("Can't take an action if not validated")
        }

        const supplier: Supplier = await req.json()
        
        const service = new SupplierService()
        const res = await service.create(supplier)
        console.log(supplier)
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