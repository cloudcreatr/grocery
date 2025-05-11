import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ButtonComponent,
  Loading,
  ProductCard,
  ScrollViewComponent,
  useMutation,
  useQuery,
  useQueryClient,
  useTRPC,
  ViewComponent,
  // ViewComponent might not be needed if ScrollViewComponent is used
} from "@pkg/ui";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
// Import Pressable
import { FlatList, Pressable, Text } from "react-native";
import { MainOverview } from "@pkg/ui";
export default function Products() {
  const trpc = useTRPC();
  const { id } = useLocalSearchParams();
  const { data: ud, isLoading: ul } = useQuery(
    trpc.user.getUser.queryOptions()
  );
  const r = useRouter();
  const { data, isLoading } = useQuery(
    trpc.product.getProductByAvailable.queryOptions(
      {
        availableId: Number(id),
        lat: ud?.location.lat ?? 0, // Replace with actual latitude value
        long: ud?.location.long ?? 0, // Replace with actual longitude value
      },
      {
        enabled: !ul,
      }
    )
  );

  return (
    // Consider if ScrollViewComponent is needed if FlatList handles scrolling
    // If the button should always be visible, position it outside/absolute to the FlatList container
    <ViewComponent className="px-6 flex-1 ">
      <MainOverview
        title="Products Available"
        description="Find products available in your area"
      />
      <Loading isloading={isLoading || ul}>
        {!data || data.length == 0 ? (
          <Text>No products</Text>
        ) : (
          <FlatList
            numColumns={2}
            // Removed style={{ width: '100%' }} - often not needed with flex parent
            data={data}
            // Added keyExtractor for performance and stability
            keyExtractor={(item) => item.product.id.toString()}
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
                        id: item.product.id,
                      },
                    })
                  }
                >
                  <ProductCard
                    name={item.product.name}
                    price={item.product.price}
                    src={item.product.img ? item.product.img.imgID[0] : null}
                  />
                </Pressable>
              );
            }}
            // Add contentContainerStyle for potential inner spacing if needed
            // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
          />
        )}
      </Loading>
    </ViewComponent> // Changed ScrollViewComponent to ViewComponent if FlatList handles scroll
  );
}
