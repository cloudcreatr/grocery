import {
  MainOverview,
  ScrollViewComponent,
  TextComponent,
  useTRPC,
  useQuery,
  Loading,
  useMutation,
  useQueryClient,
  ViewComponent,
  ButtonComponent,
} from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";
import {
  CategorySchema,
  ProductModifySchema,
  type categorySchema,
  type ProductModify,
} from "@repo/bg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
export default function Page() {
  const t = useTRPC();
  const q = useQueryClient();
  const r = useRouter();
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery(
    t.admin.getCateogryById.queryOptions({
      id: Number(id),
    })
  );
  const { isPending: dp, mutate: dm } = useMutation(
    t.admin.deleteCategory.mutationOptions()
  );

  const { isPending, mutate } = useMutation(
    t.admin.createCategory.mutationOptions({
      onSuccess: (data) => {
        q.invalidateQueries(t.admin.listCategory.queryFilter());
        q.invalidateQueries(t.admin.getCateogryById.queryFilter());
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      id: data?.id || 0,
      name: data?.name || "",
      description: data?.description || "",

      img:
        data && data.img
          ? {
              uploadedFiles: [data.img],
              deletedFiles: [],
            }
          : {
              uploadedFiles: [],
              deletedFiles: [],
            },
    } as categorySchema,

    validators: {
      onChange: CategorySchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      if (value.id !== undefined) {
        mutate(value);
      } else {
        console.error("ID is undefined. Cannot mutate.");
      }
      form.reset();
    },
  });
  return (
    <ViewComponent className="px-6 flex-1">
      <View className="flex gap-4 pb-4">
        <MainOverview
          title="Modify Cateogry"
          description="Modify the details for your  Cateogry."
        />
        <form.AppField
          name="name"
          children={(f) => {
            return <f.Input placeholder="name" />;
          }}
        />
        <form.AppField
          name="description"
          children={(f) => {
            return <f.Input placeholder="Product Descrption" />;
          }}
        />

        <form.AppField
          name="img"
          children={(f) => {
            return (
              <f.UploadField
                uploadUrl={`${process.env.EXPO_PUBLIC_API}/upload`}
                multiple={true}
                CardText="Upload Product Image"
              />
            );
          }}
        />
      </View>

      <form.AppForm>
        <form.Submit
          text={"Modify Category"}
          onPress={form.handleSubmit}
          isSubmitting={isPending}
        />
      </form.AppForm>
      <ButtonComponent
        onPress={() => {
          r.push("/category");
          dm({ id: Number(id) });
        }}
        className="mt-2"
        isLoading={dp}
      >
        Delete the Cateogory
      </ButtonComponent>
    </ViewComponent>
  );
}
