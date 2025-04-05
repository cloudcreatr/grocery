import { Loading, useAuthStore, useQuery, useTRPC } from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { uploadSchema, addressSchema } from "@repo/bg";
import { Text } from "react-native";

const schema = z.object({
  address: addressSchema,
  upload: uploadSchema,
});
export default function User() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const form = useAppForm({
    defaultValues: {
      address: "",
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
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.user.getUser.queryOptions());
  return (
    <SafeAreaView className="p-6 bg-slate-100">
      <Loading islaoding={false} source={require("@/assets/loading.json")}>
        {/* <form.AppField
          name="name"
          children={(f) => {
            return <f.Input placeholder="name" />;
          }}
        /> */}

        <form.AppField
          name="address"
          children={(f) => {
            return (
              <f.Address
                onAddressSelect={(coords) => {
                  console.log("coords", coords);
                }}
              />
            );
          }}
        />
        {!isLoading && <Text>{data?.doc?.id}</Text>}
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
