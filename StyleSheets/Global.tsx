import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f1",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flex: 1,
    backgroundColor: "#003e7d",
    borderColor: "#cfcfcf",
    borderWidth: 2,
    padding: 20,
    margin: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 23,
    paddingBottom: 10,
    color: "white",
  },
  itemDesc: {
    fontSize: 16,
  },
});

export default styles;
