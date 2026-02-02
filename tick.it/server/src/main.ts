// Required modules
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Own modules
import { itemRouter } from './routers/items.router.ts';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create hostname and ports
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

export const hostname = (process.env.HOSTNAME as string) || '127.0.0.1';
export const jsonPort = parseInt(process.env.JSON_PORT as string) || 3002;
export const expressPort = parseInt(process.env.EXPRESS_PORT as string) || 3001;

// Create express webserver
const httpServer = express();

// Initialize database file if needed
const dbPath = path.join(__dirname, '../public/data/', 'db.json');
const initializeDatabase = () => {
  try {
    // Check if file exists
    if (!fs.existsSync(dbPath)) {
      // Create directory if it doesn't exist
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      // Create db.json with correct structure
      fs.writeFileSync(dbPath, JSON.stringify({ items: [] }, null, 2));
      console.log('Database file created with initial structure');
    } else {
      // File exists, check if it has correct structure
      const fileContent = fs.readFileSync(dbPath, 'utf-8');
      const data = JSON.parse(fileContent);

      // If items array doesn't exist, add it
      if (!data.items) {
        data.items = [];
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        console.log('Database file updated with items array');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database before starting servers
initializeDatabase();

// Create JSON server and use as middleware
const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Security middleware to only allow requests from express server to json server
type SecurityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

const securityMiddleware: SecurityMiddleware = function (req, res, next) {
  // Check if request comes from express server port
  if (req.headers['user-agent'] !== 'node') {
    res.status(403).send({ Forbidden: 'Access is denied' });
    return;
  } else {
    next();
  }
};

// Middleware to parse json in responses
// Set HTTP-SizeLimit to 2mb
httpServer.use(express.json({ limit: '2mb' }));
httpServer.use(function (_req, res, next) {
  // Allow everyone to connect
  // Disabling CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow client vite server over localhost to http:post 'Content-Type': 'application/json' to express server
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // Allow specific HTTP methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  next();
});

// Use items router for route '/api/items'
// REST conform API will be available under http://hostname:expressPort/api/items
httpServer.use('/api/items', itemRouter);

/**
 * Start json server listening
 */
server.use(middlewares);
server.use(securityMiddleware);
server.use(router);
server.listen(jsonPort, hostname, () => {
  console.log(`JSON server is listening on http://${hostname}:${jsonPort}/`);
});

/**
 * Start express server listening
 */
httpServer.listen(expressPort, hostname, () => {
  console.log(
    `Express server is listening on http://${hostname}:${expressPort}/`,
  );
  console.log(`End server with ^C (CTRL + C)`);
});
