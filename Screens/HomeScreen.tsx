import React from "react";
import { useEffect } from "react";
import {
  FlatList,
  TouchableHighlight as TouchableOpacity,
  View,
  Text,
  Button,
} from "react-native";
import styles from "../StyleSheets/Global";
import Axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

function HomeScreen({ navigation }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([]);
    Axios.get("https://tasktrackerapi.herokuapp.com/tasks")
      .then(({ data }) => {
        setData(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Delete task?", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          Axios.delete(`https://tasktrackerapi.herokuapp.com/tasks/${id}`);
        },
      },
    ]);
  };

  const handleEdit = (id: string, title: string, description: string) => {
    navigation.navigate("Edit", {
      id: id,
      title: title,
      description: description,
    });
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleEdit(item.id, item.title, item.description)}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <Entypo
                name="circle-with-cross"
                size={24}
                color="grey"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default HomeScreen;
