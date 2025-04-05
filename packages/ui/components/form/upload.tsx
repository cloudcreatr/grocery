import { z } from "zod";
import { useFieldContext } from "./util";
import { useStore } from "@tanstack/react-form";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { upload_store, useStore as useUploadStore } from "@pkg/ui";
import { cva } from "class-variance-authority";
import Ionicons from "@expo/vector-icons/Ionicons";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { is } from "@pkg/lib";
import { uploadSchema } from "@repo/bg";
export function UploadField() {
  const field = useFieldContext<z.infer<typeof uploadSchema>>();
  const value = useStore(field.store, (s) => s.value);
  const store = useUploadStore(upload_store, (s) => s);
  store.onComplete = (f) => {
    console.log("Files uploaded", f);
    field.setValue({
      uploadedFiles: f.map((f) => f.fileName),
      deletedFiles: [],
    });
  };

  return (
    <View>
      <View>
        <Text>is uploading: {store.isUploading ? "true" : "false"}</Text>
        <Text>
          {value.uploadedFiles.length === 0 ? (
            <Card text="Upload file" isActive={false} />
          ) : (
            <Card
              text={`Uploaded ${value.uploadedFiles.length} file(s)`}
              isActive={true}
            />
          )}
        </Text>
        <TouchableOpacity>
          <Text
            onPress={async () => {
              store.selectAndUpload({
                uploadUrl: `${process.env.EXPO_PUBLIC_API}/upload`,
              });
            }}
          >
            {value.uploadedFiles.length === 0 ? "Upload file" : "Change file"}
          </Text>
        </TouchableOpacity>
        {store.selectedFiles.length > 0 && (
          <ScrollView>
            {store.selectedFiles.map((file, index) => (
              <View key={index} className="flex  gap-2 border p-4 rounded-2xl bg-white border-slate-200  ">
                <Text className="">{file.fileName}</Text>
                <Text>{file.status}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function Card({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <View
      className={twMerge(
        clsx(
          "bg-white p-8 border border-dotted border-slate-400 flex-1 w-full rounded-2xl flex flex-row  items-center",
          isActive && "bg-blue-100 border-blue-600 "
        )
      )}
    >
      {isActive && (
        <Ionicons name="document-lock-outline" size={40} color={"#1e40af"} />
      )}
      <Text
        className={twMerge(
          clsx("font-bold text-slate-800", isActive && "text-blue-800")
        )}
      >
        {text}
      </Text>
    </View>
  );
}
