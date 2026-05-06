import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '../services/supabase';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>
        Acesse sua biblioteca acadêmica digital
      </Text>

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

        <PrimaryButton title="Entrar" onPress={handleLogin} />

        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          Criar conta
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#1D4ED8',
    fontWeight: '600',
  },
});