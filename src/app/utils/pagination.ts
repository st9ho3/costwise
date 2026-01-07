import { Ingredient, Recipe, Supplier } from "@/shemas/recipe";

export const paginate = <T>(
  itemsPerPage: number,
  page: number,
  items: T[]
): T[] => {
  if (items.length === 0) {
    return [];
  }
  const indexOfFirstItem = itemsPerPage * (page - 1);
  const indexOfLastItem = itemsPerPage * page - 1;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem + 1);
  return currentItems;
};

export const paginationPages = (
  pageNumber: number | undefined,
  itemsPerPage: number
) => {
  if (!pageNumber) {
    return;
  }

  const pageNumbers = Array.from({ length: pageNumber }, (_, i) => i + 1);
  return pageNumbers;
};
