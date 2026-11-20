import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, PALETTE } from '../constants/theme';
import { User } from '../models/types';
import { DEFAULT_USER } from '../services/storage';

interface LoginScreenProps {
  theme: AppTheme;
  onLoginSuccess: (user: User) => void;
  onToggleTheme: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  theme,
  onLoginSuccess,
  onToggleTheme,
}) => {
  const { colors, radii, shadows } = theme;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Reset previous error
    setErrorMessage('');

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Validasi Input Kosong
    if (!cleanUsername && !cleanPassword) {
      setErrorMessage('Username dan password wajib diisi.');
      return;
    }
    if (!cleanUsername) {
      setErrorMessage('Silakan masukkan username Anda.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Silakan masukkan password Anda.');
      return;
    }

    // 2. Validasi Panjang Password (minimal 4 karakter)
    if (cleanPassword.length < 4) {
      setErrorMessage('Password minimal harus memiliki 4 karakter.');
      return;
    }

    setIsLoading(true);

    // Simulate slight authentic network authentication latency
    setTimeout(() => {
      setIsLoading(false);

      // Credential validation (supports demo credentials and flexible admin login)
      if (
        (cleanUsername.toLowerCase() === 'admin' && cleanPassword === 'admin123') ||
        (cleanUsername.toLowerCase() === 'septianto' && cleanPassword === 'guru123') ||
        (cleanUsername.toLowerCase() === 'farhaan' && cleanPassword === 'siswa123') ||
        cleanPassword === 'admin123'
      ) {
        let authUser: User = { ...DEFAULT_USER };
        if (cleanUsername.toLowerCase() === 'septianto') {
          authUser = {
            username: 'septianto',
            name: 'Septianto Raharso, S.Kom., M.Pd.',
            role: 'Guru Mata Pelajaran Pemrograman Mobile',
            school: 'SMK Plus Pelita Nusantara Bogor',
            nip: 'NIG 0180179036',
            email: 'septianto@smkpluspnb.sch.id',
            avatar: '👨‍🏫',
          };
        } else if (cleanUsername.toLowerCase() === 'farhaan') {
          authUser = {
            username: 'farhaan',
            name: 'Farhaan Shaikh',
            role: 'Siswa Kelas XI RPL 1',
            school: 'SMK Plus Pelita Nusantara Bogor',
            nip: 'NIS 23241005',
            email: 'farhaan.shaikh@smkpluspnb.sch.id',
            avatar: '🧑‍🎓',
          };
        } else {
          authUser.username = cleanUsername;
        }

        onLoginSuccess(authUser);
      } else {
        setErrorMessage('Username atau password salah! Gunakan akun demo di bawah.');
      }
    }, 600);
  };

  const fillQuickCredential = (userVal: string, passVal: string) => {
    setUsername(userVal);
    setPassword(passVal);
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Dark/Light Theme Switch */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={theme.isDark ? 'sunny' : 'moon'}
              size={18}
              color={theme.isDark ? '#F59E0B' : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Branding Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.xl,
            },
            shadows.button,
          ]}
        >
          {/* Subtle Decorative Circle */}
          <View style={[styles.decorCircle, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]} />

          <View style={[styles.schoolIconCircle, { backgroundColor: colors.secondary }]}>
            <Ionicons name="school" size={36} color={colors.primary} />
          </View>

          <Text style={styles.schoolTitle}>SMK PLUS PELITA NUSANTARA</Text>
          <Text style={styles.schoolSubtitle}>Asesmen Sumatif Pemrograman Perangkat Bergerak</Text>

          <View style={[styles.systemBadge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
            <Text style={styles.systemBadgeText}>Aplikasi Manajemen Data Siswa</Text>
          </View>
        </View>

        {/* Login Form Box */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
            },
            shadows.card,
          ]}
        >
          <View style={styles.formHeader}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Selamat Datang</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Silakan masuk untuk mengelola data siswa XI RPL
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={[styles.errorBox, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Username Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Username</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  borderRadius: radii.md,
                },
              ]}
            >
              <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Masukkan username (contoh: admin)"
                placeholderTextColor={colors.inputPlaceholder}
                value={username}
                onChangeText={(val) => {
                  setUsername(val);
                  if (errorMessage) setErrorMessage('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {username.length > 0 && (
                <TouchableOpacity onPress={() => setUsername('')} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  borderRadius: radii.md,
                },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Masukkan password (minimal 4 karakter)"
                placeholderTextColor={colors.inputPlaceholder}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.clearBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Login Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: radii.md,
                opacity: isLoading ? 0.7 : 1,
              },
              shadows.button,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Masuk ke Aplikasi</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Quick Demo Credentials for Grading */}
          <View style={[styles.demoCredentialsBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>
              Akses Cepat Penguji / Guru:
            </Text>
            <View style={styles.demoChipsRow}>
              <TouchableOpacity
                style={[styles.demoChip, { backgroundColor: colors.secondary, borderColor: colors.primaryLight }]}
                onPress={() => fillQuickCredential('admin', 'admin123')}
                activeOpacity={0.7}
              >
                <Ionicons name="shield-checkmark" size={14} color={colors.primaryDark} />
                <Text style={[styles.demoChipText, { color: colors.primaryDark }]}>
                  Admin (admin / admin123)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoChip, { backgroundColor: colors.secondary, borderColor: colors.primaryLight }]}
                onPress={() => fillQuickCredential('septianto', 'guru123')}
                activeOpacity={0.7}
              >
                <Ionicons name="school-outline" size={14} color={colors.primaryDark} />
                <Text style={[styles.demoChipText, { color: colors.primaryDark }]}>
                  Guru Mapel (septianto / guru123)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            XI Rekayasa Perangkat Lunak 1 & 2 • Tahun Ajaran 2026/2027
          </Text>
          <Text style={[styles.footerSubText, { color: colors.textMuted }]}>
            Pembimbing: Septianto Raharso, S.Kom., M.Pd.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroCard: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  decorCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -40,
    right: -30,
  },
  schoolIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  schoolTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  schoolSubtitle: {
    color: '#F1F5F9',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  systemBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  systemBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderWidth: 1,
  },
  formHeader: {
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  formSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  demoCredentialsBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoChipsRow: {
    flexDirection: 'column',
    gap: 8,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  demoChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footerSubText: {
    fontSize: 10,
    marginTop: 3,
  },
});
