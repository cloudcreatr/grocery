import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  type ViewProps,
  type TextProps,
  type TouchableOpacityProps,
  type ScrollViewProps,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { twMerge } from "tailwind-merge";
import { Link } from "expo-router";
export function ViewComponent({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & ViewProps) {
  return (
    <View className={twMerge("bg-slate-100", className)} {...rest}>
      {children}
    </View>
  );
}
export function ScrollViewComponent({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & ScrollViewProps) {
  return (
    <ScrollView className={twMerge("bg-slate-100", className)} {...rest}>
      {children}
    </ScrollView>
  );
}

export function TextComponent({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & TextProps) {
  return (
    <Text className={twMerge("text-slate-900", className)} {...rest}>
      {children}
    </Text>
  );
}

export function ButtonComponent({
  className,
  isLoading,
  isDisabled,
  textClassName,
  children,
  ...rest
}: {
  children: string | React.ReactNode;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
} & TouchableOpacityProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        "bg-blue-600 p-4 w-full rounded-3xl",
        isDisabled || isLoading ? "opacity-80" : "",
        className
      )}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator animating={true} size={"large"} color={"white"} />
      ) : (
        <Text
          className={twMerge(
            "text-white text-center font-semibold text-3xl",
            textClassName
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export type SettingsItemProps = {
  name: string;
  icon?: iconType;
  onPress?: () => void;
};
export function SettingsItem({ name, icon, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow"
    >
      <Text className="text-lg font-semibold">{name}</Text>
      {icon && <Ionicons name={icon} size={24} color="black" />}
    </TouchableOpacity>
  );
}

export function QuickActionRow({
  title,
  title2,
  path,
}: {
  title: string;
  title2: string;
  path: string;
}) {
  return (
    <View className="flex flex-row items-center justify-between pb-2">
      <TextComponent className="text-2xl font-bold">{title}</TextComponent>
      <Link className="text-blue-500 font-bold text-2xl" href={path}>
        {title2}
      </Link>
    </View>
  );
}

export type iconType =
  | "storefront-outline"
  | "card-outline"
  | "person-outline"
  | "cube-outline"
  | "log-out-outline"
  | "radio-outline";
