import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Student } from '../models/types';
import { PALETTE } from '../constants/theme';

export async function exportStudentsToPdf(students: Student[], filterClass?: string): Promise<{ success: boolean; message: string }> {
  try {
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const rowsHtml = students
      .map(
        (s, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : PALETTE.secondaryLight};">
          <td style="padding: 10px 8px; text-align: center; border-bottom: 1px solid ${PALETTE.secondary};">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight: 600; color: #1E293B; border-bottom: 1px solid ${PALETTE.secondary};">${s.nis}</td>
          <td style="padding: 10px 8px; font-weight: 600; color: #1E293B; border-bottom: 1px solid ${PALETTE.secondary};">
            ${s.avatar || '👤'} ${s.nama}
          </td>
          <td style="padding: 10px 8px; text-align: center; border-bottom: 1px solid ${PALETTE.secondary};">
            <span style="background: ${PALETTE.secondary}; color: #2B4C7E; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">
              ${s.kelas}
            </span>
          </td>
          <td style="padding: 10px 8px; text-align: center; border-bottom: 1px solid ${PALETTE.secondary}; font-size: 12px;">
            ${s.jenisKelamin}
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid ${PALETTE.secondary}; font-size: 12px; color: #475569;">
            ${s.alamat}
          </td>
          <td style="padding: 10px 8px; text-align: center; border-bottom: 1px solid ${PALETTE.secondary};">
            <span style="background: ${PALETTE.successBg}; color: #065F46; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${s.status || 'Aktif'}
            </span>
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Laporan Data Siswa - SMK Plus Pelita Nusantara Bogor</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1E293B;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px double ${PALETTE.primary};
            padding-bottom: 14px;
            margin-bottom: 20px;
          }
          .school-foundation {
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1.5px;
            color: #475569;
            text-transform: uppercase;
          }
          .school-name {
            font-size: 20px;
            font-weight: 900;
            color: #0F172A;
            margin: 4px 0;
            letter-spacing: 0.5px;
          }
          .school-badge {
            display: inline-block;
            background-color: ${PALETTE.primary};
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
            padding: 3px 12px;
            border-radius: 12px;
            margin: 4px 0;
          }
          .school-address {
            font-size: 11px;
            color: #64748B;
            margin-top: 4px;
          }
          .report-title-box {
            background-color: ${PALETTE.secondary};
            border-left: 5px solid ${PALETTE.primary};
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .report-title {
            font-size: 16px;
            font-weight: bold;
            color: #1E293B;
            margin: 0 0 4px 0;
          }
          .report-meta {
            font-size: 12px;
            color: #475569;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th {
            background-color: ${PALETTE.primary};
            color: #FFFFFF;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            border: 1px solid ${PALETTE.primaryDark};
          }
          th.center {
            text-align: center;
          }
          .signatures {
            margin-top: 40px;
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .sign-col {
            width: 45%;
            text-align: center;
            font-size: 12px;
          }
          .sign-space {
            height: 60px;
          }
          .sign-name {
            font-weight: bold;
            text-decoration: underline;
            color: #0F172A;
          }
          .sign-nip {
            color: #64748B;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-foundation">YAYASAN PELITA NUSANTARA BOGOR</div>
          <div class="school-name">SMK PLUS PELITA NUSANTARA BOGOR</div>
          <div class="school-badge">TERAKREDITASI A "UNGGUL" - NPSN: 69978524</div>
          <div class="school-address">
            Jl. Golf Ciriung-Cibinong Tlp/Fax. (021) 83713168 | Email: smkpluspnb@gmail.com | Website: www.smkpluspnb.sch.id
          </div>
        </div>

        <div class="report-title-box">
          <h2 class="report-title">LAPORAN DATA SISWA KELAS XI RPL</h2>
          <p class="report-meta">
            Mata Pelajaran: <strong>Pemrograman Perangkat Bergerak</strong> | 
            Filter: <strong>${filterClass || 'Semua Kelas'}</strong> | 
            Total Data: <strong>${students.length} Siswa</strong> | 
            Dicetak: <strong>${today}</strong>
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th class="center" style="width: 35px;">No</th>
              <th style="width: 80px;">NIS</th>
              <th>Nama Lengkap Siswa</th>
              <th class="center" style="width: 75px;">Kelas</th>
              <th class="center" style="width: 85px;">L / P</th>
              <th>Alamat Domisili</th>
              <th class="center" style="width: 60px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <table style="margin-top: 45px; width: 100%; border: none;">
          <tr>
            <td style="width: 50%; text-align: center; border: none; font-size: 12px;">
              Mengetahui,<br/>
              Waka. Kurikulum<br/>
              <div class="sign-space"></div>
              <strong style="text-decoration: underline;">Amirul Hadid R, S.Pd., M.Pd.</strong><br/>
              <span style="font-size: 11px; color: #64748B;">NIG 0170193011</span>
            </td>
            <td style="width: 50%; text-align: center; border: none; font-size: 12px;">
              Cibinong, ${today}<br/>
              Guru Bidang Studi<br/>
              <div class="sign-space"></div>
              <strong style="text-decoration: underline;">Septianto Raharso, S.Kom., M.Pd.</strong><br/>
              <span style="font-size: 11px; color: #64748B;">NIG 0180179036</span>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (Platform.OS === 'web') {
      await Print.printAsync({ html: htmlContent });
      return { success: true, message: 'Laporan PDF berhasil dibuka untuk dicetak/disimpan.' };
    } else {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Bagikan Laporan Data Siswa PDF',
          UTI: 'com.adobe.pdf',
        });
      }
      return { success: true, message: 'PDF berhasil dibuat dan dibagikan!' };
    }
  } catch (err: any) {
    console.error('Error exporting PDF:', err);
    return { success: false, message: err?.message || 'Gagal membuat file PDF' };
  }
}
