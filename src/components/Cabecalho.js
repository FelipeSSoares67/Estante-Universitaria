import { View, Text, Image } from 'react-native';

export default function Header() {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        📘 Estante Universitária
      </Text>

      <Image
        source={{ uri: 'https://via.placeholder.com/40' }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </View>
  );
}