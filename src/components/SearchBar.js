import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#6b7280" />
      <TextInput
        style={styles.input}
        placeholder="Buscar livros..."
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
});