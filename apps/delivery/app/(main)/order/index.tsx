import {
  Loading,
  MainOverview,
  ScrollViewComponent,
  TextComponent,
  useQuery,
  useTRPC,
} from "@pkg/ui";
import { View, Text, FlatList, Pressable } from "react-native";
import { ProductCard } from "@pkg/ui";
import { useRouter } from "expo-router";
export default function Orders() {
  const t = useTRPC();
  const { data, isLoading } = useQuery(
    t.order.getOrdersByDeliveryPartner.queryOptions()
  );
  const r = useRouter();
  return (
    <ScrollViewComponent className="p-6">
      <Loading
        isloading={isLoading}
        source={require("@/assets/loading-3.json")}
      >
        <View>
          <MainOverview
            title="New Orders"
            description="here are new orders for your store"
          />
          {!data || data.length == 0 ? (
            <Text className="font-semibold text-xl pt-6">No Orders yet!!</Text>
          ) : (
            <FlatList
              numColumns={2}
              // Removed style={{ width: '100%' }} - often not needed with flex parent
              data={data}
              // Added keyExtractor for performance and stability
              keyExtractor={({ product: item }) => item.id.toString()}
              renderItem={({ item: { product: item, orderItem } }) => {
                // Wrap ProductCard in Pressable for navigation
                // Apply flex: 1 to Pressable to ensure it takes up column space
                return (
                  <Pressable
                    style={{ flex: 1 }} // Ensure Pressable takes up the column space
                    onPress={() =>
                      r.push({
                        pathname: "/order/[id]",
                        params: {
                          id: orderItem.id,
                        },
                      })
                    }
                  >
                    <ProductCard
                      name={item.name}
                      price={item.price}
                      src={item.img ? item.img.imgID[0] : null}
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
