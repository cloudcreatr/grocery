import {
  Loading,
  MainOverview,
  ScrollViewComponent,
  useAuthStore,
  useMutation,
  useQuery,
  useQueryClient,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { useAppForm } from "@pkg/ui/components/form/util";
import { useStore } from "@tanstack/react-form";
import { storeUserSchema, type StoreUser } from "@repo/bg";
import { ScrollView, Text, View } from "react-native";

export default function User() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.user.getUser.queryOptions());
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation(
    trpc.user.editUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.getUser.queryKey(),
        });
      },
    })
  );

  const form = useAppForm({
    defaultValues: {
      name: data?.name ?? "",
      doc:
        data?.doc && data.doc.id.length > 0
          ? {
              uploadedFiles: data.doc.id,
              deletedFiles: [],
            }
          : {
              uploadedFiles: [],
              deletedFiles: [],
            },

      phone: data?.phone ?? "",
      address: data?.address ?? "",
      gps: data?.lat
        ? {
            latitude: data.lat,
            longitude: data.long,
          }
        : {
            latitude: 0,
            longitude: 0,
          },
    } as StoreUser,
    validators: {
      onChange: storeUserSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const errors = useStore(form.store, (s) => s.errors);
  console.log(console.log(errors));

  return (
    <ViewComponent className="flex-1 p-6">
      <Loading
        isloading={isLoading}
        source={require("@/assets/loading-3.json")}
      >
        <ScrollView>
          <View className="flex-1 gap-4 pb-4">
            {data?.name ? (
              <MainOverview
                title={"Complete Your Profile"}
                description={
                  "Tell us a bit about yourself. This info helps us verify your store and connect you with customers and delivery partners nearby."
                }
              />
            ) : (
              <MainOverview
                title="Your Store Owner Profile"
                description="This is your personal info linked to your store. Keep it accurate to ensure smooth communication and delivery support."
              />
            )}

            <form.AppField
              name="name"
              children={(f) => {
                return <f.Input placeholder="name" />;
              }}
            />
            <form.AppField
              name="phone"
              children={(f) => {
                return <f.Input placeholder="phone" inputMode="tel" />;
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
              name="doc"
              children={(f) => {
                return (
                  <f.UploadField
                    uploadUrl={`${process.env.EXPO_PUBLIC_API}/upload`}
                    multiple={true}
                    CardText="Upload PAN & GST"
                  />
                );
              }}
            />
          </View>
        </ScrollView>

        <form.AppForm>
          <form.Submit
            text={data?.name ? "Update Info" : "Complete Profile"}
            onPress={form.handleSubmit}
            isSubmitting={isPending}
          />
        </form.AppForm>
      </Loading>
    </ViewComponent>
  );
}
