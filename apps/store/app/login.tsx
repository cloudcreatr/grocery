import { Om2, useAuthLogin, useAuthStore } from "@pkg/ui";
import {
  Button,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  const login = useAuthLogin();
  const isExchangeToken = useAuthStore((s) => s.isExchangeToken);

  return (
    <SafeAreaView>
      <View className=" h-full ">
        <Text>om</Text>
        <TouchableOpacity
          onPress={() => {
            login(router);
          }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <Text className="text-white">
            {isExchangeToken ? "loading" : "Login with code"}
          </Text>
        </TouchableOpacity>
        <Text>hi bro</Text>

        <Om2 />
      </View>
    </SafeAreaView>
  );
}
