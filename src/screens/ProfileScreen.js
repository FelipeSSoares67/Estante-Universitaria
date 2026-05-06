import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
} from 'react-native';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function carregarPerfil(userId) {
    const { data } = await supabase
      .from('profiles')
      .select(`cidade, universidade, curso, study_areas (nome)`)
      .eq('id', userId)
      .maybeSingle();

    setPerfil(data);
  }

  async function carregarLivros(userId) {
    const { data } = await supabase
      .from('books')
      .select('id, titulo, imagem')
      .eq('user_id', userId);

    setLivros(data || []);
  }

  async function deletarLivro(id) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    setLivros((prev) => prev.filter((item) => item.id !== id));
  }

  useEffect(() => {
    async function init() {
      setLoading(true);

      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user) {
        setUser(user);
        await carregarPerfil(user.id);
        await carregarLivros(user.id);
      }

      setLoading(false);
    }

    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >

        {/* 🔙 HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Perfil</Text>

          <View style={{ width: 30 }} />
        </View>

        {/* 👤 PERFIL */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.[0]?.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{user?.email}</Text>
        </View>

        {/* 📄 CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Cidade</Text>
          <Text style={styles.value}>{perfil?.cidade}</Text>

          <Text style={styles.label}>Universidade</Text>
          <Text style={styles.value}>{perfil?.universidade}</Text>

          <Text style={styles.label}>Curso</Text>
          <Text style={styles.value}>{perfil?.curso}</Text>

          <Text style={styles.label}>Área</Text>
          <Text style={styles.value}>
            {perfil?.study_areas?.nome}
          </Text>
        </View>

        {/* 🔥 BOTÕES */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddBook')}
          >
            <Text style={styles.addText}>
              + Adicionar Livro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.deleteText}>
              🗑 Excluir Livros
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📚 LIVROS */}
        <Text style={styles.section}>
          Seus livros
        </Text>

        <FlatList
          data={livros}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.bookBox}>
              {item.imagem ? (
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.bookImage}
                />
              ) : (
                <View style={styles.noImage}>
                  <Text>Sem capa</Text>
                </View>
              )}
            </View>
          )}
        />

        {/* 🚪 LOGOUT */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logout}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 🗑 MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>

          <Text style={styles.modalTitle}>
            Selecionar livro para excluir
          </Text>

          <FlatList
            data={livros}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deletarLivro(item.id)}
              >
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.modalImage}
                />

                <Text style={{ flex: 1 }}>
                  {item.titulo}
                </Text>

                <Text style={{ color: 'red' }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: '#fff' }}>
              Fechar
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}

/* ===================== STYLE ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 24,
  },

  name: {
    marginTop: 10,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },

  label: {
    fontSize: 12,
    color: '#6b7280',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 15,
  },

  addBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  section: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginHorizontal: 20,
  },

  bookBox: {
    width: '33.3%',
    padding: 5,
  },

  bookImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },

  noImage: {
    height: 110,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  deleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },

  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },

  closeBtn: {
    backgroundColor: '#111827',
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  logout: {
    backgroundColor: '#1e40af',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});