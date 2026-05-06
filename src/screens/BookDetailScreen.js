import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function BookDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [book, setBook] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 🔥 BUSCA LIVRO
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select(`
            *,
            study_areas (
              nome
            )
          `)
          .eq('id', id)
          .maybeSingle();

        console.log(bookData);
        console.log(bookError);

        if (bookError || !bookData) {
          setLoading(false);
          return;
        }

        setBook(bookData);

        // 🔥 BUSCA PERFIL DO DONO
        if (bookData.user_id) {
          const { data: perfilData } = await supabase
            .from('profiles')
            .select('cidade, universidade')
            .eq('id', bookData.user_id)
            .maybeSingle();

          setPerfil(perfilData);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // 🔥 LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // 🔥 NÃO ENCONTROU
  if (!book) {
    return (
      <View style={styles.center}>
        <Text>Livro não encontrado</Text>
      </View>
    );
  }

  const isLiterario = !!book.categoria_literaria;

  return (
    <View style={styles.container}>

      {/* 🔙 BOTÃO VOLTAR */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* IMAGEM */}
      <View style={styles.imageBox}>
        <Image
          source={{
            uri:
              book.imagem ||
              'https://via.placeholder.com/300x400.png?text=Livro',
          }}
          style={styles.image}
        />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>

        <Text style={styles.title}>
          {book.titulo}
        </Text>

        {/* TAGS */}
        <View style={styles.badges}>

          {/* TIPO */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {book.tipo}
            </Text>
          </View>

          {/* ÁREA */}
          {!isLiterario && (
            <View style={styles.badgeOutline}>
              <Text style={styles.badgeOutlineText}>
                {book.study_areas?.nome || 'Sem área'}
              </Text>
            </View>
          )}

          {/* LITERÁRIO */}
          {isLiterario && (
            <View style={styles.badgeOutline}>
              <Text style={styles.badgeOutlineText}>
                {book.categoria_literaria}
              </Text>
            </View>
          )}

          {/* NEGÓCIO */}
          <View style={styles.badgeGray}>
            <Text style={styles.badgeGrayText}>
              {book.tipo_negocio || 'Negociação'}
            </Text>
          </View>

          {/* CIDADE */}
          <View style={styles.badgeGray}>
            <Text style={styles.badgeGrayText}>
              {perfil?.cidade || 'Sem cidade'}
            </Text>
          </View>

          {/* FACULDADE */}
          <View style={styles.badgeGray}>
            <Text style={styles.badgeGrayText}>
              {perfil?.universidade || 'Sem faculdade'}
            </Text>
          </View>

        </View>

        {/* ESTADO */}
        <Text style={styles.sectionTitle}>
          Estado do livro
        </Text>

        <Text style={styles.text}>
          {book.estado || 'Não informado'}
        </Text>

      </View>

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Interest', {
            bookId: book.id,
          })
        }
      >
        <Text style={styles.buttonText}>
          Tenho interesse
        </Text>
      </TouchableOpacity>

    </View>
  );
}

/* =========================
   🎨 STYLE
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 🔙 BOTÃO VOLTAR */
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },

  imageBox: {
    width: '100%',
    height: 280,
    backgroundColor: '#e5e7eb',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },

  badge: {
    backgroundColor: '#2563eb',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  badgeOutline: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeOutlineText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },

  badgeGray: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeGrayText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
  },

  text: {
    fontSize: 14,
    color: '#374151',
  },

  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});