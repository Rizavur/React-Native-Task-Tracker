import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Google from "expo-google-app-auth";
import { GoogleUser } from "expo-google-app-auth";
import Axios from "axios";
import Toast from "react-native-tiny-toast";
import { Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

import { Colors } from "../constants/Colors";
import { GoogleDetails } from "../constants/GoogleDetails";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

function SignInScreen({ navigation }: Props) {
  const signInAsync = async () => {
    try {
      const loginResult = await Google.logInAsync({
        iosClientId: GoogleDetails.iosClientId,
        androidClientId: GoogleDetails.androidClientId,
      });

      if (loginResult.type === "success") {
        const user: GoogleUser | undefined = loginResult?.user;
        verifyUserInDB(user);
        navigation.navigate("Home", { user });
        Toast.show("Log in successful");
      }
    } catch (error) {
      console.log("Error with login", error);
    }
  };

  const verifyUserInDB = async (user: GoogleUser | undefined) => {
    if (user === undefined) {
      console.log("No user found");
    }

    const userId = user!.id;

    try {
      const response = await Axios.get(
        GoogleDetails.firebaseStorage + `/${userId}.json`
      );

      // If new user, create instance in database
      if (response.statusText === null) {
        await Axios.put(GoogleDetails.firebaseStorage + ".json", {
          userId: userId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.greetingContainer}>
        <FontAwesome5 name="angellist" size={150} color="black" />
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.welcomeInfo}>
          Log in to start using Task Tracker
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          icon="google"
          mode="contained"
          onPress={signInAsync}
          color={Colors.google}
          labelStyle={{ fontSize: 17 }}
        >
          Log In With Google
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 35,
    marginTop: 30,
  },
  welcomeInfo: {
    fontSize: 17,
    marginTop: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingContainer: {
    flex: 4,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 2,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default SignInScreen;
