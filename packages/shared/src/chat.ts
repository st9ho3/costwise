// src/schemas/messageSchemas.ts (or wherever you manage your core data schemas)
import { z } from 'zod';

// -----------------------------------------------------------------------------
// Message (Updated Interface)
// -----------------------------------------------------------------------------
export const MessageSchema = z.object({
  id: z.string().uuid("Invalid message ID format"), // Assuming IDs are UUIDs, adjust if they are just any string
  message: z.string().min(1, "Message content cannot be empty"), // Renamed from 'content' to 'message'
  sender: z.string().min(1, "Sender is required"),
  // timestamp: string; // ISO 8601 string - z.string().datetime() is ideal for this
  timestamp: z.string().datetime("Invalid ISO 8601 timestamp format"),
});

export type MessageType = z.infer<typeof MessageSchema>; // Inferred Type: Message