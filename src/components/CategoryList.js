import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryList({ selecionada, onSelect }) {
  const categorias = ['Todos', 'Computação', 'Engenharia', 'Direito'];

  return (
    <FlatList
      data={categorias}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const ativo = item === selecionada;

        return (
          <TouchableOpacity
            style={[styles.item, ativo && styles.active]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.text, ativo && styles.activeText]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  active: {
    backgroundColor: '#1D4ED8',
  },
  text: {
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
});