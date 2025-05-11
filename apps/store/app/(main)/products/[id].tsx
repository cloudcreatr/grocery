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
import { ProductModifySchema, type ProductModify } from "@repo/bg";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  const r = useRouter();

  const { data: categories, isLoading: isLoading2 } = useQuery(
    t.admin.listProductAvailable.queryOptions()
  );

  const { isPending, mutate } = useMutation(
    t.product.modifyProduct.mutationOptions({
      onSuccess: () => {
        q.invalidateQueries(t.product.getProduct.queryFilter());
        q.invalidateQueries(t.product.listProduct.queryFilter());
      },
    })
  );

  const { isPending: dl, mutate: dm } = useMutation(
    t.product.deleteProduct.mutationOptions({
      onSuccess: () => {
        q.invalidateQueries(t.product.listProduct.queryFilter());

        r.push("/products");
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      id: Number(id),
      name: data?.product.name ? data.product.name : "",
      description: data?.product.description ? data.product.description : "",
      price: data?.product.price ? data.product.price.toString() : "",
      productAvailable: data?.product.productAvailable
        ? data.product.productAvailable
        : null,
      img:
        data?.product.img && data?.product.img?.imgID.length > 0
          ? {
              uploadedFiles: data.product.img.imgID,
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
    <ViewComponent className="px-6 flex-1">
      <Loading isloading={isLoading || isLoading2}>
        <ScrollViewComponent>
          <View className="flex gap-4 pb-4">
            <MainOverview
              title="Modify Product"
              description="Update the details for your new item."
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
              name="productAvailable"
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
          <ButtonComponent
            onPress={() => {
              dm({
                id: Number(id),
              });
            }}
            isLoading={dl}
          >
            Delete Product
          </ButtonComponent>
        </ScrollViewComponent>
        <form.AppForm>
          <form.Submit
            text={data?.product.name ? "Update Product" : "Add Product"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
