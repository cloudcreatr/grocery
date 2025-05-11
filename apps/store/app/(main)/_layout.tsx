import { View, Text } from "react-native";
import { getHeaderTitle } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { MyTabBar } from "@pkg/ui";

export default function Layout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => (
        <MyTabBar
          {...props}
          routeInclude={["home", "products/index", "settings"]}
        />
      )}
      
      screenOptions={{
        header: (props) => {
          const title = getHeaderTitle(props.options, "Ekam");
          return (
            <SafeAreaView className="px-4 bg-slate-100 py-2 flex flex-row items-center justify-center">
              <View className="flex flex-row items-center flex-1 justify-center">
                <Text className="font-bold text-2xl text-slate-900 capitalize">
                  {title}
                </Text>
              </View>
            </SafeAreaView>
          );
        },
      }}
    >
      // ...existing code...
      <Tabs.Screen
        name="home" // This is the name of the page and must match the url from root
        options={{
          tabBarLabel: "Home",
          title: "Dashboard",
          tabBarIcon: ({ focused, color }) => {
            return <Ionicons name="home-outline" size={30} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="products/index" // This is the name of the page and must match the url from root
        options={{
          tabBarLabel: "Products",
          title: "All Products",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons name="storefront-outline" size={30} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings" // This is the name of the page and must match the url from root
        options={{
          tabBarLabel: "Settings",
          title: "Settings",
          tabBarIcon: ({ focused, color }) => {
            return <Ionicons name="cog-outline" size={30} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}

//
