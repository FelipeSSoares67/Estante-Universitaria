import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { setUsuario } from '../data/user';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  function cadastrar() {
    if (!email || !senha) {
      setMensagem('Preencha todos os campos!');
      return;
    }

   setUsuario({
  email: email,
  senha: senha
});

    setMensagem('Cadastro realizado!');
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

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

      <TouchableOpacity style={styles.botao} onPress={cadastrar}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
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
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
  },
  mensagem: {
    textAlign: 'center',
    marginTop: 10,
    color: 'green',
  },
});