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
  const { title, description, tid, uid } = route.params;

  return (
    <Formik
      initialValues={{
        title: title,
        description: description,
      }}
      onSubmit={async (values, { resetForm }) => {
        if (values.title !== "" && values.description !== "") {
          try {
            navigation.navigate("Home", { reload: true });
            await Axios.patch(
              `https://tasktrackerapi.herokuapp.com/users/${uid}/tasks/${tid}`,
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
