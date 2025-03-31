import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
} from "expo-auth-session";
import { type Router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import type { Sub } from "@pkg/lib";

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  status: "loading" | "unauthenticated" | "authenticated";
  user: Sub | null;
  isExchangeToken: boolean;
  login: (code: string, codeVerifier: string, router: Router) => Promise<void>;
  logout: (router: Router) => Promise<void>;
  loadAuthState: () => Promise<void>;
}

const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_AUTH}/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_AUTH}/token`,
};

// ✅ Zustand Store
export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,
  isExchangeToken: false,

  login: async (code: string, codeVerifier: string, router: Router) => {
    try {
      set({ isExchangeToken: true });
      if (!code) {
        console.error("No code found in response");
        throw new Error("No code found in response");
      }

      const exchangeTokenResponse = await exchangeCodeAsync(
        {
          clientId: "YOUR_CLIENT",
          code,
          redirectUri: makeRedirectUri({ path: "/login" }),
          extraParams: { code_verifier: codeVerifier },
        },
        discovery
      );

      set({ isExchangeToken: false });

      if (exchangeTokenResponse.refreshToken) {
        const tokens = {
          access_token: exchangeTokenResponse.accessToken,
          refresh_token: exchangeTokenResponse.refreshToken,
        };

        const user = jwtDecode<{ properties: any }>(tokens.access_token);

        set({ status: "authenticated", user: user.properties });
        await Promise.allSettled([
          SecureStore.setItemAsync("access_token", tokens.access_token),
          SecureStore.setItemAsync("refresh_token", tokens.refresh_token),
        ]);

        router.replace("/home");
      } else {
        console.error("No refresh token found.");
        set({ status: "unauthenticated", user: null });

        router.replace("/login");
      }
    } catch (error) {
      console.error("Token exchange error", error);
      set({ status: "unauthenticated", user: null, isExchangeToken: false });

      router.replace("/login");
    }
  },

  logout: async (router) => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    set({ status: "unauthenticated", user: null });

    router.replace("/login");
  },

  loadAuthState: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (accessToken && refreshToken) {
        const user = jwtDecode<{ properties: Sub }>(accessToken);
        set({ status: "authenticated", user: user.properties });
      } else {
        set({ status: "unauthenticated", user: null });
      }
    } catch (error) {
      console.error("Error loading stored token:", error);
      set({ status: "unauthenticated", user: null });
    }
  },
}));

WebBrowser.maybeCompleteAuthSession();

// Custom hook to handle login flow - use this in your components
export const useAuthLogin = () => {
  const login = useAuthStore((state) => state.login);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "YOUR_CLIENT",
      usePKCE: true,
      redirectUri: makeRedirectUri({ path: "/login" }),
    },
    discovery
  );

  const handleLogin = async (router: Router) => {
    const authResponse = await promptAsync();
    if (authResponse.type === "success") {
      const { code } = authResponse.params;
      if (!code) {
        console.error("No code found in response");
        throw new Error("No code found in response");
      }
      await login(code, request?.codeVerifier || "", router);
    }
  };

  return handleLogin;
};

export function getToken() {
  return SecureStore.getItemAsync("access_token");
}