import { useAuthLogin, useAuthStore } from "@pkg/ui";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ButtonComponent } from "@pkg/ui";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const login = useAuthLogin();
  const isExchangeToken = useAuthStore((s) => s.isExchangeToken);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (status === "authenticated") {
      timer = setTimeout(() => {
        router.replace("/(main)/home");
      }, 1000);
      console.log("logged in /index");
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [status, router]);

  return (
    <SafeAreaView className="flex bg-blue-600 flex-1 p-6">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white font-bold text-6xl ">Ekam Mart</Text>
        <Text className="text-white font-medium text-2xl">
          Your city, your shop, one app
        </Text>
      </View>
      {status === "unauthenticated" && (
        <View className=" items-center justify-center">
          <ButtonComponent
            className="bg-white"
            textClassName="text-blue-500"
            onPress={() => login(router)}
            isLoading={isExchangeToken}
          >
            Sign In To Continue
          </ButtonComponent>
        </View>
      )}
      <StatusBar backgroundColor="#2563eb" />
    </SafeAreaView>
  );
}
