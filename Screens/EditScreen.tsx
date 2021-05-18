import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import Taskform from "../components/Taskform";
import { Colors } from "../constants/Colors";

interface PropsType {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
}

interface ParamsType {
  title: string;
  description: string;
  userId: string;
  taskId: string;
  date: Date;
}

const EditScreen = ({ route, navigation }: PropsType) => {
  const params = route.params as ParamsType;

  return params ? (
    <Taskform
      navigation={navigation}
      initialTitle={params.title}
      initialDescription={params.description}
      userId={params.userId}
      taskId={params.taskId}
      initialDate={params.date}
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

export default EditScreen;
