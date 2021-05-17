import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import Taskform from "../components/taskform";
import { RouteProp } from "@react-navigation/native";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function AddScreen({ route, navigation }: Props) {
  const { params } = route;

  return (
    params && (
      <Taskform
        navigation={navigation}
        initialTitle=""
        initialDescription=""
        uid={params.uid}
        tid=""
      />
    )
  );
}

export default AddScreen;
