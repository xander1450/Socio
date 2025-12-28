import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "./app/context/AuthContext";
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <AppNavigator user={user} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}