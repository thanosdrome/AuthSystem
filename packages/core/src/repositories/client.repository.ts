import { Client } from '../entities/client.js';

export interface ClientRepository {
    findById(id: string): Promise<Client | null>;
}
