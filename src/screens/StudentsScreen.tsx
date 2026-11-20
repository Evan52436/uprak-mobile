import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { Student, SortOrder } from '../models/types';
import { StudentCard } from '../components/StudentCard';

interface StudentsScreenProps {
  theme: AppTheme;
  students: Student[];
  onAddStudentPress: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onExportPdf: (filterClass?: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

export const StudentsScreen: React.FC<StudentsScreenProps> = ({
  theme,
  students,
  onAddStudentPress,
  onEditStudent,
  onDeleteStudent,
  onExportPdf,
  searchQuery,
  onChangeSearchQuery,
}) => {
  const { colors, radii, shadows } = theme;

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name_asc');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Filter & Search logic
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by Class
    if (selectedClassFilter !== 'Semua') {
      result = result.filter((s) => s.kelas.toLowerCase().includes(selectedClassFilter.toLowerCase()));
    }

    // Search query (matches nama, nis, alamat, or kelas)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.nama.toLowerCase().includes(q) ||
          s.nis.toLowerCase().includes(q) ||
          s.alamat.toLowerCase().includes(q) ||
          s.kelas.toLowerCase().includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortOrder === 'name_asc') return a.nama.localeCompare(b.nama);
      if (sortOrder === 'name_desc') return b.nama.localeCompare(a.nama);
      if (sortOrder === 'nis_asc') return a.nis.localeCompare(b.nis);
      if (sortOrder === 'nis_desc') return b.nis.localeCompare(a.nis);
      return 0;
    });

    return result;
  }, [students, selectedClassFilter, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    if (sortOrder === 'name_asc') setSortOrder('name_desc');
    else if (sortOrder === 'name_desc') setSortOrder('nis_asc');
    else if (sortOrder === 'nis_asc') setSortOrder('nis_desc');
    else setSortOrder('name_asc');
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'name_asc': return 'Nama (A-Z)';
      case 'name_desc': return 'Nama (Z-A)';
      case 'nis_asc': return 'NIS (Naik)';
      case 'nis_desc': return 'NIS (Turun)';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Search & Filter Bar */}
      <View style={[styles.topSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              borderRadius: radii.md,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Cari siswa (Nama, NIS, Alamat)..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onChangeSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Class Filter Chips */}
        <View style={styles.filterRow}>
          {['Semua', 'XI RPL 1', 'XI RPL 2'].map((cls) => {
            const isSelected = selectedClassFilter === cls;
            return (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primaryDark : colors.border,
                    borderRadius: radii.full,
                  },
                ]}
                onPress={() => setSelectedClassFilter(cls)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
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

      {/* Control Strip: Found Count + Sort + Add Button (Matches PDF Mockup!) */}
      <View style={styles.controlStrip}>
        <View style={styles.countBox}>
          <Text style={[styles.countTitle, { color: colors.text }]}>
            {filteredStudents.length} Siswa Ditemukan
          </Text>
          <TouchableOpacity onPress={toggleSortOrder} style={styles.sortToggleRow} activeOpacity={0.7}>
            <Ionicons name="swap-vertical" size={14} color={colors.primary} />
            <Text style={[styles.sortText, { color: colors.primaryDark }]}>
              Urutkan: <Text style={{ fontWeight: '700' }}>{getSortLabel()}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActionButtons}>
          <TouchableOpacity
            style={[styles.pdfButton, { backgroundColor: colors.secondary, borderColor: colors.primaryLight }]}
            onPress={() => onExportPdf(selectedClassFilter !== 'Semua' ? selectedClassFilter : undefined)}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={16} color={colors.primaryDark} />
            <Text style={[styles.pdfButtonText, { color: colors.primaryDark }]}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }, shadows.button]}
            onPress={onAddStudentPress}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={15} color="#FFFFFF" />
            <Text style={styles.addButtonText}>+ Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            theme={theme}
            onEdit={onEditStudent}
            onDelete={onDeleteStudent}
            onPress={(s) => setSelectedStudentDetail(s)}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.secondary }]}>
              <Ionicons name="search" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Tidak Ada Siswa Ditemukan</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {searchQuery.length > 0
                ? `Tidak ada hasil pencarian untuk "${searchQuery}". Coba kata kunci lain.`
                : 'Belum ada data siswa untuk filter kelas ini.'}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
                onPress={() => onChangeSearchQuery('')}
              >
                <Text style={styles.resetSearchBtnText}>Reset Pencarian</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Student Detail Modal */}
      <Modal
        visible={selectedStudentDetail !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedStudentDetail(null)}
      >
        <View style={styles.detailOverlay}>
          <View
            style={[
              styles.detailCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.xl,
              },
              shadows.card,
            ]}
          >
            {selectedStudentDetail && (
              <>
                <View style={styles.detailHeader}>
                  <View style={[styles.detailAvatarCircle, { backgroundColor: colors.secondary, borderColor: colors.primary }]}>
                    <Text style={styles.detailAvatarText}>
                      {selectedStudentDetail.avatar || (selectedStudentDetail.jenisKelamin === 'Laki-laki' ? '👨‍🎓' : '👩‍🎓')}
                    </Text>
                  </View>
                  <Text style={[styles.detailName, { color: colors.text }]}>{selectedStudentDetail.nama}</Text>
                  <View style={[styles.detailClassBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.detailClassText, { color: colors.primaryDark }]}>
                      {selectedStudentDetail.kelas}
                    </Text>
                  </View>
                </View>

                {/* Details List */}
                <View style={[styles.detailsBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailItemLabel, { color: colors.textSecondary }]}>Nomor Induk Siswa (NIS)</Text>
                    <Text style={[styles.detailItemValue, { color: colors.text }]}>{selectedStudentDetail.nis}</Text>
                  </View>

                  <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailItemLabel, { color: colors.textSecondary }]}>Jenis Kelamin</Text>
                    <Text style={[styles.detailItemValue, { color: colors.text }]}>{selectedStudentDetail.jenisKelamin}</Text>
                  </View>

                  <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailItemLabel, { color: colors.textSecondary }]}>Alamat Domisili</Text>
                    <Text style={[styles.detailItemValue, { color: colors.text }]}>{selectedStudentDetail.alamat}</Text>
                  </View>

                  {selectedStudentDetail.telepon ? (
                    <>
                      <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.detailItem}>
                        <Text style={[styles.detailItemLabel, { color: colors.textSecondary }]}>Kontak Orang Tua / Siswa</Text>
                        <Text style={[styles.detailItemValue, { color: colors.text }]}>{selectedStudentDetail.telepon}</Text>
                      </View>
                    </>
                  ) : null}

                  <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailItemLabel, { color: colors.textSecondary }]}>Status Siswa</Text>
                    <Text style={[styles.detailItemValue, { color: colors.success }]}>
                      {selectedStudentDetail.status || 'Aktif'}
                    </Text>
                  </View>
                </View>

                {/* Detail Modal Action Buttons */}
                <View style={styles.detailActionRow}>
                  <TouchableOpacity
                    style={[styles.detailActionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      const st = selectedStudentDetail;
                      setSelectedStudentDetail(null);
                      onEditStudent(st);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.detailActionBtnText}>Edit Data Siswa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.detailCloseBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                    onPress={() => setSelectedStudentDetail(null)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.detailCloseBtnText, { color: colors.text }]}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  controlStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countBox: {
    flex: 1,
  },
  countTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  sortToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sortText: {
    fontSize: 11,
  },
  headerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  pdfButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetSearchBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetSearchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailCard: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detailAvatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailAvatarText: {
    fontSize: 34,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  detailClassBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  detailClassText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailsBox: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 18,
  },
  detailItem: {
    paddingVertical: 6,
  },
  detailItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailItemValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    marginVertical: 4,
  },
  detailActionRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  detailActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  detailActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  detailCloseBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
});
