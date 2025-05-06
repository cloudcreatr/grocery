import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Loading,
  MainOverview,
  ProductCard,
  ScrollViewComponent,
  useAuthStore,
  useMutation,
  useQuery,
  useTRPC,
} from "@pkg/ui";
import { useRouter } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";

export default function Pending() {
  const auth = useAuthStore((s) => s.user?.id);
  if (!auth) {
    return <Text className="text-red-500">Please login to continue</Text>;
  }
  const t = useTRPC();
  const { data, isLoading } = useQuery(t.order.getWaitingOrders.queryOptions());
  const { isPending, mutate, error } = useMutation(
    t.order.assignOrder.mutationOptions({
      onSuccess: (_, v) => {
        // r.push({
        //   pathname: "/order/[id]",
        //   params: {
        //     id: v.orderItemId,
        //   },
        // });
      },
    })
  );
  console.log("error", error);
  const r = useRouter();
  return (
    <ScrollViewComponent className="p-6">
      <Loading isloading={isLoading}>
        <View>
          <MainOverview
            title="Pending Orders"
            description="Here are Pending Orders to be delivered near you"
          />
          {!data || data.length == 0 ? (
            <Text className="font-semibold text-xl pt-6">No Orders yet!!</Text>
          ) : (
            <FlatList
              numColumns={2}
              // Removed style={{ width: '100%' }} - often not needed with flex parent
              data={data}
              // Added keyExtractor for performance and stability
              keyExtractor={({ orderItem: item }) => item.id.toString()}
              renderItem={({ item: { product: item, orderItem } }) => {
                // Wrap ProductCard in Pressable for navigation
                // Apply flex: 1 to Pressable to ensure it takes up column space
                return (
                  <Pressable
                    style={{ flex: 1 }} // Ensure Pressable takes up the column space
                  >
                    <ProductCard
                      name={item.name}
                      price={item.price}
                      src={item.img ? item.img.imgID[0] : null}
                      action={{
                        title: "Accept Order",
                        onPress: () => {
                          mutate({
                            orderItemId: orderItem.id,
                            deliveryPartnerId: auth,
                          });
                        },
                      }}
                    />
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </Loading>
    </ScrollViewComponent>
  );
}
