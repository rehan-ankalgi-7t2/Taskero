import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{headerShown: false}}/>
          <Stack.Screen name="onboarding/onboarding-start" options={{headerShown: false}}/>
          <Stack.Screen name="login" options={{headerShown: false}}/>
          <Stack.Screen name="notification" options={{headerShown: false}}/>
          <Stack.Screen name="create-todo" options={{
            headerShown: true, 
            headerStyle: {
              backgroundColor: Colors.light.tint,
            },
            headerTintColor: "white"
          }}/>
          {/* Dynamic Route (No need to explicitly define [id]) */}
          <Stack.Screen
            name="todo/[id]"
            options={{
              headerShown: true,
              title: "Todo Details",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
