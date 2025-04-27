import {
  Loading,
  ScrollViewComponent,
  useQuery,
  useTRPC,
  TextComponent,
  ImageComponent,
} from "@pkg/ui";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function Order() {
  const t = useTRPC();
  const r = useRouter();
  const { data, isLoading } = useQuery(t.order.getOrdersByUser.queryOptions());
  console.log(data);
  return (
    <ScrollViewComponent className="p-6">
      <Loading isloading={isLoading}>
        <View>
          {data && data.length > 0 ? (
            data.map((item) => {
              return (
                <View className="flex flex-col gap-2 p-6 bg-white rounded-cl">
                  <TextComponent className="text-2xl font-bold pb-4">
                    #Orders {item.userOrder.id}
                  </TextComponent>
                  {item.items.map(({ product, orderItem }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          r.push({
                            pathname: "/order/[id]",
                            params: {
                              id: orderItem.id,
                            },
                          });
                        }}
                        className="flex flex-row items-center gap-4 "
                      >
                        <ImageComponent
                          src={product.img?.imgID[0]}
                          className="w-16 h-16 rounded-lg overflow-hidden"
                        />
                        <View>
                          <TextComponent className="text-lg font-semibold">
                            {product.name}
                          </TextComponent>
                          <TextComponent className="text-lg font-semibold">
                            {product.price}
                          </TextComponent>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })
          ) : (
            <View className="flex flex-col items-center justify-center h-full">
              <TextComponent className="text-2xl font-bold pb-4">
                No Orders
              </TextComponent>
            </View>
          )}
        </View>
      </Loading>
    </ScrollViewComponent>
  );
}
