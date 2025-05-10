import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";

// import { CodeProvider } from "@openauthjs/openauth/provider/code";
// import { CodeUI } from "@openauthjs/openauth/ui/code";
// import { Resend } from "resend";
import { db, eq, user, subjects, type Sub, store, bank } from "@pkg/lib";
import { Hono } from "hono";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
const app = new Hono();
const r = issuer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    // code: CodeProvider(
    //   CodeUI({
    //     sendCode: async (email, code) => {
    //       console.log(email, code);

    //       const resend = new Resend("re_Z1oPQM3C_4wFLJMksfjkoQmiYWCP4okS6");

    //       await resend.emails.send({
    //         from: "Auth <auth@omnaidu.codes>",
    //         to: [typeof email === "string" ? email : email.toString()],
    //         subject: `${code} otp`,
    //         html: `<p>${code} otp</p>`,
    //       });
    //     },
    //   })
    // ),
    google: GoogleProvider({
      clientID:
        "661073424991-51bgrnao5f87pn8nlpdtsjfod33a2638.apps.googleusercontent.com",
      clientSecret: "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",
      pkce: true,
      scopes: ["email"],
    }),
  },
  async allow() {
    return true;
  },
  success: async (ctx, value) => {
    // if (value.provider === "code") {
    //   const email = value.claims.email;
    //   if (!email) {
    //     throw new Error("Email not found");
    //   }
    //   //find exsisting user
    //   const findUser = await db
    //     .select()
    //     .from(user)
    //     .where(eq(user.email, email));

    //   let userObj: Sub;

    //   if (findUser.length === 0) {
    //     //create new user
    //     const newUser = await db
    //       .insert(user)
    //       .values({
    //         email,
    //       })
    //       .returning({
    //         id: user.id,
    //         email: user.email,
    //       });
    //     if (!newUser[0]) throw new Error("Failed to create user");
    //     userObj = newUser[0];
    //   } else {
    //     if (!findUser[0]) throw new Error("User not found");
    //     userObj = findUser[0];
    //   }

    //   return ctx.subject("user", userObj);
    // }
    if (value.provider === "google") {
      // Fetch user info from Google
      const googleUserResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${value.tokenset.access}`,
          },
        }
      );

      if (!googleUserResponse.ok) {
        throw new Error("Failed to fetch user info from Google");
      }

      const googleUserData = await googleUserResponse.json();
      console.log(googleUserData);
      const email = googleUserData.email;

      if (!email) {
        throw new Error("Email not found in Google user data");
      }

      //find existing user
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

        await db.insert(store).values({
          userId: newUser[0].id,
        });
        await db.insert(bank).values({
          userid: newUser[0].id,
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
