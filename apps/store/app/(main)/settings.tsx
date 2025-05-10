import { SettingsItem, ViewComponent, type SettingsItemProps } from "@pkg/ui";
import { useRouter } from "expo-router";

export default function Settings() {
  const r = useRouter();
  const List: SettingsItemProps[] = [
    {
      name: "Store Info",
      icon: "storefront-outline",
      onPress: () => r.push("/store"),
    },
    {
      name: "Payment info",
      icon: "card-outline",
      onPress: () => r.push("/(main)/bank"),
    },
    {
      name: "User info",
      icon: "person-outline",
      onPress: () => r.push("/(main)/user"),
    },
  ];
  return (
    <ViewComponent className="p-6 flex-1 gap-4">
      {List.map((item, index) => (
        <SettingsItem
          key={index}
          name={item.name}
          icon={item.icon}
          onPress={item.onPress}
        />
      ))}
    </ViewComponent>
  );
}
