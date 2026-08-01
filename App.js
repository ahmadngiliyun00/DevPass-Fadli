import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import GeneratorScreen from './src/screens/GeneratorScreen';

/**
 * Dev Pass — pembangkit kata sandi, PIN, dan token acak yang aman.
 *
 * Struktur proyek:
 *   src/lib        — logika murni (sumber acak, pembangkit, penilaian kekuatan)
 *   src/hooks      — state aplikasi
 *   src/components — komponen antarmuka
 *   src/screens    — susunan layar
 *   src/theme.js   — sistem desain (warna, jarak, tipografi)
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Android SDK 56 memakai mode edge-to-edge, jadi latar bilah status
          diambil dari latar layar dan bukan dari prop StatusBar. */}
      <StatusBar style="light" />
      <GeneratorScreen />
    </SafeAreaProvider>
  );
}
