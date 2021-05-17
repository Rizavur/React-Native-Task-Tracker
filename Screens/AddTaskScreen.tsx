import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import Taskform from "../components/taskform";
import { RouteProp } from "@react-navigation/native";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function AddScreen({ route, navigation }: Props) {
  const { uid } = route.params;

  return (
    <Taskform
      navigation={navigation}
      initialTitle=""
      initialDescription=""
      uid={uid}
      tid=""
    />
  );
}

export default AddScreen;
