import { useCart } from "@/util/cart_store";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ButtonComponent,
  ScrollViewComponent,
  useQueries,
  useTRPC,
  ViewComponent, // Import ViewComponent
  TextComponent, // Import TextComponent
  ImageComponent,
  Loading,
  useMutation,
  useQueryClient, // Import ImageComponent
} from "@pkg/ui";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, TouchableOpacity } from "react-native"; // Keep View, add ActivityIndicator

export default function Page() {
  const t = useTRPC();
  const productsId = useCart((s) => s.inCartProducts);
  const removeFromCart = useCart((s) => s.removeFromCart);
  const reset = useCart((s) => s.clearCart);
  const r = useRouter();
  const q = useQueryClient();
  // Fetch data for all products in the cart
  const queries = useQueries({
    queries: productsId.map((id) =>
      t.product.getProduct.queryOptions({
        productId: id,
      })
    ),
  });

  const { isPending, mutate } = useMutation(
    t.order.createOrder.mutationOptions({
      onSuccess: () => {
        r.push("/order");
        reset();
        q.invalidateQueries(t.order.getOrdersByUser.queryFilter());
      },
    })
  );
  // Calculate total price from successfully loaded items
  const total = queries.reduce((acc, query) => {
    if (query.isSuccess && query.data?.price) {
      // Ensure price is treated as a number
      const price = Number(query.data.price);
      return acc + (isNaN(price) ? 0 : price);
    }
    return acc;
  }, 0);

  const isLoading = queries.some((q) => q.isLoading);

  return (
    <ViewComponent className="flex-1">
      {/* Scrollable Cart Items */}
      <Loading isloading={isLoading}>
        <ScrollViewComponent
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {productsId.length === 0 && !isLoading ? (
            <View className="items-center justify-center pt-20">
              <TextComponent className="text-lg ">
                Your cart is empty.
              </TextComponent>
            </View>
          ) : (
            queries.map((query, index) => (
              <View
                key={productsId[index] ?? `item-${index}`} // Use product ID for key if available
                className="bg-white flex gap-4 p-4 my-2 mx-3 rounded-xl flex-row items-center space-x-4"
              >
                {query.data ? (
                  <>
                    {/* Product Image */}
                    <ImageComponent
                      src={query.data.img?.imgID?.[0]} // Display the first image
                      className="w-20 h-20  bg-gray-100 rounded-lg overflow-hidden"
                    />
                    {/* Product Details */}
                    <View className="flex-1 space-y-1 ">
                      <TextComponent className="text-lg font-semibold">
                        {query.data.name ?? "Product Name"}
                      </TextComponent>
                      <TextComponent className="text-base text-blue-600 font-medium">
                        ${Number(query.data.price ?? 0).toFixed(2)}
                      </TextComponent>
                    </View>
                    {/* Remove Button */}
                    <TouchableOpacity className="pl-2">
                      <Ionicons
                        name="trash-outline"
                        size={30}
                        color="red"
                        onPress={() => {
                          removeFromCart(query.data.id);
                        }}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View className="flex-1 h-20 items-center justify-center">
                    <TextComponent className="text-gray-500">
                      Item not found
                    </TextComponent>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollViewComponent>
      </Loading>

      {/* Fixed Bottom Section - Only show if cart has items */}
      {productsId.length > 0 && (
        <View className="p-4  flex flex-col gap-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <TextComponent className="text-xl font-medium text-gray-700">
              Total:
            </TextComponent>
            <TextComponent className="text-2xl font-bold text-blue-700">
              Rs {total.toFixed(2)}
            </TextComponent>
          </View>
          <ButtonComponent
            onPress={() => {
              /* Implement place order logic */
              mutate({
                productId: productsId, // Ensure non-empty array
              });
              // Example: Navigate to checkout, clear cart, etc.
            }}
            isLoading={isPending}
          >
            Place Order
          </ButtonComponent>
        </View>
      )}
    </ViewComponent>
  );
}
