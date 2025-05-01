import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";

import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import {Resend } from 'resend'
import { db, eq, user, subjects, type Sub } from "@pkg/lib";
import { Hono } from "hono";
const app = new Hono();
const r = issuer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          console.log(email, code);
          

          const resend = new Resend('re_Z1oPQM3C_4wFLJMksfjkoQmiYWCP4okS6');

        await  resend.emails.send({
            from: "Auth <auth@omnaidu.codes>",
            to: [typeof email === "string" ? email : email.toString()],
            subject: `${code} otp`,
            html: `<p>${code} otp</p>`
          });
        },
      })
    ),
  },
  async allow() {
    return true;
  },
  success: async (ctx, value) => {
    if (value.provider === "code") {
      const email = value.claims.email;
      if (!email) {
        throw new Error("Email not found");
      }
      //find exsisting user
      const findUser = await db
        .select()
        .from(user)
        .where(eq(user.email, email));

      let userObj: Sub;

      if (findUser.length === 0) {
        //create new user
        const newUser = await db
          .insert(user)
          .values({
            email,
          })
          .returning({
            id: user.id,
            email: user.email,
          });
        if (!newUser[0]) throw new Error("Failed to create user");
        userObj = newUser[0];
      } else {
        if (!findUser[0]) throw new Error("User not found");
        userObj = findUser[0];
      }

      return ctx.subject("user", userObj);
    }

    throw new Error("Invalid provider");
  },
});
app.route("/", r);

Bun.serve({
  idleTimeout: 100,
  port: 3000,
  fetch: app.fetch,
});
