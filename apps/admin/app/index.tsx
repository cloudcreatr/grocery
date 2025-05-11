import { SettingsItem, ViewComponent } from "@pkg/ui";
import { useRouter } from "expo-router";
import { Text } from "react-native";

export default function App() {
  const r = useRouter();
  return (
    <ViewComponent className="p-6 flex-1 gap-4">
      <SettingsItem
        name="Category"
        onPress={() => {
          r.push("/category");
        }}
      />
      <SettingsItem
        name="Products"
        onPress={() => {
          r.push("/product");
        }}
      />
    </ViewComponent>
  );
}
