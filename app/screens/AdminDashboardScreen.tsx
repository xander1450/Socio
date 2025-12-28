import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { db } from "../services/firebase";

const theme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  muted: "#A0A0A0",
};

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "issues"), snap => {
      const data = snap.docs.map(d => d.data());

      setStats({
        total: data.length,
        open: data.filter(i => i.status === "open").length,
        in_progress: data.filter(i => i.status === "in_progress").length,
        resolved: data.filter(i => i.status === "resolved").length,
      });
    });

    return () => unsub();
  }, []);

  const StatCard = ({ label, value }: any) => (
    <View
      style={{
        backgroundColor: theme.card,
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: theme.muted }}>{label}</Text>
      <Text
        style={{
          color: theme.text,
          fontSize: 28,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );

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
        Admin Dashboard
      </Text>

      <StatCard label="Total Issues" value={stats.total} />
      <StatCard label="Open Issues" value={stats.open} />
      <StatCard label="In Progress" value={stats.in_progress} />
      <StatCard label="Resolved Issues" value={stats.resolved} />
    </View>
  );
}
