import type { Item } from './item.ts';

export async function fetchPost(item: Item): Promise<void> {
  try {
    const response = await fetch('http://127.0.0.1:3002/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (response.status === 201) {
      alert('Item erfolgreich gespeichert!');
      window.dispatchEvent(new CustomEvent('itemAdded'));
    } else {
      console.error(`Fehler beim Speichern: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Fehler beim Senden der Anfrage:', error);
  }
}

export async function fetchGet(
  url: string = 'http://127.0.0.1:3002/api/items',
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

export async function fetchPatch(
  id: string,
  updates: Partial<Item>,
): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:3002/api/items/${id}`, {
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

export async function fetchDelete(id: string): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:3002/api/items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(`Fehler beim Löschen: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
  }
}
