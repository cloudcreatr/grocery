import { Text, View } from "react-native";
import { ImageComponent } from "./image";
import { ButtonComponent, TextComponent } from "./rn";
import type React from "react";

export function ProductCard({
  name,
  src,
  price,
  action,
}: {
  name: string | null;
  src: string | null;
  price: number | null;
  action?: {
    onPress: () => void;
    title: string;
    isLoading?: boolean;
  };
}) {
  return (
    // Added margin for spacing between cards in columns
    // Removed fixed height proportions, let content define height
    // Added padding inside the card
    <View className=" bg-white overflow-hidden m-2 mb-3 border-gray-200 rounded-xl ">
      {src ? (
        // Use aspect-square for a consistent image shape, removed w-full and h-2/3
        <ImageComponent
          src={src}
          className="aspect-auto  h-60  overflow-hidden"
        />
      ) : (
        // Placeholder styling
        <View className="aspect-auto h-60 bg-blue-100 flex items-center   justify-center ">
          <Text className="text-blue-500">No image</Text>
        </View>
      )}
      {/* Added some margin top for spacing */}
      <View className="p-2 pb-4">
        <TextComponent className="  font-bold text-lg text-wrap">
          {name ? name : "No product name"}
        </TextComponent>
        <TextComponent className="text-blue-500 font-semibold">
          {price ? `Rs ${price.toFixed(2)}` : "No product price"}
        </TextComponent>
      </View>
      {action && (
        <View className="p-2">
          <ButtonComponent
            onPress={action.onPress}
            isLoading={action.isLoading}
            textClassName="text-lg"
            className="rounded-lg"
          >
            {action.title}
          </ButtonComponent>
        </View>
      )}
    </View>
  );
}
