/**
 * Defines and exports utility functions for creating standardized API responses in a Next.js environment.
 * These functions simplify the process of sending consistent success and error payloads.
 *
 * `sendSuccess`:
 * - Creates a JSON response for successful API calls.
 * - Takes a message string, data of a generic type `T`, and an optional HTTP status code (defaults to 200).
 * - The response body includes `success: true`, the provided message, and the data payload.
 * - It is strongly typed to ensure the data structure is consistent.
 *
 * `sendError`:
 * - Creates a JSON response for failed API calls.
 * - Takes an error message string and an optional HTTP status code (defaults to 500).
 * - The response body includes `success: false` and an `error` object containing the message.
 * - This helps in providing a clear, structured way to communicate failures to the client.
 */
import { FieldError } from '@costwise/domain/types/errors';
import { NextResponse } from 'next/server';

interface APIResponseSuccess<T> {
    success: boolean;
    message: string;
    data: T;
}

interface APIResponseError {
    success: boolean;
    error: {
        message: string
        errors?: FieldError[]
    };
}

interface ErrorObject {
    message: string
    errors?: FieldError[]
    field?: string
}


export const sendSuccess = <T>(message: string, data: T, status = 200): NextResponse<APIResponseSuccess<T>> => {
    return NextResponse.json({
        success: true,
        message,
        data,
    }, { status });
};

export const sendError = (error: ErrorObject, status = 500): NextResponse<APIResponseError> => {
    return NextResponse.json({
        success: false,
        error: {
            message: error.message,
            errors: error.errors,
            field: error.field
        }
    }, { status });
};