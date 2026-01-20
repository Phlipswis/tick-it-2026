import type { Item } from './item.ts';

// CREATE: Neues Item an den Server senden
export async function fetchPost(item: Omit<Item, 'id'>): Promise<Item> {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern: HTTP ${response.status}`);
    }

    const createdItem: Item = await response.json();
    window.dispatchEvent(new CustomEvent('itemAdded'));
    return createdItem;
  } catch (error) {
    console.error('Fehler beim Senden der Anfrage:', error);
    throw error;
  }
}

// READ: Items vom Server abrufen
export async function fetchGet(
  url: string = 'http://127.0.0.1:3001/api/items',
) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return (await response.json()) as Item[];
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return null;
  }
}

// UPDATE: Vorhandenes Item teilweise aktualisieren
export async function fetchPatch(
  id: string,
  updates: Partial<Item>,
): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:3001/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      console.error(`Fehler beim Update: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Fehler beim Patchen:', error);
  }
}

// DELETE: Item anhand der ID löschen
export async function fetchDelete(id: string | number): Promise<void> {
  const numericId = typeof id === 'string' ? Number(id) : id;

  if (isNaN(numericId)) {
    console.error('Ungültige ID zum Löschen:', id);
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:3001/api/items/${numericId}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      console.error(`Fehler beim Löschen: HTTP ${response.status}`);
    } else {
      console.log(`Item mit ID ${numericId} erfolgreich gelöscht.`);
    }
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
  }
}
