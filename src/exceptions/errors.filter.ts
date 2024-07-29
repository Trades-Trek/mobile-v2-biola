import {ArgumentsHost, Catch, HttpStatus} from "@nestjs/common";
import {Request, Response} from 'express';
import {BaseExceptionFilter} from "@nestjs/core";
import {RollbarLogger} from "nestjs-rollbar";

const logger = require('../utils/logger');

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        const validatorErrors = exception.response ? exception.response.message : null;
        const message = (exception instanceof Error) ? validatorErrors ? validatorErrors : exception.message : exception.message.error ? exception.message.error : response;
        let path = '';
        switch (exception.status) {
            case HttpStatus.NOT_FOUND:
                status = HttpStatus.NOT_FOUND;
                break;
            case HttpStatus.SERVICE_UNAVAILABLE:
                status = HttpStatus.SERVICE_UNAVAILABLE;
                break;
            case HttpStatus.NOT_ACCEPTABLE:
                status = HttpStatus.NOT_ACCEPTABLE;
                break;
            case HttpStatus.EXPECTATION_FAILED:
                status = HttpStatus.EXPECTATION_FAILED;
                break;
            case HttpStatus.BAD_REQUEST:
                status = HttpStatus.BAD_REQUEST;
                break;
            case HttpStatus.UNAUTHORIZED:
                status = HttpStatus.UNAUTHORIZED;
                break;
        }
        logger.error(`status - ${status || 500} message - ${message} `);
        // this.rollbarLogger.error({message})
        if (process.env.NODE_ENV === 'development') path = request.url;
        response
            .status(status)
            .json({
                status: status,
                success: false,
                data: [],
                errors: message,
                timestamp: new Date().toISOString(),
                path,
                message: (status === HttpStatus.INTERNAL_SERVER_ERROR) ? 'Sorry we are experiencing technical problems.' : ''
            });
    }
}
