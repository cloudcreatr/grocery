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

export function StatusOverView({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="flex gap-3  p-6 bg-white border-slate-300 rounded-xl ">
      <Text className="text-slate-900 text-2xl font-bold">{title}</Text>
      <Text className="text-slate-600 text-base">{description}</Text>
    </View>
  );
}
