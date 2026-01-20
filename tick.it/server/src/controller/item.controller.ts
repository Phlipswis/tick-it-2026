// ===== Imports =====
import { Request, Response } from 'express';
import { Item } from '../models/item';
import { JsonService } from '../services/jsonServer.service';

/**
 * Controller für Item-Requests
 */
export class ItemController {
  // ===== GET: Alle Items =====
  public async getItem(_request: Request, response: Response) {
    try {
      const items: Item[] = await JsonService.getAllItems();
      response.status(200).json(items);
    } catch (error) {
      console.error('GET Error:', error);
      response.status(500).json({ message: 'Internal server error' });
    }
  }

  // ===== POST: Neues Item erstellen =====
  public async createItem(request: Request, response: Response) {
    try {
      console.log('POST Request Body:', request.body);
      const jsonPayload = JSON.stringify(request.body);
      const jsonServerResponse = await JsonService.createItem(jsonPayload);
      console.log('JSON Server Response:', jsonServerResponse);
      response.status(201).send(jsonServerResponse);
    } catch (error) {
      console.error('POST Error:', error);
      response
        .status(500)
        .json({ message: 'Internal server error', error: String(error) });
    }
  }

  // ===== PATCH: Item aktualisieren =====
  public async updateItem(request: Request, response: Response) {
    try {
      const { id } = request.params;
      console.log('PATCH Request for ID:', id, 'Body:', request.body);
      await JsonService.updateItem(id, JSON.stringify(request.body));
      response.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
      console.error('PATCH Error:', error);
      response
        .status(500)
        .json({ message: 'Internal server error', error: String(error) });
    }
  }

  // ===== DELETE: Item löschen =====
  public async deleteItem(request: Request, response: Response) {
    try {
      const { id } = request.params;
      console.log('DELETE Request for ID:', id);
      await JsonService.deleteItem(id);
      response.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('DELETE Error:', error);
      response
        .status(500)
        .json({ message: 'Internal server error', error: String(error) });
    }
  }
}
