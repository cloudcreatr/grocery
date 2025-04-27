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

  if (isLoading) {
    return (
      <ViewComponent>
        <Loading isloading={isLoading} />
      </ViewComponent>
    );
  }

  if (!data) {
    return (
      <ViewComponent>
        <Text>No product found</Text>
      </ViewComponent>
    );
  }

  const { images, title, description, price } = data;

  return (
    <ViewComponent>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <ImageComponent src={item} className="w-full h-64" />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text className="text-2xl font-bold mt-4">{title}</Text>
      <Text className="text-lg mt-2">{description}</Text>
      <Text className="text-xl font-semibold mt-2">${price}</Text>
      <ButtonComponent className="mt-4">Add to Cart</ButtonComponent>
    </ViewComponent>
  );
}