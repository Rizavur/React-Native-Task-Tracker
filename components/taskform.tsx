import { Formik } from "formik";
import React from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button } from "react-native-paper";
import { OutlinedTextField } from "rn-material-ui-textfield";
import Axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import * as yup from "yup";

type Props = {
  navigation: StackNavigationProp<any, any>;
  initialTitle: String;
  initialDescription: String;
  uid: String;
  tid: String;
};

const taskSchema = yup.object().shape({
  title: yup.string().required("Required").max(20),
  description: yup.string().required("Required"),
});

function Taskform({
  navigation,
  initialTitle,
  initialDescription,
  uid,
  tid,
}: Props) {
  return (
    <Formik
      initialValues={{ title: initialTitle, description: initialDescription }}
      validationSchema={taskSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          navigation.navigate("Home", { reload: true });
          if (tid === "") {
            await Axios.post(
              `https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users/uid/${uid}/tasks/${tid}.json`,
              values
            );
          } else {
            await Axios.patch(
              `https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users/uid/${uid}/tasks/${tid}.json`,
              values
            );
          }

          resetForm();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={{ marginHorizontal: 20 }}>
              <View style={{ height: 20 }}></View>
              <OutlinedTextField
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                label="Title"
                tintColor="#003e7d"
                maxLength={20}
                characterRestriction={20}
                animationDuration={175}
                error={touched.title && errors.title}
              />
              <View style={{ height: 20 }}></View>
              <OutlinedTextField
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                label="Description"
                multiline={true}
                tintColor="#003e7d"
                animationDuration={175}
                error={touched.description && errors.description}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                mode="contained"
                color="#003e7d"
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                }}
              >
                Submit
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
}

export default Taskform;
