import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import BottomTab from "./components/BottomTab";
import NavButton from "./components/NavButton";
import ScheduleItem from "./components/ScheduleItem";
import ToDoCard from "./components/ToDoCard";

export default function MainPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  const ProfilePageBottomTab = () => {
    const router = useRouter();
    const ProfilePagePressed = () => {
      console.log("Profile Page pressed");
      router.push("/AccountPageParent");
    }
    return (
      <BottomTab
        icon="user"
        label="Profile"
        onPress={ProfilePagePressed}
      />
    )
  }
  
  const ProfilePagePicIcon = () => {
    const router = useRouter();
    const ProfilePagePressed = () => {
      console.log("Profile Page pressed");
      router.push("/AccountPageParent");
    }
    return (
      <TouchableOpacity style={styles.profilePic} onPress={ProfilePagePressed}>
        <MaterialCommunityIcons name="account-circle" size={45} color="black" />
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <ProfilePagePicIcon />
              <Text style={styles.welcome}>Welcome!</Text>
              <Text style={styles.username}>{user?.user_metadata?.username || user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.bellIcon}>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.navRow}>
            <NavButton icon="cutlery" label="Focus!" />
            <ToDoList />
            <NavButton icon="book" label="Backyard" />
            <NavButton icon="eye" label="See More" />
          </View>

          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.cardList}>
            <ScheduleItem time="10:00 - 12:00" module="CS2100" desc="Tutorial 10" />
            <ScheduleItem time="12:00 - 14:00" module="CS2107" desc="Tutorial 10" />
            <ScheduleItem time="18:00 - 19:00" module="CS2118" desc="Lecture" />
          </View>
          <TouchableOpacity>
            <Text style={styles.viewMore}>View More</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>To-do List</Text>
          <View style={styles.cardList}>
            <ToDoCard module="ES2668" items={["Midterm Test", "Tutorial 2"]} />
            <ToDoCard module="ES2660" items={["Update Weekly Journal", "Social Commentary"]} />
          </View>
          <TouchableOpacity>
            <Text style={styles.viewMore}>View More</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
            <BottomTab icon="home" label="Home" />
            <BottomTab icon="calendar" label="Timetable" />
            <BottomTab icon="leaf" label="Rewards" />
            <ProfilePageBottomTab />
        </View>
     </View>
    </SafeAreaView>
  );
}
const ToDoList = () => {
  const router = useRouter();
  const ToDoListPressed = () => {
    console.log("To-do List pressed");
    router.push("/todolist");
  }
  return (
    <NavButton 
      icon="list" 
      label="To-do List" 
      onPress={ToDoListPressed}
    />
  )
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "column",
  },
  profilePic: {
    fontSize: 45,
    marginBottom: 5,
  },
  welcome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#555",
  },
  bellIcon: {
    backgroundColor: "#003049",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardList: {
    marginBottom: 1,
  },
  viewMore: {
    color: "#003049",
    fontSize: 12,
    marginBottom: 5,
    alignSelf: "flex-end",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#003049",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});
