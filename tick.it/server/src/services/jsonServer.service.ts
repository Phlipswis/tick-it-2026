import { hostname, jsonPort } from '../main';
import { Item } from '../models/item';

export * as JsonService from './jsonServer.service';

/**
 * Uses the Fetch API to get records from a specified URL.
 * @returns A Promise that resolves to a string representing the retrieved data.
 */
export async function getAllItems(): Promise<Item[]> {
  const url = `http://${hostname}:${jsonPort}/items`;

  /* ToDo 2.1 */
  /* Use Fetch API to get all items from JSON server */
  /* ToDo 2.1 */
  return new Array<Item>();
}

/**
 * Uses the Fetch API to post a record to a specified URL.
 * @param jsonPayload - The JSON payload to be sent.
 * @returns A Promise that resolves to a string representing the response content.
 */
export async function createItem(jsonPayload: string): Promise<string> {
  const url = `http://${hostname}:${jsonPort}/items`;

  /* ToDo 2.2 */
  /* Use Fetch API to post the jsonPayload to the JSON server */
  /* ToDo 2.2 */
  return '';
}
