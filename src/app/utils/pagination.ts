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
  items: Recipe[] | Ingredient[] | Supplier[],
  itemsPerPage: number
) => {
  const pages = Math.ceil(items.length / itemsPerPage);
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  return pageNumbers;
};
