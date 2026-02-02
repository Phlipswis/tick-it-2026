import { Router } from 'express';
import { ItemController } from '../controller/item.controller.ts';

/**
 * Router for handling item-related requests
 */
export const itemRouter = Router();

/**
 * Controller handling item-related requests
 */
export const itemController = new ItemController();

// GET: Alle Items abrufen
// Route: GET '/api/items/'
itemRouter.get('/', itemController.getItem);

// POST: Neues Item erstellen
// Route: POST '/api/items/'
itemRouter.post('/', itemController.createItem);

// PATCH: Item aktualisieren
// Route: PATCH '/api/items/:id'
itemRouter.patch('/:id', itemController.updateItem);

// DELETE: Item löschen
// Route: DELETE '/api/items/:id'
itemRouter.delete('/:id', itemController.deleteItem);
