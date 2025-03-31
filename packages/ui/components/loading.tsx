import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

export function Loading({
  islaoding,
  children,
  source,
}: {
  islaoding: boolean;
  children: React.ReactNode;
  source: any;
}) {
  return (
    <>
      {islaoding ? (
        <LottieView
          autoPlay
          loop
          style={{
            width: "100%",
            height: "100%",
          }}
          source={source}
        />
      ) : (
        children
      )}
    </>
  );
}
