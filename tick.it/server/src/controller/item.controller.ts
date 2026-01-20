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
    // request wird nicht genutzt
    try {
      const items: Item[] = await JsonService.getAllItems();
      response.status(200).json(items);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  }

  // ===== POST: Neues Item erstellen =====
  public async createItem(request: Request, response: Response) {
    try {
      const jsonPayload = JSON.stringify(request.body);
      const jsonServerResponse = await JsonService.createItem(jsonPayload);
      response.status(201).send(jsonServerResponse);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}
