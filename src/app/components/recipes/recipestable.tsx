"use client"
import { recipesColumns, recipeSortedLinks } from "@/app/constants/data";
import { getProfitMarginType } from "@/app/utils/pricing";
import { paginate } from "@/app/utils/pagination";
import { Recipe } from "@/shemas/recipe";
import Notification from '@/app/components/shared/notification'
import Link from "next/link";
import Label from "../shared/label";
import useHelpers from "@/app/hooks/useHelpers";
import {  useEffect, useMemo } from "react";
import useSorting from "@/app/hooks/useSorting";
import { usePaginationStore } from "@/app/stores/paginationStore";
import { useNotificationStore } from "@/app/stores/notificationStore";
import TableHead from "../shared/table/tableHead";
import TableActions from "../shared/table/tableActions";
import TableClickableTitle from "../shared/table/tableClickableTitle";
import MonetaryCell from "../shared/table/monetaryCell";
import PercentilleCell from "../shared/table/percentilleCell";
import Modal from "../shared/modal";
import DeleteConfirmationModal from "../shared/deleteConfirmationModal";


const RecipesTable = ({items}: {items: Recipe[]}) => {
  const currentPage = usePaginationStore((state) => state.currentPage)
  const resetPage = usePaginationStore((state) => state.resetPage)
  const resetNotification = useNotificationStore((state) => state.reset)
  const { isOpen, isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision } = useHelpers({path: 'recipes'})
  const {sortData, sortStatus, sortedData} = useSorting({data: items})
  const paginateItems = useMemo(() => paginate(10, currentPage, sortedData),[currentPage, sortedData]);
  const itemsToDisplay = paginateItems ? paginateItems : [];

  useEffect(()=> {
    const reset = () => {
      resetNotification()
      resetPage()
    }
    reset()

  }, [resetNotification, resetPage])

  return (
    <div>
      <table className="w-full table-fixed mb-2">
        <TableHead
          columns={recipesColumns}
          sortStatus={sortStatus}
          sortedLinks={recipeSortedLinks}
          onSort={sortData}
        />
        <tbody className="text-gray-500 text-md">
          {itemsToDisplay.map((item) => (
            <tr
              key={item.id}
              className="border-b h-12.5 border-gray-200 text-sm"
            >

              <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/recipes/${item.id}`}>
                  <TableClickableTitle
                    imgPath={item.imgPath}
                    title={item.title}
                  />
                </Link>
              </td>

              <td className="hidden md:table-cell pl-4">
                <PercentilleCell
                  percentage={item.tax}
                 />
              </td>

              <td className="hidden md:table-cell pl-4">
                <MonetaryCell
                  type="absolute"
                  price={item.sellingPrice}
                 />
              </td>

              <td className="hidden md:table-cell pl-4">
                <Label
                  text={`${String(item.profitMargin)}%`}
                  type={getProfitMarginType(item.profitMargin)}
                />
              </td>

              <td className="hidden md:table-cell pl-4">
                <MonetaryCell
                  type="absolute"
                  price={item.totalCost}
                 />
              </td>
              <td className="align-middle text-center gap-5 flex justify-center md:text-start md:justify-start mt-4 md:pl-4">
                <TableActions
                  id={item.id}
                  onDelete={askPermision}
                  path="recipes"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isOpen && <Notification />}
      {isModalOpen && isDeleteActive && 
      <Modal isOpen={isModalOpen} onClose={closeModal} type="delete">
        <DeleteConfirmationModal
          onDelete={handleDelete}
          onClose={closeModal}
          id={storedItemId}
         />
      </Modal>}
    </div>
  );
};

export default RecipesTable