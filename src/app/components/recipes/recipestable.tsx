"use client";

import React, { useEffect } from "react";
import { recipesColumns, recipeSortedLinks } from "@/app/constants/data";
import { Recipe } from "@/shemas/recipe";
import Link from "next/link";
import useHelpers from "@/app/hooks/useHelpers";
import { useNotificationStore } from "@/app/stores/notificationStore";
import TableHead from "../shared/table/tableHead";
import TableActions from "../shared/table/tableActions";
import TableClickableTitle from "../shared/table/tableClickableTitle";
import MonetaryCell from "../shared/table/monetaryCell";
import PercentilleCell from "../shared/table/percentilleCell";
import Modal from "../shared/modal";
import DeleteConfirmationModal from "../shared/deleteConfirmationModal";
import MobileListCard, { MobileCardRow } from "../shared/mobileListCard";
import { Badge } from "../ui/badge";
import { CategoryThumbnail } from "@/app/utils/uiHelpers";

const getMarginTone = (margin: number | undefined): "good" | "info" | "watch" | "over" => {
  if (margin === undefined || margin <= 40) return "over";
  if (margin > 60) return "good";
  if (margin > 50) return "info";
  return "watch";
};

const RecipesTable = ({ items }: { items: Recipe[] }) => {
  const resetNotification = useNotificationStore((state) => state.reset);
  const { isModalOpen, isDeleteActive, closeModal, storedItemId, handleDelete, askPermision } = useHelpers({ path: 'recipes' });

  useEffect(() => {
    resetNotification();
  }, [resetNotification]);

  return (
    <div className="w-full">
      {/* Mobile Card Feed */}
      <div className="md:hidden flex flex-col gap-3">
        {items.map((item) => (
          <MobileListCard
            key={item.id}
            thumb={
              item.imgPath ? (
                <img
                  src={item.imgPath}
                  alt={item.title}
                  className="size-[36px] rounded-full object-cover shrink-0 border border-[#EFE8DA]"
                />
              ) : (
                <CategoryThumbnail category={item.category} size={36} />
              )
            }
            title={
              <Link href={`/recipes/edit/${item.id}`} className="hover:text-green-800 transition-colors">
                {item.title}
              </Link>
            }
            actions={
              <TableActions
                id={item.id}
                onDelete={askPermision}
                path="recipes"
              />
            }
          >
            <MobileCardRow
              label="VAT"
              value={<PercentilleCell percentage={item.tax} />}
            />
            <MobileCardRow
              label="Menu price"
              value={<MonetaryCell type="absolute" price={item.sellingPrice} />}
            />
            <MobileCardRow
              label="What you keep"
              value={
                <Badge tone={getMarginTone(Number(item.profitMargin))}>
                  {Number(item.profitMargin || 0).toFixed(1)}%
                </Badge>
              }
              isMono={false}
            />
            <MobileCardRow
              label="Plate cost"
              value={<MonetaryCell type="absolute" price={item.totalCost} />}
            />
          </MobileListCard>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-white rounded-[18px] border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <TableHead columns={recipesColumns} sortedLinks={recipeSortedLinks} />
          <tbody className="divide-y divide-[#EFE8DA]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-[56px] hover:bg-cream-100/60 transition-colors duration-140 group"
              >
                <td className="pl-5 pr-3 text-left">
                  <Link href={`/recipes/edit/${item.id}`} className="block">
                    <TableClickableTitle
                      imgPath={item.imgPath}
                      title={item.title}
                      category={item.category}
                    />
                  </Link>
                </td>

                <td className="px-3.5 text-left">
                  <PercentilleCell percentage={item.tax} />
                </td>

                <td className="px-3.5 text-left">
                  <MonetaryCell type="absolute" price={item.sellingPrice} />
                </td>

                <td className="px-3.5 text-left">
                  <Badge tone={getMarginTone(Number(item.profitMargin))}>
                    {Number(item.profitMargin || 0).toFixed(1)}%
                  </Badge>
                </td>

                <td className="px-3.5 text-left">
                  <MonetaryCell type="absolute" price={item.totalCost} />
                </td>

                <td className="pr-5 pl-3 text-right">
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
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && isDeleteActive && (
        <Modal isOpen={isModalOpen} onClose={closeModal} type="delete">
          <DeleteConfirmationModal
            onDelete={handleDelete}
            onClose={closeModal}
            id={storedItemId}
            itemType="dish"
          />
        </Modal>
      )}
    </div>
  );
};

export default RecipesTable;