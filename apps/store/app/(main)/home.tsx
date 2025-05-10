import {
  ActionItem,
  ButtonComponent,
  Loading,
  MainOverview,
  Modal,
  ProductCard,
  ScrollViewComponent,
  TextComponent,
  useConnectionStatusStore,
} from "@pkg/ui";

import { useTRPC } from "@pkg/ui";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, FlatList, Pressable, TextInput, View } from "react-native";

import { Text } from "react-native";

export default function home() {
  const r = useRouter();
  const t = useTRPC();
  const [isOpen, setIsOpen] = useState(false);
  const status = useConnectionStatusStore((s) => s.status);
  const { data, isLoading } = useQuery(t.order.getOrdersByStore.queryOptions());

  const { data: d2 } = useQuery(t.user.getUser.queryOptions());
  const { data: s } = useQuery(t.store.getStoreDetails.queryOptions());
  const { data: b } = useQuery(t.bank.getBankDetails.queryOptions());
  useEffect(() => {
    if (d2 && s && b) {
      console.log(d2.name, s.name, b.BankName);
      if (!d2.name || !s.name || !b.BankName) {
        console.log(!d2?.name || !s?.name || b?.BankName);
        r.replace("/registeration");
      }
    }
  }, [d2, s, b]);

  return (
    <ScrollViewComponent className="p-6  ">
      <Loading isloading={isLoading}>
        <View className="flex-1 flex felx-col gap-4">
          <View>
            <TextComponent className="text-2xl font-bold pb-4">
              Quick Actons
            </TextComponent>
            <View className="flex flex-row items-center justify-between gap-2">
              <ActionItem
                title="Store Info"
                icon="storefront-outline"
                onPress={() =>
                  r.push({
                    pathname: "/store",
                  })
                }
              />

              <ActionItem
                title="Payment Info"
                icon="card-outline"
                onPress={() => {
                  r.push({
                    pathname: "/bank",
                  });
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

          <View className="flex gap-2">
            <MainOverview
              title="New Orders"
              description="here are new orders for your store"
            />
            {!data || data.length == 0 ? (
              <Text className="font-semibold text-xl pt-6">
                No Orders yet!!
              </Text>
            ) : (
              <FlatList
                numColumns={2}
                // Removed style={{ width: '100%' }} - often not needed with flex parent
                data={data}
                // Added keyExtractor for performance and stability
                keyExtractor={({ product: item }) => item.id.toString()}
                renderItem={({ item: { product: item } }) => {
                  // Wrap ProductCard in Pressable for navigation
                  // Apply flex: 1 to Pressable to ensure it takes up column space
                  return (
                    <Pressable
                      style={{ flex: 1 }} // Ensure Pressable takes up the column space
                      onPress={() =>
                        r.push({
                          pathname: "/orders/[id]",
                          params: {
                            id: item.id,
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
        </View>
      </Loading>

      <StatusBar backgroundColor="#f1f5f9" />
    </ScrollViewComponent>
  );
}
