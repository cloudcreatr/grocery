import {
  ImageComponent,
  Loading,
  StatusOverView,
  TextComponent,
  useQuery,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Order() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  console.log("ID", id);
  const { data, isLoading } = useQuery(
    t.order.getOrderItemDetails.queryOptions({
      orderItemId: Number(id),
    })
  );
  const { data: deliveryPartnerDetails, isLoading: l } = useQuery(
    t.order.getDeliveryPartnerDetails.queryOptions(
      {
        id: data?.order_item.deliveryPartnerId!,
      },
      {
        enabled: !!data?.order_item.deliveryPartnerId,
      }
    )
  );
  return (
    <ViewComponent className="flex-1 p-6">
      <Loading isloading={isLoading}>
        <View>
          {data?.order_item.status === "picked" ? (
            <StatusOverView
              title=" Order picked up and is now out for delivery."
              description="Your order is on the way to you!"
            />
          ) : data?.order_item.status === "delivered" ? (
            <StatusOverView
              title="Your order has been delivered. "
              description="Delivery completed successfully."
            />
          ) : data?.order_item.status === "waiting" ? (
            <StatusOverView
              title="Finding a delivery partner near the store. "
              description=" Order placed, awaiting partner assignment."
            />
          ) : data?.order_item.status === "assigned" ? (
            <StatusOverView
              title="Delivery partner is heading to the store. "
              description="Partner assigned, going to pick up your order."
            />
          ) : null}

          <View className="flex-row items-center gap-4 mt-4 bg-white p-4 rounded-xl">
            <ImageComponent
              src={data?.product.img?.imgID?.[0]} // Display the first image
              className="w-20 h-20  bg-gray-100 rounded-lg overflow-hidden"
            />
            {/* Product Details */}
            <View className="flex-1 space-y-1 ">
              <TextComponent className="text-lg font-semibold">
                {data?.product.name ?? "Product Name"}
              </TextComponent>
              <TextComponent className="text-base text-blue-600 font-medium">
                ${Number(data?.product.price ?? 0).toFixed(2)}
              </TextComponent>
            </View>
          </View>
          {data?.order_item.deliveryPartnerId && !l && (
            <View className="mt-4 bg-white p-4 rounded-xl">
              <TextComponent className="text-lg font-semibold">
                Delivery Partner Name: {deliveryPartnerDetails?.name}
              </TextComponent>
              <TextComponent className="text-base text-blue-600 font-medium">
                Delivery Partner Phone: {deliveryPartnerDetails?.phone}
              </TextComponent>
            </View>
          )}
        </View>
      </Loading>
    </ViewComponent>
  );
}
