import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { Grid } from "react-native-animated-spinkit";

const ShowLoadingSpinner = () => {
  return (
    <View style={styles.mainContainer}>
      <Grid size={48} color="#003e7d" />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ShowLoadingSpinner;
