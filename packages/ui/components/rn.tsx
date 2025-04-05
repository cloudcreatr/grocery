import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  type ViewProps,
  type TextProps,
  type TouchableOpacityProps,
} from "react-native";

import { twMerge } from "tailwind-merge";

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
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & TouchableOpacityProps) {
  return (
    <TouchableOpacity
      className={twMerge("text-slate-900", className)}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}
