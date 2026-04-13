
// Componentes do React Native para construção da interface
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

// Hook para estado local dos campos do formulário
import { useState } from 'react';

// Estilos globais reutilizados no app
import styles from '../styles/globalStyles';

// Serviço responsável pela criação de usuário (regra de negócio fora da UI)
import { cadastro } from '../services/authService';

/**
 * Tela de Cadastro
 * Responsável por criar novos usuários no sistema
 */
export default function Cadastro({ navigation }) {

  // Estado dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para mensagens de erro ou feedback ao usuário
  const [mensagem, setMensagem] = useState('');

  /**
   * Realiza o cadastro do usuário
   * - Valida campos obrigatórios
   * - Chama serviço de autenticação
   * - Exibe feedback ao usuário
   */
  async function cadastrarUsuario() {

    // Validação simples de campos obrigatórios
    if (!email || !senha) {
      setMensagem('Preencha todos os campos!');
      return;
    }

    try {
      // Cria usuário no Firebase
      await cadastro(email, senha);

      // Feedback de sucesso para o usuário
      Alert.alert('Sucesso', 'Conta criada com sucesso!');

      // Observação:
      // O Firebase já autentica automaticamente o usuário após o cadastro

    } catch (error) {
      // Exibe mensagem de erro para o usuário
      setMensagem(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      {/* Campo de email */}
      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Campo de senha */}
      <TextInput
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.botao} onPress={cadastrarUsuario}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Navegação de retorno para login */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Já tem conta? Voltar para login</Text>
      </TouchableOpacity>

      {/* Mensagem de erro ou feedback */}
      {mensagem !== '' && (
        <Text style={styles.mensagem}>{mensagem}</Text>
      )}
    </View>
  );
}