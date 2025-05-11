import { productAvailable } from "@pkg/lib";
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
  ProductAvailSchema,
  ProductModifySchema,
  type categorySchema,
  type ProductAvail,
  type ProductModify,
} from "@repo/bg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
export default function Page() {
  const t = useTRPC();
  const q = useQueryClient();
  const r = useRouter();

  const { data, isLoading } = useQuery(t.admin.listCategory.queryOptions());
  const { isPending, mutate } = useMutation(
    t.admin.createProductAvailable.mutationOptions({
      onSuccess: (data) => {
        q.invalidateQueries(t.admin.listProductAvailable.queryFilter());
        r.push({
          pathname: "/product/[id]",
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
      category: 0,
      img: {
        uploadedFiles: [],
        deletedFiles: [],
      },
    } as ProductAvail,

    validators: {
      onChange: ProductAvailSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      mutate(value);
      form.reset();
    },
  });
  return (
    <ViewComponent className="px-6 flex-1">
      <Loading isloading={isLoading}>
        <View className="flex gap-4 pb-4">
          <MainOverview
            title="Create Product"
            description="Enter the details for your new Product."
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
            text={"Add Product"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
