import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator as Spinner,
} from "react-native";

export function ActivityIndicator() {
  return <Spinner animating size={"large"} color={"#3b82f6"} />;
}

export function Loading({
  isloading,
  children,
}: {
  isloading: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {isloading ? (
        <View className="flex  flex-col  h-full flex-1 justify-center items-center">
          <View className="w-fit bg-blue-100 rounded-2xl p-4 border border-blue-200">
            <ActivityIndicator />
          </View>
        </View>
      ) : (
        children
      )}
    </>
  );
}
