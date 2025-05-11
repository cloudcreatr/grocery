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

  const { isPending, mutate } = useMutation(
    t.admin.createCategory.mutationOptions({
      onSuccess: (data) => {
        q.invalidateQueries(t.admin.listCategory.queryFilter());
        r.push({
          pathname: "/category/[id]",
          params: {
            id: data.id,
          },
        });
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",

      img: {
        uploadedFiles: [],
        deletedFiles: [],
      },
    } as categorySchema,

    validators: {
      onChange: CategorySchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      mutate(value);
      form.reset();
    },
  });
  return (
    <ViewComponent className="px-6 flex-1">
      <View className="flex gap-4 pb-4">
        <MainOverview
          title="Create Cateogry"
          description="Enter the details for your new Cateogry."
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
          text={"Add Category"}
          onPress={form.handleSubmit}
          isSubmitting={isPending}
        />
      </form.AppForm>
    </ViewComponent>
  );
}
