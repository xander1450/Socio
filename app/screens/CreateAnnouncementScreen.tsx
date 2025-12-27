import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { db } from "../services/firebase";

const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  muted: "#A0A0A0",
  primary: "#4F8EF7",
};

export default function CreateAnnouncementScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "announcements"), {
  title,
  message,
  createdAt: serverTimestamp(),
  createdByRole: "admin",
});

      navigation.goBack();
    } catch {
      alert("Failed to post announcement");
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
        New Announcement
      </Text>

      <TextInput
        placeholder="Title"
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
        placeholder="Message"
        placeholderTextColor={theme.muted}
        value={message}
        onChangeText={setMessage}
        multiline
        style={{
          backgroundColor: theme.card,
          color: theme.text,
          padding: 14,
          borderRadius: 12,
          height: 120,
        }}
      />

      <Pressable
        onPress={submit}
        style={{
          backgroundColor: theme.primary,
          padding: 16,
          borderRadius: 14,
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Publish
        </Text>
      </Pressable>
    </View>
  );
}
