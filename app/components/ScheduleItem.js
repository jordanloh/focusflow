import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ScheduleItem = ({ time, module, desc }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <AntDesign name="calendar" size={24} color="black" />
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.moduleContainer}>
        <Text style={styles.cardText}>{module}</Text>
        <Text style={styles.assignment}>{desc}</Text>
      </View>
    </View>
  );
}

export default ScheduleItem;

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "20%",
  },
  moduleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
  },
  assignment: {
    fontSize: 14,
    fontWeight: "bold",
  }

});