import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';

import { useEffect } from 'react';

export default function SplashScreen({ navigation }) {

  //  SPLASH POR 3 SEGUNDOS
  useEffect(() => {
    const timer = setTimeout(() => {

      //  SE ESTIVER USANDO NAVEGAÇÃO
      if (navigation) {
        navigation.replace('Login');
      }

    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* 🖼️ LOGO */}
      <View style={styles.logoBox}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 📘 TÍTULO */}
      <Text style={styles.title}>
        Estante Universitária
      </Text>

      {/* ✨ SUBTÍTULO */}
      <Text style={styles.subtitle}>
        A curadoria do conhecimento
      </Text>

      {/* 🔄 LOADING */}
      <ActivityIndicator
        size="large"
        color="#1D4ED8"
        style={styles.loader}
      />

      {/* 🔤 TEXTO */}
      <Text style={styles.loadingText}>
        SINCRONIZANDO ACERVO
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // 📦 BOX DA LOGO
  logoBox: {
    width: 190,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  // 🖼️ LOGO GRANDE
  logo: {
    width: 180,
    height: 180,
  },

  // 📘 TÍTULO
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  // ✨ SUBTÍTULO
  subtitle: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },

  // 🔄 LOADING
  loader: {
    marginTop: 45,
  },

  // 🔤 TEXTO INFERIOR
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#9ca3af',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

});