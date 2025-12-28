import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { ScrollView, Text } from "react-native";
import AppButton from "../components/AppButton";
import { AuthContext } from "../context/AuthContext";
const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
};


export default function HomeScreen({ navigation, route }: any) {
  const phone = route?.params?.phone ?? "";
  const role = route?.params?.role ?? "resident";
  const { setUser } = useContext(AuthContext);


  return (
    <ScrollView
  style={{ flex: 1, backgroundColor: theme.background }}
  contentContainerStyle={{ padding: 20 }}
  keyboardShouldPersistTaps="handled"
    >
      <Text style={{ color: theme.text, marginBottom: 20 }}>
        Logged in as {role.toUpperCase()}
      </Text>
      

    {role === "admin" && (
  <AppButton
    label="Admin Dashboard"
    icon="dashboard"
    onPress={() =>
      navigation.navigate("AdminDashboard")
    }
  />
)}

      <AppButton
  label="Raise Issue"
  icon="report-problem"
  onPress={() =>
    navigation.navigate("RaiseIssue", { phone, role })
  }
/>

<AppButton
  label="View Issues"
  icon="list-alt"
  onPress={() =>
    navigation.navigate("Issues", { phone, role })
  }
/>

<AppButton
  label="Announcements"
  icon="campaign"
  onPress={() =>
    navigation.navigate("Announcements", { role })
  }
/>

<AppButton
  label="Logout"
  icon="logout"
  danger
  onPress={async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  }}
/>


    </ScrollView>
  );
}
