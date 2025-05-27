import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface NavButtonProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
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