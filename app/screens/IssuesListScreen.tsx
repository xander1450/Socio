import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { db } from "../services/firebase";

/* ---------- THEME ---------- */
const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  muted: "#A0A0A0",
};

/* ---------- STATUS COLORS ---------- */
const STATUS_COLORS: Record<
  "open" | "in_progress" | "resolved",
  string
> = {
  open: "#E57373",
  in_progress: "#FFB74D",
  resolved: "#81C784",
};

/* ---------- STATUS OPTIONS ---------- */
const STATUS_OPTIONS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function IssuesListScreen({ route }: any) {
  const role = route?.params?.role;
  const phone = route?.params?.phone;

  const [issues, setIssues] = useState<any[]>([]);
  const [showMyIssues, setShowMyIssues] = useState(
  role !== "admin" // residents default to true
);

  const [activeDropdownId, setActiveDropdownId] =
    useState<string | null>(null);

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "issues", id), {
        status,
      });
      setActiveDropdownId(null); // close dropdown
    } catch {
      alert("Failed to update status");
    }
  };

  /* ---------- FETCH ISSUES ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssues(data);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- RENDER ITEM ---------- */
  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: theme.card,
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 12,
      }}
    >
      {/* TITLE */}
      <Text style={{ color: theme.text, fontSize: 16 }}>
        {item.title}
      </Text>

      {/* DESCRIPTION */}
      {item.description ? (
        <Text
          style={{
            color: theme.muted,
            marginTop: 6,
            fontSize: 14,
          }}
        >
          {item.description}
        </Text>
      ) : null}

      {/* CREATED BY */}
      <Text style={{ color: theme.muted, marginTop: 6 }}>
        Raised by: {item.createdBy}
      </Text>

      {/* STATUS DROPDOWN */}
      {role === "admin" ? (
        <View style={{ marginTop: 10 }}>
          {/* STATUS BADGE */}
          <Text
            onPress={() =>
              setActiveDropdownId(
                activeDropdownId === item.id ? null : item.id
              )
            }
            style={{
              alignSelf: "flex-start",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor:
                STATUS_COLORS[
                  item.status as keyof typeof STATUS_COLORS
                ],
              color: "#000",
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            {item.status.replace("_", " ").toUpperCase()} ▼
          </Text>

          {/* DROPDOWN OPTIONS */}
          {activeDropdownId === item.id && (
            <View
              style={{
                marginTop: 6,
                backgroundColor: theme.card,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {STATUS_OPTIONS.map(opt => (
                <Text
                  key={opt.key}
                  onPress={() =>
                    updateStatus(item.id, opt.key)
                  }
                  style={{
                    padding: 12,
                    color: theme.text,
                    borderBottomWidth:
                      opt.key !== "resolved" ? 1 : 0,
                    borderBottomColor: "#333",
                  }}
                >
                  {opt.label}
                </Text>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* RESIDENT VIEW */
        <View
          style={{
            marginTop: 8,
            alignSelf: "flex-start",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
            backgroundColor:
              STATUS_COLORS[
                item.status as keyof typeof STATUS_COLORS
              ],
          }}
        >
          <Text style={{ color: "#000", fontSize: 12 }}>
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );

  const filteredIssues =
  showMyIssues
    ? issues.filter(i => i.createdBy === phone)
    : issues;

  /* ---------- SCREEN ---------- */
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
        marginBottom: 12,
      }}
    >
      Issues
    </Text>

    {/* 🔹 STEP 5 — ADMIN TOGGLE UI */}
    {role === "admin" && (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 16,
        }}
      >
        <Text
          onPress={() => setShowMyIssues(false)}
          style={{
            color: showMyIssues ? "#888" : "#fff",
            marginRight: 20,
          }}
        >
          All Issues
        </Text>

        <Text
          onPress={() => setShowMyIssues(true)}
          style={{
            color: showMyIssues ? "#fff" : "#888",
          }}
        >
          My Issues
        </Text>
      </View>
    )}

    {/* 🔹 ISSUE LIST */}
    <FlatList
      data={filteredIssues}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListEmptyComponent={() => (
  <Text
    style={{
      color: theme.muted,
      textAlign: "center",
      marginTop: 60,
      fontSize: 16,
    }}
  >
    No issues yet 👌
  </Text>
)}
    />
  </View>
);

}
