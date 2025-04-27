import { useCart } from "@/util/cart_store";
import {
  ButtonComponent,
  ScrollViewComponent,
  useQuery,
  useTRPC,
  ViewComponent,
} from "@pkg/ui";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
  const trpc = useTRPC();
  const cartnumber = useCart((s) => s.inCartProducts.length);
  const { isLoading, data } = useQuery(
    trpc.product.listAllProduct.queryOptions()
  );
  const addToCart = useCart((s) => s.addToCart);
  return (
    <ScrollViewComponent className="p-6 space-y-4">
      <Link
        href={{
          pathname: "/cart",
        }}
      >
        View Cart {cartnumber > 0 ? `(${cartnumber})` : ""}
      </Link>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : data && data.length > 0 ? (
        <>
          {data.map((item) => (
            <View key={item.id}>
              <Text>{JSON.stringify(item, null, 2)}</Text>
              <ButtonComponent
                onPress={() => {
                  addToCart(item.id);
                }}
              >
                Add to Cart
              </ButtonComponent>
            </View>
          ))}
        </>
      ) : (
        <Text>No Product Found</Text>
      )}
    </ScrollViewComponent>
  );
}
