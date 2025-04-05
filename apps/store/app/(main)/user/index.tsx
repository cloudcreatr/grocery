import { Loading, useAuthStore, useQuery, useTRPC, ViewComponent } from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";

import { z } from "zod";
import { uploadSchema, addressSchema } from "@repo/bg";
import { Text, View } from "react-native";

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

  
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.user.getUser.queryOptions());
  return (
    <ViewComponent>
      <Loading isloading={isLoading} source={require("@/assets/loading-3.json")}>

        <View>
          <Text>{data?.email}</Text>
          <Text>{data?.name}</Text>
          <Text>{data?.address}</Text>
      </View>
      </Loading>
    </ViewComponent>
  );
}
