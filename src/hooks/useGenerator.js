import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';

import { clampLength, generate, LENGTH_RANGE, OPTION_KEYS } from '../lib/generator';
import { evaluate } from '../lib/strength';
import {
  impactFeedback,
  selectionFeedback,
  successFeedback,
  warningFeedback,
} from '../lib/feedback';

const HISTORY_LIMIT = 8;
const NOTICE_DURATION = 2000;

const DEFAULT_OPTIONS = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
};

/**
 * Seluruh state dan aksi aplikasi. Komponen antarmuka hanya menerima nilai jadi
 * dari sini, sehingga logika dapat diuji terpisah dari tampilan.
 */
export function useGenerator() {
  const [type, setType] = useState('password');
  const [length, setLength] = useState(LENGTH_RANGE.password.initial);
  // Nilai slider saat digeser; dipisah agar penggeseran tetap mulus dan
  // pembangkitan ulang hanya terjadi ketika jari diangkat.
  const [sliderLength, setSliderLength] = useState(LENGTH_RANGE.password.initial);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState(null);

  const noticeTimer = useRef(null);
  const historyId = useRef(0);

  const range = LENGTH_RANGE[type];

  // Membersihkan timer notifikasi saat komponen dilepas.
  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const notify = useCallback((message, tone = 'info') => {
    clearTimeout(noticeTimer.current);
    setNotice({ message, tone });
    noticeTimer.current = setTimeout(() => setNotice(null), NOTICE_DURATION);
  }, []);

  const pushHistory = useCallback((entry, entryType) => {
    if (!entry) return;
    // Nomor urut dibuat di luar updater agar tetap sekali jalan meski React
    // memanggil ulang updater (mode ketat / pengembangan).
    historyId.current += 1;
    const record = { id: `h${historyId.current}`, value: entry, type: entryType };
    setHistory((prev) => [record, ...prev.filter((item) => item.value !== entry)].slice(0, HISTORY_LIMIT));
  }, []);

  /** Membangkitkan nilai baru dengan konfigurasi saat ini. */
  const regenerate = useCallback(
    ({ record = false } = {}) => {
      const next = generate(type, length, options);
      setValue(next);
      if (record) pushHistory(next, type);
      return next;
    },
    [type, length, options, pushHistory]
  );

  // Membangkitkan ulang setiap kali konfigurasi berubah.
  useEffect(() => {
    setValue(generate(type, length, options));
  }, [type, length, options]);

  /** Mengganti tipe keluaran sekaligus menyesuaikan panjang ke rentang barunya. */
  const changeType = useCallback(
    (nextType) => {
      if (nextType === type) return;
      selectionFeedback();
      const nextLength = clampLength(length, nextType);
      setType(nextType);
      setLength(nextLength);
      setSliderLength(nextLength);
    },
    [type, length]
  );

  /**
   * Memperbarui angka saat penggeser masih ditarik. Nilai dinormalkan supaya
   * angka yang tampil selalu bulat dan sesuai langkah tipe aktif.
   */
  const slide = useCallback(
    (next) => setSliderLength(clampLength(next, type)),
    [type]
  );

  /** Menetapkan panjang final (dipanggil saat geseran selesai atau tombol +/-). */
  const commitLength = useCallback(
    (nextLength) => {
      const clamped = clampLength(nextLength, type);
      setLength(clamped);
      setSliderLength(clamped);
    },
    [type]
  );

  /** Menambah atau mengurangi panjang satu langkah. */
  const stepLength = useCallback(
    (direction) => {
      const next = clampLength(length + direction * range.step, type);
      if (next === length) {
        warningFeedback();
        return;
      }
      selectionFeedback();
      commitLength(next);
    },
    [length, range.step, type, commitLength]
  );

  /**
   * Menyalakan / mematikan kategori karakter. Kategori terakhir yang aktif tidak
   * dapat dimatikan supaya aplikasi tak pernah masuk ke keadaan tanpa keluaran.
   */
  const toggleOption = useCallback(
    (key) => {
      const activeCount = OPTION_KEYS.filter((item) => options[item]).length;
      if (options[key] && activeCount === 1) {
        warningFeedback();
        notify('Minimal satu jenis karakter harus aktif.', 'warning');
        return;
      }
      selectionFeedback();
      setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [options, notify]
  );

  /** Menyalin sebuah nilai ke papan klip dan mencatatnya ke riwayat. */
  const copy = useCallback(
    async (text, textType = type) => {
      const target = text ?? value;
      if (!target) return;
      try {
        const copied = await Clipboard.setStringAsync(target);
        if (copied === false) throw new Error('Papan klip menolak permintaan');
        successFeedback();
        notify('Tersalin ke papan klip.', 'success');
        pushHistory(target, textType);
      } catch {
        warningFeedback();
        notify('Gagal menyalin. Coba lagi.', 'danger');
      }
    },
    [type, value, notify, pushHistory]
  );

  /** Tombol utama: buat nilai baru dan simpan ke riwayat. */
  const generateNew = useCallback(() => {
    impactFeedback();
    regenerate({ record: true });
  }, [regenerate]);

  const clearHistory = useCallback(() => {
    if (history.length === 0) return;
    impactFeedback();
    setHistory([]);
    notify('Riwayat dikosongkan.', 'info');
  }, [history.length, notify]);

  const strength = useMemo(() => evaluate(value, type), [value, type]);

  const activeOptionCount = useMemo(
    () => OPTION_KEYS.filter((key) => options[key]).length,
    [options]
  );

  return {
    // state
    type,
    length,
    sliderLength,
    range,
    options,
    activeOptionCount,
    value,
    strength,
    history,
    notice,
    // aksi
    changeType,
    slide,
    commitLength,
    stepLength,
    toggleOption,
    generateNew,
    copy,
    clearHistory,
  };
}
