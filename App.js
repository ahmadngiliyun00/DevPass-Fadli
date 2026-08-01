import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import Slider from '@react-native-community/slider';

// Palet resmi Universitas Insan Mahardika.
// Warna utama aplikasi ini mengikuti Program Studi Informatika (kuning emas).
// Varian "Terang" adalah versi lebih cerah dari warna resmi, dipakai untuk teks
// dan garis di atas latar gelap agar tetap terbaca.
const BRAND = {
  informatika: '#F0B90B', // Informatika — warna utama
  informatikaTerang: '#FFD75E',
  fmt: '#FB7A1E', // FMT — kekuatan sandi sedang
  fkes: '#7ED957', // FKES — kekuatan sandi kuat
  rmikTerang: '#E85555', // RMIK (dicerahkan) — kekuatan sandi lemah
  kesmasTerang: '#8B5BD6', // KESMAS (dicerahkan) — aksen sekunder
  tinta: '#030712',
  putih: '#FFFFFF',
};

// Mendapatkan dimensi layar untuk styling yang responsif
const { width } = Dimensions.get('window');

// =========================================================================
// 1. FUNGSI UTAMA & HELPER (Murni Logika Password / Token Generator)
// =========================================================================

/**
 * Menghasilkan password acak berdasarkan panjang dan kategori karakter yang aktif.
 * Mengimplementasikan jaminan minimal satu karakter dari setiap kategori terpilih.
 * 
 * @param {number} length - Panjang password
 * @param {object} options - Opsi kategori karakter (lowercase, uppercase, numbers, symbols)
 * @returns {string} Password yang dihasilkan
 */
