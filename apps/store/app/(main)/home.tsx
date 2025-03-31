import { Button, CustomView, Om, Om3 } from "@/components/view";
import { useTRPC } from "@/util/trpc";
import { Om2, useAuthStore } from "@pkg/ui";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function home() {
  const logout = useAuthStore((s) => s.logout);
  const trpc = useTRPC();
  const router = useRouter();
 

  return (
    <CustomView className="flex-1 items-center justify-center">
      {/* <View className="border-2 border-slate-300 rounded-xl p-6">
        <Text className="text-2xl font-bold text-slate-900 ">
          {isLoading ? "Loading..." : "Hello " + data?.user.email}
        </Text>
      </View> */}
      <TouchableOpacity
        onPress={() => logout(router)}
        className="p-6 bg-slate-950 rounded-lg mt-6"
      >
        <Text className="text-white">logout</Text>
      </TouchableOpacity>
      <Om2 />
    </CustomView>
  );
}
