import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ImagePlaceholderProps {
  index: number;
}

export function ImagePlaceholder({ index }: ImagePlaceholderProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="p-1 aspect-square">
      <Animated.View
        style={animatedStyle}
        className="w-full h-full bg-gray-800 rounded-xl"
      />
    </View>
  );
}
