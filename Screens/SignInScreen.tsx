import React from "react";
import { View, Text } from "react-native";
import styles from "../stylesheets/Global";
import * as Google from "expo-google-app-auth";
import { Button } from "react-native-paper";
import Axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import Toast from "react-native-tiny-toast";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

function SignInScreen({ navigation }: Props) {
  const signInAsync = async () => {
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId:
          "27987693251-t45ivrv4tjgb8h0ifs1cum36ejqjlfi8.apps.googleusercontent.com",
        androidClientId:
          "27987693251-ehjmgsr13b6o5vjllvo9vufk1gcempi4.apps.googleusercontent.com",
      });

      createUserIfNotExists(user);

      if (type === "success") {
        navigation.navigate("Home", { user });
        Toast.show("Log in successful");
      }
    } catch (error) {
      console.log("Error with login", error);
    }
  };

  const createUserIfNotExists = async (user: object) => {
    const uid = user.id;

    try {
      const response = await Axios.get(
        `https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users/${uid}.json`
      );

      if (response.statusText === null) {
        await Axios.put(
          "https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users.json",
          { uid }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ ...styles.container, flex: 4 }}>
        <FontAwesome5 name="angellist" size={150} color="black" />
        <Text style={{ fontSize: 35, marginTop: 30 }}>Welcome</Text>
        <Text style={{ fontSize: 17, marginTop: 15 }}>
          Log in to start using Task Tracker
        </Text>
      </View>
      <View style={{ ...styles.container, flex: 2, marginBottom: 20 }}>
        <Button
          icon="google"
          mode="contained"
          onPress={signInAsync}
          color="#ff7663"
          labelStyle={{ fontSize: 17 }}
        >
          Log In With Google
        </Button>
      </View>
    </View>
  );
}

export default SignInScreen;
