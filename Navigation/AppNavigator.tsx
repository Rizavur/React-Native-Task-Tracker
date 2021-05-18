import React from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AddScreen from "../screens/AddTaskScreen";
import SignInScreen from "../screens/SignInScreen";
import EditScreen from "../screens/EditScreen";
import Toast from "react-native-tiny-toast";

const Stack = createStackNavigator();

interface paramsType {
  reload: boolean;
  user: {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photoURL: string;
  };
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{ title: "Log In", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route: { params } }) => ({
            title: "My Tasks",
            headerRight: () => {
              return (
                <Ionicons
                  name="add"
                  type="material"
                  style={{ fontSize: 30, paddingRight: 20 }}
                  onPress={() => {
                    let userId = "";
                    if (params !== undefined) {
                      userId = (params as paramsType).user.id;
                    }

                    navigation.navigate("Add", { userId });
                  }}
                />
              );
            },
            headerLeft: () => {
              return (
                <SimpleLineIcons
                  name="logout"
                  type="material"
                  style={{ fontSize: 20, paddingLeft: 20 }}
                  onPress={() => {
                    navigation.navigate("Sign In");
                    Toast.show("Log out successful");
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "New Task" }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ title: "Edit Task" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
