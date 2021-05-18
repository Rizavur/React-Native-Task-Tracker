import { Formik } from "formik";
import React from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import Axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Taskform from "../components/Taskform";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function EditScreen({ route, navigation }: Props) {
  const { params } = route;

  return (
    params && (
      <Taskform
        navigation={navigation}
        initialTitle={params.title}
        initialDescription={params.description}
        uid={params.uid}
        tid={params.tid}
        initialDate={params.date}
      />
    )
  );
}

export default EditScreen;
