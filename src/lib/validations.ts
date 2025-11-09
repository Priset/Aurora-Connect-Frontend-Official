import { z } from "zod";

export const registerClientSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),
  
  role: z.literal("client")
});

export const registerTechnicianSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),
  
  experience: z
    .string()
    .min(10, "La experiencia debe tener al menos 10 caracteres")
    .max(1000, "La experiencia no puede exceder 1000 caracteres"),
  
  years_experience: z
    .number({ invalid_type_error: "Debes ingresar un número válido" })
    .min(1, "Los años de experiencia deben ser al menos 1")
    .max(50, "Los años de experiencia no pueden exceder 50"),
  
  role: z.literal("technician")
});

export const serviceRequestSchema = z.object({
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  
  offeredPrice: z
    .number()
    .min(1, "El precio debe ser mayor a 0")
    .max(10000, "El precio no puede exceder 10,000 Bs")
});

export const serviceOfferSchema = z.object({
  message: z
    .string()
    .min(5, "El mensaje debe tener al menos 5 caracteres")
    .max(500, "El mensaje no puede exceder 500 caracteres"),
  
  proposedPrice: z
    .number({ invalid_type_error: "El precio debe ser un número válido" })
    .min(1, "El precio debe ser mayor a 0")
    .max(10000, "El precio no puede exceder 10,000 Bs")
});

export const createServiceOfferSchema = (minPrice: number) => z.object({
  message: z
    .string()
    .min(5, "El mensaje debe tener al menos 5 caracteres")
    .max(500, "El mensaje no puede exceder 500 caracteres"),
  
  proposedPrice: z
    .number({ invalid_type_error: "El precio debe ser un número válido" })
    .min(minPrice + 1, `El precio debe ser mayor a Bs. ${minPrice.toFixed(2)}`)
    .max(10000, "El precio no puede exceder 10,000 Bs")
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Debes seleccionar al menos 1 estrella")
    .max(5, "La calificación máxima es 5 estrellas"),
  
  comment: z
    .string()
    .max(500, "El comentario no puede exceder 500 caracteres")
    .optional()
});

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(2000, "El mensaje no puede exceder 2000 caracteres")
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")
    .optional(),
  
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios")
    .optional(),
  
  email: z
    .string()
    .email("Formato de email inválido")
    .max(100, "El email no puede exceder 100 caracteres")
    .optional()
});

export const updateTechnicianSchema = z.object({
  experience: z
    .string()
    .min(10, "La experiencia debe tener al menos 10 caracteres")
    .max(1000, "La experiencia no puede exceder 1000 caracteres")
    .optional(),
  
  years_experience: z
    .number()
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(50, "Los años de experiencia no pueden exceder 50")
    .optional()
});

export const reportSchema = z.object({
  reason: z
    .enum(["harassment", "inappropriate_language", "unprofessional_behavior", "other"], {
      errorMap: () => ({ message: "Selecciona una razón válida" })
    }),
  
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres")
});

export type RegisterClientData = z.infer<typeof registerClientSchema>;
export type RegisterTechnicianData = z.infer<typeof registerTechnicianSchema>;
export type ServiceRequestData = z.infer<typeof serviceRequestSchema>;
export type ServiceOfferData = z.infer<typeof serviceOfferSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UpdateTechnicianData = z.infer<typeof updateTechnicianSchema>;
export type ReportData = z.infer<typeof reportSchema>;