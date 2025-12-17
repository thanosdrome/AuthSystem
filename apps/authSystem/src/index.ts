import { createServer } from './http/server.js';

const app = await createServer();

await app.listen({ port: 3000 });