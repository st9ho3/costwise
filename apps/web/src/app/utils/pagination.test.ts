import { describe, test, expect } from "@jest/globals";
import { paginationPages } from "./pagination";

describe("paginationPages", () => {
  test("Should return an array with the pages", () => {
    const totalPages = 1;

    const result = paginationPages(totalPages);

    expect(result).toStrictEqual([1]);
  });
});
