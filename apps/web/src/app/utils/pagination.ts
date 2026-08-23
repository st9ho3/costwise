export const paginationPages = (pageNumber: number | undefined) => {
  if (!pageNumber) {
    return;
  }
  const pageNumbers = Array.from({ length: pageNumber }, (_, i) => i + 1);
  return pageNumbers;
};
