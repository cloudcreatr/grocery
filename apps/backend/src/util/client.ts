import { createClient } from "@openauthjs/openauth/client";

export const client = createClient({
  issuer: `${process.env["AUTH"]}`,
  clientID: "backend",
});
