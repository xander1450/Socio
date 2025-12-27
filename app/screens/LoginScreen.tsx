import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { db } from "../services/firebase";

const theme = {
  background: "#121212",
  card: "#1E1E1E",
  primary: "#4F8EF7",
  text: "#FFFFFF",
  muted: "#A0A0A0",
};

export default function LoginScreen({ navigation, route }: any) {
  const setUser = route?.params?.setUser;
  const [role, setRole] = useState<"admin" | "resident" | null>(null);
  const [phone, setPhone] = useState("");


  const login = async () => {
  if (phone.length < 10) {
    alert("Enter valid phone number");
    return;
  }

  try {
    const userId = phone; // simple & deterministic

    await setDoc(
      doc(db, "users", userId),
      {
        phone,
        role,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    
    const userData = { phone, role };

await AsyncStorage.setItem(
  "user",
  JSON.stringify(userData)
);

setUser(userData); 

navigation.replace("Home", { phone, role });
    
  } catch (e) {
    alert("Failed to login");
  }
};


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 32,
          fontWeight: "600",
          marginBottom: 32,
        }}
      >
        Socio
      </Text>

      {!role && (
        <>
          <Pressable
            onPress={() => setRole("resident")}
            style={{
              backgroundColor: theme.card,
              padding: 16,
              borderRadius: 14,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.text }}>I am a Resident</Text>
          </Pressable>

          <Pressable
            onPress={() => setRole("admin")}
            style={{
              backgroundColor: theme.card,
              padding: 16,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: theme.text }}>
              I am an Admin / Caretaker
            </Text>
          </Pressable>
        </>
      )}

      {role && (
        <>
          <TextInput
            placeholder="Phone number"
            placeholderTextColor={theme.muted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={{
              backgroundColor: theme.card,
              color: theme.text,
              padding: 14,
              borderRadius: 12,
              marginTop: 20,
            }}
          />

          <Pressable
            onPress={login}
            style={{
              backgroundColor: theme.primary,
              padding: 16,
              borderRadius: 14,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Continue
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
