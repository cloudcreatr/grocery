import { Loading, TextComponent, useAuthLogin, useAuthStore } from "@pkg/ui";
import {
  Button,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from "react-native-maps";
export default function App() {
  const router = useRouter();
  const login = useAuthLogin();
  const isExchangeToken = useAuthStore((s) => s.isExchangeToken);

  return (
    <SafeAreaView>
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
      
    </SafeAreaView>
  );
}


