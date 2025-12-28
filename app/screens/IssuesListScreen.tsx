import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { db } from "../services/firebase";

const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  muted: "#A0A0A0",
};

const STATUS_COLORS: Record<
  "open" | "in_progress" | "resolved",
  string
> = {
  open: "#E57373",
  in_progress: "#FFB74D",
  resolved: "#81C784",
};

const STATUS_OPTIONS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function IssuesListScreen({ route }: any) {
  const role = route?.params?.role ?? "resident";
  const phone = route?.params?.phone ?? "";

  const [issues, setIssues] = useState<any[]>([]);
  const [activeDropdownId, setActiveDropdownId] =
    useState<string | null>(null);
  const [showMyIssues, setShowMyIssues] = useState(
    role !== "admin"
  );

  /* ---------------- FETCH ISSUES ---------------- */
  useEffect(() => {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
      setIssues(data);
    });

    return () => unsub();
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "issues", id), { status });
      setActiveDropdownId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredIssues = showMyIssues
    ? issues.filter(i => i.createdBy === phone)
    : issues;

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: theme.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          color: theme.text,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
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
      <Text
        style={{
          color: theme.muted,
          marginTop: 6,
          fontSize: 12,
        }}
      >
        Raised by: {item.createdBy}
      </Text>

      {/* STATUS */}
      {role === "admin" ? (
        <View style={{ marginTop: 10 }}>
          {/* CLICKABLE STATUS BADGE */}
          <Pressable
            onPress={() =>
              setActiveDropdownId(
                activeDropdownId === item.id
                  ? null
                  : item.id
              )
            }
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor:
                STATUS_COLORS[
                  item.status as keyof typeof STATUS_COLORS
                ],
            }}
          >
            <MaterialIcons
              name={
                item.status === "open"
                  ? "error-outline"
                  : item.status === "in_progress"
                  ? "autorenew"
                  : "check-circle-outline"
              }
              size={16}
              color="#000"
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: "#000",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {item.status.replace("_", " ").toUpperCase()} ▼
            </Text>
          </Pressable>

          {/* DROPDOWN */}
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
                <Pressable
                  key={opt.key}
                  onPress={() =>
                    updateStatus(item.id, opt.key)
                  }
                  style={{
                    padding: 12,
                    borderBottomWidth:
                      opt.key !== "resolved" ? 1 : 0,
                    borderBottomColor: "#333",
                  }}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 14,
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
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
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
            backgroundColor:
              STATUS_COLORS[
                item.status as keyof typeof STATUS_COLORS
              ],
          }}
        >
          <MaterialIcons
            name={
              item.status === "open"
                ? "error-outline"
                : item.status === "in_progress"
                ? "autorenew"
                : "check-circle-outline"
            }
            size={14}
            color="#000"
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: "#000",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );

  /* ---------------- SCREEN ---------------- */
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

      {/* ADMIN FILTER */}
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

      <FlatList
        data={filteredIssues}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
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
        }
      />
    </View>
  );
}
