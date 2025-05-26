import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const BottomTab = ({ icon, label }) => {
  return (
    <TouchableOpacity style={styles.tabButton}>
      <FontAwesome name={icon} size={20} color="white" />
      <Text style={styles.tabLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default BottomTab;

const styles = StyleSheet.create({
  tabButton: {
    alignItems: 'center',
  },
  tabLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});