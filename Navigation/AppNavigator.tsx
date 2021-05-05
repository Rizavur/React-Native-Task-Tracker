import React from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../Screens/HomeScreen";
import AddScreen from "../Screens/AddTaskScreen";
import SignInScreen from "../Screens/SignInScreen";
import EditScreen from "../Screens/EditScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "My Tasks",
            headerRight: () => {
              return (
                <Ionicons
                  name="add"
                  type="material"
                  style={{ fontSize: 30, paddingRight: 20 }}
                  onPress={() => {
                    navigation.navigate("Add");
                  }}
                />
              );
            },
            // headerLeft: () => {
            //   return (
            //     <SimpleLineIcons
            //       name="logout"
            //       type="material"
            //       style={{ fontSize: 20, paddingLeft: 20 }}
            //       onPress={() => {
            //         navigation.navigate("Sign In");
            //       }}
            //     />
            //   );
            // },
          })}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "Add" }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ title: "Edit" }}
        />
        {/* <Stack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{ title: "Sign In", headerLeft: () => null }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
