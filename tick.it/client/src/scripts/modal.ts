import type { Item } from './item';
import { fetchPost, fetchPatch, fetchDelete } from './api';
import { createCard } from './board';

// ===== DOM-Elemente =====
const modal = document.getElementById('card-modal');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');
const cardForm = document.getElementById('card-form') as HTMLFormElement;
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');
const addcard = document.getElementById('addcard');

// ===== State für Bearbeitungsmodus =====
let editingCardId: string | null = null;
let allItems: Item[] = [];

// ===== Modal öffnen/schließen =====
export function openModal() {
  modal?.classList.add('active');
}

export function closeModalHandler() {
  modal?.classList.remove('active');
  cardForm?.reset();
  editingCardId = null;

  if (modalTitle) modalTitle.textContent = 'Create new card';
  if (submitBtn) submitBtn.textContent = 'Save';
  if (deleteBtn) deleteBtn.style.display = 'none';
}

// ===== Karte bearbeiten im Modal =====
export function openEditModal(item: Item) {
  editingCardId = item.id;

  if (modalTitle) modalTitle.textContent = 'Edit card';
  if (submitBtn) submitBtn.textContent = 'Save';
  if (deleteBtn) deleteBtn.style.display = 'block';

  const titleInput = document.getElementById('card-title') as HTMLInputElement;
  const descInput = document.getElementById(
    'card-description',
  ) as HTMLTextAreaElement;
  const deadlineInput = document.getElementById(
    'card-deadline',
  ) as HTMLInputElement;

  if (titleInput) titleInput.value = item.titel;
  if (descInput) descInput.value = item.beschreibung || '';
  if (deadlineInput) deadlineInput.value = item.date || '';

  openModal();
}

// ===== Event-Listener für Modal =====
export function initModalListeners(itemsState: Item[]) {
  allItems = itemsState;

  addcard?.addEventListener('click', () => {
    editingCardId = null;
    openModal();
  });

  cancelBtn?.addEventListener('click', closeModalHandler);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalHandler();
  });

  deleteBtn?.addEventListener('click', async () => {
    if (!editingCardId) return;

    try {
      document.getElementById(editingCardId)?.remove();
      await fetchDelete(editingCardId);

      const index = allItems.findIndex((item) => item.id === editingCardId);
      if (index !== -1) allItems.splice(index, 1);

      closeModalHandler();
    } catch (error) {
      console.error('Error occured while deleting card:', error);
      alert('Error occured while deleting card, please try again.');
    }
  });
}

// ===== Getter/Setter =====
export function getEditingCardId() {
  return editingCardId;
}

export function setAllItems(items: Item[]) {
  allItems = items;
}

// ===== DOM aktualisieren bei Bearbeitung =====
function updateCardDisplay(item: Item) {
  const card = document.getElementById(item.id);
  if (!card) return;

  const titleDiv = card.querySelector('.card-title');
  if (titleDiv) titleDiv.textContent = item.titel;

  const descDiv = card.querySelector('.card-description');
  if (descDiv) descDiv.textContent = item.beschreibung || '';

  const deadlineDiv = card.querySelector('.card-deadline');
  if (deadlineDiv) deadlineDiv.textContent = item.date ? item.date : '';
}

// ===== Form Submission =====
cardForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(cardForm);
  const titel = formData.get('title') as string;
  const beschreibung = formData.get('description') as string;
  const deadline = formData.get('deadline') as string;

  if (!titel) return;

  try {
    if (!editingCardId) {
      // Neue Karte erstellen
      const newItem: Omit<Item, 'id'> = {
        titel,
        lane: 'lane-backlog',
        beschreibung: beschreibung || undefined,
        date: deadline || undefined,
      };

      const createdItem: Item = await fetchPost(newItem);
      allItems.push(createdItem);
      createCard(createdItem);
    } else {
      // Karte bearbeiten
      await fetchPatch(editingCardId, {
        titel,
        beschreibung,
        date: deadline || undefined,
      });
      const item = allItems.find((i) => i.id === editingCardId);
      if (item) {
        item.titel = titel;
        item.beschreibung = beschreibung || undefined;
        item.date = deadline || undefined;
        updateCardDisplay(item);
      }
    }

    closeModalHandler();
  } catch (error) {
    console.error('Error occured while saving card:', error);
    alert('Error occured while saving card, please try again.');
  }
});
