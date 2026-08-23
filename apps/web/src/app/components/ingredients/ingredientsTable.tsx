"use client";

import React, { useEffect } from "react";
import { ingredientColumns, ingredientSortedLinks } from "@/app/constants/data";
import { IngredientToDisplay } from "@costwise/shared/recipe";
import Link from "next/link";
import useHelpers from "@/app/hooks/useHelpers";
import { useNotificationStore } from "@/app/stores/notificationStore";
import TableHead from "../shared/table/tableHead";
import TableActions from "../shared/table/tableActions";
import TableClickableTitle from "../shared/table/tableClickableTitle";
import MonetaryCell from "../shared/table/monetaryCell";
import Modal from "../shared/modal";
import DeleteConfirmationModal from "../shared/deleteConfirmationModal";
import MobileListCard, { MobileCardRow } from "../shared/mobileListCard";
import { Badge } from "../ui/badge";
import { CategoryChip, CategoryThumbnail } from "@/app/utils/uiHelpers";

const getUsageBadge = (usageNum: number) => {
  if (usageNum > 15) {
    return <Badge tone="good">Most days</Badge>;
  }
  if (usageNum > 8) {
    return <Badge tone="info">Weekly</Badge>;
  }
  return <Badge tone="neutral">Now and then</Badge>;
};

const IngredientsTable = ({ items }: { items: IngredientToDisplay[] }) => {
  const resetNotification = useNotificationStore((state) => state.reset);
  const {
    isModalOpen,
    isDeleteActive,
    closeModal,
    storedItemId,
    handleDelete,
    askPermision,
  } = useHelpers({ path: "ingredients" });

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
            thumb={<CategoryThumbnail category={item.category} size={36} />}
            title={
              <Link href={`/ingredients/${item.id}`} className="hover:text-green-800 transition-colors">
                {item.name}
              </Link>
            }
            actions={
              <TableActions
                id={item.id}
                onDelete={askPermision}
                path="ingredients"
              />
            }
          >
            <MobileCardRow
              label="What it costs"
              value={
                <MonetaryCell
                  price={item.unitPrice}
                  type="per_unit"
                  unit={item.unit}
                />
              }
            />
            <MobileCardRow
              label="How often"
              value={getUsageBadge(Number(item.usage))}
              isMono={false}
            />
            <MobileCardRow
              label="Kind"
              value={<CategoryChip category={item.categoryName || item.category} />}
              isMono={false}
            />
          </MobileListCard>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-white rounded-[18px] border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <TableHead
            columns={ingredientColumns}
            sortedLinks={ingredientSortedLinks}
          />
          <tbody className="divide-y divide-[#EFE8DA]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-[56px] hover:bg-cream-100/60 transition-colors duration-140 group"
              >
                <td className="pl-5 pr-3 text-left">
                  <Link href={`/ingredients/${item.id}`} className="block">
                    <TableClickableTitle
                      title={item.name}
                      category={item.category}
                    />
                  </Link>
                </td>

                <td className="px-3.5 text-left">
                  <MonetaryCell
                    price={item.unitPrice}
                    type="per_unit"
                    unit={item.unit}
                  />
                </td>

                <td className="px-3.5 text-left">
                  {getUsageBadge(Number(item.usage))}
                </td>

                <td className="px-3.5 text-left">
                  <CategoryChip category={item.categoryName || item.category} />
                </td>

                <td className="pr-5 pl-3 text-right">
                  <TableActions
                    id={item.id}
                    onDelete={askPermision}
                    path="ingredients"
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
            itemType="ingredient"
          />
        </Modal>
      )}
    </div>
  );
};

export default IngredientsTable;
