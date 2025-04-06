import { View, Text } from "react-native";

export function MainOverview({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="flex gap-3 ">
      <Text className="text-slate-900 text-2xl font-bold">{title}</Text>
      <Text className="text-slate-500 text-base">{description}</Text>
    </View>
  );
}
