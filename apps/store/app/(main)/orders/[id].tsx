import {
  ButtonComponent,
  ImageComponent,
  Loading,
  MapComponent,
  OrderOverViewCard,
  OrderOverviewItem,
  ScrollViewComponent,
  StatusOverView,
  TextComponent,
  useMutation,
  useQuery,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Order() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  const [isMapFocused, setIsMapFocused] = useState(false); // State to track map interaction
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
  const status = data?.order_item.status;
  const { mutate, isPending } = useMutation(
    t.order.pickupOrder.mutationOptions()
  );
  const { mutate: completeOrder, isPending: isCompleteOrderPending } =
    useMutation(t.order.completeOrder.mutationOptions());
  const location = data?.order_item.location;
  return (
    <ViewComponent className="flex-1 p-6 py-0">
      <Loading isloading={isLoading}>
        <ScrollViewComponent scrollEnabled={!isMapFocused}>
          <View className="flex gap-3">
            {location && (
              <MapComponent
                onTouchStart={() => setIsMapFocused(true)} // Disable scroll on map touch
                onTouchEnd={() => setIsMapFocused(false)} // Enable scroll after map touch
                destination={{
                  latitude: location.destination.lat,
                  longitude: location.destination.long,
                }}
                orgin={{
                  latitude: location.source.lat,
                  longitude: location.source.long,
                }}
              />
            )}
            {data?.order_item.status === "picked" ? (
              <StatusOverView
                title="Order picked up and is now out for delivery."
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

            <View className="flex-row items-center gap-4  bg-white p-4 rounded-2xl border border-slate-200">
              <ImageComponent
                src={data?.product.img?.imgID?.[0]} // Display the first image
                className="w-20 h-20  bg-gray-100 rounded-lg overflow-hidden"
              />
              {/* Product Details */}
              <View className="flex-1 space-y-1 ">
                <TextComponent className="text-lg font-semibold">
                  {data?.product.name ?? "Product Name"}
                </TextComponent>
                <TextComponent className="text-base text-blue-500 font-medium">
                  Rs {Number(data?.product.price ?? 0).toFixed(2)}
                </TextComponent>
              </View>
            </View>

            <OrderOverViewCard>
              <OrderOverviewItem
                icon="storefront-outline"
                title={data?.store.name ?? "No Store Name"}
              />
              <OrderOverviewItem
                icon="person-outline"
                title={data?.user.name ?? "No User Name"}
                description={data?.user.phone ?? "No User Phone"}
              />
            </OrderOverViewCard>
          </View>
        </ScrollViewComponent>
      </Loading>
    </ViewComponent>
  );
}
