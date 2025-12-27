import { Pressable, Text } from "react-native";

export default function AppButton({
  label,
  onPress,
  danger = false,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: danger ? "#E57373" : "#1E1E1E",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          color: "#FFFFFF",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
