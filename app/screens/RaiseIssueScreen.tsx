
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

export default function RaiseIssueScreen({ navigation, route }: any) {
  const { phone, role } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitIssue = async () => {
    if (!title.trim()) {
      alert("Enter issue title");
      return;
    }

    try {
      await addDoc(collection(db, "issues"), {
        title,
        description,
        category: "general",
        status: "open",
        createdBy: phone,
        createdByRole: role,
        createdAt: serverTimestamp(),
      });

      alert("Issue raised successfully");
      navigation.goBack();
    } catch (e) {
      alert("Failed to raise issue");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 22,
          marginBottom: 20,
        }}
      >
        Raise Issue
      </Text>

      <TextInput
        placeholder="Issue title"
        placeholderTextColor={theme.muted}
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: theme.card,
          color: theme.text,
          padding: 14,
          borderRadius: 12,
          marginBottom: 16,
        }}
      />

      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor={theme.muted}
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          backgroundColor: theme.card,
          color: theme.text,
          padding: 14,
          borderRadius: 12,
          height: 100,
        }}
      />

      <Pressable
        onPress={submitIssue}
        style={{
          backgroundColor: theme.primary,
          padding: 16,
          borderRadius: 14,
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Submit Issue
        </Text>
      </Pressable>
    </View>
  );
}
