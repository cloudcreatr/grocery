import { Loading, useAppForm, useAuthStore } from "@pkg/ui";

import { SafeAreaView } from "react-native-safe-area-context";

export default function User() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });
  return (
    <SafeAreaView className="p-6 bg-slate-100">
      <Loading islaoding={false} source={require("@/assets/loading.json")}>
        <form.AppField
          name="name"
          children={(f) => {
            return <f.Input placeholder="name" />;
          }}
        />
        <form.AppForm>
          <form.Submit
            onPress={form.handleSubmit}
            text="submit"
            isSubmitting={false}
          />
        </form.AppForm>
      </Loading>
    </SafeAreaView>
  );
}
