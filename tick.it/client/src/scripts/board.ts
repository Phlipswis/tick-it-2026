// ===== Imports =====
import { fetchGet, fetchPatch, fetchDelete } from './api';
import type { Item, Lane } from './item';
import { openEditModal, initModalListeners, setAllItems } from './modal';

// ===== DOM-Elemente =====
const trash = document.getElementById('trash');
const lanes = document.querySelectorAll<HTMLElement>('.lane');

// ===== Typprüfung =====
function isLane(value: string): value is Lane {
  return [
    'lane-backlog',
    'lane-in-progress',
    'lane-review',
    'lane-done',
  ].includes(value);
}

// ===== Drag & Drop =====
lanes.forEach((lane) => {
  lane.addEventListener('dragover', (e) => e.preventDefault());
  lane.addEventListener('drop', onDrop);
});

async function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer || !(event.currentTarget instanceof HTMLElement))
    return;

  const cardId = event.dataTransfer.getData('text/plain');
  const laneId = event.currentTarget.id;

  if (!isLane(laneId)) return;

  const card = document.getElementById(cardId);
  if (!card) return;

  event.currentTarget.appendChild(card);
  await fetchPatch(cardId, { lane: laneId });
}

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer || !(event.target instanceof HTMLElement)) return;
  event.dataTransfer.setData('text/plain', event.target.id);
}

// ===== Karten erzeugen & laden =====
let allItems: Item[] = [];

export function createCard(item: Item) {
  const card = document.createElement('div');
  card.id = item.id;
  card.className = 'card';
  card.draggable = true;

  // Titel
  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.titel;
  card.appendChild(title);

  // Beschreibung (optional)
  if (item.beschreibung) {
    const desc = document.createElement('div');
    desc.className = 'card-description';
    desc.textContent = item.beschreibung;
    card.appendChild(desc);
  }

  // Deadline (optional)
  if (item.date) {
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const deadline = document.createElement('div');
    deadline.className = 'card-deadline';
    deadline.textContent = item.date;

    footer.appendChild(deadline);
    card.appendChild(footer);
  }

  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('click', () => openEditModal(item));

  document.getElementById(item.lane)?.appendChild(card);
}

async function loadCards() {
  const items = await fetchGet();
  if (!items) return;

  allItems = items;
  setAllItems(allItems); // Overlay synchronisieren
  initModalListeners(allItems);

  for (const item of items) {
    createCard(item);
  }
}

// ===== Karten löschen =====
trash?.addEventListener('drop', async (event: DragEvent) => {
  event.preventDefault();
  if (!event.dataTransfer) return;

  const cardId = event.dataTransfer.getData('text/plain');
  document.getElementById(cardId)?.remove();
  await fetchDelete(cardId);

  allItems = allItems.filter((item) => item.id !== cardId);
  setAllItems(allItems);
});

trash?.addEventListener('dragover', (e) => e.preventDefault());

// ===== Initialisierung =====
loadCards();
