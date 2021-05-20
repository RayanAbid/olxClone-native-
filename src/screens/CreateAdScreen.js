import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import { TextInput, Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

const CreateAdScreen = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  const [filePath, setFilePath] = useState({});

  const postData = async () => {
    if (!name || !desc || !year || !price || !phone) {
      Alert.alert("Fill Fields");
    } else {
      try {
        await firestore().collection("ads").add({
          name: name,
          desc: desc,
          year: year,
          price: price,
          phone: phone,
          image: filePath,
          uid: auth().currentUser.uid,
        });
        Alert.alert("Success");
        console.log("Success");
        setName("");
        setDesc("");
        setYear("");
        setPrice("");
        setPhone("");
        setFilePath("");
      } catch (error) {
        Alert.alert(error, "Something went wrong");
        console.log(error, "erro");
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log("Response = ", response);

        if (response.didCancel) {
          alert("User cancelled camera picker");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }
        console.log("base64 -> ", response.base64);
        console.log("uri -> ", response.uri);
        console.log("width -> ", response.width);
        console.log("height -> ", response.height);
        console.log("fileSize -> ", response.fileSize);
        console.log("type -> ", response.type);
        console.log("fileName -> ", response.fileName);
        setFilePath(response);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      console.log("base64 -> ", response.base64);
      console.log("uri -> ", response.uri);
      console.log("width -> ", response.width);
      console.log("height -> ", response.height);
      console.log("fileSize -> ", response.fileSize);
      console.log("type -> ", response.type);
      console.log("fileName -> ", response.fileName);
      setFilePath(response);
      console.log("repos", filePath);
      const uploadTask = storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(response.uri);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          if (progress == 100) {
            Alert.alert("Upload Successful");
          }
        },
        (error) => {
          Alert.alert("There is some issue");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    });
  };

  const openCamera = () => {
    console.log("tets");
    launchCamera({ quality: 0.5 }, (fielObj) => {
      console.log(fielObj);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Ad</Text>
      {filePath ? <Image source={filePath} /> : <Text></Text>}

      <TextInput
        label="Add Title"
        mode="outlined"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        label="Add Description"
        mode="outlined"
        value={desc}
        multiline={true}
        onChangeText={(text) => setDesc(text)}
      />

      <TextInput
        label="Year of Purchase"
        mode="outlined"
        value={year}
        multiline={true}
        keyboardType={"numeric"}
        onChangeText={(text) => setYear(text)}
      />

      <TextInput
        label="Price in PKR"
        mode="outlined"
        value={price}
        multiline={true}
        keyboardType={"numeric"}
        onChangeText={(text) => setPrice(text)}
      />

      <TextInput
        label="Your Contact Number"
        mode="outlined"
        value={phone}
        multiline={true}
        keyboardType={"numeric"}
        onChangeText={(text) => setPhone(text)}
      />

      <Button
        icon="camera"
        mode="contained"
        onPress={() => chooseFile("photo")}
      >
        Choose Image
      </Button>
      <Button icon="camera" mode="contained" onPress={() => openCamera()}>
        Upload Image
      </Button>

      <Button
        disabled={filePath ? false : true}
        mode="contained"
        onPress={() => postData()}
      >
        Create Ad
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: "space-evenly",
  },

  text: {
    fontSize: 22,
    textAlign: "center",
  },
});

export default CreateAdScreen;
