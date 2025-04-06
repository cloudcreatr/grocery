import { z } from "zod";
import { addressSchema, gpsSchema, inputSchema, uploadSchema } from "./field";


export const storeUserSchema = z.object({
  name: inputSchema,
  doc: uploadSchema,
  phone: inputSchema,
  address: addressSchema.optional(),
  gps: gpsSchema.optional(),
});
export const storeInfoSchema = z.object({
  name: inputSchema,
  img: uploadSchema,
  description: inputSchema,
  address: addressSchema.optional(),
  gps: gpsSchema.optional(),
});

export const IndianBankDetailsSchema = z.object({
  IFSC: inputSchema,
  AccountNumber: inputSchema,
  BankName: inputSchema,
  BranchName: inputSchema,
  UPI: inputSchema,
});
export type IndianBankDetails = z.infer<typeof IndianBankDetailsSchema>;
export type StoreUser = z.infer<typeof storeUserSchema>;
export type StoreInfo = z.infer<typeof storeInfoSchema>;
