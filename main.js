import { useState, useEffect } from 'react';

// Navegação
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Supabase
import { supabase } from './src/services/supabase';

// Telas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();



/**
 * 🔐 STACK DE AUTENTICAÇÃO
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}
/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/**
 * 📱 STACK PRINCIPAL (logado)
 */
function AppStack({ usuario }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} usuario={usuario} />}
      </Stack.Screen>

      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUsuario(data.session?.user ?? null);
      setLoading(false);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuario(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {usuario ? <AppStack usuario={usuario} /> : <AuthStack />}
    </NavigationContainer>
  );
}