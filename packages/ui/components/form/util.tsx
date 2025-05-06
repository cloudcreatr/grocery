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
import { is } from "@pkg/lib";
import { twMerge } from "tailwind-merge";
import { ButtonComponent } from "../rn";
import { SelectField } from "./select";
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
    SelectField,
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
        const isDisabled = !canSubmit || isSubmitting || !isDirty;
        return (
          <ButtonComponent
            isDisabled={isDisabled}
            isLoading={isSubmitting}
            onPress={onPress}
          >
            {text}
          </ButtonComponent>
        );
      }}
    </form.Subscribe>
  );
}

export function Input(prop: TextInputProps) {
  const field = useFieldContext<z.infer<typeof inputSchema>>();

  return (
    <View className="bg-white border border-slate-300 rounded-2xl p-2  w-full placeholder-slate-400  ">
      <TextInput
        {...prop}
        className=" "
        value={field.state.value}
        onChangeText={(T) => field.handleChange(T)}
      />
    </View>
  );
}
