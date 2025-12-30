import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AppError, ErrorCode } from '@/core';

export function setupErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
        app.log.error(error);

        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                success: false,
                error: {
                    code: error.code,
                    message: error.message
                }
            });
        }

        // Handle native Fastify validation errors
        if (error.validation) {
            return reply.status(400).send({
                success: false,
                error: {
                    code: ErrorCode.INVALID_INPUT,
                    message: error.message
                }
            });
        }

        // Default internal error
        return reply.status(500).send({
            success: false,
            error: {
                code: ErrorCode.INTERNAL_ERROR,
                message: 'An unexpected error occurred'
            }
        });
    });
}
