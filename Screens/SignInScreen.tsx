import React from "react";
import { View, Text } from "react-native";
import styles from "../StyleSheets/Global";
import * as Google from "expo-google-app-auth";
import { Button } from "react-native";
import Axios from "axios";

function SignInScreen({ navigation }) {
  let user = null;

  const signInAsync = async () => {
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId:
          "27987693251-t45ivrv4tjgb8h0ifs1cum36ejqjlfi8.apps.googleusercontent.com",
        androidClientId:
          "27987693251-ehjmgsr13b6o5vjllvo9vufk1gcempi4.apps.googleusercontent.com",
      });

      checkExisitingUser(user);

      if (type === "success") {
        navigation.navigate("Home", { user });
      }
    } catch (error) {
      console.log("Error with login", error);
    }
  };

  const checkExisitingUser = async (user) => {
    const uid = user.id;

    try {
      const response = await Axios.get(
        `https://tasktrackerapi.herokuapp.com/users/${uid}/`
      );
      if (response.statusText === undefined) {
        await Axios.post("https://tasktrackerapi.herokuapp.com/users", { uid });
      }
      console.log(response);
    } catch (error) {
      if (error.response.status === 404) {
        await Axios.post("https://tasktrackerapi.herokuapp.com/users", { uid });
      }
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button title="Login with Google" onPress={signInAsync} />
    </View>
  );
}

export default SignInScreen;
