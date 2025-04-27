import { Loading, useQuery, useTRPC, ViewComponent } from "@pkg/ui";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Order() {
  const t = useTRPC();
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery(
    t.order.getOrderItemDetails.queryOptions({
      orderItemId: Number(id),
    })
  );
  return (
    <ViewComponent>
      <Loading isloading={isLoading}>
        <Text>hi</Text>
      </Loading>
    </ViewComponent>
  );
}
