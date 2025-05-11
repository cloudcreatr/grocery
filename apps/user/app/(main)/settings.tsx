import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SettingsItem,
  TextComponent,
  useConnectionStatusStore,
  ViewComponent,
  type iconType,
} from "@pkg/ui";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

const List: {
  name: string;
  icon: iconType;
  path: "/order" | "/user";
}[] = [
  {
    name: "Order info",
    icon: "storefront-outline",
    path: "/order",
  },
  {
    name: "User info",
    icon: "person-outline",
    path: "/user",
  },
];

export default function Settings() {
  const r = useRouter();
  const status = useConnectionStatusStore((s) => s.status);
  return (
    <ViewComponent className="p-6 flex-1 gap-4">
      {List.map((item) => (
        <SettingsItem
          key={item.name}
          name={item.name}
          icon={item.icon}
          onPress={() => r.push(item.path)}
        />
      ))}
      <TextComponent className="text-slate-400">{status}</TextComponent>
    </ViewComponent>
  );
}
