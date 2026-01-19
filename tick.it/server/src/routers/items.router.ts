import { Router } from 'express';
import { ItemController } from '../controller/item.controller';

/**
 * Router for handling item-related requests
 */
export const itemRouter = Router();

/**
 * Controller handling item-related requests
 */
export const itemController = new ItemController();

// Create GET route for retrieving items based on the search query parameter
// Since the base route is '/api/items', the full route is GET '/api/items/'
itemRouter.get('/', itemController.getItem);

// Create POST route to create a new item
// Since the base route is '/api/items', the full route is POST '/api/items/'
itemRouter.post('/', itemController.createItem);
