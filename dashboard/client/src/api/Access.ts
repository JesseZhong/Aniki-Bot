import { ErrorResponse } from './ErrorResponse';

export type Access = (
    action: (
        access_token: string,
        errorHandler?: (response: ErrorResponse) => boolean
    ) => void
) => void