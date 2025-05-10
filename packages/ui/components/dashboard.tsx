import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { TextComponent } from "./rn";
import type { iconType } from "./rn";

export function ActionItem({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: iconType;
  onPress?: () => void;
}) {
  return (
    <View className="flex  flex-1 flex-row items-center justify-between bg-blue-100 border-2 border-blue-400 p-4 rounded-xl ">
      <TouchableOpacity onPress={onPress} className="flex-1">
        <Ionicons name={icon} size={24} color="#3b82f6" />
        <TextComponent className="text-lg font-semibold text-blue-500 pt-1">
          {title}
        </TextComponent>
      </TouchableOpacity>
    </View>
  );
}
