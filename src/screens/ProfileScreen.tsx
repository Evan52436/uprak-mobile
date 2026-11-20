import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { User } from '../models/types';

interface ProfileScreenProps {
  theme: AppTheme;
  user: User | null;
  totalStudents: number;
  onLogout: () => void;
  onToggleTheme: () => void;
  onResetData: () => void;
  onExportPdf: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  theme,
  user,
  totalStudents,
  onLogout,
  onToggleTheme,
  onResetData,
  onExportPdf,
}) => {
  const { colors, radii, shadows } = theme;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* User Identity Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
          },
          shadows.card,
        ]}
      >
        <View style={[styles.avatarCircle, { backgroundColor: colors.secondary, borderColor: colors.primary }]}>
          <Text style={styles.avatarEmoji}>{user?.avatar || '👨‍🏫'}</Text>
        </View>

        <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Administrator'}</Text>
        <Text style={[styles.userRole, { color: colors.textSecondary }]}>{user?.role || 'Petugas Pengelola Data'}</Text>

        <View style={[styles.schoolPill, { backgroundColor: colors.secondary }]}>
          <Ionicons name="school" size={14} color={colors.primaryDark} style={{ marginRight: 6 }} />
          <Text style={[styles.schoolPillText, { color: colors.primaryDark }]}>
            {user?.school || 'SMK Plus Pelita Nusantara Bogor'}
          </Text>
        </View>

        {/* User Details Grid */}
        <View style={[styles.metaGrid, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.metaCol}>
            <Text style={[styles.metaColLabel, { color: colors.textSecondary }]}>Username</Text>
            <Text style={[styles.metaColValue, { color: colors.text }]}>{user?.username || 'admin'}</Text>
          </View>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <View style={styles.metaCol}>
            <Text style={[styles.metaColLabel, { color: colors.textSecondary }]}>Nomor Induk</Text>
            <Text style={[styles.metaColValue, { color: colors.text }]}>{user?.nip || 'NIG 0180179036'}</Text>
          </View>
        </View>
      </View>

      {/* School Information Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
          },
          shadows.card,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="business-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informasi Sekolah</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nama Instansi</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>SMK Plus Pelita Nusantara</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Akreditasi</Text>
          <View style={[styles.akreditasiBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.akreditasiBadgeText}>A "UNGGUL"</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>NPSN</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>69978524</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Alamat</Text>
          <Text style={[styles.infoVal, { color: colors.text, textAlign: 'right', flex: 1, marginLeft: 12 }]}>
            Jl. Golf Ciriung-Cibinong, Kab. Bogor
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Mata Pelajaran</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>Pemrograman Perangkat Bergerak</Text>
        </View>
      </View>

      {/* Examination & Academic Sign-offs */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
          },
          shadows.card,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Asesmen & Pembimbing</Text>
        </View>

        <View style={styles.teacherBox}>
          <View style={styles.teacherItem}>
            <Text style={[styles.teacherRole, { color: colors.textSecondary }]}>Guru Pengampu Mapel:</Text>
            <Text style={[styles.teacherName, { color: colors.text }]}>Septianto Raharso, S.Kom., M.Pd.</Text>
            <Text style={[styles.teacherNig, { color: colors.textMuted }]}>NIG: 0180179036</Text>
          </View>

          <View style={[styles.teacherDivider, { backgroundColor: colors.border }]} />

          <View style={styles.teacherItem}>
            <Text style={[styles.teacherRole, { color: colors.textSecondary }]}>Waka. Kurikulum:</Text>
            <Text style={[styles.teacherName, { color: colors.text }]}>Amirul Hadid R, S.Pd., M.Pd.</Text>
            <Text style={[styles.teacherNig, { color: colors.textMuted }]}>NIG: 0170193011</Text>
          </View>
        </View>
      </View>

      {/* Application Settings & Actions */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
          },
          shadows.card,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pengaturan & Utilitas</Text>
        </View>

        {/* Toggle Dark Mode */}
        <TouchableOpacity
          style={[styles.menuActionItem, { borderBottomColor: colors.border }]}
          onPress={onToggleTheme}
          activeOpacity={0.7}
        >
          <View style={styles.menuActionLeft}>
            <Ionicons name={theme.isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.primary} />
            <Text style={[styles.menuActionText, { color: colors.text }]}>
              Mode Tampilan: {theme.isDark ? 'Gelap (Dark Mode)' : 'Terang (Light Mode)'}
            </Text>
          </View>
          <Ionicons name="swap-horizontal" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Export PDF Report */}
        <TouchableOpacity
          style={[styles.menuActionItem, { borderBottomColor: colors.border }]}
          onPress={onExportPdf}
          activeOpacity={0.7}
        >
          <View style={styles.menuActionLeft}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={[styles.menuActionText, { color: colors.text }]}>Cetak Laporan Siswa (PDF)</Text>
          </View>
          <Ionicons name="download-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Reset Database to Defaults (Testing helper) */}
        <TouchableOpacity
          style={[styles.menuActionItem, { borderBottomWidth: 0 }]}
          onPress={() => setShowResetConfirm(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuActionLeft}>
            <Ionicons name="refresh-circle-outline" size={20} color={colors.warning} />
            <Text style={[styles.menuActionText, { color: colors.warning }]}>
              Reset Database ke Data Standar
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.warning} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          {
            backgroundColor: colors.dangerBg,
            borderColor: colors.danger,
            borderRadius: radii.md,
          },
        ]}
        onPress={() => setShowLogoutConfirm(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
        <Text style={[styles.logoutBtnText, { color: colors.danger }]}>Keluar dari Aplikasi (Logout)</Text>
      </TouchableOpacity>

      <Text style={[styles.versionText, { color: colors.textMuted }]}>
        Aplikasi Data Siswa v1.0.0 • SMK Plus Pelita Nusantara
      </Text>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.xl,
              },
              shadows.card,
            ]}
          >
            <View style={[styles.modalIconCircle, { backgroundColor: colors.dangerBg }]}>
              <Ionicons name="log-out" size={32} color={colors.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Konfirmasi Logout</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Apakah Anda yakin ingin keluar dari sesi aplikasi ini?
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                onPress={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Ya, Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.xl,
              },
              shadows.card,
            ]}
          >
            <View style={[styles.modalIconCircle, { backgroundColor: colors.warningBg }]}>
              <Ionicons name="refresh" size={32} color={colors.warning} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Database?</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Semua data siswa saat ini akan dikembalikan ke 10 siswa default standar ujian SMK Pelita Nusantara.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setShowResetConfirm(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.warning }]}
                onPress={() => {
                  setShowResetConfirm(false);
                  onResetData();
                }}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Ya, Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
    gap: 16,
  },
  profileCard: {
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  userRole: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
  schoolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
  },
  schoolPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
  },
  metaColLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaColValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 28,
  },
  sectionCard: {
    padding: 18,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  akreditasiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  akreditasiBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  teacherBox: {
    gap: 12,
  },
  teacherItem: {},
  teacherRole: {
    fontSize: 11,
    fontWeight: '600',
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  teacherNig: {
    fontSize: 11,
    marginTop: 1,
  },
  teacherDivider: {
    height: 1,
  },
  menuActionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  menuActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
