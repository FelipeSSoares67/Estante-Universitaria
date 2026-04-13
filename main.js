// Hooks do React para gerenciar estado e efeitos colaterais
import { useState, useEffect } from 'react';

// Container principal de navegação do app
import { NavigationContainer } from '@react-navigation/native';

// Criador de navegação em pilha (Stack Navigation)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Serviço de autenticação do Firebase
import { auth } from './src/services/API_Firebase';

// Listener que observa mudanças no estado de autenticação do usuário
import { onAuthStateChanged } from 'firebase/auth';

// Telas do aplicativo
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';

// Componentes básicos do React Native para UI simples
import { View, Text } from 'react-native';

// Instância do Stack Navigator
const Stack = createNativeStackNavigator();

/**
 * Stack responsável pelas telas de autenticação
 * Usado quando o usuário ainda NÃO está logado
 */
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

/**
 * Componente principal do aplicativo
 * Responsável por controlar:
 * - Estado de autenticação do usuário
 * - Carregamento inicial do Firebase
 * - Fluxo de navegação (logado vs não logado)
 */
export default function App() {
  // Armazena o usuário autenticado (ou null se não estiver logado)
  const [usuario, setUsuario] = useState(null);

  // Controla estado de carregamento inicial da autenticação
  const [loading, setLoading] = useState(true);

  /**
   * Observa mudanças no estado de autenticação do Firebase
   * Atualiza o usuário e encerra o loading quando Firebase responde
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setLoading(false);
    });

    // Remove o listener quando o componente desmonta
    return unsubscribe;
  }, []);

  /**
   * Tela de carregamento enquanto o Firebase verifica autenticação
   */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  /**
   * Controle principal de navegação:
   * - Se usuário existir → entra no app (Home)
   * - Se não existir → fluxo de autenticação
   */
  return (
    <NavigationContainer>
      {usuario ? (
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {(props) => <Home {...props} usuario={usuario} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}