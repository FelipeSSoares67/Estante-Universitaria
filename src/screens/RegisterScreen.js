import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [curso, setCurso] = useState('');
  const [cidade, setCidade] = useState('');

  const [areas, setAreas] = useState([]);
  const [areaSelecionada, setAreaSelecionada] = useState(null);
  const [areaNome, setAreaNome] = useState('');
  const [abrirAreas, setAbrirAreas] = useState(false);

  const [loading, setLoading] = useState(false);

  async function carregarAreas() {
    const { data } = await supabase.from('study_areas').select('*');
    setAreas(data || []);
  }

  useEffect(() => {
    carregarAreas();
  }, []);

  async function handleRegister() {
    try {
      if (
        !email ||
        !password ||
        !universidade ||
        !curso ||
        !cidade ||
        !areaSelecionada
      ) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        Alert.alert('Erro', error.message);
        return;
      }

      if (!data.session) {
        await supabase.auth.signInWithPassword({ email, password });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        universidade,
        curso,
        cidade,
        study_area_id: areaSelecionada,
      });

      setLoading(false);
      navigation.replace('Home');

    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert('Erro inesperado');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <View style={styles.card}>
        <InputField
          icon="mail-outline"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <InputField
          icon="school-outline"
          placeholder="Universidade"
          value={universidade}
          onChangeText={setUniversidade}
        />

        <InputField
          icon="book-outline"
          placeholder="Curso"
          value={curso}
          onChangeText={setCurso}
        />

        <InputField
          icon="location-outline"
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />

        {/* 🔥 DROPDOWN ÁREA */}
        <Text style={styles.label}>Área de estudo</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setAbrirAreas(!abrirAreas)}
        >
          <Text style={{ color: areaNome ? '#000' : '#9ca3af' }}>
            {areaNome || 'Selecionar área'}
          </Text>
        </TouchableOpacity>

        {abrirAreas && (
          <View style={styles.dropdownList}>
            {areas.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={styles.areaItem}
                onPress={() => {
                  setAreaSelecionada(area.id);
                  setAreaNome(area.nome);
                  setAbrirAreas(false); // 🔥 fecha após selecionar
                }}
              >
                <Text>{area.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <PrimaryButton
          title={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
        />

        <Text style={styles.link} onPress={() => navigation.goBack()}>
          Já tem conta? Fazer login
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },

  label: {
    marginTop: 15,
    fontWeight: '600',
  },

  dropdown: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },

  dropdownList: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 3,
  },

  areaItem: {
    padding: 10,
  },

  link: {
    marginTop: 15,
    color: '#1D4ED8',
    textAlign: 'center',
    fontWeight: '600',
  },
});