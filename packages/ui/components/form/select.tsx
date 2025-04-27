import type { selectSchema } from "@repo/bg";
import { useFieldContext } from "./util";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { TextComponent } from "../rn";
import { z } from "zod";
import Ionicons from "@expo/vector-icons/Ionicons";
export function SelectField({
  options,
}: {
  options: {
    id: number;
    name: string;
  }[];
}) {
  const f = useFieldContext<z.infer<typeof selectSchema>>();
  const [isopen, setIsOpen] = useState(false);
  return (
    <View className="flex gap-2">
      <View className="flex-row items-center justify-between p-4 border border-slate-300 rounded-xl bg-white">
        <TextComponent className="text-slate-500">
          {f.state.value === null
            ? "Select category"
            : options.find((o) => o.id === f.state.value)?.name}
        </TextComponent>
        <TouchableOpacity onPress={() => setIsOpen(!isopen)}>
          {isopen ? (
            <Ionicons name="close-circle" size={24} color="gray" />
          ) : (
            <Ionicons name="chevron-expand-outline" size={24} color="gray" />
          )}
        </TouchableOpacity>
      </View>
      {isopen ? (
        options.length > 0 ? (
          options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                f.setValue(option.id);
                setIsOpen(false);
              }}
              className="p-4  rounded-xl bg-white border border-slate-300"
            >
              <TextComponent className="text-slate-500">
                {option.name}
              </TextComponent>
            </TouchableOpacity>
          ))
        ) : (
          <TextComponent className="text-slate-500 font-bold">
            No Option available
          </TextComponent>
        )
      ) : null}
    </View>
  );
}
