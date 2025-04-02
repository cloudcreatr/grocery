import { getDocumentAsync } from "expo-document-picker";
import * as Crypto from "expo-crypto";
import {
  createUploadTask,
  FileSystemUploadType,
  uploadAsync,
  type FileSystemNetworkTaskProgressCallback,
  type UploadProgressData,
} from "expo-file-system";
import { create } from "zustand";
type Status = "pending" | "uploading" | "done" | "error";
type Assets = {
  fileName: string;

  uri: string;
  status: Status;
  id: string;
  mimeType: string;
};

type AssetsUploaded = {
  fileName: string;
};

interface startUploadoptions {
  uploadUrl: string;
  multiple?: boolean;
  mimeType?: string[];
}

interface uploadStore {
  isUploading: boolean;
  selectedFiles: Assets[];
  onComplete?: (Assets: AssetsUploaded[]) => void;
  cancelUpload?: () => void;

  selectAndUpload: (options: startUploadoptions) => void;
}
const getFilenameFromUri = (uri: string): string => {
  return uri.substring(uri.lastIndexOf("/") + 1);
};

export const upload_store = create<uploadStore>((set, get) => ({
  selectedFiles: [],
  onComplete: undefined,
  cancelUpload: undefined,
  isUploading: false,

  selectAndUpload: async ({ uploadUrl, mimeType, multiple = false }) => {
    const DocumentPickerResult = await getDocumentAsync({
      type: mimeType,
      multiple: multiple,
      copyToCacheDirectory: true,
    });
    if (DocumentPickerResult.canceled === false) {
      set({ isUploading: true });
      const assets = DocumentPickerResult.assets.map((a) => {
        return {
          fileName: a.name,
          uri: a.uri,
          status: "pending" as Status,
          id: getFilenameFromUri(a.uri),
          mimeType: a.mimeType || "application/octet-stream",
        };
      });

      set({
        selectedFiles: assets,
      });

      const updateFileStatus = (status: Status, id: string) => {
        set((state) => ({
          selectedFiles: state.selectedFiles?.map((file) =>
            file.id === id ? { ...file, status } : file
          ),
        }));
      };

      const AssetsUploaded: AssetsUploaded[] = [];

      for (const asset of assets) {
        try {
          const response = await uploadAsync(uploadUrl, asset.uri, {
            uploadType: FileSystemUploadType.MULTIPART,
            fieldName: "file",
            mimeType: asset.mimeType,
          });

          if (response.status === 200) {
            updateFileStatus("done", asset.id);
            AssetsUploaded.push({
              fileName: asset.id,
            });
          } else {
            throw new Error("Upload failed");
          }
        } catch (e) {
          console.log("error", e);
          updateFileStatus("error", asset.id);
          continue;
        }
      }
      get().onComplete?.(AssetsUploaded);
      set({
        isUploading: false,
        cancelUpload: undefined,
        selectedFiles: [],
      });
    } else {
      console.log("DocumentPickerResult canceled");
      return;
    }
  },
}));
