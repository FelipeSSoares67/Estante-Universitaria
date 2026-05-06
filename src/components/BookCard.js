import { View, Text, Image } from 'react-native';

export default function BookCard({ item }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 15,
      padding: 10,
      marginBottom: 15,
      elevation: 2
    }}>
      
      <Image
        source={{ uri: item.imagem }}
        style={{ width: 80, height: 100, borderRadius: 10 }}
      />

      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
        <Text>{item.area} • {item.faculdade}</Text>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{
            backgroundColor: '#DFF5E1',
            padding: 5,
            borderRadius: 5,
            marginRight: 10
          }}>
            {item.tipo}
          </Text>

          <Text>📍 {item.distancia}</Text>
        </View>

        <Text style={{ marginTop: 5 }}>⭐ {item.nota}</Text>
      </View>
    </View>
  );
}