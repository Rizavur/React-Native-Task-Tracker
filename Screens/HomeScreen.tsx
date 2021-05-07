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
import { RouteProp } from "@react-navigation/native";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function HomeScreen({ route, navigation }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const uid = route.params.user.id;

  const getData = async () => {
    setLoading(true);
    const response = await Axios.get(
      `https://tasktrackerapi.herokuapp.com/users/${uid}/tasks`
    );
    console.log(response.data);

    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [route]);

  const handleDelete = (tid: string) => {
    Alert.alert("Delete task?", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await Axios.delete(
            `https://tasktrackerapi.herokuapp.com/users/${uid}/tasks/${tid}`
          );
          getData();
          setRefresh(!refresh);
        },
      },
    ]);
  };

  const handleEdit = (tid: string, title: string, description: string) => {
    navigation.navigate("Edit", {
      tid: tid,
      title: title,
      description: description,
      uid: uid,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          data={data}
          extraData={refresh}
          keyExtractor={(item) => item.tid}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  handleEdit(item.tid, item.title, item.description)
                }
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
                    onPress={() => handleDelete(item.tid)}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

export default HomeScreen;
