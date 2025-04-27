import Ionicons from "@expo/vector-icons/Ionicons";
import { is, orderItem } from "@pkg/lib";
import {
  ButtonComponent,
  Loading,
  QuickActionRow,
  ScrollViewComponent,
  TextComponent,
  ViewComponent,
  type iconType,
} from "@pkg/ui";

import { useAuthStore, useTRPC } from "@pkg/ui";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Text } from "react-native";

function Action({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: iconType;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-1">
      <View className="flex flex-row items-center justify-between bg-blue-100 border-2 border-blue-400 p-4 rounded-xl ">
        <Ionicons name={icon} size={24} color="#3b82f6" />
        <TextComponent className="text-lg font-semibold text-blue-500">
          {title}
        </TextComponent>
      </View>
    </TouchableOpacity>
  );
}

export default function home() {
  const r = useRouter();
  const t = useTRPC();
  const { data, isLoading } = useQuery(t.order.getOrdersByStore.queryOptions());
  const { data: products, isLoading: isloading2 } = useQuery(
    t.product.listProduct.queryOptions()
  );
  return (
    <ScrollViewComponent className="p-6  ">
      <View>
        <Loading isloading={isloading2 || isLoading}>
          <View className="flex-1 flex felx-col gap-4">
            <View>
              <TextComponent className="text-2xl font-bold pb-4">
                Quick Actons
              </TextComponent>
              <View className="flex flex-row items-center justify-between gap-2">
                <Action
                  title="Store Info"
                  icon="storefront-outline"
                  onPress={() =>
                    r.push({
                      pathname: "/store",
                    })
                  }
                />

                <Action
                  title="Payment Info"
                  icon="card-outline"
                  onPress={() => {
                    r.push({
                      pathname: "/bank",
                    });
                  }}
                />
              </View>
            </View>

            <View>
              <QuickActionRow
                title="New Orders"
                title2="Check Orders"
                path="/orders"
              />
              <View className="flex flex-col gap-2 ">
                {data && data.length > 0 ? (
                  data.slice(0, 3).map((order, index) => (
                    <View
                      key={index}
                      className="p-4  rounded-2xl bg-white border border-slate-300"
                    >
                      <TextComponent className="font-semibold text-xl">
                        {order.product.name}
                      </TextComponent>
                      <TextComponent className=" text-slate-300">
                        Rs {order.product.price}
                      </TextComponent>
                    </View>
                  ))
                ) : (
                  <TextComponent className="text-lg font-semibold text-gray-500">
                    No orders yet
                  </TextComponent>
                )}
              </View>
            </View>

            <View>
              <QuickActionRow
                title="Product OverView"
                title2="All Products"
                path="/products"
              />

              <View className="flex flex-col gap-2 ">
                {products && products.length > 0 ? (
                  products.slice(0, 3).map((product, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        r.push({
                          pathname: "/products/[id]",
                          params: {
                            id: product.id,
                          },
                        });
                      }}
                    >
                      <View
                        key={index}
                        className=" p-4  rounded-2xl bg-white border border-slate-300"
                      >
                        <TextComponent className="font-semibold text-xl">
                          {product.name || "No Name"}
                        </TextComponent>
                        <TextComponent className=" text-slate-500">
                          {product.price ? "Rs " + product.price : "No Price"}
                        </TextComponent>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TextComponent className="text-lg font-semibold text-gray-500">
                    No products yet
                  </TextComponent>
                )}
              </View>
            </View>
          </View>
        </Loading>
      </View>
    </ScrollViewComponent>
  );
}
