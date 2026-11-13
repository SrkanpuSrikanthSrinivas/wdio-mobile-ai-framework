import { View, Text, TouchableOpacity } from 'react-native';
import { C } from '../theme';

/**
 * Chips — a dependency-free selector (row of tappable chips). Each chip exposes
 * an accessibility id `<idPrefix>-<value>` so tests can tap a specific option.
 */
export default function Chips({ options, value, onChange, idPrefix }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            testID={`${idPrefix}-${opt}`}
            accessibilityLabel={`${idPrefix}-${opt}`}
            accessible
            style={{
              paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
              borderWidth: 1, borderColor: active ? C.primary : C.border,
              backgroundColor: active ? C.primary : 'transparent',
            }}
          >
            <Text style={{ color: active ? '#06210F' : C.muted, fontSize: 13, fontWeight: active ? '700' : '400' }}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
