import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CreateAdScreen from "./screens/CreateAdScreen";
import HomeScreen from "./screens/ListitemScreen";
import AccountScreen from "./screens/AccountScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { NavigationContainer, DefaultTheme as DefaultThemeNav } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Feather from "react-native-vector-icons/Feather";

import "react-native-gesture-handler";

import auth from "@react-native-firebase/auth";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "green",
    accent: "#f1c40f",
  },
};

const NavTheme = {
  ...DefaultThemeNav,
  colors: {
    ...DefaultThemeNav.colors,
    background: 'white',
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUP"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "create") {
            iconName = "plus-circle";
          } else if (route.name === "Account") {
            iconName = "user";
          }

          // You can return any component that you like here!
          return <Feather name={iconName} size={35} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "green",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="create" component={CreateAdScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
 const unsubscribe = auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser("");
      }
    });
    return unsubscribe
  }, []);

  return (
    <NavigationContainer theme={NavTheme}>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
