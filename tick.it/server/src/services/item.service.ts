/**
 * Filters the given inputArray by the given categoryArray
 *
 * @param inputArray - The Item[] to be filtered.
 * @param categoryArray - The array of categories to filter by.
 * @returns Item[] that match at least one of the specified categories.
 */
import { Item } from '../models/item';

type filterFn = (inputArray: Item[], categoryArray: string[]) => Item[];

/**
 * Filters given inputArray by given categoryArray
 */
const filterByCategory: filterFn = (inputArray, categoryArray) => {
  /* ToDo 2.1 */
  /* Filter inputArray by categoryArray and return the filtered array */
  /* ToDo 2.1 */
  return new Array<Item>();
};

export default filterByCategory;
