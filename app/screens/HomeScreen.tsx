import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text } from "react-native";
import AppButton from "../components/AppButton";
const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
};


export default function HomeScreen({ navigation, route }: any) {
  const phone = route?.params?.phone ?? "";
  const role = route?.params?.role ?? "resident";
  const setUser = route?.params?.setUser;

  return (
    <ScrollView
  style={{ flex: 1, backgroundColor: theme.background }}
  contentContainerStyle={{ padding: 20 }}
  keyboardShouldPersistTaps="handled"
    >
      <Text style={{ color: theme.text, marginBottom: 20 }}>
        Logged in as {role.toUpperCase()}
      </Text>

      <AppButton
  label="Raise Issue"
  onPress={() =>
    navigation.navigate("RaiseIssue", { phone, role })
  }
/>

<AppButton
  label="View Issues"
  onPress={() =>
    navigation.navigate("Issues", { phone, role })
  }
/>

<AppButton
  label="Announcements"
  onPress={() =>
    navigation.navigate("Announcements", { role })
  }
/>

<AppButton
  label="Logout"
  danger
  onPress={async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  }}
/>

    </ScrollView>
  );
}
