import { useTRPC } from "@/util/trpc";
import { useAuth, useProtectedRoute } from "@pkg/ui";
import { useQuery } from "@tanstack/react-query";
import { Button, Text, View } from "react-native";

export default function home() {
  const { logout } = useAuth();
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.test.queryOptions());

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
      {isLoading ? <Text>Loading...</Text> : <Text>{data?.message}</Text>}
    </View>
  );
}
