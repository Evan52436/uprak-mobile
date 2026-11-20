import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { Student } from '../models/types';

interface AddStudentScreenProps {
  theme: AppTheme;
  existingStudents: Student[];
  onSaveStudent: (studentData: Omit<Student, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AVAILABLE_AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🧑‍🎓', '👩‍🔬', '👨‍💼', '👩‍💼', '🧑‍💼', '👩‍🎨', '👨‍🎨', '🧑‍💻'];
const AVAILABLE_CLASSES = ['XI RPL 1', 'XI RPL 2', 'XI RPL 3'];

export const AddStudentScreen: React.FC<AddStudentScreenProps> = ({
  theme,
  existingStudents,
  onSaveStudent,
  onCancel,
}) => {
  const { colors, radii, shadows } = theme;

  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('XI RPL 1');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🎓');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 1. Validasi NIS
    const cleanNis = nis.trim();
    if (!cleanNis) {
      newErrors.nis = 'NIS wajib diisi.';
    } else if (!/^\d+$/.test(cleanNis)) {
      newErrors.nis = 'NIS harus berupa angka numerik.';
    } else if (cleanNis.length < 4) {
      newErrors.nis = 'NIS minimal harus 4 digit angka.';
    } else if (existingStudents.some((s) => s.nis === cleanNis)) {
      newErrors.nis = `NIS ${cleanNis} sudah terdaftar pada siswa lain!`;
    }

    // 2. Validasi Nama Siswa
    const cleanNama = nama.trim();
    if (!cleanNama) {
      newErrors.nama = 'Nama siswa wajib diisi.';
    } else if (cleanNama.length < 3) {
      newErrors.nama = 'Nama siswa minimal 3 karakter.';
    }

    // 3. Validasi Kelas
    if (!kelas) {
      newErrors.kelas = 'Pilih kelas siswa.';
    }

    // 4. Validasi Alamat
    const cleanAlamat = alamat.trim();
    if (!cleanAlamat) {
      newErrors.alamat = 'Alamat domisili siswa wajib diisi.';
    } else if (cleanAlamat.length < 5) {
      newErrors.alamat = 'Alamat terlalu singkat (minimal 5 karakter).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSaveStudent({
      nis: nis.trim(),
      nama: nama.trim(),
      kelas,
      jenisKelamin,
      alamat: alamat.trim(),
      telepon: telepon.trim() || undefined,
      avatar: selectedAvatar,
      status: 'Aktif',
    });

    // Reset fields
    setNis('');
    setNama('');
    setAlamat('');
    setTelepon('');
    setErrors({});
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
        {/* Header Title Banner */}
        <View style={styles.titleHeader}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>Tambah Data Siswa</Text>
          <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
            Masukkan informasi lengkap data siswa baru SMK Plus Pelita Nusantara
          </Text>
        </View>

        {/* Main Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
            },
            shadows.card,
          ]}
        >
          {/* Avatar Selector Preview */}
          <View style={styles.avatarSection}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Pilih Foto Profil / Avatar Siswa</Text>
            <View style={styles.avatarRow}>
              {AVAILABLE_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av;
                return (
                  <TouchableOpacity
                    key={av}
                    style={[
                      styles.avatarPickBtn,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedAvatar(av)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.avatarPickEmoji}>{av}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Form Input: NIS */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Nomor Induk Siswa (NIS) *</Text>
              <Text style={[styles.helperBadge, { color: colors.primaryDark }]}>Wajib Angka</Text>
            </View>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: errors.nis ? colors.danger : colors.inputBorder,
                  borderRadius: radii.md,
                },
              ]}
            >
              <Ionicons name="card-outline" size={20} color={colors.primary} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Contoh: 23241011"
                placeholderTextColor={colors.inputPlaceholder}
                value={nis}
                onChangeText={(val) => {
                  setNis(val);
                  if (errors.nis) setErrors({ ...errors, nis: '' });
                }}
                keyboardType="numeric"
              />
            </View>
            {errors.nis ? <Text style={[styles.errorMsg, { color: colors.danger }]}>{errors.nis}</Text> : null}
          </View>

          {/* Form Input: Nama Lengkap */}
          <View style={styles.inputGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama Lengkap Siswa *</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: errors.nama ? colors.danger : colors.inputBorder,
                  borderRadius: radii.md,
                },
              ]}
            >
              <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Masukkan nama lengkap siswa"
                placeholderTextColor={colors.inputPlaceholder}
                value={nama}
                onChangeText={(val) => {
                  setNama(val);
                  if (errors.nama) setErrors({ ...errors, nama: '' });
                }}
              />
            </View>
            {errors.nama ? <Text style={[styles.errorMsg, { color: colors.danger }]}>{errors.nama}</Text> : null}
          </View>

          {/* Form Input: Kelas (Chips Selector) */}
          <View style={styles.inputGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Kelas Siswa *</Text>
            <View style={styles.classChipsRow}>
              {AVAILABLE_CLASSES.map((cls) => {
                const isSelected = kelas === cls;
                return (
                  <TouchableOpacity
                    key={cls}
                    style={[
                      styles.classChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primaryDark : colors.border,
                        borderRadius: radii.md,
                      },
                    ]}
                    onPress={() => setKelas(cls)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={isSelected ? '#FFFFFF' : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.classChipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {cls}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Form Input: Jenis Kelamin */}
          <View style={styles.inputGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Jenis Kelamin *</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor: jenisKelamin === 'Laki-laki' ? colors.secondary : colors.surfaceSubtle,
                    borderColor: jenisKelamin === 'Laki-laki' ? colors.primary : colors.border,
                    borderRadius: radii.md,
                  },
                ]}
                onPress={() => {
                  setJenisKelamin('Laki-laki');
                  if (selectedAvatar === '👩‍🎓') setSelectedAvatar('👨‍🎓');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="male" size={18} color={colors.primary} />
                <Text style={[styles.genderBtnText, { color: colors.text }]}>Laki-laki</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor: jenisKelamin === 'Perempuan' ? '#FCE7F3' : colors.surfaceSubtle,
                    borderColor: jenisKelamin === 'Perempuan' ? '#EC4899' : colors.border,
                    borderRadius: radii.md,
                  },
                ]}
                onPress={() => {
                  setJenisKelamin('Perempuan');
                  if (selectedAvatar === '👨‍🎓') setSelectedAvatar('👩‍🎓');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="female" size={18} color="#EC4899" />
                <Text style={[styles.genderBtnText, { color: colors.text }]}>Perempuan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Input: Alamat */}
          <View style={styles.inputGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Alamat Tempat Tinggal *</Text>
            <View
              style={[
                styles.textAreaWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: errors.alamat ? colors.danger : colors.inputBorder,
                  borderRadius: radii.md,
                },
              ]}
            >
              <TextInput
                style={[styles.textArea, { color: colors.text }]}
                placeholder="Contoh: Jl. Mayor Oking No. 12, Cibinong, Bogor"
                placeholderTextColor={colors.inputPlaceholder}
                value={alamat}
                onChangeText={(val) => {
                  setAlamat(val);
                  if (errors.alamat) setErrors({ ...errors, alamat: '' });
                }}
                multiline
                numberOfLines={3}
              />
            </View>
            {errors.alamat ? <Text style={[styles.errorMsg, { color: colors.danger }]}>{errors.alamat}</Text> : null}
          </View>

          {/* Optional Form Input: Telepon / Kontak */}
          <View style={styles.inputGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>No. Telepon / WhatsApp (Opsional)</Text>
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
              <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Contoh: 0812-3456-7890"
                placeholderTextColor={colors.inputPlaceholder}
                value={telepon}
                onChangeText={setTelepon}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  borderRadius: radii.md,
                },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: radii.md,
                },
                shadows.button,
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Simpan Data Siswa</Text>
            </TouchableOpacity>
          </View>
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
    padding: 18,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titleHeader: {
    width: '100%',
    maxWidth: 480,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  screenSubtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    borderWidth: 1,
  },
  avatarSection: {
    marginBottom: 18,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  avatarPickBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarPickEmoji: {
    fontSize: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  helperBadge: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  textAreaWrapper: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    fontSize: 14,
    minHeight: 65,
    textAlignVertical: 'top',
  },
  errorMsg: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 2,
  },
  classChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  classChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  classChipText: {
    fontSize: 12,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderWidth: 1.5,
  },
  genderBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
