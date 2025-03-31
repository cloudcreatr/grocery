import { createFormHookContexts, createFormHook } from "@tanstack/react-form";


export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    Input,
  },
  formComponents: {
    Submit,
  },
});

import { Text, TouchableOpacity } from "react-native";

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

import { TextInput, View, type TextInputProps } from "react-native";

export function Input(prop: TextInputProps) {
  const field = useFieldContext<string>();
  return (
    <View className="bg-white border border-slate-300 rounded-2xl p-8  w-full placeholder-slate-400  ">
      <TextInput
        {...prop}
        className=" "
        value={field.state.value}
        onChangeText={(T) => field.handleChange(T)}
      />
    </View>
  );
}
