import { z } from "zod";

export const gpsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const uploadSchema = z.object({
  uploadedFiles: z.string().array(),
  deletedFiles: z.string().array(),
});

export const selectSchema = z.coerce.number().nullable();

export const inputSchema = z.string().min(2);

export const addressSchema = z.string();
