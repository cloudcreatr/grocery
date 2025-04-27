import { Loading, useQuery, useTRPC, ViewComponent } from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { View, FlatList, Text } from "react-native";
import { ButtonComponent } from "@pkg/ui/components/rn";

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
            data={data?.images || []}
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