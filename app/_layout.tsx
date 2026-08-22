import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <AppNavbar />
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="herd-setup" options={{ headerShown: false }} />
        <Stack.Screen name="piggy-setup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="feeding" options={{ headerShown: false }} />
        <Stack.Screen name="foods" options={{ headerShown: false }} />
        <Stack.Screen name="herds" options={{ headerShown: false }} />
        <Stack.Screen name="herd-details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="info/terms" options={{ headerShown: false }} />
        <Stack.Screen name="info/privacy" options={{ headerShown: false }} />
        <Stack.Screen name="info/contact" options={{ headerShown: false }} />
        <Stack.Screen name="info/help" options={{ headerShown: false }} />
        <Stack.Screen name="statistics" options={{ headerShown: false }} />
        <Stack.Screen name="piggies" options={{ headerShown: false }} />
        <Stack.Screen name="piggies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/change-password" options={{ headerShown: false }} />
        <Stack.Screen name="about/index" options={{ headerShown: false }} />
      </Stack>
    <AppFooter />
       <StatusBar style="auto" />
  </ThemeProvider>
  );
}