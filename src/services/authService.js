
// Importa funções de autenticação do Firebase
// - login com email/senha
// - criação de conta
// - logout do usuário
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

// Instância de autenticação configurada do Firebase
import { auth } from './API_Firebase';

/**
 * Realiza login do usuário com email e senha
 * Retorna o objeto do usuário autenticado
 */
export async function login(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    // Propaga o erro para ser tratado na camada de UI
    throw error;
  }
}

/**
 * Cria uma nova conta de usuário com email e senha
 * Retorna o usuário criado
 */
export async function cadastro(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    // Propaga erro para tratamento externo
    throw error;
  }
}

/**
 * Realiza logout do usuário autenticado
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    // Propaga erro para tratamento externo
    throw error;
  }
}