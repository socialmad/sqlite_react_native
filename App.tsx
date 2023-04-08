import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import SQLite from 'react-native-sqlite-storage'

//database connection
const db = SQLite.openDatabase(
  {
    name: 'mydb',
    location: 'default'
  },
  () => { console.log("Database connected!") }, //on success
  error => console.log("Database error", error) //on error
)


export default function App() {

  useEffect(() => {
    createUserTable(); //create the table
  })


  //create table function
  const createUserTable = () => {
    db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR)",[], (result) => {
      console.log("Table created successfully");
    }, (error) => {
      console.log("Create table error", error)
    })
  }

  //insert a new user record
  const createUser = () => {
     let sql = "INSERT INTO users (email, name) VALUES (?, ?)";
     let params = ["yoursocialmd@gmail.com", "MD Sarfaraj"];
     db.executeSql(sql, params, (result) => {
      Alert.alert("Success", "User created successfully.");
     }, (error) => {
      console.log("Create user error", error);
     });
  }


  //list all the users 
  const listUsers = async () => {
    let sql = "SELECT * FROM users";
    db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, resultSet) => {
        var length = resultSet.rows.length;
        for(var i = 0; i < length; i++) {
          console.log(resultSet.rows.item(i));
        }
      }, (error) => {
        console.log("List user error", error);
      })
    })
  }

  //update user record
  const updateUser = () => {
    let sql = 'UPDATE users SET email = ?, name = ? WHERE id = ?';
    let params = ['yoursocialmd@gmail.com', "Mohammad Sarfaraj", 1]; 
    db.executeSql(sql, params, (resultSet) => {
     Alert.alert("Success", "Record updated successfully");
    }, (error) => {
      console.log(error);
    });
  }

  //delete user record
  const deleteUser = () => {
    let sql = "DELETE FROM users WHERE id = ?";
    let params = [1];
    db.executeSql(sql, params, (resultSet) => {
      Alert.alert("Success", "User deleted successfully");
    }, (error) => {
      console.log("Delete user error", error);
    })
  }


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SQLite Database With React Native</Text>
      <View style={[styles.buttonStyle, styles.green]}>
        <TouchableOpacity onPress={createUser}>
          <Text style={styles.textStyle}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonStyle, styles.blue]}>
        <TouchableOpacity onPress={listUsers}>
          <Text style={styles.textStyle}>Fetch</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonStyle, styles.grey]}>
        <TouchableOpacity onPress={updateUser}>
          <Text style={styles.textStyle}>Update</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonStyle, styles.red]}>
        <TouchableOpacity onPress={deleteUser}>
          <Text style={styles.textStyle}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  buttonStyle: {
    marginTop: 10,
    padding: 12,
    width: "100%",
    borderRadius: 4
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white'
  },
  green: {
    backgroundColor: 'green'
  },
  red: {
    backgroundColor: 'red'
  },
  grey: {
    backgroundColor: 'grey'
  },
  blue: {
    backgroundColor: 'blue'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold'
  }
})