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
  ButtonComponent,
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
  const { id } = useLocalSearchParams();
  const { data: cd, isLoading: cl } = useQuery(
    t.admin.listCategory.queryOptions()
  );
  const { isLoading, data } = useQuery(
    t.admin.getProductAvailableById.queryOptions({
      id: Number(id),
    })
  );

  const { isPending, mutate } = useMutation(
    t.admin.modifyProductAvailable.mutationOptions({
      onSuccess: (data) => {
        q.invalidateQueries(t.admin.listProductAvailable.queryFilter());
        q.invalidateQueries(t.admin.getProductAvailableById.queryFilter());
      },
    })
  );

  const { isPending: dp, mutate: dm } = useMutation(
    t.admin.deleteProductAvailable.mutationOptions()
  );
  const form = useAppForm({
    defaultValues: {
      id: Number(id),
      name: data?.name || "",
      description: data?.description || "",
      category: data?.categoryId || 0,
      img:
        data && data?.img
          ? {
              uploadedFiles: [data.img],
              deletedFiles: [],
            }
          : {
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
      <Loading isloading={isLoading || cl}>
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
            name="category"
            children={(f) => {
              return (
                <f.SelectField
                  options={
                    cd
                      ? cd.map((d) => {
                          return {
                            id: d.id,
                            name: d.name,
                          };
                        })
                      : []
                  }
                />
              );
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
            text={"Update Product"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
        <ButtonComponent
          onPress={() => {
            r.push("/product");
            dm({ id: Number(id) });
          }}
          className="mt-2"
          isLoading={dp}
        >
          Delete the Product
        </ButtonComponent>
      </Loading>
    </ViewComponent>
  );
}
