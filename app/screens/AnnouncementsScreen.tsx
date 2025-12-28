import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { db } from "../services/firebase";


const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  muted: "#A0A0A0",
  primary: "#4F8EF7",
};

export default function AnnouncementsScreen({ navigation, route }: any) {
  const role = route?.params?.role ?? "resident";
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: theme.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: theme.text, fontSize: 16 }}>
        {item.title}
      </Text>

      <Text
        style={{
          color: theme.muted,
          marginTop: 6,
          fontSize: 14,
        }}
      >
        {item.message}
      </Text>
    </View>
  );

  return (
    <View
      style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  }}
>
  <MaterialIcons
    name="campaign"
    size={24}
    color="#fff"
    style={{ marginRight: 8 }}
  />
  <Text style={{ color: theme.text, fontSize: 22 }}>
    Announcements
  </Text>

      {role === "admin" && (
        <Pressable
          onPress={() =>
            navigation.navigate("CreateAnnouncement")
          }
          style={{
            backgroundColor: theme.primary,
            padding: 14,
            borderRadius: 12,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            + New Announcement
          </Text>
        </Pressable>
      )}

      <FlatList
        data={announcements}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: theme.muted }}>
            No announcements yet
          </Text>
        }
      />
    </View>
  );
}
