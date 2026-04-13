
// Componentes básicos do React Native para UI
import { View, Text, TouchableOpacity } from 'react-native';

// Estilos globais reutilizados no app
import styles from '../styles/globalStyles';

// Serviço responsável pelo logout do usuário
import { logout } from '../services/authService';

/**
 * Tela Home
 * Exibida quando o usuário está autenticado
 */
export default function Home({ usuario }) {

  /**
   * Realiza o logout do usuário autenticado
   */
  async function sair() {
    await logout();

    // Aqui poderia haver navegação para tela de login
    // Ex: navigation.replace('Login');
  }

  return (
    <View style={styles.container}>

      {/* Mensagem principal de estado autenticado */}
      <Text style={styles.titulo}>Você está logado 🎉</Text>

      {/* Exibe email do usuário autenticado */}
      <Text>{usuario?.email}</Text>

      {/* Botão de logout */}
      <TouchableOpacity onPress={sair} style={styles.botao}>
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
}