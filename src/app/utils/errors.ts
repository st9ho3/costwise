import { FieldError } from "@/types/errors"
import { ZodError } from "zod"

export class AppError extends Error {
    public readonly statusCode: number
    
    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
}}

export class ValidationError extends AppError {
  public readonly errors: FieldError[]

  constructor(errors: FieldError[] | ZodError) {
    super("Validation failed", 400)
    this.errors = this.normalizeErrors(errors)
  }

  private normalizeErrors(errors: FieldError[] | ZodError): FieldError[] {
    if (Array.isArray(errors)) {
      return errors
    }

    return errors.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }))
  }
}

export class ConflictError extends AppError {
    public readonly resource: string
    public readonly field: string

    constructor(resource: string, field: string) {
        super(`${resource} with this ${field} already exists`, 409)
        this.resource = resource
        this.field = field
    }
}

export class NotFoundError extends AppError {
    public readonly resource: string
    public readonly identifer: string

    constructor(resource: string, identifer: string) {
        super(`${resource} not found`, 404)
        this.resource = resource
        this.identifer = identifer
    }
}

export class ForbiddenError extends AppError {
    public readonly resource: string
    public readonly identifier: string
    public readonly userId: string 

    constructor(resource: string, identifier: string, userId: string) {
        super(`${resource} not found`, 404)
        this.resource = resource
        this.identifier = identifier
        this.userId = userId 
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401)
    }
}

export class DataBaseError extends AppError {
    public readonly originalError: unknown
    public readonly operation: string

    constructor(operation: string, originalError: unknown) {
        super('A database error occured', 500)
        this.originalError = originalError
        this.operation = operation
    }
}



