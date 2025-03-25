import { useAuth } from "@pkg/lib";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, View, Text } from "react-native";

export default function App() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let timer: Timer | null = null;

    if (authState.status === "authenticated") {
      timer = setTimeout(() => {
        router.replace("/home");
      }, 1000);
      console.log("logged in /index");
    }

    if (authState.status === "unauthenticated") {
      timer = setTimeout(() => {
        router.replace("/login");
      }, 1000);
      console.log("logged out /index");
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [authState, router]);
  return (
    <>
      <View>
        <Text>Slash sceen</Text>
      </View>
    </>
  );
}
