import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Student } from '../models/types';
import { AppTheme } from '../constants/theme';

interface StudentCardProps {
  student: Student;
  theme: AppTheme;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onPress?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  theme,
  onEdit,
  onDelete,
  onPress,
}) => {
  const { colors, radii, shadows } = theme;

  const isMale = student.jenisKelamin === 'Laki-laki';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress && onPress(student)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.md,
        },
        shadows.card,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Avatar Circle */}
        <View style={[styles.avatarCircle, { backgroundColor: colors.secondary, borderColor: colors.primary }]}>
          <Text style={styles.avatarText}>{student.avatar || (isMale ? '👨‍🎓' : '👩‍🎓')}</Text>
        </View>

        {/* Student Main Info */}
        <View style={styles.infoCol}>
          <View style={styles.headerLine}>
            <Text style={[styles.studentName, { color: colors.text }]} numberOfLines={1}>
              {student.nama}
            </Text>
            <View style={[styles.classBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.classBadgeText, { color: colors.badgeText }]}>
                {student.kelas}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="card-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                NIS: <Text style={{ fontWeight: '700', color: colors.text }}>{student.nis}</Text>
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons
                name={isMale ? 'male-outline' : 'female-outline'}
                size={13}
                color={isMale ? colors.primary : '#EC4899'}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {student.jenisKelamin}
              </Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} style={styles.locIcon} />
            <Text style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={1}>
              {student.alamat}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Actions Footer */}
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View style={[styles.statusTag, { backgroundColor: colors.successBg }]}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.statusText, { color: colors.success }]}>
            {student.status || 'Aktif'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.secondaryLight, borderColor: colors.secondaryDark }]}
            onPress={() => onEdit(student)}
            accessibilityLabel="Edit data siswa"
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primaryDark }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}
            onPress={() => onDelete(student)}
            accessibilityLabel="Hapus data siswa"
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionBtnText, { color: colors.danger }]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  infoCol: {
    flex: 1,
  },
  headerLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#CBD5E1',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locIcon: {
    marginRight: 4,
  },
  addressText: {
    fontSize: 12,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteBtn: {
    borderColor: '#FECACA',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
