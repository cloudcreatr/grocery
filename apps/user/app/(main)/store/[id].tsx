import {
  Loading,
  MainOverview,
  MapComponent,
  ProductCard,
  ScrollViewComponent,
  useQuery,
  useTRPC,
} from "@pkg/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";

export default function Store() {
  const t = useTRPC();
  const { data, isLoading } = useQuery(t.store.getStoreDetails.queryOptions());
  const { data: ud, isLoading: ul } = useQuery(t.user.getUser.queryOptions());
  const [isScrolling, setIsScrolling] = useState(false);
  const r = useRouter();
  return (
    <ScrollViewComponent className="flex-1 px-6" scrollEnabled={!isScrolling}>
      <Loading isloading={isLoading || ul}>
        <View className="flex flex-col gap-6">
          <MainOverview
            title={data?.storeDetails.name ?? "No Store Name"}
            description={
              data?.storeDetails.description ?? "No Store Description"
            }
          />
          <MapComponent
            onTouchEnd={() => setIsScrolling(false)}
            onTouchStart={() => setIsScrolling(true)}
            orgin={{
              latitude: ud?.location.lat ?? 0,
              longitude: ud?.location.long ?? 0,
            }}
            destination={{
              latitude: data?.storeDetails?.location?.y ?? 0,
              longitude: data?.storeDetails?.location?.x ?? 0,
            }}
          />
          <MainOverview
            title="Product Sold "
            description="Products from Our store"
          />

          {!data?.product || data.product.length == 0 ? (
            <Text>No products</Text>
          ) : (
            <FlatList
              numColumns={2}
              // Removed style={{ width: '100%' }} - often not needed with flex parent
              data={data?.product}
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
            />
          )}
        </View>
      </Loading>
    </ScrollViewComponent>
  );
}
