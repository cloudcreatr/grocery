import { useCart } from "@/util/cart_store";
import {
  Loading,
  useQuery,
  useTRPC,
  ViewComponent,
  ScrollViewComponent,
  TextComponent,
  ButtonComponent,
  ImageComponent,
} from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native"; // Removed FlatList import

export default function Page() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery(
    t.product.getProduct.queryOptions({
      productId: Number(id),
    })
  );
  const addToCart = useCart((state) => state.addToCart);
  // Ensure images is always an array, even if data.img or data.img.imgID is null/undefined
  const images = data?.img?.imgID ?? [];
  const firstImage = images.length > 0 ? images[0] : undefined; // Get the first image URL

  // Removed renderImage function as it's no longer needed for FlatList

  return (
    // Use flex-1 for the main container to take full screen height
    <ViewComponent className="flex-1">
      <Loading isloading={isLoading}>
        {data ? (
          // Use a standard View for overall layout
          <View className="flex-1">
            {/* Single Image Area */}

            <ImageComponent
              src={firstImage}
              className="w-full h-2/4 aspect-auto" // Take full width
            />

            {/* Scrollable Content Area (Details) */}
            <ScrollViewComponent
              className="flex-1 p-6" // Allow this part to scroll if content overflows
              // Add padding inside the scroll view
            >
              <TextComponent className="text-3xl font-bold mb-2">
                {data.name ?? "Product Name"}
              </TextComponent>
              <TextComponent className="text-lg text-gray-700 mb-4">
                {data.description ?? "Product description goes here."}
              </TextComponent>
              <TextComponent className="text-2xl font-semibold text-blue-600 mb-6">
                ${data.price?.toFixed(2) ?? "0.00"}
              </TextComponent>
              {/* Add some space at the bottom of scroll view if needed */}
              <View style={{ height: 20 }} />
            </ScrollViewComponent>

            {/* Fixed Bottom Button Area */}
            <View className="p-4   ">
              <ButtonComponent
                onPress={() => {
                  /* Add to cart logic here */
                  addToCart(data.id);
                }}
              >
                Add to Cart
              </ButtonComponent>
            </View>
          </View>
        ) : (
          // Handle case where data is not available after loading
          !isLoading && (
            <View className="flex-1 items-center justify-center p-4">
              <TextComponent>Product not found.</TextComponent>
            </View>
          )
        )}
      </Loading>
    </ViewComponent>
  );
}