const generatePassword = (length, options) => {
  const { lowercase, uppercase, numbers, symbols } = options;
  
  // Mengumpulkan seluruh karakter yang diperbolehkan
  let charSet = '';
  const activeSets = [];

  if (lowercase) {
    charSet += 'abcdefghijklmnopqrstuvwxyz';
    activeSets.push('abcdefghijklmnopqrstuvwxyz');
  }
  if (uppercase) {
    charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    activeSets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }
  if (numbers) {
    charSet += '0123456789';
    activeSets.push('0123456789');
  }
  if (symbols) {
    charSet += '!@#$%^&*';
    activeSets.push('!@#$%^&*');
  }

  // Jika tidak ada kategori yang aktif, return string kosong
  if (charSet.length === 0) return '';

  const guaranteedChars = [];
  
  // Menjamin minimal ada satu karakter dari setiap kategori yang aktif
  activeSets.forEach(set => {
    guaranteedChars.push(set.charAt(Math.floor(Math.random() * set.length)));
  });

  // Melengkapi sisa panjang password dengan karakter acak dari set gabungan
  const remainingLength = length - guaranteedChars.length;
  let remainingChars = '';
  for (let i = 0; i < remainingLength; i++) {
    remainingChars += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  // Menggabungkan karakter jaminan dan sisa, lalu mengacaknya (shuffle)
  const combined = (guaranteedChars.join('') + remainingChars).split('');
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  // Memotong hasil sesuai panjang yang diminta untuk mengantisipasi edge case length < activeSets
  return combined.slice(0, length).join('');
};

/**
 * Menghasilkan PIN acak (hanya angka).
 * 
 * @param {number} length - Panjang PIN
 * @returns {string} PIN numerik
 */
const generatePIN = (length) => {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
};

/**
 * Menghasilkan Token acak berformat serial key (misal: AB3K-X92P-Q8TR).
 * Alfanumerik kapital dipisahkan dengan tanda hubung setiap 4 karakter.
 * 
 * @param {number} length - Panjang target (dibulatkan ke kelipatan 4 terdekat)
 * @returns {string} Token terformat
 */
const generateToken = (length) => {
  // Membulatkan panjang ke kelipatan 4 terdekat agar pembagian grup pas
  const adjustedLength = Math.max(8, Math.round(length / 4) * 4);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < adjustedLength; i++) {
    // Menambahkan tanda hubung setelah setiap 4 karakter
    if (i > 0 && i % 4 === 0) {
      result += '-';
    }
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Menghitung tingkat kekuatan (Strength) password berdasarkan panjang dan kompleksitas.
 * Dioptimalkan untuk membaca isi karakter aktual tanpa terikat variabel konfigurasi switch eksternal.
 * 
 * @param {string} pwd - Password/PIN/Token yang diuji
 * @param {string} type - Tipe (password, pin, token)
 * @returns {string} Kategori kekuatan ('Weak' | 'Medium' | 'Strong')
 */
const calculateStrength = (pwd, type) => {
  if (!pwd) return 'Weak';

  // Kalkulasi kekuatan untuk PIN (Hanya angka)
  if (type === 'pin') {
    if (pwd.length < 10) return 'Weak';
    if (pwd.length < 16) return 'Medium';
    return 'Strong';
  }

  // Kalkulasi kekuatan untuk Token (Alfanumerik kapital berformat)
  if (type === 'token') {
    const rawLength = pwd.replace(/-/g, '').length;
    if (rawLength < 12) return 'Medium';
    return 'Strong';
  }

  // Kalkulasi kekuatan untuk Password Standard berdasarkan karakter aktual
  let score = 0;

  // 1. Poin berdasarkan panjang password
  if (pwd.length >= 16) {
    score += 3;
  } else if (pwd.length >= 10) {
    score += 2;
  } else {
    score += 1;
  }

  // 2. Poin berdasarkan keragaman karakter aktual yang terkandung
  let activeCategories = 0;
  if (/[a-z]/.test(pwd)) activeCategories++;
  if (/[A-Z]/.test(pwd)) activeCategories++;
  if (/[0-9]/.test(pwd)) activeCategories++;
  if (/[!@#$%^&*]/.test(pwd)) activeCategories++;

  score += activeCategories;

  // Penentuan kategori kekuatan berdasarkan total skor (Skor maks: 7)
  if (score <= 3) return 'Weak';
  if (score <= 5) return 'Medium';
  return 'Strong';
};

/**
 * Menyalin password ke clipboard secara aman dengan penanganan error.
 * 
 * @param {string} pwd - Teks password yang akan dicopy
 */
const copyPassword = async (pwd) => {
  if (!pwd) return;
  try {
    const success = await Clipboard.setStringAsync(pwd);
    if (success) {
      Alert.alert(
        '🔒 SYSTEM ACCESS',
        'Data copied successfully to clipboard.',
        [{ text: ' CONFIRM ', style: 'default' }]
      );
    } else {
      throw new Error('Clipboard operation returned failure');
    }
  } catch (error) {
    Alert.alert(
      '⚠️ SYSTEM ERROR',
      'Failed to copy data to clipboard. Please try again.',
      [{ text: 'DISMISS', style: 'destructive' }]
    );
  }
};

// =========================================================================
// 2. KOMPONEN UTAMA (App)
// =========================================================================
export default function App() {
  
  // State manajemen aplikasi
  const [passwordType, setPasswordType] = useState('password'); // tipe: 'password' | 'pin' | 'token'
  const [passwordLength, setPasswordLength] = useState(16);     // panjang stabil untuk generator
  const [displayLength, setDisplayLength] = useState(16);       // panjang realtime untuk kelancaran UI
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strength, setStrength] = useState('Weak');
  const [history, setHistory] = useState([]);                  // riwayat 5 password terakhir

  // Validasi: Apakah semua switch dimatikan pada tipe 'password'
  const isInvalid = 
    passwordType === 'password' && 
    !includeLowercase && 
    !includeUppercase && 
    !includeNumbers && 
    !includeSymbols;

  /**
   * Fungsi untuk memicu pembuatan password baru.
   * 
   * @param {boolean} addToHistory - Menentukan apakah hasil generate dimasukkan ke riwayat.
   * Ini mencegah riwayat terisi sampah saat menyeret slider.
   */
  const handleGenerate = useCallback((addToHistory = false) => {
    if (passwordType === 'password' && isInvalid) {
      setGeneratedPassword('');
      setStrength('Weak');
      return;
    }

    let newPassword = '';
    
    // Memanggil generator spesifik berdasarkan tipe terpilih
    if (passwordType === 'password') {
      newPassword = generatePassword(passwordLength, {
        lowercase: includeLowercase,
        uppercase: includeUppercase,
        numbers: includeNumbers,
        symbols: includeSymbols
      });
    } else if (passwordType === 'pin') {
      newPassword = generatePIN(passwordLength);
    } else if (passwordType === 'token') {
      newPassword = generateToken(passwordLength);
    }

    setGeneratedPassword(newPassword);

    // Mengalkulasi kekuatan password secara aman
    const computedStrength = calculateStrength(newPassword, passwordType);
    setStrength(computedStrength);

    // Memasukkan hasil generate ke dalam riwayat jika diinstruksikan dan valid
    if (addToHistory && newPassword) {
      setHistory(prev => {
        // Hapus duplikat lama untuk mencegah rendering item ganda di dalam flat logs
        const filtered = prev.filter(item => item !== newPassword);
        return [newPassword, ...filtered].slice(0, 5);
      });
    }
  }, [passwordType, passwordLength, includeLowercase, includeUppercase, includeNumbers, includeSymbols, isInvalid]);

  // Efek samping untuk regenerasi password otomatis saat opsi konfigurasi berubah
  useEffect(() => {
    handleGenerate(false);
  }, [handleGenerate]);

  // Menyinkronkan displayLength apabila passwordLength berubah secara programmatis
  useEffect(() => {
    setDisplayLength(passwordLength);
  }, [passwordLength]);

  // Helper untuk mendapatkan warna berdasarkan tingkat kekuatan password
  const getStrengthColor = () => {
    switch (strength) {
      case 'Strong':
        return BRAND.fkes; // Hijau Neon
      case 'Medium':
        return BRAND.fmt; // Kuning Neon
      case 'Weak':
      default:
        return BRAND.rmikTerang; // Merah Neon
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerTag}>
            <View style={styles.pulseDot} />
            <Text style={styles.headerTagText}>SECURE PROTOCOL ACTIVE</Text>
          </View>
          <Text style={styles.headerTitle}>
            DEVPASS<Text style={styles.headerCursor}>_</Text>
          </Text>
          <Text style={styles.headerSubtitle}>V1.0.4 // RANDOM CRYPTO ENGINE</Text>
          <View style={styles.headerLineContainer}>
            <View style={styles.headerLine} />
            <View style={styles.headerLineAccent} />
          </View>
        </View>

        {/* PASSWORD DISPLAY CARD */}
        <View style={[styles.card, styles.glowCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>&gt;_ SYSTEM_KEY_READOUT</Text>
            <View style={[styles.statusBadge, { borderColor: getStrengthColor() + '40', backgroundColor: getStrengthColor() + '10' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStrengthColor() }]} />
              <Text style={[styles.statusText, { color: getStrengthColor() }]}>
                {strength.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.passwordContainer}>
            {isInvalid ? (
              <Text style={styles.errorText}>[ ERROR: SELECT AT LEAST ONE PARAMETER ]</Text>
            ) : (
              <Text 
                style={[
                  styles.passwordText, 
                  { fontSize: (generatedPassword || '').length > 32 ? 13 : (generatedPassword || '').length > 20 ? 15 : 18 }
                ]} 
                selectable={true}
              >
                {generatedPassword || 'INITIALIZING...'}
              </Text>
            )}
            <View style={styles.cardDecorationTL} />
            <View style={styles.cardDecorationBR} />
          </View>

          <TouchableOpacity 
            style={[styles.copyButton, isInvalid && styles.disabledButton]} 
            onPress={() => copyPassword(generatedPassword)}
            disabled={isInvalid || !generatedPassword}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Copy generated password key output"
          >
            <Text style={styles.copyButtonText}>[ EXTRACT & COPY KEY ]</Text>
          </TouchableOpacity>
        </View>

        {/* PASSWORD TYPE SELECTOR */}
        <Text style={styles.sectionTitle}>// ENGINE SELECTOR</Text>
        <View style={styles.segmentContainer}>
          {['password', 'pin', 'token'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.segmentButton,
                passwordType === type && styles.segmentButtonActive
              ]}
              onPress={() => setPasswordType(type)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="tab"
              accessibilityLabel={`Select generator type ${type}`}
            >
              <Text 
                style={[
                  styles.segmentText,
                  passwordType === type && styles.segmentTextActive
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumScaleFactor={0.8}
              >
                {passwordType === type ? `> ${type.toUpperCase()}` : type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LENGTH SECTION */}
        <View style={styles.lengthHeader}>
          <Text style={styles.sectionTitle}>// ENTROPY LENGTH CONFIG</Text>
          <View style={styles.lengthValueContainer}>
            <Text style={styles.lengthValue}>
              {passwordType === 'token' 
                ? `${Math.max(8, Math.round(displayLength / 4) * 4)}` 
                : `${displayLength}`}
            </Text>
            <Text style={styles.lengthValueSuffix}> CHARS</Text>
          </View>
        </View>
        <View style={styles.sliderCard}>
          <Slider
            minimumValue={8}
            maximumValue={64}
            step={1}
            value={displayLength}
            onValueChange={(val) => setDisplayLength(val)}
            onSlidingComplete={(val) => setPasswordLength(val)}
            minimumTrackTintColor={BRAND.informatika}
            maximumTrackTintColor="#1F2937"
            thumbTintColor={BRAND.informatika}
            style={styles.slider}
          />
          <View style={styles.sliderRangeContainer}>
            <Text style={styles.sliderRangeText}>08 [MIN]</Text>
            <View style={styles.sliderTicks}>
              <Text style={styles.sliderTick}>.</Text>
              <Text style={styles.sliderTick}>.</Text>
              <Text style={styles.sliderTick}>.</Text>
              <Text style={styles.sliderTick}>.</Text>
              <Text style={styles.sliderTick}>.</Text>
            </View>
            <Text style={styles.sliderRangeText}>64 [MAX]</Text>
          </View>
        </View>

        {/* OPTIONS SECTION */}
        <Text style={styles.sectionTitle}>// CHARACTER PARAMETERS</Text>
        <View style={[styles.optionsCard, passwordType !== 'password' && styles.disabledCard]}>
          
          {/* Status Indicator jika Switch Dinonaktifkan */}
          {passwordType !== 'password' && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockText}>
                ⚠️ ACCESS BLOCKED: ACTIVE TILE OVERRIDE ({passwordType.toUpperCase()})
              </Text>
            </View>
          )}

          {/* Option: Lowercase */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionLabel, includeLowercase && styles.neonTextBlue]}>
                {includeLowercase ? '[+] Lowercase Set' : '[-] Lowercase Set'}
              </Text>
              <Text style={styles.optionDesc}>a-z character collection</Text>
            </View>
            <Switch
              value={includeLowercase}
              onValueChange={(val) => setIncludeLowercase(val)}
              disabled={passwordType !== 'password'}
              trackColor={{ false: '#1F2937', true: 'rgba(240, 185, 11, 0.4)' }}
              thumbColor={includeLowercase ? BRAND.informatika : '#64748B'}
            />
          </View>

          <View style={styles.divider} />

          {/* Option: Uppercase */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionLabel, includeUppercase && styles.neonTextBlue]}>
                {includeUppercase ? '[+] Uppercase Set' : '[-] Uppercase Set'}
              </Text>
              <Text style={styles.optionDesc}>A-Z character collection</Text>
            </View>
            <Switch
              value={includeUppercase}
              onValueChange={(val) => setIncludeUppercase(val)}
              disabled={passwordType !== 'password'}
              trackColor={{ false: '#1F2937', true: 'rgba(240, 185, 11, 0.4)' }}
              thumbColor={includeUppercase ? BRAND.informatika : '#64748B'}
            />
          </View>

          <View style={styles.divider} />

          {/* Option: Numbers */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionLabel, includeNumbers && styles.neonTextBlue]}>
                {includeNumbers ? '[+] Numeric Set' : '[-] Numeric Set'}
              </Text>
              <Text style={styles.optionDesc}>0-9 numerical digits</Text>
            </View>
            <Switch
              value={includeNumbers}
              onValueChange={(val) => setIncludeNumbers(val)}
              disabled={passwordType !== 'password'}
              trackColor={{ false: '#1F2937', true: 'rgba(240, 185, 11, 0.4)' }}
              thumbColor={includeNumbers ? BRAND.informatika : '#64748B'}
            />
          </View>

          <View style={styles.divider} />

          {/* Option: Symbols */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionLabel, includeSymbols && styles.neonTextBlue]}>
                {includeSymbols ? '[+] Special Symbols' : '[-] Special Symbols'}
              </Text>
              <Text style={styles.optionDesc}>!@#$%^&* unique symbols</Text>
            </View>
            <Switch
              value={includeSymbols}
              onValueChange={(val) => setIncludeSymbols(val)}
              disabled={passwordType !== 'password'}
              trackColor={{ false: '#1F2937', true: 'rgba(240, 185, 11, 0.4)' }}
              thumbColor={includeSymbols ? BRAND.informatika : '#64748B'}
            />
          </View>
        </View>

        {/* VALIDATION ERROR DIALOG IN-LINE */}
        {isInvalid && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              ⚠️ VALIDATION ERROR: At least one character parameter must be enabled.
            </Text>
          </View>
        )}

        {/* STRENGTH ANALYZER VISUAL SECTION */}
        <Text style={styles.sectionTitle}>// DECRYPTION DEFENSE METRICS</Text>
        <View style={styles.card}>
          <View style={styles.strengthInfoRow}>
            <Text style={styles.strengthLabel}>Complexity Matrix</Text>
            <Text style={[styles.strengthLevelText, { color: getStrengthColor() }]}>
              {strength.toUpperCase()}
            </Text>
          </View>
          <View style={styles.strengthBlocksContainer}>
            {/* Block 1 */}
            <View 
              style={[
                styles.strengthBlock, 
                { backgroundColor: strength === 'Weak' || strength === 'Medium' || strength === 'Strong' ? getStrengthColor() : '#1e293b' }
              ]} 
            />
            {/* Block 2 */}
            <View 
              style={[
                styles.strengthBlock, 
                { backgroundColor: strength === 'Medium' || strength === 'Strong' ? getStrengthColor() : '#1e293b' }
              ]} 
            />
            {/* Block 3 */}
            <View 
              style={[
                styles.strengthBlock, 
                { backgroundColor: strength === 'Strong' ? getStrengthColor() : '#1e293b' }
              ]} 
            />
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, isInvalid && styles.disabledButton]}
            onPress={() => handleGenerate(true)}
            disabled={isInvalid}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Execute crypt key generation process"
          >
            <Text style={styles.primaryBtnText}>EXECUTE GENERATE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, isInvalid && styles.disabledButton]}
            onPress={() => handleGenerate(true)}
            disabled={isInvalid}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Regenerate secure code using current attributes"
          >
            <Text style={styles.secondaryBtnText}>RE-GENERATE SOURCE</Text>
          </TouchableOpacity>
        </View>

        {/* HISTORY SECTION */}
        <Text style={styles.sectionTitle}>// TERMINAL_HISTORY_LOGS</Text>
        <View style={styles.historyCard}>
          {history.length === 0 ? (
            <Text style={styles.emptyHistoryText}>[ SECURE BUFFER EMPTY: NO RECENT ENTRIES ]</Text>
          ) : (
            history.map((item, index) => {
              const itemStrength = calculateStrength(item, item.includes('-') ? 'token' : /^\d+$/.test(item) ? 'pin' : 'password');
              
              const itemColor = 
                itemStrength === 'Strong' ? BRAND.fkes :
                itemStrength === 'Medium' ? BRAND.fmt : BRAND.rmikTerang;

              return (
                <View key={item}>
                  {index > 0 && <View style={styles.historyDivider} />}
                  <TouchableOpacity
                    style={styles.historyItem}
                    onPress={() => copyPassword(item)}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Copy historical log item number ${index + 1}: ${item}`}
                  >
                    <Text style={styles.historyNumber}>SYS_LOG.0{index + 1}</Text>
                    <Text style={styles.historyText} numberOfLines={1} ellipsizeMode="middle">
                      {item}
                    </Text>
                    <View style={[styles.historyBadge, { borderColor: itemColor + '30', backgroundColor: itemColor + '10' }]}>
                      <Text style={[styles.historyBadgeText, { color: itemColor }]}>
                        {itemStrength.toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// =========================================================================
// 3. STYLESHEET (Cyberpunk & Cyber Security Design System)
// =========================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712', // Ultra dark background void
    paddingTop: Platform.OS === 'ios' ? 50 : (RNStatusBar.currentHeight || 24) + 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 56 : 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  // Header Style
  header: {
    marginTop: 10,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(126, 217, 87, 0.1)',
    borderColor: 'rgba(126, 217, 87, 0.25)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND.fkes,
    marginRight: 6,
  },
  headerTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: BRAND.fkes,
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textShadowColor: 'rgba(139, 91, 214, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  headerCursor: {
    color: BRAND.informatika,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748B',
    letterSpacing: 2.5,
    marginTop: 6,
    fontWeight: 'bold',
  },
  headerLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    height: 2,
    marginTop: 14,
  },
  headerLine: {
    flex: 4,
    height: 1,
    backgroundColor: 'rgba(139, 91, 214, 0.2)',
  },
  headerLineAccent: {
    flex: 1,
    height: 2,
    backgroundColor: BRAND.informatika,
    marginLeft: 4,
  },

  // Cards
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
  },
  glowCard: {
    borderColor: 'rgba(240, 185, 11, 0.3)',
    shadowColor: BRAND.informatika,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 1,
  },

  // Badge Status Kekuatan
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Password Box
  passwordContainer: {
    backgroundColor: '#050816',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  cardDecorationTL: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: BRAND.informatika,
  },
  cardDecorationBR: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 6,
    height: 6,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: BRAND.informatika,
  },
  passwordText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },
  errorText: {
    fontSize: 11,
    color: BRAND.rmikTerang,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },

  // Action Button dalam output card
  copyButton: {
    backgroundColor: 'rgba(240, 185, 11, 0.1)',
    borderColor: BRAND.informatika,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: BRAND.informatika,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1.5,
  },

  // Label Section
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BRAND.kesmasTerang,
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 6,
  },

  // Segment Buttons (Password, PIN, Token)
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  segmentButtonActive: {
    backgroundColor: BRAND.kesmasTerang,
    shadowColor: BRAND.kesmasTerang,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 1,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },

  // Slider Section
  lengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lengthValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  lengthValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: BRAND.informatika,
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },
  lengthValueSuffix: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
  },
  sliderCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  sliderRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  sliderRangeText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: 'bold',
  },
  sliderTicks: {
    flexDirection: 'row',
    opacity: 0.3,
  },
  sliderTick: {
    color: '#64748B',
    marginHorizontal: 15,
    fontSize: 12,
    bottom: 4,
  },

  // Options Section (Switch)
  optionsCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.4,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lockText: {
    color: BRAND.fmt,
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionInfo: {
    flex: 1,
    marginRight: 12,
    flexDirection: 'column',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  neonTextBlue: {
    color: BRAND.informatika,
    textShadowColor: 'rgba(240, 185, 11, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  optionDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 4,
  },

  // Error Banner
  errorBanner: {
    backgroundColor: 'rgba(232, 85, 85, 0.08)',
    borderWidth: 1,
    borderColor: BRAND.rmikTerang,
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: BRAND.rmikTerang,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Strength visual
  strengthInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  strengthLevelText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  strengthBlocksContainer: {
    flexDirection: 'row',
    height: 8,
    marginTop: 8,
    gap: 6,
  },
  strengthBlock: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
  },

  // Main Action Buttons
  actionContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
  primaryBtn: {
    // Tombol aksi utama memakai kuning Informatika sebagai warna utama merek
    backgroundColor: BRAND.informatika,
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: BRAND.informatika,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryBtnText: {
    // Teks gelap di atas kuning agar kontrasnya tetap tinggi
    color: BRAND.tinta,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND.informatika,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: BRAND.informatika,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  disabledButton: {
    opacity: 0.4,
    backgroundColor: '#111827',
    borderColor: '#1e293b',
  },

  // History Section
  historyCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  emptyHistoryText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 12,
    letterSpacing: 1.5,
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyNumber: {
    fontSize: 11,
    color: BRAND.kesmasTerang,
    marginRight: 10,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },
  historyText: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    letterSpacing: 1,
    ...Platform.select({
      ios: { fontFamily: 'Courier' },
      android: { fontFamily: 'monospace' },
    }),
  },
  historyBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 10,
  },
  historyBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#1e293b',
  },
});
