export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  alamat: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  avatar?: string;
  status?: 'Aktif' | 'Izin' | 'Alumni';
  telepon?: string;
  createdAt?: string;
}

export interface User {
  username: string;
  name: string;
  role: string;
  school: string;
  nip?: string;
  email: string;
  avatar?: string;
}

export type TabType = 'dashboard' | 'students' | 'add' | 'profile';

export type SortOrder = 'name_asc' | 'name_desc' | 'nis_asc' | 'nis_desc';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  title: string;
  message: string;
}
