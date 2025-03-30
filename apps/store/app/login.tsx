import { useTRPC } from "@/util/trpc";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@pkg/ui";
import {
  Button,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const auth = useAuth();

  const { login, isExchangeToken } = auth;

  return (
    <SafeAreaView>
      <View className=" h-full ">
       
        <Text>
          om
</Text>
        <TouchableOpacity
          onPress={() => {
            login();
          }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <Text>{isExchangeToken ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
