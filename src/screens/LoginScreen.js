import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import auth from "@react-native-firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async () => {
    if (!email || !password) Alert.alert("Please fill all fields");
    else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("User account created & signed in!");
          Alert.alert("User Logged in ");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
          }

          console.error(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.View1}>
        <Image style={styles.image} source={require("../assets/cnqlogo.png")} />
        <Text style={styles.text}>Please Login to Continue</Text>
      </View>
      <View style={styles.View2}>
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />

        <Button mode="contained" onPress={() => userLogin()}>
          Login
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("SignUP")}>
          <Text style={{ textAlign: "center" }}>Don't have an account ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  View1: {
    alignItems: "center",
  },
  View2: {
    paddingHorizontal: 40,
    justifyContent: "space-evenly",
    height: "50%",
  },
  text: {
    fontSize: 22,
  },
});
