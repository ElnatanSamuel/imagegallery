import { Text, TextProps } from "react-native";

export function ThemedText(props: TextProps) {
  const { style, ...otherProps } = props;

  return <Text style={[style]} {...otherProps} />;
}
