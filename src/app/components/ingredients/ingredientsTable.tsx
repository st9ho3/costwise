"use client";
import { ingredientColumns, ingredientSortedLinks } from "@/app/constants/data";
import { getUsageCategory, paginate } from "@/app/services/helpers";
import { Ingredient} from "@/shemas/recipe";
import { useRouter } from "next/navigation";
/* import Notification from '@/app/components/shared/notification'
 */import Link from "next/link";
import Label from "../shared/label";
import { deleteIngredient } from "@/app/services/services";
import useHelpers from "@/app/hooks/useHelpers";
import { useCallback, useEffect, useMemo } from "react";
import useSorting from "@/app/hooks/useSorting";
import { usePaginationStore } from "@/app/stores/paginationStore";
import TableHead from "../shared/table/tableHead";
import TableActions from "../shared/table/tableActions";
import TableClickableTitle from "../shared/table/tableClickableTitle";
import Notification from "../shared/notification";
import { useNotificationStore } from "@/app/stores/notificationStore";
import MonetaryCell from "../shared/table/monetaryCell";

const IngredientsTable = ({items}: {items: Ingredient[]}) => {

  const page = usePaginationStore((state) => state.currentPage)
  const reset = usePaginationStore((state) => state.resetPage)
  const isOpen = useNotificationStore((state) => state.notification.isOpen)
  const {raiseNotification} = useHelpers()
  const {sortData, sortStatus, sortedData} = useSorting({data: items})
  const router = useRouter()
  const paginateItems = useMemo(() => paginate(10, page, sortedData ),[sortedData, page]);

  const itemsToDisplay = paginateItems ? paginateItems : [];

  const handleDelete = useCallback(async(id: string) => {
    const response = await deleteIngredient(id)
    raiseNotification(response)
    router.replace("ingredients")
  },[raiseNotification, router])

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <div>
      <table className="w-full table-fixed mb-2 ">
        <TableHead
          columns={ingredientColumns}
          sortStatus={sortStatus}
          sortedLinks={ingredientSortedLinks}
          onSort={sortData}
        />
        <tbody className="text-gray-500 text-md">
          {itemsToDisplay.map((item) => (
            <tr
              key={item.id}
              className="border-b h-12.5 border-gray-200 text-sm"
            >

              <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/ingredients/${item.id}`}>
                  <TableClickableTitle
                    title={item.name}
                    icon={item.icon}
                    category={item.category}
                  />
                </Link>
              </td>

              <td className="hidden md:table-cell align-middle text-center md:text-start md:pl-4">
                <MonetaryCell
                price={item.unitPrice}
                type="per_unit"
                unit={item.unit}
                 />
              </td>

              <td className="hidden md:table-cell pl-4">
                <Label
                  text={getUsageCategory(Number(item.usage)) }
                  type={getUsageCategory(Number(item.usage))}
                />
              </td>
              <td className="hidden md:table-cell pl-4">
                <Label
                  text={item.category}
                  type={item.category}
                />
              </td>

              <td className="align-middle text-center gap-5 flex justify-center md:text-start md:justify-start mt-4 md:pl-4">
                <TableActions
                  id={item.id}
                  onDelete={handleDelete}
                  path="ingredients"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isOpen && <Notification />}
    </div>
  );
};

export default IngredientsTable;