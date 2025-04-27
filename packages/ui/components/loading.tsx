import LottieView from "lottie-react-native";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

export function Loading({
  isloading,
  children,
  source,
}: {
  isloading: boolean;
  children: React.ReactNode;
  source?: string;
}) {
  return (
    <>
      {isloading ? (
        <View className="flex  flex-col  h-full flex-1 justify-center items-center">
          <View className="w-fit bg-blue-100 rounded-2xl p-4 border border-blue-200">
            <ActivityIndicator animating size={"large"} color={"#3b82f6"} />
          </View>
        </View>
      ) : (
        children
      )}
    </>
  );
}
