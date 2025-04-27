import { ViewComponent } from "@pkg/ui";
import ImageComponent from "@pkg/ui/components/image";
import { Image } from "expo-image";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
export default function Login() {
  return (
    <ViewComponent className=" flex flex-1 items-center justify-center">
      <Text>ommmrdd</Text>

      <ImageComponent
        className="w-full h-2/3 aspect-auto rounded-2xl overflow-hidden"
        src="https://media.glamour.com/photos/5d922a0b55231b0008495a15/master/w_2560%2Cc_limit/stranger-things.jpg"
      />
    </ViewComponent>
  );
}
