import { ViewComponent } from "@pkg/ui";
import { ScrollView } from "react-native";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewComponent className="flex-1">
      <ScrollView>
        {children}
      </ScrollView>
    </ViewComponent>
  );
}