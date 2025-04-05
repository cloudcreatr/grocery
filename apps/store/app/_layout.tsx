import { Stack, useRouter, type ErrorBoundaryProps } from "expo-router";
import "@/global.css";
import {
  getToken,
  useAuthStore,
  QueryClient,
  QueryClientProvider,
  TRPCProvider,
  createTRPCClient,
  httpBatchLink,
  TRPCClientError,
} from "@pkg/ui";
import "expo-dev-client";

import { useEffect, useState } from "react";

import { AppRouter } from "@repo/bg";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client

        throwOnError: true,
      },
    },
  });
}

export default function App({ children }: { children: React.ReactNode }) {
  const queryClient = makeQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.EXPO_PUBLIC_API}/trpc`,
          headers: async () => {
            const token = await getToken();
            if (token) {
              return {
                Authorization: `Bearer ${token}`,
              };
            }
            return {};
          },
        }),
      ],
    })
  );
  const load = useAuthStore((s) => s.loadAuthState);
  useEffect(() => {
    load();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <SafeAreaView>{children}</SafeAreaView>
          
        </Stack>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  let text = "An error occurred";
  let code: string | undefined = undefined;

  if (error instanceof TRPCClientError) {
    code = error.data?.code;

    switch (code) {
      case "UNAUTHORIZED":
        text = "Unauthorized";
        break;
      case "FORBIDDEN":
        text = error.data.message || "Forbidden";
        break;
      default:
        text = "An error occurred";
    }

    console.error("TRPC Error Code:", code);
  }

  return (
    <View className="flex flex-1 bg-emerald-100 justify-center items-center">
      <Text className="text-2xl font-bold text-slate-900 ">
        Something went wrong
      </Text>
      {code !== "UNAUTHORIZED" && (
        <Text
          onPress={retry}
          className="bg-slate-950 text-white rounded-lg p-6"
        >
          Try Again?
        </Text>
      )}
      <LogoutCOmp error={error} retry={retry} />
      <StatusBar style="auto" />
    </View>
  );
}

function LogoutCOmp({
  error,
  retry,
}: {
  error: Error;
  retry: () => Promise<void>;
}) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (!(error instanceof TRPCClientError)) return;

    const code = error.data?.code;

    if (code === "UNAUTHORIZED") {
      console.log("Logging out due to UNAUTHORIZED error");

      // ✅ Ensure we only log out ONCE per error occurrence
      logout(router).then(() => {
        retry(); // Try again after logging out
      });
    }
  }, [error, logout, router, retry]); // ✅ Dependencies properly managed

  return null;
}
