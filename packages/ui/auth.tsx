import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import type { Sub } from "@pkg/lib";
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
} from "expo-auth-session";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

interface tokens {
  access_token: string;
  refresh_token: string;
}

// Define a more comprehensive auth state
type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: Sub };

interface AuthContextType {
  authState: AuthState;
  login: () => void;
  logout: () => Promise<void>;
  isExchangeToken: boolean;
}

const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_AUTH}/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_AUTH}/token`,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const [isExchangeToken, setIsExchangeToken] = useState(false);
  const router = useRouter();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "YOUR_CLIENT",
      usePKCE: true,
      redirectUri: makeRedirectUri({
        path: "/login",
      }),
    },
    discovery
  );

  const setToken = ({ access_token }: { access_token: string }) => {
    const user = jwtDecode<{ properties: Sub }>(access_token);
    setAuthState({ status: "authenticated", user: user.properties });
  };

  // Load tokens from SecureStore on app start
  useEffect(() => {
    const loadStoredTokens = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (accessToken && refreshToken) {
          setToken({ access_token: accessToken });
        } else {
          setAuthState({ status: "unauthenticated" });
        }
      } catch (error) {
        console.error("Error loading stored token:", error);
        setAuthState({ status: "unauthenticated" });
      }
    };

    loadStoredTokens();
  }, []);

  // Exchange authorization code for tokens
  useEffect(() => {
    const exchangeToken = async (code: string) => {
      try {
        setIsExchangeToken(true);
        const exchangeTokenResponse = await exchangeCodeAsync(
          {
            clientId: "YOUR_CLIENT",
            code,
            redirectUri: makeRedirectUri({
              path: "/login",
            }),
            extraParams: {
              code_verifier: request?.codeVerifier || "",
            },
          },
          discovery
        );
        console.log(exchangeTokenResponse);
        setIsExchangeToken(false);
        if (exchangeTokenResponse.refreshToken) {
          const tokens = {
            access_token: exchangeTokenResponse.accessToken,
            refresh_token: exchangeTokenResponse.refreshToken,
          };

          setToken(tokens);

          await Promise.allSettled([
            SecureStore.setItemAsync(
              "access_token",
              exchangeTokenResponse.accessToken
            ),
            SecureStore.setItemAsync(
              "refresh_token",
              exchangeTokenResponse.refreshToken
            ),
          ]);

          router.replace("/home");
        } else {
          console.error("No refresh token found.");
          setAuthState({ status: "unauthenticated" });
          router.replace("/login");
        }
      } catch (error) {
        console.error("Token exchange error", error);
        setAuthState({ status: "unauthenticated" });
        router.replace("/login");
      }
    };

    if (response?.type === "success") {
      exchangeToken(response.params.code || "");
    }
  }, [response, router, request?.codeVerifier]);

  const login = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    setAuthState({ status: "unauthenticated" });
    router.replace("/login");
    console.log("User logged out.");
  };

  const value: AuthContextType = {
    authState,
    login,
    logout,
    isExchangeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

WebBrowser.maybeCompleteAuthSession();


export function getToken() {
  return SecureStore.getItemAsync("access_token");
}