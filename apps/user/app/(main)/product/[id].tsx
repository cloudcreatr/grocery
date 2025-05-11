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
  MainOverview,
  ProductCard,
} from "@pkg/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View, Text } from "react-native"; // Removed FlatList import

export default function Page() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery(
    t.product.getProduct.queryOptions({
      productId: Number(id),
    })
  );
  const r = useRouter();
  const addToCart = useCart((state) => state.addToCart);
  // Ensure images is always an array, even if data.img or data.img.imgID is null/undefined

  // Removed renderImage function as it's no longer needed for FlatList

  return (
    // Use flex-1 for the main container to take full screen height
    <ViewComponent className="flex-1">
      <Loading isloading={isLoading}>
        // Use a standard View for overall layout
        <View className="flex-1">
          {/* Single Image Area */}

          <ImageComponent
            src={data?.product.img?.imgID[0] ?? undefined} // Use the first image if available
            className="w-full h-2/4 aspect-auto" // Take full width
          />

          {/* Scrollable Content Area (Details) */}
          <ScrollViewComponent
            className="flex-1 p-6" // Allow this part to scroll if content overflows
            // Add padding inside the scroll view
          >
            <View className="gap-2 pb-20">
              <TextComponent className="text-3xl font-bold mb-2">
                {data?.product.name ?? "Product Name"}
              </TextComponent>
              <TextComponent className="text-lg text-gray-700 mb-4">
                {data?.product.description ?? "Product description goes here."}
              </TextComponent>
              <TextComponent className="text-2xl font-semibold text-blue-600 mb-6">
                Rs{data?.product.price?.toFixed(2) ?? "0.00"}
              </TextComponent>
              {/* Add some space at the bottom of scroll view if needed */}
              <ButtonComponent
                onPress={() => {
                  /* Add to cart logic here */
                  addToCart(data?.product.id ?? 0);
                }}
              >
                Add to Cart
              </ButtonComponent>
              <MainOverview
                title="Similar Products"
                description="Related products you might like"
              />
              {!data || data.recommendedProduct.length == 0 ? (
                <Text>No products</Text>
              ) : (
                <FlatList
                  numColumns={2}
                  // Removed style={{ width: '100%' }} - often not needed with flex parent
                  data={data.recommendedProduct}
                  // Added keyExtractor for performance and stability
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    // Wrap ProductCard in Pressable for navigation
                    // Apply flex: 1 to Pressable to ensure it takes up column space
                    return (
                      <Pressable
                        style={{ flex: 1 }} // Ensure Pressable takes up the column space
                        onPress={() =>
                          r.push({
                            pathname: "/product/[id]",
                            params: {
                              id: item.id,
                            },
                          })
                        }
                      >
                        <ProductCard
                          name={item.name}
                          src={item.img ? item.img.imgID[0] : null}
                        />
                      </Pressable>
                    );
                  }}
                  // Add contentContainerStyle for potential inner spacing if needed
                  // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
                />
              )}
            </View>
          </ScrollViewComponent>

          {/* Fixed Bottom Button Area */}
        </View>
      </Loading>
    </ViewComponent>
  );
}
