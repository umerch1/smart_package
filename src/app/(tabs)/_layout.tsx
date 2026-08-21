import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

const tabIcons = {
  dashboard: { ios: "square.grid.2x2.fill", android: "grid", web: "grid" },
  subscriptions: {
    ios: "rectangle.stack.fill",
    android: "subscriptions",
    web: "layers",
  },
  history: {
    ios: "clock.arrow.circlepath",
    android: "history",
    web: "history",
  },
  recommendations: {
    ios: "sparkles",
    android: "auto-awesome",
    web: "sparkles",
  },
} as const;

function renderTabIcon(
  name: keyof typeof tabIcons,
  color: string,
  size: number,
) {
  return <SymbolView name={tabIcons[name]} tintColor={color} size={size} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#052653",
        tabBarInactiveTintColor: "#454B57",
        tabBarActiveBackgroundColor: "#6497F6",
        tabBarStyle: {
          height: 96,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DDE1E8",
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          marginHorizontal: 5,
          marginVertical: 5,
          borderRadius: 18,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) =>
            renderTabIcon("dashboard", color, size),
        }}
      />
      <Tabs.Screen
        name="(subscriptions)"
        options={{
          title: "Subscriptions",
          tabBarIcon: ({ color, size }) =>
            renderTabIcon("subscriptions", color, size),
        }}
      />
      <Tabs.Screen
        name="(history)"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) =>
            renderTabIcon("history", color, size),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Recommendations",
          tabBarIcon: ({ color, size }) =>
            renderTabIcon("recommendations", color, size),
        }}
      />
      <Tabs.Screen name="(subscriptions)/add" options={{ href: null }} />
      <Tabs.Screen name="(subscriptions)/edit" options={{ href: null }} />
      <Tabs.Screen name="(history)/payments" options={{ href: null }} />
      <Tabs.Screen name="(history)/subscriptions" options={{ href: null }} />
    </Tabs>
  );
}
