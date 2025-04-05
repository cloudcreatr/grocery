import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

import {
  TextInput,
  View,
  type TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { Address, GPS } from "./address";
import { UploadField } from "./upload";
import { z } from "zod";
import { inputSchema } from "@repo/bg";
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    Input,
    Address,
    GPS,
    UploadField,
  },
  formComponents: {
    Submit,
  },
});

export function Submit({
  text,
  isSubmitting,
  onPress,
}: {
  text: string;
  isSubmitting: boolean;
  onPress: () => void;
}) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(s) => {
        return {
          isDirty: s.isDirty,
          canSubmit: s.canSubmit,
        };
      }}
    >
      {(state) => {
        const canSubmit = state.canSubmit;
        const isDirty = state.isDirty;
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={!canSubmit || isSubmitting || !isDirty}
            className="p-6  rounded-2xl mt-6 bg-blue-600 px-8 "
          >
            <Text className="text-white font-semibold capitalize tracking-wider">
              {isSubmitting ? "Submitting..." : text}
            </Text>
          </TouchableOpacity>
        );
      }}
    </form.Subscribe>
  );
}

export function Input(prop: TextInputProps) {
  const field = useFieldContext<z.infer<typeof inputSchema>>();

  return (
    <View className="bg-white border border-slate-300 rounded-2xl p-4  w-full placeholder-slate-400  ">
      <TextInput
        {...prop}
        className=" "
        value={field.state.value}
        onChangeText={(T) => field.handleChange(T)}
      />
    </View>
  );
}
