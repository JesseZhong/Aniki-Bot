import { Response } from 'superagent';

export interface ErrorResponse extends Response {
    statusText: string;
}