import { createClient } from "@openauthjs/openauth/client";

export const client = createClient({
  issuer: `https://${process.env["AUTH"]}`,
  clientID: "backend",
});
