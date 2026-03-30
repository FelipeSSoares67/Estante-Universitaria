import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { getUsuario } from '../data/user';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

function fazerLogin() {
  if (!email || !senha) {
    setMensagem('Preencha todos os campos!');
    return;
  }

  const usuario = getUsuario();

  if (
    usuario &&
    email === usuario.email &&
    senha === usuario.senha
  ) {
    setMensagem('');
    navigation.navigate('Home');
  } else {
    setMensagem('Email ou senha inválidos');
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>

      {mensagem !== '' && (
        <Text style={styles.mensagem}>{mensagem}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: 'blue',
  },
  mensagem: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
  },
});