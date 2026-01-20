// ===== Imports =====
import { fetchGet, fetchPatch, fetchPost, fetchDelete } from './api';
import type { Item, Lane } from './item';

// ===== DOM-Elemente =====
const addcard = document.getElementById('addcard');
const trash = document.getElementById('trash');
const lanes = document.querySelectorAll<HTMLElement>('.lane');
const modal = document.getElementById('card-modal');
const closeModal = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');
const cardForm = document.getElementById('card-form') as HTMLFormElement;
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

// ===== State für Bearbeitungsmodus =====
let editingCardId: string | null = null;
let allItems: Item[] = [];

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

  // Update local state
  const item = allItems.find((i) => i.id === cardId);
  if (item) {
    item.lane = laneId;
  }
}

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer || !(event.target instanceof HTMLElement)) return;
  event.dataTransfer.setData('text/plain', event.target.id);
}

// ===== Hilfsfunktion: Datum formatieren =====
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return date.toLocaleDateString('de-DE', options);
}

function isOverdue(dateString: string): boolean {
  const deadline = new Date(dateString);
  deadline.setHours(23, 59, 59, 999);
  const today = new Date();
  return deadline < today;
}

// ===== Karte bearbeiten =====
function onCardClick(event: MouseEvent, item: Item) {
  // Verhindere, dass der Click während des Draggings ausgelöst wird
  const target = event.target as HTMLElement;
  if (target.classList.contains('card') || target.closest('.card')) {
    openEditModal(item);
  }
}

function openEditModal(item: Item) {
  editingCardId = item.id;

  if (modalTitle) modalTitle.textContent = 'Karte bearbeiten';
  if (submitBtn) submitBtn.textContent = 'Speichern';
  if (deleteBtn) deleteBtn.style.display = 'block';

  // Formular mit Daten füllen
  const titleInput = document.getElementById('card-title') as HTMLInputElement;
  const descInput = document.getElementById(
    'card-description',
  ) as HTMLTextAreaElement;
  const deadlineInput = document.getElementById(
    'card-deadline',
  ) as HTMLInputElement;

  if (titleInput) titleInput.value = item.titel;
  if (descInput) descInput.value = item.beschreibung || '';
  if (deadlineInput) deadlineInput.value = item.deadline || '';

  openModal();
}

// ===== Karten erzeugen & laden =====
function createCard(item: Item) {
  const card = document.createElement('div');
  card.id = item.id;
  card.className = 'card';
  card.draggable = true;

  // Titel
  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.titel;
  card.appendChild(title);

  // Beschreibung (falls vorhanden)
  if (item.beschreibung) {
    const description = document.createElement('div');
    description.className = 'card-description';
    description.textContent = item.beschreibung;
    card.appendChild(description);
  }

  // Footer mit Deadline
  if (item.deadline) {
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const deadline = document.createElement('div');
    deadline.className = 'card-deadline';
    if (isOverdue(item.deadline)) {
      deadline.classList.add('overdue');
    }
    deadline.textContent = formatDate(item.deadline);

    footer.appendChild(deadline);
    card.appendChild(footer);
  }

  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('click', (e) => onCardClick(e, item));

  document.getElementById(item.lane)?.appendChild(card);
}

function updateCardDisplay(item: Item) {
  const card = document.getElementById(item.id);
  if (!card) return;

  // Karte komplett neu erstellen
  const parent = card.parentElement;
  card.remove();
  createCard(item);
}

async function loadCards() {
  const items = await fetchGet();
  if (!items) return;

  allItems = items;

  for (const item of items) {
    createCard(item);
  }
}

// ===== Modal Funktionen =====
function openModal() {
  modal?.classList.add('active');
}

function closeModalHandler() {
  modal?.classList.remove('active');
  cardForm?.reset();
  editingCardId = null;

  if (modalTitle) modalTitle.textContent = 'Neue Karte erstellen';
  if (submitBtn) submitBtn.textContent = 'Karte erstellen';
  if (deleteBtn) deleteBtn.style.display = 'none';
}

// ===== Event-Listener für Modal =====
addcard?.addEventListener('click', () => {
  editingCardId = null;
  openModal();
});

closeModal?.addEventListener('click', closeModalHandler);
cancelBtn?.addEventListener('click', closeModalHandler);

// Modal schließen bei Klick außerhalb
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalHandler();
  }
});

// ===== Karte löschen (aus Modal) =====
deleteBtn?.addEventListener('click', async () => {
  if (!editingCardId) return;

  const confirmDelete = confirm('Möchtest du diese Karte wirklich löschen?');
  if (!confirmDelete) return;

  try {
    document.getElementById(editingCardId)?.remove();
    await fetchDelete(editingCardId);

    allItems = allItems.filter((item) => item.id !== editingCardId);

    closeModalHandler();
  } catch (error) {
    console.error('Fehler beim Löschen der Karte:', error);
    alert('Fehler beim Löschen der Karte. Bitte versuche es erneut.');
  }
});

// ===== Formular absenden =====
cardForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(cardForm);
  const titel = formData.get('title') as string;
  const beschreibung = formData.get('description') as string;
  const deadline = formData.get('deadline') as string;

  if (!titel) return;

  try {
    if (editingCardId) {
      // Karte aktualisieren
      const updates: Partial<Item> = { titel };

      if (beschreibung) {
        updates.beschreibung = beschreibung;
      } else {
        updates.beschreibung = '';
      }

      if (deadline) {
        updates.deadline = deadline;
      } else {
        updates.deadline = '';
      }

      await fetchPatch(editingCardId, updates);

      // Update local state
      const item = allItems.find((i) => i.id === editingCardId);
      if (item) {
        item.titel = titel;
        item.beschreibung = beschreibung || undefined;
        item.deadline = deadline || undefined;
        updateCardDisplay(item);
      }
    } else {
      // Neue Karte erstellen
      const newItem: Omit<Item, 'id'> = {
        titel,
        lane: 'lane-backlog',
        date: new Date().toISOString(),
      };

      if (beschreibung) {
        newItem.beschreibung = beschreibung;
      }

      if (deadline) {
        newItem.deadline = deadline;
      }

      const createdItem: Item = await fetchPost(newItem);
      allItems.push(createdItem);
      createCard(createdItem);
    }

    closeModalHandler();
  } catch (error) {
    console.error('Fehler beim Speichern der Karte:', error);
    alert('Fehler beim Speichern der Karte. Bitte versuche es erneut.');
  }
});

// ===== Karte löschen (Trash) =====
trash?.addEventListener('drop', async (event: DragEvent) => {
  event.preventDefault();
  if (!event.dataTransfer) return;

  const cardId = event.dataTransfer.getData('text/plain');

  const confirmDelete = confirm('Möchtest du diese Karte wirklich löschen?');
  if (!confirmDelete) return;

  document.getElementById(cardId)?.remove();
  await fetchDelete(cardId);

  allItems = allItems.filter((item) => item.id !== cardId);
});

trash?.addEventListener('dragover', (e) => e.preventDefault());

// ===== Initialisierung =====
loadCards();
