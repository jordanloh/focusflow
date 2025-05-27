import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface BottomTabProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  active?: boolean;
}

const BottomTab: React.FC<BottomTabProps> = ({ icon, label, active }) => {
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