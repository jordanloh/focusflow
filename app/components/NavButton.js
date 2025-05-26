import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const NavButton = ({ icon, label }) => {
  return (
    <TouchableOpacity style={styles.navButton}>
      <FontAwesome name={icon} size={20} color="#003049" />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default NavButton;

const styles = StyleSheet.create({
  navButton: {
    alignItems: 'center',
  },
  navLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#003049',
  },
});