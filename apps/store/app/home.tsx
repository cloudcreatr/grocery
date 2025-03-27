import { useTRPC } from "@/util/trpc";
import { useAuth } from "@pkg/ui";
import { useQuery } from "@tanstack/react-query";
import { Button, Text, View } from "react-native";

export default function home() {
  const { logout } = useAuth();
  const trpc = useTRPC();

  const { authState } = useAuth();

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
      <Text>{authState.status}</Text>
      <Text>
        {authState.status === "authenticated"
          ? JSON.stringify(authState.user)
          : null}
      </Text>
    </View>
  );
}
