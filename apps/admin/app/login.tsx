import {
  ButtonComponent,

  useAuthLogin,
  useAuthStore,
  ViewComponent,
} from "@pkg/ui";

import { useRouter } from "expo-router";
import { Text } from "react-native";


export default function App() {
  const router = useRouter();
  const login = useAuthLogin();
  const isExchangeToken = useAuthStore((s) => s.isExchangeToken);

  return (
    <ViewComponent className="flex-1 items-center justify-center">
      <Text>
        login
      </Text>
      <ButtonComponent
        onPress={() => {
          login(router);
        }}
        isLoading={isExchangeToken}
      >
        Login
      </ButtonComponent>
    </ViewComponent>
  );
}
