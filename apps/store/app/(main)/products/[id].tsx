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
import { ProductModifySchema, type ProductModify } from "@repo/bg";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
export default function Page() {
  const { id } = useLocalSearchParams();
  const t = useTRPC();
  const q = useQueryClient();
  const { isLoading, data } = useQuery(
    t.product.getProduct.queryOptions({
      productId: Number(id),
    })
  );

  const { data: categories, isLoading: isLoading2 } = useQuery(
    t.product.getCategory.queryOptions()
  );
  const { isPending, mutate } = useMutation(
    t.product.modifyProduct.mutationOptions({
      onSuccess: () => {
        q.invalidateQueries(t.product.getProduct.queryFilter());
        q.invalidateQueries(t.product.listProduct.queryFilter());
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      id: data?.id,
      name: data?.name ? data.name : "",
      description: data?.description ? data.description : "",
      price: data?.price ? data.price.toString() : "",
      category: data?.categoryID ? data.categoryID : null,
      img:
        data?.img && data?.img?.imgID.length > 0
          ? {
              uploadedFiles: data.img.imgID,
              deletedFiles: [],
            }
          : {
              uploadedFiles: [],
              deletedFiles: [],
            },
    } as ProductModify,
    validators: {
      onChange: ProductModifySchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });
  return (
    <ViewComponent className="p-6 flex-1">
      <Loading
        isloading={isLoading || isLoading2}
        source={require("@/assets/loading-3.json")}
      >
        <ScrollViewComponent>
          <View className="flex gap-4 pb-4">
            <MainOverview
              title="Add Product"
              description="Enter the details for your new item."
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
              name="price"
              children={(f) => {
                return (
                  <f.Input
                    placeholder="Product Price"
                    keyboardType="number-pad"
                  />
                );
              }}
            />
            <form.AppField
              name="category"
              children={(f) => {
                return (
                  <f.SelectField
                    options={
                      categories
                        ? categories.map((c) => {
                            return {
                              id: c.id,
                              name: c.name,
                            };
                          })
                        : []
                    }
                  />
                );
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
        </ScrollViewComponent>
        <form.AppForm>
          <form.Submit
            text={data?.name ? "Update Product" : "Add Product"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
