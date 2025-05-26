import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ToDoCard = ({ module, items }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.module}>{module}</Text>
      {items.map((item, index) => (
        <Text key={index} style={styles.cardText}>- {item}</Text>
      ))}
    </View>
  );
}

export default ToDoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  module: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
  },
});