import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { getHeaderTitle } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: (props) => {
            const title = getHeaderTitle(props.options, "Ekam");
            return (
              <SafeAreaView className="px-4 bg-slate-100 py-2 flex flex-row items-center justify-center">
                <View className="flex flex-row items-center flex-1 justify-center">
                  <Ionicons
                    name="reorder-three-outline"
                    size={40}
                    color="black"
                    onPress={() => props.navigation.toggleDrawer()}
                    style={{ position: "absolute", left: 0 }}
                  />
                  <Text className="font-bold text-2xl text-slate-900 capitalize">
                    {title}
                  </Text>
                </View>
              </SafeAreaView>
            );
          },
          drawerType: "slide",
          drawerHideStatusBarOnOpen: true,
          drawerStyle: {
            backgroundColor: "#f1f5f9",
            padding: 18,
          },
          drawerActiveTintColor: "#2563eb",
          drawerActiveBackgroundColor: "#dbeafe",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "800",
          },
        }}
      >
        <Drawer.Screen
          name="home" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            title: "Dashboard",
            drawerIcon: ({ focused, color }) => {
              return (
                <Ionicons
                  name="home-outline"
                  size={30}
                  className="pr-2"
                  color={color}
                />
              );
            },
          }}
        />
        <Drawer.Screen
          name="user/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "User",
            title: "Profile",
            drawerIcon: ({ focused, color }) => {
              return (
                <Ionicons
                  name="person-outline"
                  size={30}
                  className="pr-2"
                  color={color}
                />
              );
            },
          }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
