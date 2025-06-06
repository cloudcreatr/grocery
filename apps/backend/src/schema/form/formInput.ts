import { z } from "zod";
import {
  addressSchema,
  gpsSchema,
  inputSchema,
  selectSchema,
  uploadSchema,
} from "./field";

export const storeUserSchema = z.object({
  name: inputSchema,
  doc: uploadSchema,
  phone: inputSchema,
  address: addressSchema.optional(),
  gps: gpsSchema,
});
export const storeInfoSchema = z.object({
  name: inputSchema,
  img: uploadSchema,
  description: inputSchema,
  address: addressSchema.optional(),
  gps: gpsSchema,
});

export const IndianBankDetailsSchema = z.object({
  IFSC: inputSchema,
  AccountNumber: inputSchema,
  BankName: inputSchema,
  BranchName: inputSchema,
  UPI: inputSchema,
});

export const ProductModifySchema = z.object({
  id: z.number(),
  name: inputSchema,
  description: inputSchema,
  price: inputSchema,
  productAvailable: selectSchema,
  img: uploadSchema.nullable(),
});

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: inputSchema,
  description: inputSchema,
  img: uploadSchema,
});
export const ProductAvailSchema = z.object({
  id: z.number().optional(),
  name: inputSchema,
  description: inputSchema,
  img: uploadSchema,
  category: selectSchema,
});

export type ProductModify = z.infer<typeof ProductModifySchema>;
export type IndianBankDetails = z.infer<typeof IndianBankDetailsSchema>;
export type StoreUser = z.infer<typeof storeUserSchema>;
export type StoreInfo = z.infer<typeof storeInfoSchema>;
export type categorySchema = z.infer<typeof CategorySchema>;
export type ProductAvail = z.infer<typeof ProductAvailSchema>;
