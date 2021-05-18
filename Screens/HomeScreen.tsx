import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  BackHandler,
} from "react-native";
import Axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import moment from "moment";

import { Colors } from "../constants/Colors";
import { GoogleDetails } from "../constants/GoogleDetails";
import WelcomeMessage from "../components/WelcomeMessage";
import ShowLoadingSpinner from "../components/LoadingSpinner";

interface PropsType {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any, any>;
}

interface TaskDataType {
  taskId: string;
  description: string;
  title: string;
  date: Date;
}

const HomeScreen = ({ route, navigation }: PropsType) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TaskDataType[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [liveDate, setLiveDate] = useState<string>(
    moment().format("dddd").toString() +
      ", " +
      moment().format("MMMM Do YYYY, h:mm:ss a").toString()
  );

  // Update time for every second in greeting at the top
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

  useEffect(() => {
    getData();
  }, [route]);

  // Functions for swipe to refresh
  const wait = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Set userId and username
  let userId = "";
  let username = "";

  if (route.params !== undefined) {
    userId = route.params.user.id;
    username = route.params.user.name;
  }

  // Convert data into array from task item object in firebase
  const convertData = (data: Object) => {
    let convertedData: TaskDataType[] = [];
    Object.entries(data).forEach(([key, value]) =>
      convertedData.push({
        taskId: key,
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
        GoogleDetails.firebaseStorage + `/userId/${userId}/tasks.json`
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

  const handleDelete = (taskId: string) => {
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
              GoogleDetails.firebaseStorage +
                `/userId/${userId}/tasks/${taskId}.json`
            );
            getData();
            setRefresh(!refresh);
          } catch (error) {
            console.log("Deletion error: " + error);
          }
        },
      },
    ]);
  };

  const handleEdit = (item: TaskDataType) => {
    navigation.navigate("Edit", {
      taskId: item.taskId,
      title: item.title,
      description: item.description,
      userId: userId,
      date: item.date,
    });
  };

  // Prevent hardware back button in android so that cannot pop from home to sign in page
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

  const ShowEmptyData = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <WelcomeMessage username={username} liveDate={liveDate} />
        <View style={styles.mainContainer}>
          <Text style={{ fontSize: 16 }}>
            It seems you don't have any tasks.
          </Text>
          <Text style={{ fontSize: 16 }}>
            Click on the "+" button to add a new task.
          </Text>
        </View>
      </ScrollView>
    );
  };

  const ShowListData = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          extraData={refresh}
          keyExtractor={(item) => item.taskId}
          ListHeaderComponent={() => (
            <WelcomeMessage username={username} liveDate={liveDate} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <View>
                  <View style={styles.titleAndCancelContainer}>
                    <View style={styles.itemTitleContainer}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                    <Entypo
                      name="circle-with-cross"
                      size={24}
                      color="#cfcfcf"
                      onPress={() => handleDelete(item.taskId)}
                    />
                  </View>
                  <View style={styles.itemDescriptionContainer}>
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.deadlineDateContainer}>
                    <Text style={styles.deadlineDate}>
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
  };

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
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  titleAndCancelContainer: {
    flex: 1,
    flexDirection: "row",
  },
  itemContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    padding: 20,
    margin: 12,
    borderRadius: 8,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 23,
    paddingBottom: 10,
    color: "white",
  },
  itemDescriptionContainer: {
    backgroundColor: "#cfcfcf",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: -10,
    marginBottom: -10,
  },
  itemDescription: {
    fontSize: 16,
  },
  deadlineDateContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: -10,
  },
  deadlineDate: {
    flex: 1,
    color: "white",
    textAlign: "right",
  },
});

export default HomeScreen;
