import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import CreateAnnouncementScreen from "../screens/CreateAnnouncementScreen";
import HomeScreen from "../screens/HomeScreen";
import IssuesListScreen from "../screens/IssuesListScreen";
import LoginScreen from "../screens/LoginScreen";
import RaiseIssueScreen from "../screens/RaiseIssueScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ user, setUser }: any) {
  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
          initialParams={{ setUser }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
            initialParams={{ ...user, setUser }}
          />
          <Stack.Screen name="Issues" component={IssuesListScreen} />
          <Stack.Screen name="RaiseIssue" component={RaiseIssueScreen} />
          <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
          <Stack.Screen
            name="CreateAnnouncement"
            component={CreateAnnouncementScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
