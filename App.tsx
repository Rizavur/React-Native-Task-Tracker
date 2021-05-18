import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  return <AppNavigator />;
}
