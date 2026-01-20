// ===== Imports =====
import { fetchGet, fetchPatch, fetchPost, fetchDelete } from './api';
import type { Item, Lane } from './item';

// ===== DOM-Elemente =====
const addcard = document.getElementById('addcard');
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

// ===== Event-Listener für Lanes =====
lanes.forEach((lane) => {
  lane.addEventListener('dragover', (e) => e.preventDefault());
  lane.addEventListener('drop', onDrop);
});

// ===== Drag & Drop Funktionen =====
async function onDrop(event: DragEvent) {
  event.preventDefault();

  if (!event.dataTransfer || !(event.currentTarget instanceof HTMLElement))
    return;

  const cardId = event.dataTransfer.getData('text/plain');
  const laneId = event.currentTarget.id;

  if (!isLane(laneId)) {
    console.error('Ungültige Lane:', laneId);
    return;
  }

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
function createCard(item: Item) {
  const card = document.createElement('div');
  card.id = item.id;
  card.className = 'card';
  card.draggable = true;
  card.textContent = item.titel;

  card.addEventListener('dragstart', onDragStart);

  document.getElementById(item.lane)?.appendChild(card);
}

async function loadCards() {
  const items = await fetchGet();
  if (!items) return;

  for (const item of items) {
    createCard(item);
  }
}

// ===== Neue Karte hinzufügen =====
addcard?.addEventListener('click', async () => {
  const titel = prompt('Name der Karte');
  if (!titel) return;

  const newItem: Omit<Item, 'id'> = {
    titel,
    lane: 'lane-backlog',
    date: new Date().toISOString(),
  };

  const createdItem: Item = await fetchPost(newItem);
  createCard(createdItem);
});

// ===== Karte löschen (Trash) =====
trash?.addEventListener('drop', async (event: DragEvent) => {
  event.preventDefault();
  if (!event.dataTransfer) return;

  const cardId = event.dataTransfer.getData('text/plain');
  document.getElementById(cardId)?.remove();
  await fetchDelete(cardId);
});

trash?.addEventListener('dragover', (e) => e.preventDefault());

// ===== Initialisierung =====
loadCards();
