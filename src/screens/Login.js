
// Componentes do React Native para construção da interface
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

// Estilos globais do app
import styles from '../styles/globalStyles';

// Hook para gerenciamento de estado local
import { useState } from 'react';

// Função de login abstraída no service (regra de negócio fora da UI)
import { login } from '../services/authService';

/**
 * Tela de Login
 * Responsável por autenticar o usuário e navegar para outras telas
 */
export default function Login({ navigation }) {

  // Estado dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para mensagens de erro ou feedback ao usuário
  const [mensagem, setMensagem] = useState('');

  /**
   * Executa o processo de login
   * - Valida campos obrigatórios
   * - Chama serviço de autenticação
   * - Trata possíveis erros
   */
  async function fazerLogin() {

    // Validação simples de campos obrigatórios
    if (!email || !senha) {
      setMensagem('Preencha todos os campos!');
      return;
    }

    try {
      // Tenta autenticar o usuário
      await login(email, senha);

      // Aqui poderia navegar para Home após login bem-sucedido
      // navigation.replace('Home');

    } catch (error) {
      // Exibe mensagem de erro para o usuário
      setMensagem(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

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

      {/* Botão de login */}
      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      {/* Navegação para tela de cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>

      {/* Mensagem de erro ou feedback */}
      {mensagem !== '' && (
        <Text style={styles.mensagem}>{mensagem}</Text>
      )}
    </View>
  );
}