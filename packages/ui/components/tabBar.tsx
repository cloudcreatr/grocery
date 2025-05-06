import { View, Platform } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { twMerge } from "tailwind-merge";
export function MyTabBar({
  state,
  descriptors,
  navigation,
  routeInclude = [],
}: BottomTabBarProps & {
  routeInclude: string[];
}) {
  const { buildHref } = useLinkBuilder();

  return (
    <View className="p-6 px-8 flex flex-row  bg-white rounded-2xl border border-slate-200">
      {state.routes
        .filter((route) => {
          return routeInclude.includes(route.name);
        })
        .map((route, index) => {
          const { options } = descriptors[route.key]!;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              key={index}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className=" flex flex-col items-center justify-center flex-1"
            >
              {options.tabBarIcon && (
                <options.tabBarIcon focused={isFocused} color="" size={200} />
              )}
              <Text className="text-slate-900 text-sm font-bold capitalize">
                {label as string}
              </Text>
            </PlatformPressable>
          );
        })}
    </View>
  );
}
