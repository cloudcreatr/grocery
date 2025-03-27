import { useAuth, useProtectedRoute } from "@pkg/ui";
import { Button, Text, View } from "react-native";

export default function home() {
  const { logout } = useAuth();

  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await logout();
        }}
      />
      <Text>hi</Text>
    </View>
  );
}
