import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

import { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [subCategoria, setSubCategoria] = useState(null);

  const [userArea, setUserArea] = useState(null);
  const [outrasAreas, setOutrasAreas] = useState([]);
  const [livrosBanco, setLivrosBanco] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      // 📌 PERFIL
      const { data: perfil } = await supabase
        .from('profiles')
        .select(`study_areas (id, nome)`)
        .eq('id', user.id)
        .single();

      const areaUsuario = perfil?.study_areas;
      setUserArea(areaUsuario);

      // 📌 ÁREAS
      const { data: areas } = await supabase
        .from('study_areas')
        .select('*');

      setOutrasAreas(
        areas?.filter((a) => a.id !== areaUsuario?.id) || []
      );

      // 📌 LIVROS
      const { data: books } = await supabase
        .from('books')
        .select(`
          id,
          titulo,
          imagem,
          tipo,
          categoria_literaria,
          study_areas (nome)
        `);

      const formatados =
        books?.map((b) => ({
          id: b.id,
          titulo: b.titulo,
          categoria: b.study_areas?.nome || b.categoria_literaria,
          tipo: b.tipo,
          imagem: b.imagem,
        })) || [];

      setLivrosBanco(formatados);
    }

    carregarDados();
  }, []);

  // 📚 LITERÁRIOS
  const categoriasLiterarias = [
    'Ficção',
    'Não ficção',
    'Poesia',
    'Drama',
    'Comédia',
  ];

  const livros = livrosBanco;

  // 🔥 FILTRO
  const filtrados = useMemo(() => {
    return livros.filter((l) => {
      const matchSearch = l.titulo
        ?.toLowerCase()
        .includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (categoria === 'Todos') return true;

      if (categoria === userArea?.nome) {
        return l.categoria === userArea?.nome;
      }

      if (categoria === 'Literários') {
        if (subCategoria) {
          return l.categoria === subCategoria;
        }

        return categoriasLiterarias.includes(l.categoria);
      }

      if (categoria === 'Estudantil') {
        if (subCategoria) {
          return l.categoria === subCategoria;
        }

        return outrasAreas.some(
          (a) => a.nome === l.categoria
        );
      }

      return true;
    });
  }, [
    search,
    categoria,
    subCategoria,
    userArea,
    outrasAreas,
    livros,
  ]);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
          />

          <Text style={styles.logoText}>
            Estante Universitária
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{
              uri:
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

      </View>

      {/* BUSCA */}
      <TextInput
        placeholder="Buscar livros..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* ABAS */}
      <View style={styles.tabs}>
        {[
          'Todos',
          userArea?.nome || 'Área',
          'Literários',
          'Estudantil',
        ].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              categoria === tab && styles.activeTab,
            ]}
            onPress={() => {
              setCategoria(tab);
              setSubCategoria(null);
            }}
          >
            <Text style={styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔥 SUB LITERÁRIOS */}
      {categoria === 'Literários' && (
        <View style={styles.subTabs}>
          {categoriasLiterarias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.subBtn,
                subCategoria === cat &&
                  styles.activeSub,
              ]}
              onPress={() => setSubCategoria(cat)}
            >
              <Text style={styles.subText}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 🔥 SUB ESTUDANTIL */}
      {categoria === 'Estudantil' && (
        <View style={styles.subTabs}>
          {outrasAreas.map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.subBtn,
                subCategoria === area.nome &&
                  styles.activeSub,
              ]}
              onPress={() =>
                setSubCategoria(area.nome)
              }
            >
              <Text style={styles.subText}>
                {area.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 📚 CATÁLOGO */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                'BookDetail',
                { id: item.id }
              )
            }
          >
            <Image
              source={{
                uri:
                  item.imagem ||
                  'https://via.placeholder.com/150x220.png?text=Livro',
              }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text
              style={styles.title}
              numberOfLines={2}
            >
              {item.titulo}
            </Text>

            <Text style={styles.tag}>
              {item.tipo}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* BOTÃO FLUTUANTE */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddBook')
        }
      >
        <Text style={styles.fabText}>
          ＋
        </Text>
      </TouchableOpacity>

    </View>
  );
}

/* 🎨 STYLE */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 15,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },

  logoText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* BUSCA */

  search: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    marginVertical: 15,
  },

  /* ABAS */

  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  tabBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: '#bfdbfe',
  },

  tabText: {
    fontWeight: '600',
    color: '#111827',
  },

  /* SUB ABAS */

  subTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 5,
  },

  subBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  activeSub: {
    backgroundColor: '#93c5fd',
  },

  subText: {
    fontSize: 13,
    color: '#111827',
  },

  /* CARDS */

  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },

  title: {
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    color: '#111827',
  },

  tag: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },

  /* FAB */

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  fabText: {
    color: '#fff',
    fontSize: 28,
  },
});