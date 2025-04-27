import {
  ButtonComponent,
  useAuthLogin,
  useAuthStore,
  ViewComponent,
} from "@pkg/ui";

import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  const login = useAuthLogin();
  const isExchangeToken = useAuthStore((s) => s.isExchangeToken);

  return (
    <ViewComponent className="flex-1 items-center justify-center">
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
