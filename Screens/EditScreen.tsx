import { Form, Formik } from "formik";
import React from "react";
import { Button } from "react-native";
import { TextInput } from "react-native";
import { View, Text } from "react-native";
import Axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function EditScreen({ route, navigation }: Props) {
  return (
    <Formik
      initialValues={{
        title: route.params.title,
        description: route.params.description,
      }}
      onSubmit={async (values, { resetForm }) => {
        if (values.title !== "" && values.description !== "") {
          try {
            navigation.navigate("Home");
            await Axios.patch(
              `https://tasktrackerapi.herokuapp.com/tasks/${route.params.id}`,
              values
            );
            resetForm();
          } catch (error) {
            console.log(error);
          }
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              margin: 10,
            }}
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
            value={values.title}
            placeholder="Title"
          />
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              margin: 10,
            }}
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
            value={values.description}
            placeholder="Description"
          />
          <Button
            onPress={() => {
              handleSubmit();
            }}
            title="Finish editing"
          />
        </View>
      )}
    </Formik>
  );
}

export default EditScreen;
