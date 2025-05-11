import { SettingsItem, TextComponent, ViewComponent } from "@pkg/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Registration() {
  const r = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ViewComponent className="flex-1 px-6 pt-8 gap-3 ">
        <TextComponent className="text-4xl/10 font-bold pb-4 capitalize ">
          Complete the following steps to Start your Journey
        </TextComponent>
        <SettingsItem
          name="Complete your  Profile"
          icon="person-outline"
          onPress={() => r.push("/(main)/user")}
        />
      </ViewComponent>
    </SafeAreaView>
  );
}
