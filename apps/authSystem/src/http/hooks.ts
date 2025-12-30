import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'UNAUTHORIZED' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.decode(token) as any;
        if (!decoded || !decoded.sub) throw new Error('Invalid token');

        (request as any).user = { id: decoded.sub };
    } catch (err) {
        return reply.status(401).send({ error: 'INVALID_TOKEN' });
    }
}
