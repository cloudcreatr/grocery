import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";


import { object, string } from "valibot";
import { createSubjects } from "@openauthjs/openauth/subject";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";

const subjects = createSubjects({
  user: object({
    id: string(),
  }),
});

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123";
}

export default issuer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      })
    ),
    google: GoogleProvider({
      clientID:
        "661073424991-51bgrnao5f87pn8nlpdtsjfod33a2638.apps.googleusercontent.com",
      clientSecret: "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",
      scopes: ["email"],
    }),
  },
  async allow() {
    return true;
  },
  success: async (ctx, value) => {
    if (value.provider === "code") {
      return ctx.subject("user", {
        id: await getUser(value.email),
      });
    }
    if (value.provider === "google") {
      console.log(value);
      return ctx.subject("user", {
        id: await getUser(value.email),
      });
    }
    throw new Error("Invalid provider");
  },
});
