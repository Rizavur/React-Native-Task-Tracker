import React from "react";
import { useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import styles from "../stylesheets/Global";
import Axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { Grid } from "react-native-animated-spinkit";
import { BackHandler } from "react-native";
import { RefreshControl } from "react-native";
import moment from "moment";

type Props = {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
};

function HomeScreen({ route, navigation }: Props) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [liveDate, setLiveDate] = useState(
    moment().format("dddd").toString() +
      ", " +
      moment().format("MMMM Do YYYY, h:mm:ss a").toString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(
        moment().format("dddd").toString() +
          ", " +
          moment().format("MMMM Do YYYY, h:mm:ss a").toString()
      );
    }, 60);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const wait = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  let uid = "";
  let username = "";

  if (route.params !== undefined) {
    uid = route.params.user.id;
    username = route.params.user.name;
  }

  const convertData = (data: Object) => {
    let convertedData: {
      tid: string;
      description: string;
      title: string;
      date: Date;
    }[] = [];
    Object.entries(data).forEach(([key, value]) =>
      convertedData.push({
        tid: key,
        description: value["description"],
        title: value["title"],
        date: new Date(value["date"]),
      })
    );
    setData(convertedData);
  };

  const getData = async () => {
    refresh ? null : setLoading(true);
    try {
      const response = await Axios.get(
        `https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users/uid/${uid}/tasks.json`
      );

      if (response.data === null) {
        setData([]);
      } else {
        convertData(response.data);
      }
    } catch (e) {
      console.log("Error occurred");
    }
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
          try {
            await Axios.delete(
              `https://rn-task-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/users/uid/${uid}/tasks/${tid}.json`
            );
            getData();
            setRefresh(!refresh);
          } catch (error) {
            console.log(`Deletion error: ${error}`);
          }
        },
      },
    ]);
  };

  const handleEdit = (
    tid: string,
    title: string,
    description: string,
    date: Date
  ) => {
    navigation.navigate("Edit", {
      tid: tid,
      title: title,
      description: description,
      uid: uid,
      date: date,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  function WelcomeMessage() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f1f2f1",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20 }}>Hi, {username}</Text>
        <Text style={{ paddingTop: 10 }}>It's {liveDate}</Text>
      </View>
    );
  }

  function ShowLoadingSpinner() {
    return (
      <View style={styles.container}>
        <Grid size={48} color="#003e7d" />
      </View>
    );
  }

  function ShowEmptyData() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <WelcomeMessage username={username} />
        <View style={styles.container}>
          <Text style={{ fontSize: 16 }}>
            It seems you don't have any tasks.
          </Text>
          <Text style={{ fontSize: 16 }}>
            Click on the "+" button to add a new task.
          </Text>
        </View>
      </ScrollView>
    );
  }

  function ShowListData() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          extraData={refresh}
          keyExtractor={(item) => item.tid}
          ListHeaderComponent={() => <WelcomeMessage username={username} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  handleEdit(item.tid, item.title, item.description, item.date)
                }
                activeOpacity={0.7}
              >
                <View>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                    <Entypo
                      name="circle-with-cross"
                      size={24}
                      color="#cfcfcf"
                      onPress={() => handleDelete(item.tid)}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "#cfcfcf",
                      padding: 10,
                      borderRadius: 5,
                      marginHorizontal: -10,
                      marginBottom: -10,
                    }}
                  >
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginTop: 20,
                      marginBottom: -10,
                    }}
                  >
                    <Text style={customStyles.date}>
                      By {moment(item.date).format("Do MMM YYYY").toString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ShowLoadingSpinner />
      ) : !data.length ? (
        <ShowEmptyData />
      ) : (
        <ShowListData />
      )}
    </View>
  );
}

const customStyles = StyleSheet.create({
  date: {
    flex: 1,
    color: "white",
    textAlign: "right",
    // backgroundColor: "white",
  },
});

export default HomeScreen;
