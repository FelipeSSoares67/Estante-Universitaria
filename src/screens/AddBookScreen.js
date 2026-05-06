import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../services/supabase';

export default function AddBookScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [estado, setEstado] = useState('');

  const [tipoGeral, setTipoGeral] = useState(null); // ESTUDANTIL | LITERARIO
  const [modoLivro, setModoLivro] = useState(null); // DOACAO | TROCA

  const [categoriaLiteraria, setCategoriaLiteraria] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaSelecionada, setAreaSelecionada] = useState(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categoriasLiterarias = [
    'Ficção',
    'Não ficção',
    'Poesia',
    'Drama',
    'Comédia',
  ];

  /* ===================== PERMISSÕES ===================== */
  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  /* ===================== ÁREAS ===================== */
  useEffect(() => {
    async function loadAreas() {
      const { data, error } = await supabase
        .from('study_areas')
        .select('*');

      if (error) {
        console.log('ERRO AREAS:', error);
      }

      setAreas(data || []);
    }

    loadAreas();
  }, []);

  /* ===================== IMAGEM ===================== */
  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  /* ===================== UPLOAD ===================== */
  async function uploadImage(uri, userId) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `${userId}-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('book-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('book-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  }

  /* ===================== SALVAR ===================== */
  async function handleSave() {
    try {
      if (loading) return;

      if (
        !titulo ||
        !estado ||
        !tipoGeral ||
        !modoLivro ||
        !image
      ) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
      }

      if (tipoGeral === 'ESTUDANTIL' && !areaSelecionada) {
        Alert.alert('Erro', 'Selecione a área acadêmica');
        return;
      }

      if (tipoGeral === 'LITERARIO' && !categoriaLiteraria) {
        Alert.alert('Erro', 'Selecione a categoria literária');
        return;
      }

      setLoading(true);

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      let imageUrl = null;

      if (image) {
        imageUrl = await uploadImage(image, user.id);
      }

      const payload = {
        titulo,
        estado,
        imagem: imageUrl,
        tipo: tipoGeral,
        modo: modoLivro,
        categoria_literaria:
          tipoGeral === 'LITERARIO' ? categoriaLiteraria : null,
        study_area_id:
          tipoGeral === 'ESTUDANTIL' ? areaSelecionada : null,
        user_id: user.id,
      };

      console.log('PAYLOAD:', payload);

      const { data: insertData, error: insertError } = await supabase
        .from('books')
        .insert([payload])
        .select();

      console.log('INSERT DATA:', insertData);
      console.log('INSERT ERROR:', insertError);

      if (insertError) {
        Alert.alert('Erro', insertError.message);
        return;
      }

      Alert.alert('Sucesso', 'Livro adicionado com sucesso!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err) {
      console.log('ERRO:', err);
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ===================== UI ===================== */
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* VOLTAR */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Adicionar Livro</Text>

        {/* IMAGEM */}
        <View style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text>Sem imagem</Text>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.imgBtn} onPress={takePhoto}>
            <Text>📸 Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
            <Text>🖼️ Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* INPUTS */}
        <TextInput
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
        />

        <TextInput
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
          style={styles.input}
        />

        {/* TIPO */}
        <Text style={styles.label}>Tipo do livro</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.option, tipoGeral === 'ESTUDANTIL' && styles.active]}
            onPress={() => {
              setTipoGeral('ESTUDANTIL');
              setCategoriaLiteraria(null);
            }}
          >
            <Text>Estudantil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, tipoGeral === 'LITERARIO' && styles.active]}
            onPress={() => {
              setTipoGeral('LITERARIO');
              setAreaSelecionada(null);
            }}
          >
            <Text>Literário</Text>
          </TouchableOpacity>
        </View>

        {/* ÁREA */}
        {tipoGeral === 'ESTUDANTIL' && (
          <>
            <Text style={styles.label}>Área acadêmica</Text>
            <View style={styles.grid}>
              {areas.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={[
                    styles.option,
                    areaSelecionada === a.id && styles.active,
                  ]}
                  onPress={() => setAreaSelecionada(a.id)}
                >
                  <Text>{a.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* LITERÁRIO */}
        {tipoGeral === 'LITERARIO' && (
          <>
            <Text style={styles.label}>Categoria literária</Text>
            <View style={styles.grid}>
              {categoriasLiterarias.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.option,
                    categoriaLiteraria === c && styles.active,
                  ]}
                  onPress={() => setCategoriaLiteraria(c)}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* NEGOCIAÇÃO */}
        <Text style={styles.label}>Negociação</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.option, modoLivro === 'DOACAO' && styles.active]}
            onPress={() => setModoLivro('DOACAO')}
          >
            <Text>Doação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, modoLivro === 'TROCA' && styles.active]}
            onPress={() => setModoLivro('TROCA')}
          >
            <Text>Troca</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTÃO */}
      <View style={styles.fixed}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Livro</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===================== STYLE ===================== */
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { padding: 20 },

  back: { fontSize: 16, marginBottom: 10 },

  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  imageBox: {
    height: 200,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: { width: '100%', height: '100%', borderRadius: 12 },

  row: { flexDirection: 'row', gap: 10, marginTop: 10 },

  imgBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  label: { marginTop: 15, fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  option: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 10,
  },

  active: { backgroundColor: '#93c5fd' },

  fixed: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: { color: '#fff', fontWeight: 'bold' },
});