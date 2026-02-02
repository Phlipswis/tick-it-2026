// ===== Imports =====
import type { Item } from '../models/item.ts';
import { hostname, jsonPort } from '../main.ts';

// ===== Re-Exports =====
export * as JsonService from './jsonServer.service.ts';

// ===== GET: Alle Items abrufen =====
/**
 * Uses the Fetch API to get records from a specified URL.
 * @returns A Promise that resolves to an array of Item objects.
 */
export async function getAllItems(): Promise<Item[]> {
  const url = `http://${hostname}:${jsonPort}/items`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'node',
      },
    });
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
      'User-Agent': 'node',
    },
    body: jsonPayload,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
  const responseData = await response.json();
  return JSON.stringify(responseData);
}

// ===== UPDATE: Item aktualisieren =====
/**
 * Updates an item by id.
 * @param id - ID des Items
 * @param jsonPayload - The JSON payload with updates
 */
export async function updateItem(
  id: string,
  jsonPayload: string,
): Promise<void> {
  const url = `http://${hostname}:${jsonPort}/items/${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'node',
    },
    body: jsonPayload,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
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
    headers: {
      'User-Agent': 'node',
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
}
