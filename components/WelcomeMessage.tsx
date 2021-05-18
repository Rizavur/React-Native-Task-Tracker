import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface WelcomeMessageType {
  username: string;
  liveDate: string;
}

const WelcomeMessage = ({ username, liveDate }: WelcomeMessageType) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.greetUsername}>Hi, {username}</Text>
      <Text style={styles.displayDateTime}>It's {liveDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f2f1",
    padding: 20,
  },
  greetUsername: {
    fontSize: 20,
  },
  displayDateTime: {
    paddingTop: 10,
  },
});

export default WelcomeMessage;
