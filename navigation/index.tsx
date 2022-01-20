/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { ColorSchemeName, TouchableHighlight } from "react-native";

import Colors from "../constants/Colors";
import ModalScreen from "../screens/ModalScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import BracketScreen from "../screens/BracketScreen";
import AccountScreen from "../screens/AccountScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import AppContext from "../components/AppContext";
import { AuthUserContext } from "../contexts/AuthContext";
import CreateTournamentScreen from "../screens/TournamentCreation/CreateTournamentScreen";
import HomeScreen from "../screens/HomeScreen";
import TournamentDetailsScreen from "../screens/TournamentDetails";
import SearchTournamentScreen from "../screens/TournamentDiscovery/SearchTournamentScreen";
import { TouchableOpacity, Text } from "../components/Themed";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator>
        <Stack.Screen name="Root" component={RootNavigator} />
        <Stack.Screen name="SearchAndJoinStack" component={SearchAndJoinStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const userContext = useContext(AppContext);
  const { user, username } = useContext(AuthUserContext);
  const colorScheme = userContext.scheme;
  if (!user || !username) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "OH CHRIST!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="CreateTournament"
          component={CreateTournamentScreen}
          options={{
            title: "New Tournament",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function SearchAndJoinStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchTournament"
        component={SearchTournamentScreen}
        options={({ navigation }) => ({
          title: "Join Tournament",
          headerLeft: () => (
            <TouchableHighlight
              onPress={() => navigation.goBack()}
            >
              <Text>Cancel</Text>
            </TouchableHighlight>
          ),
        })}
      />
      <Stack.Screen
        name="TournamentDetails"
        component={TournamentDetailsScreen}
        options={{
          title: "Join Tournament",
        }}
      />
    </Stack.Navigator>
  )
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TournamentDetails"
        component={TournamentDetailsScreen}
        options={{
          title: "Tournament",
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const userContext = useContext(AppContext);
  const colorScheme = userContext.scheme;
  return (
    <BottomTab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Brackets"
        component={BracketScreen}
        options={({ navigation }: RootTabScreenProps<"Brackets">) => ({
          title: "Brackets",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="rocket-launch" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountScreen}
        options={({ navigation }) => ({
          headerShown: false,
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="account-outline" color={color} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />
  );
}
