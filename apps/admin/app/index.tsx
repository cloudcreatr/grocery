import { useAuthStore } from "@pkg/ui";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ButtonComponent } from "@pkg/ui";
import { View, Text } from "react-native";

export default function App() {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (status === "authenticated") {
      timer = setTimeout(() => {
        router.replace("/(main)/home");
      }, 1000);
      console.log("logged in /index");
    } else if (status === "unauthenticated") {
      timer = setTimeout(() => {
        router.replace("/login");
      }, 1000);
      console.log("logged out /index");
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [status, router]);

  return (
    <View>
      <Text>Slash screen</Text>
    </View>
  );
}
