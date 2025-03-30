import { useTRPC } from "@/util/trpc";
import { useAuth } from "@pkg/ui";
import { useQuery } from "@tanstack/react-query";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function home() {
  const { logout } = useAuth();
  const trpc = useTRPC();

  const { authState } = useAuth();
  const { data, isLoading } = useQuery(trpc.test.queryOptions());
  return (
    <View className="flex-1 items-center justify-center">
      <View className="border-2 border-slate-300 rounded-xl p-6">
        <Text className="text-2xl font-bold text-slate-900 ">
          {isLoading ? "Loading..." : "Hello " + data?.user.email}
        </Text>
      </View>
      <TouchableOpacity onPress={() => logout()} className="p-6 bg-slate-950 rounded-lg mt-6">
        <Text className="text-white">
          logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
