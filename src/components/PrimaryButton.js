import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1D4ED8',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});