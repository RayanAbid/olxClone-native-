import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";

const AccountScreen = () => {
  console.log("hjh", auth().currentUser.uid);

  const [items, setItems] = useState([]);
  const [loading, setloading] = useState(false);

  const getAds = async () => {
    const querySnap = await firestore()
      .collection("ads")
      .where("uid", "==", auth().currentUser.uid)
      .get();
    const result = querySnap.docs.map((docSnap) => docSnap.data());
    console.log(result);
    setItems(result);
  };

  useEffect(() => {
    getAds();
    return console.log("cleanup");
  }, []);

  const renderItem = (item) => {
    return (
      <Card style={styles.Card}>
        <Card.Title title={item.name} />
        <Card.Content>
          <Paragraph>{item.desc}</Paragraph>
          <Paragraph>{item.year}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: item.image.uri }} />
        <Card.Actions>
          <Button>{item.price} pkr</Button>
          <Button onPress={() => openDial(item.phone)}>{item.phone}</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <>
      <View
        style={{
          height: "30%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{auth().currentUser.email}</Text>
        <Button
          mode="contained"
          onPress={() => {
            auth().signOut();
          }}
        >
          Log out
        </Button>
      </View>
      <Text style={{ textAlign: "center" }}>Your Ads</Text>

      <FlatList
        data={items.reverse()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.uid}
      />
    </>
  );
};

const styles = StyleSheet.create({
  Card: {
    margin: 5,
    elevation: 2,
  },

  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20,
    justifyContent: "space-evenly",
  },
});

export default AccountScreen;
