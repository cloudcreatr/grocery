import { BlurView } from "expo-blur";
import {
  Modal as RNModal,
  type ModalBaseProps,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";

type ModalProp = {
  withInput?: boolean;
  children: React.ReactNode;
} & ModalBaseProps;

export function Modal({ children, withInput, ...rest }: ModalProp) {
  return (
    <RNModal {...rest} animationType="fade" transparent statusBarTranslucent>
      {withInput ? (
        <BlurView
          intensity={20}
          tint="systemMaterialDark"
          experimentalBlurMethod="dimezisBlurView"
          className="flex-1 px-3 justify-center items-center "
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="justify-center items-center w-full"
          >
            {children}
          </KeyboardAvoidingView>
        </BlurView>
      ) : (
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          className="flex-1  justify-center items-center px-3"
        >
          {children}
        </BlurView>
      )}
    </RNModal>
  );
}
