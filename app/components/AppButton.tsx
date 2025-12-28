import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function AppButton({
  label,
  onPress,
  icon,
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={22}
            color="#fff"
            style={{ marginRight: 10 }}
          />
        )}

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
