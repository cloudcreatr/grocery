// filepath: /workspaces/grocery/packages/ui/components/image.tsx
import { Image, useImage } from "expo-image";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextComponent } from "./rn";

// Apply cssInterop to the Image component from expo-image
cssInterop(Image, { className: "style" });

// Consider adding accessibilityLabel prop for better accessibility
export default function ImageComponent({
  src,
  className, // Allow passing className to the container View
}: {
  src?: string;
  className?: string; // Make className optional
}) {
  const img = useImage(src ?? "");

  return (
    // Define size and aspect ratio on the container, allow overriding via props
    // Added position relative to allow absolute positioning of the loader
    <View className={className}>
      {src ? (
        img ? (
          <Image
            source={img}
            // Make image fill the container
            className="w-full h-full"
            // Control how the image fits. 'cover' crops, 'contain' letterboxes.
            contentFit="cover"
          />
        ) : (
          <View className="w-full h-full flex items-center justify-center bg-blue-100">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )
      ) : (
        <View className="w-full h-full flex items-center justify-center bg-blue-100">
          <TextComponent className="text-blue-500 font-semibold">
            No image Found
          </TextComponent>
        </View>
      )}
    </View>
  );
}