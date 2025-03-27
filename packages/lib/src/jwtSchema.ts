import { createSubjects } from "@openauthjs/openauth/subject";
import { z } from "zod";

export const subschema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const subjects = createSubjects({
  user: subschema,
});
export type Sub = z.infer<typeof subschema>;
