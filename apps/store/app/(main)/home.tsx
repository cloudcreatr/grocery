import { ViewComponent } from "@pkg/ui";

import { useAuthStore, useTRPC } from "@pkg/ui";

import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function home() {
  const logout = useAuthStore((s) => s.logout);
  const trpc = useTRPC();
  const router = useRouter();
 
  return (
    <ViewComponent className="flex-1 items-center justify-center">
      
      <TouchableOpacity
        onPress={() => logout(router)}
        className="p-6 bg-slate-950 rounded-lg mt-6"
      >
        <Text className="text-white">logout</Text>
      </TouchableOpacity>
      <Link
        href={{
          pathname: "/user",
        }}
      >
        go to user
      </Link>
    </ViewComponent>
  );
}
