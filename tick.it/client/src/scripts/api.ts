import type { Item } from './item.ts';

// ===== Local Storage Key =====
const STORAGE_KEY = 'tickit-items';
let nextId = 1;

// ===== Helper Functions =====

/**
 * Load all items from Local Storage
 */
function loadFromStorage(): Item[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const items = JSON.parse(data) as Item[];
    
    // Determine the highest ID for new items
    if (items.length > 0) {
      const maxId = Math.max(...items.map(item => parseInt(item.id)));
      nextId = maxId + 1;
    }
    
    return items;
  } catch (error) {
    console.error('Error loading from Local Storage:', error);
    return [];
  }
}

/**
 * Save all items to Local Storage
 */
function saveToStorage(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving to Local Storage:', error);
  }
}

/**
 * Generate a new ID
 */
function generateId(): string {
  return String(nextId++);
}

// ===== API Functions =====

// CREATE: Send new item to storage
export async function fetchPost(item: Omit<Item, 'id'>): Promise<Item> {
  try {
    const items = loadFromStorage();
    
    const createdItem: Item = {
      ...item,
      id: generateId(),
    };
    
    items.push(createdItem);
    saveToStorage(items);
    
    window.dispatchEvent(new CustomEvent('itemAdded'));
    
    return createdItem;
  } catch (error) {
    console.error('Error sending request:', error);
    throw error;
  }
}

// READ: Retrieve items from storage
export async function fetchGet(_url?: string): Promise<Item[] | null> {
  try {
    return loadFromStorage();
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

// UPDATE: Partially update existing item
export async function fetchPatch(
  id: string,
  updates: Partial<Item>,
): Promise<void> {
  try {
    const items = loadFromStorage();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      console.error('Error while patching: Item not found');
      return;
    }
    
    items[index] = { ...items[index], ...updates };
    saveToStorage(items);
  } catch (error) {
    console.error('Error while patching:', error);
  }
}

// DELETE: Delete item by ID
export async function fetchDelete(id: string | number): Promise<void> {
  const stringId = typeof id === 'number' ? String(id) : id;
  
  if (!stringId) {
    console.error('Invalid ID for deletion', id);
    return;
  }
  
  try {
    const items = loadFromStorage();
    const filteredItems = items.filter(item => item.id !== stringId);
    
    saveToStorage(filteredItems);
  } catch (error) {
    console.error('Error while deleting:', error);
  }
}

// ===== Additional Utility Functions =====

/**
 * Clear all items (for testing/reset)
 */
export function clearAllItems(): void {
  localStorage.removeItem(STORAGE_KEY);
  nextId = 1;
  console.log('All items cleared.');
}

/**
 * Export all items as JSON string
 */
export function exportItems(): string {
  const items = loadFromStorage();
  return JSON.stringify(items, null, 2);
}

/**
 * Import items from JSON string
 */
export function importItems(jsonString: string): void {
  try {
    const items = JSON.parse(jsonString) as Item[];
    saveToStorage(items);
    console.log(`${items.length} items imported.`);
  } catch (error) {
    console.error('Error importing items:', error);
  }
}