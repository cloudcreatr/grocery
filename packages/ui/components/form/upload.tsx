import { z } from "zod";
import { useFieldContext } from "./util";
import { useStore } from "@tanstack/react-form";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  ButtonComponent,
  upload_store,
  useStore as useUploadStore,
  type startUploadoptions,
} from "@pkg/ui";
import { cva } from "class-variance-authority";
import Ionicons from "@expo/vector-icons/Ionicons";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { is } from "@pkg/lib";
import { uploadSchema } from "@repo/bg";

type UploadFieldProps = {
  CardText: string;
} & startUploadoptions;
export function UploadField(props: UploadFieldProps) {
  const field = useFieldContext<z.infer<typeof uploadSchema>>();
  const value = useStore(field.store, (s) => s.value);
  const store = useUploadStore(upload_store, (s) => s);
  store.onComplete = (f) => {
    field.setValue({
      uploadedFiles: f.map((f) => f.fileName),
      deletedFiles: [],
    });
  };

  return (
    <View>
      {value.uploadedFiles.length === 0 ? (
        <Card text={props.CardText} isActive={false} />
      ) : (
        <Card
          text={`Uploaded ${value.uploadedFiles.length} file(s)`}
          isActive={true}
        />
      )}

      {store.selectedFiles.length > 0 ? (
        <>
          {store.selectedFiles.map((file, index) => (
            <View
              key={index}
              className="flex gap-2 border p-4 rounded-2xl bg-white border-slate-200 mb-2  "
            >
              <Text className="font-semibold text-slate-800 text-base">
                {file.fileName}
              </Text>
              <Text className="font-medium text-slate-500">{file.status}</Text>
            </View>
          ))}
        </>
      ) : (
        <ButtonComponent
          onPress={async () => {
            store.selectAndUpload(props);
          }}
        >
          {value.uploadedFiles.length === 0 ? "Upload file" : "Change file"}
        </ButtonComponent>
      )}
    </View>
  );
}

function Card({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <View
      className={twMerge(
        "bg-white p-4 border border-dotted border-slate-400 gap-2  rounded-2xl flex flex-row  items-center mb-2",
        isActive && "bg-blue-100 border-blue-600 "
      )}
    >
      {isActive && (
        <Ionicons name="document-lock-outline" size={40} color={"#1e40af"} />
      )}
      <Text
        className={twMerge(
          "font-bold text-slate-800",
          isActive && "text-blue-800"
        )}
      >
        {text}
      </Text>
    </View>
  );
}
