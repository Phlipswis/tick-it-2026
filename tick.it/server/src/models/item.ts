/**
 * Represents a pile-of-shame item
 *
 * @typedef {Object} Item
 * @property {string} id - The unique identifier of the item.
 * @property {string} name - The name of the item.
 * @property {string} description - The description of the item.
 * @property {number} price - The price of the item.
 * @property {string[]} categories - The categories that the item belongs to.
 * @property {string} date - The date when the item was created.
 * @property {string} image - The URL of the item's image.
 */
export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  date: string;
  image: string;
};
