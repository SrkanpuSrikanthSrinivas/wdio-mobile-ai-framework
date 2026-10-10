import React from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';

export function TabBar({ onSelect }) {
  return (
    <View testID="tabbar" accessibilityLabel="tabbar">
      <Pressable testID="tab-log" accessibilityLabel="tab-log" onPress={() => onSelect('log')}><Text>Log</Text></Pressable>
      <Pressable testID="tab-stats" accessibilityLabel="tab-stats" onPress={() => onSelect('stats')}><Text>Stats</Text></Pressable>
      <Pressable testID="tab-recovery" accessibilityLabel="tab-recovery" onPress={() => onSelect('recovery')}><Text>Recovery</Text></Pressable>
    </View>
  );
}

export function LogTab({ entries, onAdd }) {
  return (
    <View testID="screen-log" accessibilityLabel="screen-log">
      <Text testID="text-log-title" accessibilityLabel="text-log-title">Workout log</Text>
      <TextInput testID="input-exercise" accessibilityLabel="input-exercise" />
      <TextInput testID="input-sets" accessibilityLabel="input-sets" keyboardType="numeric" />
      <TextInput testID="input-reps" accessibilityLabel="input-reps" keyboardType="numeric" />
      <TextInput testID="input-weight" accessibilityLabel="input-weight" keyboardType="numeric" />
      <Pressable testID="button-add-entry" accessibilityLabel="button-add-entry" onPress={onAdd}><Text>Add entry</Text></Pressable>
      <Text testID="text-log-empty" accessibilityLabel="text-log-empty">No workouts logged yet</Text>
      <FlatList testID="list-log" data={entries} renderItem={({ item }) => <Text testID="item-log-entry" accessibilityLabel="item-log-entry">{item.label}</Text>} />
    </View>
  );
}

export function StatsTab({ volume, streak }) {
  return (
    <View testID="screen-stats" accessibilityLabel="screen-stats">
      <Text testID="text-stats-title" accessibilityLabel="text-stats-title">Your stats</Text>
      <Text testID="text-weekly-volume" accessibilityLabel="text-weekly-volume">{volume}</Text>
      <Text testID="text-streak" accessibilityLabel="text-streak">{streak}</Text>
      <Text testID="text-stats-empty" accessibilityLabel="text-stats-empty">Log a workout to see your stats</Text>
    </View>
  );
}

export function RecoveryTab({ score, advice }) {
  return (
    <View testID="screen-recovery" accessibilityLabel="screen-recovery">
      <Text testID="text-recovery-title" accessibilityLabel="text-recovery-title">Recovery</Text>
      <Text testID="text-recovery-score" accessibilityLabel="text-recovery-score">{score}</Text>
      <Text testID="text-recovery-advice" accessibilityLabel="text-recovery-advice">{advice}</Text>
      <Pressable testID="button-log-sleep" accessibilityLabel="button-log-sleep"><Text>Log sleep</Text></Pressable>
      <TextInput testID="input-sleep-hours" accessibilityLabel="input-sleep-hours" keyboardType="numeric" />
      <Text testID="text-rest-day" accessibilityLabel="text-rest-day">Take a rest day</Text>
    </View>
  );
}
