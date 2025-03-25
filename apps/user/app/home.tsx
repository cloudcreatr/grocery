import { useAuth, useProtectedRoute } from "@pkg/lib";
import { Button, Text, View } from "react-native";

export default function home() {
  const { logout } = useAuth();
  const tokens = useProtectedRoute();
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await logout();
        }}
      />
      <Text>{tokens.access_token}</Text>
      <Text>{tokens.refresh_token}</Text>
    </View>
  );
}
