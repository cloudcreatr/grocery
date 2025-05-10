import {
  Loading,
  MainOverview,
  useMutation,
  useQuery,
  useQueryClient,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";
import { type StoreInfo, storeInfoSchema } from "@repo/bg";
import { ScrollView, Text, View } from "react-native";

export default function Store() {
  const trpc = useTRPC();
  const { isLoading, data } = useQuery(
    trpc.store.getStoreDetails.queryOptions()
  );
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.store.updateStoreDetails.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.store.getStoreDetails.queryKey(),
        });
      },
    })
  );
  const form = useAppForm({
    defaultValues: {
      name: data ? data.name : "",
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
      description: data?.description ? data.description : "",
      address: data?.address ? data.address : "",
      gps:
        data && data.lat
          ? {
              latitude: data.lat,
              longitude: data.long,
            }
          : {
              latitude: 0,
              longitude: 0,
            },
    } as StoreInfo,
    validators: {
      onChange: storeInfoSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return (
    <ViewComponent className="flex-1 p-6 ">
      <Loading isloading={isLoading}>
        <ScrollView>
          <View className="gap-4 pb-4">
            <MainOverview
              title={data?.name ? "Store Info" : "Add Store Info"}
              description="Tell customers about your store. Add a name and a short description to help users recognize and trust your business."
            />
            <form.AppField
              name="name"
              children={(f) => {
                return <f.Input placeholder="Store Name" />;
              }}
            />
            <form.AppField
              name="description"
              children={(f) => {
                return <f.Input placeholder="Store Description" multiline />;
              }}
            />
            <form.AppField
              name="address"
              children={(f) => {
                return (
                  <f.Address
                    onAddressSelect={(l) => {
                      form.setFieldValue("gps", {
                        latitude: l.latitude,
                        longitude: l.longitude,
                      });
                    }}
                  />
                );
              }}
            />
            <form.AppField
              name="gps"
              children={(f) => {
                return (
                  <f.GPS
                    onLocationSelect={() => {
                      form.setFieldValue("address", "");
                    }}
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
                    CardText="Upload Store Image"
                  />
                );
              }}
            />
          </View>
        </ScrollView>

        <form.AppForm>
          <form.Submit
            onPress={form.handleSubmit}
            isSubmitting={isPending}
            text="Save Store Info"
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
