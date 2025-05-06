import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

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
    <View className="flex gap-3  p-6 bg-white border-blue-500 border rounded-2xl  ">
      <Text className="text-slate-900 text-2xl font-bold">{title}</Text>
      <Text className="text-slate-600 text-base">{description}</Text>
    </View>
  );
}

export function OrderOverViewCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex bg-white p-4 rounded-2xl border border-slate-200">
      {children}
    </View>
  );
}
export function OrderOverviewItem({
  onPress,
  title,
  description,
  icon,
}: {
  onPress?: () => void;
  title: string;
  description?: string;
  icon: "call-outline" | "storefront-outline" | "person-outline";
}) {
  return (
    <View className="flex flex-row items-center gap-4    py-4">
      <Ionicons name={icon} size={30} color={"#1e293b"} />
      <View className="">
        <Text className="text-slate-800 font-bold text-xl">{title}</Text>
        {description && (
          <Text className="text-slate-500 font-medium ">{description}</Text>
        )}
      </View>
      {onPress && (
        <TouchableOpacity>
          <Ionicons name="arrow-forward-outline" size={30} color={"#1e293b"} />
        </TouchableOpacity>
      )}
    </View>
  );
}
