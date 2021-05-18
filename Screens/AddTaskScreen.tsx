import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";

import Taskform from "../components/Taskform";
import { Colors } from "../constants/Colors";

interface PropsType {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
}

const AddScreen = ({ route, navigation }: PropsType) => {
  const { params } = route;

  return params ? (
    <Taskform
      navigation={navigation}
      initialTitle=""
      initialDescription=""
      userId={params.userId}
      taskId=""
      initialDate={moment().toDate()}
    />
  ) : (
    <View style={styles.errorMessageContainer}>
      <Text>Oops, seems like something went wrong</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessageContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddScreen;
