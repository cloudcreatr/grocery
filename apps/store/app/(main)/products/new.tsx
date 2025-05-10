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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
export default function Page() {
  const t = useTRPC();
  const q = useQueryClient();
  const r = useRouter();

  const { data: categories, isLoading: isLoading2 } = useQuery(
    t.product.getCategory.queryOptions()
  );

  const { isPending, mutate } = useMutation(
    t.product.createProduct.mutationOptions({
      onSuccess: (data) => {
        q.invalidateQueries(t.product.listProduct.queryFilter());
        r.push({
          pathname: "/products/[id]",
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
      price: "",
      category: null,
      img: {
        uploadedFiles: [],
        deletedFiles: [],
      },
    } as Omit<ProductModify, "id">,

    validators: {
      onChange: ProductModifySchema.omit({ id: true }),
    },
    onSubmit: ({ value }) => {
      console.log(value);
      mutate(value);
      form.reset();
    },
  });
  return (
    <ViewComponent className="px-6 flex-1">
      <Loading isloading={isLoading2}>
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
            text={"Add Product"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
