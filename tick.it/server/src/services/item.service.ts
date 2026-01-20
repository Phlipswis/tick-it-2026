/**
 * Filters items by a date range
 *
 * @param inputArray - The Item[] to be filtered
 * @param filter - Date range filter (from / to)
 * @returns Item[] within the given date range
 */

import { Item } from '../models/item';

export type DateFilter = {
  from?: string; // ISO date: YYYY-MM-DD
  to?: string; // ISO date: YYYY-MM-DD
};

type FilterByDateFn = (inputArray: Item[], filter: DateFilter) => Item[];

const filterByDate: FilterByDateFn = (inputArray, filter) => {
  // No filter → return everything
  if (!filter.from && !filter.to) {
    return inputArray;
  }

  return inputArray.filter((item) => {
    // Items without date are excluded
    if (!item.date) return false;

    const itemTime = new Date(item.date).getTime();
    const fromTime = filter.from ? new Date(filter.from).getTime() : -Infinity;
    const toTime = filter.to ? new Date(filter.to).getTime() : Infinity;

    return itemTime >= fromTime && itemTime <= toTime;
  });
};

export default filterByDate;
