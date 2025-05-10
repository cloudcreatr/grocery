import {
  ActionItem,
  Loading,
  MainOverview,
  ProductCard,
  TextComponent,
  useAuthStore,
  useConnectionStatusStore,
  useQuery,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { router, useRouter } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function home() {
  const logout = useAuthStore((s) => s.logout);
  const status = useConnectionStatusStore((s) => s.status);
  const r = useRouter();
  const t = useTRPC();
  const { data, isLoading } = useQuery(
    t.order.getOrdersByDeliveryPartner.queryOptions()
  );

  const { data: d2 } = useQuery(t.user.getUser.queryOptions());
  useEffect(() => {
    if (d2) {
      if (d2.name == null || d2.lat == null || d2.name == "") {
        r.replace("/(main)/user");
      }
    }
  }, [d2]);
  return (
    <ViewComponent className="px-6  flex-1">
      <Loading isloading={isLoading}>
        <View className="flex gap-4">
          <View className="flex flex-col">
            <TextComponent className="text-2xl font-bold">
              Quick Actions
            </TextComponent>
            <View className="flex flex-row gap-2 pt-2">
              <ActionItem
                title="Profile Info"
                icon="person-outline"
                onPress={() => {
                  r.push("/(main)/user");
                }}
              />
              <ActionItem
                title="Logout"
                icon="log-out-outline"
                onPress={() => {
                  logout(r);
                }}
              />
            </View>
            <View className="flex flex-row gap-2 pt-2">
              <ActionItem
                title={`Connection Status: ${status}`}
                icon="radio-outline"
              />
            </View>
          </View>

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

      <StatusBar backgroundColor="#f1f5f9" />
    </ViewComponent>
  );
}
