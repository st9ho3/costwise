import { FieldError } from "@/types/errors"


export class AppError extends Error {
    public readonly statusCode: number
    
    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
}}

export class ValidationError extends AppError {
    public readonly errors: FieldError[]

    constructor(fields: FieldError[]) {
        super('Validation failed', 400)
        this.errors = fields
    }
}



