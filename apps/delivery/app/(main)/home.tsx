import { MapComponent, useAuthStore } from "@pkg/ui";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function home() {
  const logout = useAuthStore((s) => s.logout);
  const r = useRouter();
  return (
    <View className="p-6">
      <Text>
        <Link href={"/(main)/order"}>Order</Link>
        {"\n"}
      </Text>
      <TouchableOpacity
        onPress={async () => {
          await logout(r);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
