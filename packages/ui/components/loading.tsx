import LottieView from "lottie-react-native";
import { View, StyleSheet, Text } from "react-native";

export function Loading({
  isloading,
  children,
  source ,
}: {
  isloading: boolean;
  children: React.ReactNode;
  source: string;
}) {
  return (
    <>
      {isloading ? (
        <View className="h-full w-full bg-slate-100">
          <LottieView
            autoPlay
            loop
            source={source}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      ) : (
        children
      )}
    </>
  );
}
