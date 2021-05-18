import { Formik } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { OutlinedTextField } from "rn-material-ui-textfield";
import Axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

type Props = {
  navigation: StackNavigationProp<any, any>;
  initialTitle: String;
  initialDescription: String;
  initialDate: Date;
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
  initialDate,
  uid,
  tid,
}: Props) {
  const [date, setDate] = useState(initialDate);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  return (
    <Formik
      initialValues={{
        title: initialTitle,
        description: initialDescription,
      }}
      validationSchema={taskSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          navigation.navigate("Home", { reload: true });
          values.date = date;
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={{ marginHorizontal: 20 }}>
                <View style={{ height: 30 }}></View>
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
                <View style={{ height: 20 }}></View>
                <TouchableOpacity
                  style={{
                    borderColor: "#979897",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setIsPickerVisible(!isPickerVisible);
                  }}
                  activeOpacity={0.5}
                >
                  <View style={{ height: 56, justifyContent: "center" }}>
                    <Text
                      style={{
                        position: "absolute",
                        left: 6,
                        top: -10,
                        color: "#979897",
                        backgroundColor: "#f1f2f1",
                        fontSize: 12.5,
                        paddingHorizontal: 4,
                      }}
                    >
                      Deadline
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 10,
                        fontSize: 15.5,
                      }}
                    >
                      {moment(date).format("Do MMM YYYY").toString()}
                    </Text>
                  </View>
                </TouchableOpacity>
                {isPickerVisible && (
                  <DateTimePicker
                    display={Platform.OS == "android" ? "default" : "inline"}
                    testID="dateTimePicker"
                    value={date}
                    mode={"date"}
                    onChange={(event, thisDate) => {
                      thisDate && setDate(thisDate);
                      setIsPickerVisible(false);
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  onPress={() => {
                    handleSubmit();
                  }}
                  mode="contained"
                  color="#003e7d"
                  style={{
                    alignSelf: "stretch",
                    margin: 20,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}
                >
                  Submit
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

export default Taskform;
