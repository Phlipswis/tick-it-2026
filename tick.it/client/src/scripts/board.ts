// -------------------------
// DOM-Elemente referenzieren
// -------------------------
const backlog = document.getElementById('lane-backlog');
const inProgress = document.getElementById('lane-in-progress');
const review = document.getElementById('lane-review');
const done = document.getElementById('lane-done');
const newCardBtn = document.getElementById('addcard');
const trash = document.getElementById('trash');

let cardCounter = 0;

// -------------------------
// Karten aus Local Storage laden
// -------------------------
function loadCards() {
  const storedCards = localStorage.getItem('kanban-cards');
  if (!storedCards) return;

  const cards: { id: string; text: string; lane: string }[] =
    JSON.parse(storedCards);
  cards.forEach((data) => {
    const card = document.createElement('div');
    card.id = data.id;
    card.className = 'card';
    card.draggable = true;
    card.textContent = data.text;
    card.addEventListener('dragstart', onDragStart);

    const lane = document.getElementById(data.lane);
    lane?.appendChild(card);

    // Counter hochsetzen, um Duplikate zu vermeiden
    const num = parseInt(data.id.split('-')[1]);
    if (num > cardCounter) cardCounter = num;
  });
}

// -------------------------
// Karten speichern
// -------------------------
function saveCards() {
  const lanes = [
    'lane-backlog',
    'lane-in-progress',
    'lane-review',
    'lane-done',
  ];
  const cards: { id: string; text: string; lane: string }[] = [];

  lanes.forEach((laneId) => {
    const lane = document.getElementById(laneId);
    if (!lane) return;

    lane.querySelectorAll('.card').forEach((card) => {
      cards.push({
        id: card.id,
        text: card.textContent || '',
        lane: laneId,
      });
    });
  });

  localStorage.setItem('kanban-cards', JSON.stringify(cards));
}

// -------------------------
// Neue Karte erstellen
// -------------------------
newCardBtn?.addEventListener('click', () => {
  const cardText = prompt('Name der Karte:');
  if (!cardText) return;

  cardCounter++;

  const newCard = document.createElement('div');
  newCard.id = `card-${cardCounter}`;
  newCard.className = 'card';
  newCard.draggable = true;
  newCard.textContent = cardText;

  newCard.addEventListener('dragstart', onDragStart);

  backlog?.appendChild(newCard);
  saveCards(); // Änderungen speichern
});

// -------------------------
// Trash-Bereich (Karte löschen)
// -------------------------
if (trash) {
  trash.addEventListener('dragover', (event) => event.preventDefault());
  trash.addEventListener('drop', (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    if (card) card.remove();

    saveCards(); // Änderungen speichern
  });
}

// -------------------------
// Drag & Drop für Lanes
// -------------------------
const lanes = [backlog, inProgress, review, done];
lanes.forEach((lane) => {
  lane?.addEventListener('dragover', onDragOver);
  lane?.addEventListener('drop', (event) => {
    onDrop(event);
    saveCards(); // Änderungen speichern
  });
});

// -------------------------
// Event-Handler-Funktionen
// -------------------------
function onDragStart(event: DragEvent) {
  if (!event.dataTransfer || !(event.target instanceof HTMLElement)) return;
  event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer || !(event.currentTarget instanceof HTMLElement))
    return;

  const cardId = event.dataTransfer.getData('text/plain');
  const card = document.getElementById(cardId);
  if (card) event.currentTarget.appendChild(card);
}

// -------------------------
// Beim Laden der Seite Karten wiederherstellen
// -------------------------
loadCards();
