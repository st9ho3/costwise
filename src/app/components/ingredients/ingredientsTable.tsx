
"use client";
import { ingredientColumns } from "@/app/constants/data";
import { paginate } from "@/app/services/helpers";
import { useHomeContext } from "@/app/context/homeContext/homeContext";
import { Pencil, Trash2 } from "lucide-react";
import { Ingredient} from "@/shemas/recipe";
import { useRouter } from "next/navigation";
import Notification from '@/app/components/shared/notification'
import Link from "next/link";
import Label from "../shared/label";
import { deleteIngredient } from "@/app/services/services";
import useHelpers from "@/app/hooks/useHelpers";
import { useCallback, useMemo } from "react";

const IngredientsTable = ({items}: {items: Ingredient[]}) => {
  const { state } = useHomeContext();
  const {raiseNotification} = useHelpers()
  const router = useRouter()
  const paginateItems= useMemo( () => paginate(10, state.currentPage, items),[state.currentPage, items]);
  
  const itemsToDisplay =  paginateItems  ? paginateItems : [];

  const handleDelete = useCallback(async(id: string) => {
    const response = await deleteIngredient(id)
    raiseNotification(response)
    router.replace("ingredients")
  },[raiseNotification, router])

  
  return (
    <div>
      <table className="w-full table-fixed mb-4 ">
        <thead>
          <tr className="border-b-1 border-gray-200">
            {ingredientColumns.map((column) => (
              <th key={column.accessor} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-500 text-md">
          {itemsToDisplay.map((item) => (
            <tr
              key={item.id}
              className="border-b h-12.5 border-gray-200 text-sm"
            >
              {/* Cell 1: Name and Image */}
              <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/ingredients/${item.id}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex justify-center items-center w-9 h-9 text-xl bg-yellow-100 rounded-full object-cover"
                    >{item.icon}</div>
                    <p className="text-sm break-words transition-colors duration-300 ease-in-out hover:text-gray-400">
                      {item.name ? item.name : "NaN"}
                    </p>
                  </div>
                </Link>
              </td>
              
               {/* Cell 2: Price */}
              <td className="hidden md:table-cell align-middle text-center md:text-start md:pl-4">
                € { Number(item.unitPrice) < 1 ? Number(item.unitPrice).toFixed(3) : Number(item.unitPrice).toFixed(1) } / <span className="font-bold">{item.unit === 'kg' || item.unit === 'g' ? 'g': item.unit === 'ml' || item.unit === 'L' ? 'ml' : 'piece'}</span> 
              </td>
              

              {/* Cell 3: Usage */}
              {<td className="hidden md:table-cell pl-4">
                
                <Label text={Number(item.usage) < 4 ? "low" : 'medium' } type={Number(item.usage) < 4 ? "low" : 'medium' } /> 
                </td>}

              {/* Cell 4: Actions */}
              <td className="align-middle text-center gap-5 flex justify-center md:text-start md:justify-start mt-4 md:pl-4">
                <Link href={`/ingredients/edit/${item.id}`}>
                  <Pencil
                    size="18px"
                    strokeWidth="1.5px"
                    className="cursor-pointer"
                  />
                </Link>

                <Trash2
                  onClick={() => handleDelete(item.id)}
                  size="18px"
                  strokeWidth="1.5px"
                  color="red"
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.notification.isOpen && <Notification />}
    </div>
  );
};

export default IngredientsTable;
