import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ButtonComponent,
  Loading,
  MainOverview,
  ProductCard,
  ScrollViewComponent,
  useMutation,
  useQuery,
  useQueryClient,
  useTRPC,
  ViewComponent, // ViewComponent might not be needed if ScrollViewComponent is used
} from "@pkg/ui";
import { Link, useRouter } from "expo-router";
// Import Pressable
import { FlatList, Pressable, Text } from "react-native";

export default function Products() {
  const trpc = useTRPC();

  const r = useRouter();
  const { data: ud, isLoading: ul } = useQuery(
    trpc.user.getUser.queryOptions()
  );
  const { data, isLoading } = useQuery(
    trpc.store.getNearByStores.queryOptions(
      {
        lat: ud?.location.lat ?? 0,
        long: ud?.location.long ?? 0,
      },
      {
        enabled: !ul,
      }
    )
  );

  return (
    // Consider if ScrollViewComponent is needed if FlatList handles scrolling
    // If the button should always be visible, position it outside/absolute to the FlatList container
    <ViewComponent className="px-6 flex-1 gap-6 ">
      <Loading isloading={isLoading}>
        <MainOverview
          title="Stores Near You"
          description="Find stores near you"
        />
        {!data || data.length == 0 ? (
          <Text>No Stores</Text>
        ) : (
          <FlatList
            numColumns={2}
            // Removed style={{ width: '100%' }} - often not needed with flex parent
            data={data}
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
                      pathname: "/store/[id]",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  <ProductCard
                    name={item.name}
                    src={item.img ? item.img : null}
                  />
                </Pressable>
              );
            }}
            // Add contentContainerStyle for potential inner spacing if needed
            // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
          />
        )}
      </Loading>

      {/* Consider positioning the button absolutely if it should overlay the list */}
    </ViewComponent> // Changed ScrollViewComponent to ViewComponent if FlatList handles scroll
  );
}
