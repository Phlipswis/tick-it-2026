// ===== Imports =====
import { hostname, jsonPort } from '../main';
import { Item } from '../models/item';

// ===== Re-Exports =====
export * as JsonService from './jsonServer.service';

// ===== GET: Alle Items abrufen =====
/**
 * Uses the Fetch API to get records from a specified URL.
 * @returns A Promise that resolves to an array of Item objects.
 */
export async function getAllItems(): Promise<Item[]> {
  const url = `http://${hostname}:${jsonPort}/items`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as Item[];
  } catch (error) {
    console.error('Fehler beim Abrufen der Items:', error);
    return [];
  }
}

// ===== CREATE: Neues Item erstellen =====
/**
 * Uses the Fetch API to post a record to a specified URL.
 * @param jsonPayload - The JSON payload to be sent.
 * @returns A Promise that resolves to a string representing the response content.
 */
export async function createItem(jsonPayload: string): Promise<string> {
  const url = `http://${hostname}:${jsonPort}/items`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonPayload,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return JSON.stringify(responseData);
}

// ===== DELETE: Item löschen =====
/**
 * Deletes an item by id.
 * @param id - ID des Items
 */
export async function deleteItem(id: string): Promise<void> {
  const url = `http://${hostname}:${jsonPort}/items/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
