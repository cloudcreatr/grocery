import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";

import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";

import { db, eq, user, subjects, type Sub } from "@pkg/lib";



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
