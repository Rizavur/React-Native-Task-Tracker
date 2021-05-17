import { Formik } from "formik";
import React from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import Axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Taskform from "../components/taskform";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

type RouteParams = {
  title: String;
  description: String;
  tid: String;
  uid: String;
};

function EditScreen({ route, navigation }: Props) {
  const { title, description, tid, uid }: RouteParams = route.params;

  return (
    <Taskform
      navigation={navigation}
      initialTitle={title}
      initialDescription={description}
      uid={uid}
      tid={tid}
    />
  );
}

export default EditScreen;
