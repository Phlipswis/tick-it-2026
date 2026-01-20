// ===== Imports =====
import { Request, Response } from 'express';
import { Item } from '../models/item';
import filterByDate, { DateFilter } from '../services/item.service';
import { JsonService } from '../services/jsonServer.service';

/**
 * Controller für Item-Requests
 */
export class ItemController {
  // ===== GET: Items mit optionalem Datumsfilter =====
  public async getItem(request: Request, response: Response) {
    try {
      const { from, to } = request.query;
      const dateFilter: DateFilter = {
        from: from as string | undefined,
        to: to as string | undefined,
      };
      const items: Item[] = await JsonService.getAllItems();
      const responseData: Item[] = filterByDate(items, dateFilter);
      response.status(200).json(responseData);
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
