import { Hono } from "hono";
import { publicProcedure, router } from "./util/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const upload = new Hono()
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    console.log("Getting file", id);
    const filename = `${id}`;
    const bunfile = Bun.file(`uploads/${filename}`);

    if (!(await bunfile.exists())) {
      return c.json({ error: "File not found" }, 404);
    }
    console.log("File found", bunfile);
    return new Response(bunfile.stream(), {
      headers: {
        "Content-Type": bunfile.type,
      },
    });
  })
  .post("/", async (c) => {
    try {
      console.log("Uploading file");
      const form = await c.req.parseBody();
      const file = form["file"] as File;
      
    
     
      console.log("Form", form);

      

      if (!file || !(file instanceof File) ) {
        return c.json({ error: "Missing or invalid file upload" }, 400);
      }
      console.log("File", file);
      

      const maxSize = 10 * 1024 * 1024; // 10MB limit

      if (file.size > maxSize) {
        return c.json({ error: "File too large. Max size is 10MB" }, 400);
      }

      // Create filename with original extension
     
      
      const bunfile = Bun.file(`uploads/${file.name}`, {
        type: file.type,
      });

      await Bun.write(bunfile, file);

      return c.json({
        message: "File uploaded successfully",
        
        originalName: file.name,
        size: file.size,
        type: file.type,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return c.json({ error: "Failed to upload file" }, 500);
    }
  });

export const uploadFile = router({
  upload: publicProcedure
    .input(
      z.object({
        id: z.string(),
        file: z.instanceof(File),
        fileType: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, file, fileType, fileName } = input;

      const maxSize = 100 * 1024 * 1024; // 10MB limit

      if (file.size > maxSize) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File too large. Max size is 10MB",
        });
      }

      // Create filename with original extension
      const filename = `${id}`;
      const originalExt = fileName.split(".").pop() || "";
      const bunfile = Bun.file(`uploads/${filename}.${originalExt}`, {
        type: fileType,
      });

      // Single write operation
      await Bun.write(bunfile, file);

      return {
        message: "File uploaded successfully",
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      };
    }),
});

export const deleteFile = async (id: string) => {
  const bunfile = Bun.file(`uploads/${id}`);
  const file = await bunfile.exists();
  if (file) {
    await bunfile.delete();
    return true;
  }
  return false;
};
