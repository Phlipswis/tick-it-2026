import type { Item } from './item.ts';

const DEFAULT_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

// CREATE: Neues Item an den Server senden
export async function fetchPost(item: Omit<Item, 'id'>): Promise<Item> {
  try {
    const response = await fetch(`${DEFAULT_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`Error saving: HTTP ${response.status}`);
    }
    const createdItem: Item = await response.json();
    window.dispatchEvent(new CustomEvent('itemAdded'));
    return createdItem;
  } catch (error) {
    console.error('Error sending request:', error);
    throw error;
  }
}

// READ: Items vom Server abrufen
export async function fetchGet(url: string = `${DEFAULT_URL}/api/items`) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return (await response.json()) as Item[];
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

// UPDATE: Vorhandenes Item teilweise aktualisieren
export async function fetchPatch(
  id: string,
  updates: Partial<Item>,
): Promise<void> {
  try {
    const response = await fetch(`${DEFAULT_URL}/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      console.error(`Error while patching: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Error while patching:', error);
  }
}

// DELETE: Item anhand der ID löschen
export async function fetchDelete(id: string | number): Promise<void> {
  const numericId = typeof id === 'string' ? Number(id) : id;
  if (isNaN(numericId)) {
    console.error('Invalid ID for deletion', id);
    return;
  }
  try {
    const response = await fetch(`${DEFAULT_URL}/api/items/${numericId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error(`Error while deleting: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Error while deleting:', error);
  }
}
