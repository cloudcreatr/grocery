
import { useTRPC } from "@/util/trpc";
import { useQuery } from "@tanstack/react-query";
import { useAuth  } from "@pkg/lib";
import {
  Button,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const auth = useAuth();
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.hello.queryOptions("React native"));

  const { login, isExchangeToken } = auth;
  const d = data?.message;
  return (
    <SafeAreaView>
      <View className=" h-full ">
        <Text>login</Text>

        <TouchableOpacity
          onPress={() => {
            login();
          }}
          className="bg-blue-500 p-2 rounded-lg"
        >
          <Text>{isExchangeToken ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>{d ? data?.message : "no data"}</Text>
        )}
       
      </View>
    </SafeAreaView>
  );
}
