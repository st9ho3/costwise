import { SearchService } from "@/app/services/searchService";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { sendError, sendSuccess } from "../utils/responses";


export const GET = async(req: NextRequest) => {
    const session = await auth()

    const request = req.nextUrl
    const searchTerm = request.searchParams.get('q')

    try {
        
        if(!session?.user?.id) {
        throw new Error("Can't take an action if not validated")
        }
        
        if (!searchTerm) {
           return sendSuccess('Need a value', undefined)
        }

        const service = new SearchService(searchTerm, session.user.id)

        const ingredients = await service.findIngredient()
        const recipes = await service.findRecipe()
        
        const searcResults = {ingredients: ingredients, recipes: recipes}

        return sendSuccess('Your data: ', searcResults)

    } catch(error) {

        return sendError(String(error))
    }    
}