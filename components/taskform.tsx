import { Formik, FormikState } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Axios from "axios";
import * as yup from "yup";
import moment from "moment";
import { Button } from "react-native-paper";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { StackNavigationProp } from "@react-navigation/stack";
import DateTimePicker from "@react-native-community/datetimepicker";

import { GoogleDetails } from "../constants/GoogleDetails";
import { Colors } from "../constants/Colors";

interface PropsType {
  navigation: StackNavigationProp<any, any>;
  initialTitle: string;
  initialDescription: string;
  initialDate: Date;
  userId: string;
  taskId: string;
}

interface ValuesType {
  title: string;
  description: string;
  date: Date;
}

const taskSchema = yup.object().shape({
  title: yup.string().required("Required").max(20),
  description: yup.string().required("Required"),
});

const Taskform = (props: PropsType) => {
  const {
    navigation,
    initialTitle,
    initialDescription,
    initialDate,
    userId,
    taskId,
  } = props;

  const [date, setDate] = useState(initialDate);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const submitToFirebase = async (
    values: ValuesType,
    resetForm: (
      nextState?: Partial<FormikState<ValuesType>> | undefined
    ) => void
  ) => {
    try {
      navigation.navigate("Home", { reload: true });
      values.date = date;
      if (taskId === "") {
        await Axios.post(
          GoogleDetails.firebaseStorage +
            `/userId/${userId}/tasks/${taskId}.json`,
          values
        );
      } else {
        await Axios.patch(
          GoogleDetails.firebaseStorage +
            `/userId/${userId}/tasks/${taskId}.json`,
          values
        );
      }
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={{
        title: initialTitle,
        description: initialDescription,
        date: date,
      }}
      validationSchema={taskSchema}
      onSubmit={(values, { resetForm }) => submitToFirebase(values, resetForm)}
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
                  tintColor={Colors.primary}
                  maxLength={20}
                  characterRestriction={20}
                  animationDuration={175}
                  error={touched.title ? errors.title : undefined}
                />
                <View style={{ height: 20 }}></View>
                <OutlinedTextField
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  label="Description"
                  multiline={true}
                  tintColor={Colors.primary}
                  animationDuration={175}
                  error={touched.description ? errors.description : undefined}
                />
                <View style={{ height: 20 }}></View>
                <TouchableOpacity
                  style={styles.datePickerTouchable}
                  onPress={() => {
                    setIsPickerVisible(!isPickerVisible);
                  }}
                  activeOpacity={0.5}
                >
                  <View style={styles.datePickerTouchableContainer}>
                    <Text style={styles.datePickerTouchableHeader}>
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
                  color={Colors.primary}
                  style={styles.submitButton}
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
};

const styles = StyleSheet.create({
  datePickerTouchable: {
    borderColor: "#979897",
    borderWidth: 1,
    borderRadius: 5,
  },
  datePickerTouchableContainer: { height: 56, justifyContent: "center" },
  datePickerTouchableHeader: {
    position: "absolute",
    left: 6,
    top: -10,
    color: "#979897",
    backgroundColor: Colors.background,
    fontSize: 12.5,
    paddingHorizontal: 4,
  },
  submitButton: {
    alignSelf: "stretch",
    margin: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});

export default Taskform;
