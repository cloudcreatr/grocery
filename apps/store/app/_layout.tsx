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
  wsLink,
  createWSClient,
  splitLink,
  useTRPC,
  useSubscription,
  useQueryClient,
  useConnectionStatusStore,
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
        throwOnError: true,
      },
    },
  });
}

function SubscriptionProcessor({ children }: { children: React.ReactNode }) {
  const t = useTRPC();
  const q = useQueryClient();

  const sub = useSubscription(
    t.order.deliverySubscription.subscriptionOptions(undefined, {
      onStarted() {
        console.log("Subscription started");
      },
      onData(data) {
        console.log("Subscription data:", data);
        q.invalidateQueries(t.order.pathFilter());
      },
      onError(error) {
        console.log("Subscription error:", error);
      },
    })
  );
  return children;
}

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = makeQueryClient();
  const set = useConnectionStatusStore((s) => s.setStatus);
  const client = createWSClient({
    url: `${process.env.EXPO_PUBLIC_API}`,
    retryDelayMs: () => 2000,
    onOpen() {
      set("connected");
      console.log("WebSocket connection opened");
    },
    onClose() {
      set("disconnected");
      console.log("WebSocket connection closed");
    },
    onError(error) {
      set("error");
      console.log("WebSocket error:", error);
    },
  });
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client,
          }),
          false: httpBatchLink({
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
        <SubscriptionProcessor>{children}</SubscriptionProcessor>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <SafeAreaView>{children}</SafeAreaView>
      </Stack>
      <StatusBar backgroundColor="#f1f5f9" />
    </Providers>
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
