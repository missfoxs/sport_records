import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({value, label}: StatCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#667eea',
    lineHeight: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default StatCard;
