// filepath: /workspaces/grocery/apps/user/app/(main)/product/[id].tsx
import { Loading, useQuery, useTRPC, ViewComponent, ButtonComponent } from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { View, FlatList, Text } from "react-native";

export default function Page() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery(
    t.product.getProduct.queryOptions({
      productId: Number(id),
    })
  );

  const renderImage = ({ item }) => (
    <ImageComponent src={item} className="w-64 h-64" />
  );

  return (
    <ViewComponent>
      <Loading isloading={isLoading}>
        <View>
          <FlatList
            data={data?.images} // Assuming data.images is an array of image URLs
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text className="text-2xl font-bold">{data?.title}</Text>
          <Text className="text-lg">{data?.description}</Text>
          <Text className="text-xl font-semibold">${data?.price}</Text>
          <ButtonComponent className="mt-4">Add to Cart</ButtonComponent>
        </View>
      </Loading>
    </ViewComponent>
  );
}