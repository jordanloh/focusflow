import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface BottomTabProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress?: () => void;
  active?: boolean;
}

const BottomTab: React.FC<BottomTabProps> = ({ icon, label, onPress, active }) => {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <FontAwesome name={icon} size={20} color={active ? "#fff" : "rgba(255,255,255,0.7)"} />
      <Text style={[styles.tabLabel, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default BottomTab;

const styles = StyleSheet.create({
  tabButton: {
    alignItems: 'center',
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  activeLabel: {
    color: '#fff'
  }
}); 