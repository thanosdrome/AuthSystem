import { healthController } from '../controllers/health.controller.js';
import { FastifyInstance } from 'fastify';


export function registerHealthRoutes(app: FastifyInstance) {
    app.get('/health', healthController);
}