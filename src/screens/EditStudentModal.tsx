import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { Student } from '../models/types';

interface EditStudentModalProps {
  visible: boolean;
  student: Student | null;
  theme: AppTheme;
  existingStudents: Student[];
  onSave: (updatedStudent: Student) => void;
  onCancel: () => void;
}

const AVAILABLE_AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🧑‍🎓', '👩‍🔬', '👨‍💼', '👩‍💼', '🧑‍💼', '👩‍🎨', '👨‍🎨', '🧑‍💻'];
const AVAILABLE_CLASSES = ['XI RPL 1', 'XI RPL 2', 'XI RPL 3'];
const AVAILABLE_STATUSES: ('Aktif' | 'Izin' | 'Alumni')[] = ['Aktif', 'Izin', 'Alumni'];

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  visible,
  student,
  theme,
  existingStudents,
  onSave,
  onCancel,
}) => {
  const { colors, radii, shadows } = theme;

  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('XI RPL 1');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Izin' | 'Alumni'>('Aktif');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🎓');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (student) {
      setNis(student.nis || '');
      setNama(student.nama || '');
      setKelas(student.kelas || 'XI RPL 1');
      setJenisKelamin(student.jenisKelamin || 'Laki-laki');
      setAlamat(student.alamat || '');
      setTelepon(student.telepon || '');
      setStatus(student.status || 'Aktif');
      setSelectedAvatar(student.avatar || (student.jenisKelamin === 'Perempuan' ? '👩‍🎓' : '👨‍🎓'));
      setErrors({});
    }
  }, [student]);

  if (!student) return null;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 1. Validasi NIS
    const cleanNis = nis.trim();
    if (!cleanNis) {
      newErrors.nis = 'NIS wajib diisi.';
    } else if (!/^\d+$/.test(cleanNis)) {
      newErrors.nis = 'NIS harus berupa angka.';
    } else if (cleanNis.length < 4) {
      newErrors.nis = 'NIS minimal 4 digit angka.';
    } else if (existingStudents.some((s) => s.id !== student.id && s.nis === cleanNis)) {
      newErrors.nis = `NIS ${cleanNis} sudah digunakan siswa lain!`;
    }

    // 2. Validasi Nama
    const cleanNama = nama.trim();
    if (!cleanNama) {
      newErrors.nama = 'Nama siswa wajib diisi.';
    } else if (cleanNama.length < 3) {
      newErrors.nama = 'Nama siswa minimal 3 karakter.';
    }

    // 3. Validasi Alamat
    const cleanAlamat = alamat.trim();
    if (!cleanAlamat) {
      newErrors.alamat = 'Alamat domisili wajib diisi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    onSave({
      ...student,
      nis: nis.trim(),
      nama: nama.trim(),
      kelas,
      jenisKelamin,
      alamat: alamat.trim(),
      telepon: telepon.trim() || undefined,
      status,
      avatar: selectedAvatar,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
            },
            shadows.card,
          ]}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconCircle, { backgroundColor: colors.secondary }]}>
                <Ionicons name="create" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Ubah Data Siswa</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  ID: {student.id} • {student.nama}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Form Scroll Content */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Row */}
            <View style={styles.avatarSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Foto Profil / Avatar</Text>
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

            {/* Input NIS */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Nomor Induk Siswa (NIS) *</Text>
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
                <Ionicons name="card-outline" size={18} color={colors.primary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
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

            {/* Input Nama */}
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
                <Ionicons name="person-outline" size={18} color={colors.primary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  value={nama}
                  onChangeText={(val) => {
                    setNama(val);
                    if (errors.nama) setErrors({ ...errors, nama: '' });
                  }}
                />
              </View>
              {errors.nama ? <Text style={[styles.errorMsg, { color: colors.danger }]}>{errors.nama}</Text> : null}
            </View>

            {/* Class Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Kelas Siswa</Text>
              <View style={styles.chipsRow}>
                {AVAILABLE_CLASSES.map((cls) => {
                  const isSelected = kelas === cls;
                  return (
                    <TouchableOpacity
                      key={cls}
                      style={[
                        styles.chipBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.primaryDark : colors.border,
                          borderRadius: radii.md,
                        },
                      ]}
                      onPress={() => setKelas(cls)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
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

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Jenis Kelamin</Text>
              <View style={styles.chipsRow}>
                <TouchableOpacity
                  style={[
                    styles.chipBtn,
                    {
                      backgroundColor: jenisKelamin === 'Laki-laki' ? colors.secondary : colors.surfaceSubtle,
                      borderColor: jenisKelamin === 'Laki-laki' ? colors.primary : colors.border,
                      borderRadius: radii.md,
                    },
                  ]}
                  onPress={() => setJenisKelamin('Laki-laki')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="male" size={16} color={colors.primary} />
                  <Text style={[styles.chipBtnText, { color: colors.text }]}>Laki-laki</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.chipBtn,
                    {
                      backgroundColor: jenisKelamin === 'Perempuan' ? '#FCE7F3' : colors.surfaceSubtle,
                      borderColor: jenisKelamin === 'Perempuan' ? '#EC4899' : colors.border,
                      borderRadius: radii.md,
                    },
                  ]}
                  onPress={() => setJenisKelamin('Perempuan')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="female" size={16} color="#EC4899" />
                  <Text style={[styles.chipBtnText, { color: colors.text }]}>Perempuan</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Status Siswa</Text>
              <View style={styles.chipsRow}>
                {AVAILABLE_STATUSES.map((st) => {
                  const isSelected = status === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.chipBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.primaryDark : colors.border,
                          borderRadius: radii.md,
                        },
                      ]}
                      onPress={() => setStatus(st)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Input Alamat */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Alamat Lengkap *</Text>
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

            {/* Input Telepon */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>No. Telepon / HP</Text>
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
                <Ionicons name="call-outline" size={18} color={colors.primary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  value={telepon}
                  onChangeText={setTelepon}
                  placeholder="0812-xxxx-xxxx"
                  placeholderTextColor={colors.inputPlaceholder}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions Footer */}
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelBtnText, { color: colors.text }]}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.saveBtn, { backgroundColor: colors.primary }, shadows.button]}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    paddingHorizontal: 20,
  },
  formContent: {
    paddingVertical: 16,
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  avatarPickBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarPickEmoji: {
    fontSize: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 44,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  textAreaWrapper: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 14,
    minHeight: 55,
    textAlignVertical: 'top',
  },
  errorMsg: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  chipBtnText: {
    fontSize: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {},
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
