"use client";

import { create } from "zustand";
import type { AppRouter } from "@repo/bg";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
export interface UploadOptions {
  uploadUrl: string;
  chunkSize: number;
  maxFileSize?: number;
  onComplete?: (filesUploadedID: fileUploadedID[]) => void;
  onError?: (error: Error) => void;
}

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface FileListItem {
  id: string;
  file: File;
  status: UploadStatus;
}

export interface fileUploadedID {
  id: string;
  mimeType: string;
  fileName: string;
}

interface UploadState {
  error: string | null;
  progress: number;
  uploading: boolean;
  fileList: FileListItem[];
  // fix: Specify the type for fileMetaData
  uploadUrl: string;

  maxFileSize: number;
  abortController?: AbortController;
  onComplete?: (filesUploadedID: fileUploadedID[]) => void;
  onError?: (error: Error) => void;

  // Actions
  validateFile: (file: File) => boolean;

  setFileAndUpload: (files: File[]) => void;
  uploadFiles: (files: FileListItem[]) => Promise<void>;
  uploadFile: (file: FileListItem, index: number) => Promise<void>;
  resetUpload: () => void;
  updateFileMetaData: (
    status: UploadStatus,

    index: number
  ) => void;

  cancelUpload: () => void;
}

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.EXPO_PUBLIC_API}/trpc`,
      // You can pass any HTTP headers you wish here
    }),
  ],
});

const initialUploadState = {
  error: null,
  progress: 0,
  uploading: false,
  fileList: [],

  uploadUrl: process.env.EXPO_PUBLIC_API + "/upload",
  chunkSize: 100 * 1024 * 1024, // 100MB default
  maxFileSize: 100 * 1024 * 1024, // 100MB default
};

export const UploadStore = create<UploadState>()((set, get) => ({
  ...initialUploadState,

  validateFile: (file: File) => {
    const { maxFileSize, onError } = get();
    if (file.size > maxFileSize) {
      const error = new Error(
        `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`
      );
      onError?.(error);
      set({ error: error.message }); // set the error in the state
      return false;
    }
    return true;
  },

  setFileAndUpload: (files: File[]) => {
    if (get().uploading) return;
    console.log("setFileAndUpload called with:", files);
    const { validateFile, uploadFiles } = get();

    // const validFiles = files.filter((file) => {
    //   try {
    //     return validateFile(file);
    //   } catch (error) {
    //     const err = error instanceof Error ? error : new Error(String(error));
    //     get().onError?.(err);
    //     set({ error: err.message }); // set the error in the state
    //     return false;
    //   }
    // });
    console.log("Valid files:", files);

    const newFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "pending" as UploadStatus,
      progress: 0,
    }));

    // Update state with new files
    set((state) => ({ fileList: [...state.fileList, ...newFiles] }));

    // Start upload immediately
    get().uploadFiles(newFiles);
  },

  uploadFiles: async (files: FileListItem[]) => {
    console.log("uploadFiles called with:", files);
    const { uploadFile, onComplete, resetUpload } = get();

    set({ uploading: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        await uploadFile(file, i);
      }
    }

    if (!get().error) {
      onComplete?.(
        files.map((file) => ({
          id: file.id,
          mimeType: file.file.type,
          fileName: file.file.name,
        }))
      );
    }

    set({ uploading: false });
    get().resetUpload();
  },

  uploadFile: async (file: FileListItem, index: number) => {
    console.log(`uploadFile called for file:`, file);
    const { uploadUrl, updateFileMetaData, onError } = get();

    const abortController = new AbortController();
    set({ abortController });

    const { id, file: currentFile } = file;

    const totalBytes = currentFile.size;
    let bytesUploaded = 0;
    const fileType = currentFile.type;
    const fileName = currentFile.name;

    get().updateFileMetaData("uploading", index);

    try {
      await client.file.upload.mutate({
        id,
        file: currentFile,
        fileType,
        fileName,
      });

      get().updateFileMetaData("done", index);
    } catch (error) {
      console.error("Upload error:", error);
      get().updateFileMetaData("error", index);
      const err = error instanceof Error ? error : new Error(String(error));
      get().onError?.(err);
      set({ error: err.message }); // set the error in the state
    }
  },

  resetUpload: () => {
    console.log("resetUpload called");
    set({
      uploading: false,
      fileList: [],
      abortController: undefined,
      error: null,
    });
  },

  updateFileMetaData: (
    status: UploadStatus,

    index: number
  ) => {
    set((state) => ({
      fileList: state.fileList.map((file, i) =>
        i === index ? { ...file, status } : file
      ),
    }));
  },

  cancelUpload: () => {
    const { abortController, resetUpload } = get();
    if (abortController) {
      abortController.abort();
      resetUpload();
    }
  },
}));
