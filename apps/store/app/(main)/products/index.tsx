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
  ViewComponent, // ViewComponent might not be needed if ScrollViewComponent is used
} from "@pkg/ui";
import { Link, useRouter } from "expo-router";
// Import Pressable
import { FlatList, Pressable, Text } from "react-native";

export default function Products() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const r = useRouter();
  const { data, isLoading } = useQuery(trpc.product.listProduct.queryOptions());
  const { mutate, isPending } = useMutation(
    trpc.product.createProduct.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.product.listProduct.queryFilter());
        r.push({
          pathname: "/products/[id]",
          params: {
            id: data.id,
          },
        });
      },
    })
  );
  return (
    // Consider if ScrollViewComponent is needed if FlatList handles scrolling
    // If the button should always be visible, position it outside/absolute to the FlatList container
    <ViewComponent className="p-6 flex-1 ">
      <Loading
        isloading={isLoading}
        source={require("@/assets/loading-3.json")}
      >
        {!data || data.length == 0 ? (
          <Text>No products</Text>
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
                      pathname: "/products/[id]",
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
            // Add contentContainerStyle for potential inner spacing if needed
            // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
          />
        )}
      </Loading>

      {/* Consider positioning the button absolutely if it should overlay the list */}
      <ButtonComponent
        isLoading={isPending}
        onPress={() => {
          mutate();
        }}
        // Adjusted positioning if needed, e.g., absolute positioning
        // className="absolute bottom-6 right-6 bg-blue-500"
        className="rounded-full w-fit  bg-blue-500 absolute bottom-4 right-6" // Simple margin-top if it's below the list
      >
        <Ionicons name="add-outline" size={30} color="white" />
      </ButtonComponent>
    </ViewComponent> // Changed ScrollViewComponent to ViewComponent if FlatList handles scroll
  );
}
