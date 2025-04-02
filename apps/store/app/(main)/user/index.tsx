import { Loading, useAuthStore } from "@pkg/ui";
import { useAppForm } from "@/components/form/util";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { uploadSchema } from "@/components/form/upload";
import { Text } from "react-native";

const schema = z.object({
  upload: uploadSchema,
});
export default function User() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const form = useAppForm({
    defaultValues: {
      upload: {
        uploadedFiles: [],
        deletedFiles: [],
      },
    } as z.infer<typeof schema>,

    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  console.log("ERROR", form.state.errors);
  return (
    <SafeAreaView className="p-6 bg-slate-100">
      <Loading islaoding={false} source={require("@/assets/loading.json")}>
        {/* <form.AppField
          name="name"
          children={(f) => {
            return <f.Input placeholder="name" />;
          }}
        /> */}

        {/* <form.AppField
          name="adreess"
          children={(f) => {
            return (
              <f.Address
                placeholder="address"
                onAddressSelect={(c) => {
                  form.setFieldValue("location", {
                    lat: c.latitude,
                    lng: c.longitude,
                  });
                }}
              />
            );
          }}
        /> */}
        {/* <form.AppField
          name="location"
          children={(f) => {
            return <f.GPS />;
          }}
        />  */}

        <form.AppField
          name="upload"
          mode="array"
          children={(f) => {
            return <f.UploadField />;
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
