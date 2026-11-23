import { registerRootComponent } from 'expo';
import App from './App';

// Registra o componente raiz garantindo compatibilidade com Expo Go, builds nativos (Android/iOS) e Web em monorepos
registerRootComponent(App);
