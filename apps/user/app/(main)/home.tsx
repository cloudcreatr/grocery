import {
  Loading,
  ProductCard,
  QuickActionRow,
  ScrollViewComponent,
  useQuery,
  useTRPC,
} from "@pkg/ui";
import { Link, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";

export default function Page() {
  const t = useTRPC();
  const { data, isLoading } = useQuery(t.product.listAllProduct.queryOptions());
  const r = useRouter();
  return (
    <ScrollViewComponent className="p-6">
      <Loading isloading={isLoading}>
        <View>
          <View className="flex-1 flex flex-col gap-4">
            <QuickActionRow
              title="Top Products"
              title2="Check all "
              path="/product"
            />
            <FlatList
              numColumns={2}
              // Removed style={{ width: '100%' }} - often not needed with flex parent
              data={data?.slice(0, 4)}
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
                      price={item.price}
                      src={item.img ? item.img.imgID[0] : null}
                    />
                  </Pressable>
                );
              }}
              // Add contentContainerStyle for potential inner spacing if needed
              // contentContainerStyle={{ paddingBottom: 80 }} // Example if button overlaps
            />
          </View>
        </View>
      </Loading>
    </ScrollViewComponent>
  );
}
