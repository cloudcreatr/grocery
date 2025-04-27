import Ionicons from "@expo/vector-icons/Ionicons";
import { ViewComponent, type iconType } from "@pkg/ui";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

const List: {
  name: string;
  icon: iconType;
  path: "/store" | "/bank" | "/user";
}[] = [
  {
    name: "Store Info",
    icon: "storefront-outline",
    path: "/store",
  },
  {
    name: "Payment info",
    icon: "card-outline",
    path: "/bank",
  },
  {
    name: "User info",
    icon: "person-outline",
    path: "/user",
  },
];

export default function Settings() {
  const r = useRouter();
  return (
    <ViewComponent className="p-6 flex-1 gap-4">
      {List.map((item) => (
        <TouchableOpacity
          onPress={() => {
            r.push({
              pathname: item.path,
            });
          }}
          className="flex flex-row items-center justify-between bg-white p-4 rounded-lg shadow"
        >
          <Text className="text-lg font-semibold">{item.name}</Text>
          <Ionicons name={item.icon} size={24} color="black" />
        </TouchableOpacity>
      ))}
    </ViewComponent>
  );
}
