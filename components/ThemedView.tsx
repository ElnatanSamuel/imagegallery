import { View, ViewProps } from "react-native";

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;

  return <View style={[style]} {...otherProps} />;
}
