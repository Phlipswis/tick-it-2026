// Required modules
import express, { Request, Response, NextFunction } from 'express';
import jsonServer from 'json-server';
import path from 'path';
import dotenv from 'dotenv';
// Own modules
import { itemRouter } from './routers/items.router';

// Create hostname and ports
dotenv.config({ path: path.join(__dirname, '../.env') });
export const hostname = (process.env.HOSTNAME as string) || '127.0.0.1';
export const jsonPort = parseInt(process.env.JSON_PORT as string) || 3002;
export const expressPort = parseInt(process.env.EXPRESS_PORT as string) || 3001;

// Create express webserver
const httpServer = express();

// Create JSON server and use as middleware
const server = jsonServer.create();
const router = jsonServer.router(
  path.join(__dirname, '../public/data/', 'db.json'),
);
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
