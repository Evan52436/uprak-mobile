import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Student } from '../models/types';
import { AppTheme } from '../constants/theme';

interface DeleteModalProps {
  visible: boolean;
  student: Student | null;
  theme: AppTheme;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  student,
  theme,
  onCancel,
  onConfirm,
}) => {
  const { colors, radii, shadows } = theme;

  if (!student) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
            },
            shadows.card,
          ]}
        >
          {/* Warning Icon Badge */}
          <View style={[styles.warningIconCircle, { backgroundColor: colors.dangerBg }]}>
            <Ionicons name="alert-circle" size={38} color={colors.danger} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Hapus Data Siswa?</Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus siswa berikut dari sistem?
          </Text>

          {/* Student Info Box */}
          <View style={[styles.studentBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <Text style={styles.studentAvatar}>{student.avatar || '👨‍🎓'}</Text>
            <View style={styles.studentDetails}>
              <Text style={[styles.studentName, { color: colors.text }]} numberOfLines={1}>
                {student.nama}
              </Text>
              <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                NIS: {student.nis} • {student.kelas}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: colors.danger }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.deleteButtonText}>Ya, Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  warningIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  studentBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  studentAvatar: {
    fontSize: 28,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
  },
  studentMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
