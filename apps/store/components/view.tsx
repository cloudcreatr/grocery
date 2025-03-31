import React from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface CustomViewProps extends ViewProps {
  className?: string;
  defaultClassName?: string;
}

export function CustomView(prop: CustomViewProps) {
  const { className, children, ...rest } = prop;

  const containerClassName = twMerge("bg-slate-100", className);
  return <View className={containerClassName}>{children}</View>;
}
