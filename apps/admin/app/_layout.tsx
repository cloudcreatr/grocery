import { Stack, useRouter, type ErrorBoundaryProps } from "expo-router";
import "@/global.css";
import {
  useAuthStore,
  QueryClient,
  QueryClientProvider,
  TRPCProvider,
  createTRPCClient,
  httpBatchLink,
  TRPCClientError,
  ButtonComponent,
} from "@pkg/ui";
import "expo-dev-client";
import { getHeaderTitle } from "@react-navigation/elements";
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

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = makeQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.EXPO_PUBLIC_API}/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
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
          header: (props) => {
            const title = getHeaderTitle(props.options, "Ekam");
            return (
              <SafeAreaView className="px-4 bg-slate-100 py-2 flex flex-row items-center justify-center">
                <View className="flex flex-row items-center flex-1 justify-center">
                  <Text className="font-bold text-2xl text-slate-900 capitalize">
                    {title}
                  </Text>
                </View>
              </SafeAreaView>
            );
          },
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
    <SafeAreaView className="flex flex-1  justify-between bg-slate-100 p-6">
      <LogoutCOmp error={error} retry={retry} />
      <Text className="text-4xl font-bold text-slate-900 ">
        We're sorry, but we encountered a problem. Please try again later
      </Text>
      {code !== "UNAUTHORIZED" && (
        <ButtonComponent onPress={retry}>Try Again</ButtonComponent>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
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
