import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/kuis-screen/bg-kuis-screen.webp';
import btnRight from '../../assets/kuis-screen/button-right.webp';
import btnHome from '../../assets/menu-materi-gangguan-pencernaan-screen/button-home.webp';

// Aset Soal 1
import soal1Img from '../../assets/kuis-screen/soal-1/soal.webp';
import jawabA1 from '../../assets/kuis-screen/soal-1/jawab-a.webp';
import jawabB1 from '../../assets/kuis-screen/soal-1/jawab-b.webp';
import jawabC1 from '../../assets/kuis-screen/soal-1/jawab-c.webp';
import jawabD1 from '../../assets/kuis-screen/soal-1/jawab-d.webp';

// Aset Soal 2
import soal2Img from '../../assets/kuis-screen/soal-2/soal.webp';
import jawabA2 from '../../assets/kuis-screen/soal-2/jawab-a.webp';
import jawabB2 from '../../assets/kuis-screen/soal-2/jawab-b.webp';
import jawabC2 from '../../assets/kuis-screen/soal-2/jawab-c.webp';
import jawabD2 from '../../assets/kuis-screen/soal-2/jawab-d.webp';

// Aset Soal 3
import soal3Img from '../../assets/kuis-screen/soal-3/soal.webp';
import jawabA3 from '../../assets/kuis-screen/soal-3/jawab-a.webp';
import jawabB3 from '../../assets/kuis-screen/soal-3/jawab-b.webp';
import jawabC3 from '../../assets/kuis-screen/soal-3/jawab-c.webp';
import jawabD3 from '../../assets/kuis-screen/soal-3/jawab-d.webp';

// Aset Soal 4
import soal4Img from '../../assets/kuis-screen/soal-4/soal.webp';
import videoSoal4 from '../../assets/kuis-screen/soal-4/video-soal.mp4';
import videoPoster4 from '../../assets/kuis-screen/soal-4/video-poster.webp';
import jawabA4 from '../../assets/kuis-screen/soal-4/jawab-a.webp';
import jawabB4 from '../../assets/kuis-screen/soal-4/jawab-b.webp';
import jawabC4 from '../../assets/kuis-screen/soal-4/jawab-c.webp';
import jawabD4 from '../../assets/kuis-screen/soal-4/jawab-d.webp';

// Aset Soal 5
import soal5Img from '../../assets/kuis-screen/soal-5/soal.webp';
import jawabA5 from '../../assets/kuis-screen/soal-5/jawab-a.webp';
import jawabB5 from '../../assets/kuis-screen/soal-5/jawab-b.webp';
import jawabC5 from '../../assets/kuis-screen/soal-5/jawab-c.webp';
import jawabD5 from '../../assets/kuis-screen/soal-5/jawab-d.webp';

// Aset Soal 6
import soal6Img from '../../assets/kuis-screen/soal-6/soal.webp';
import jawabA6 from '../../assets/kuis-screen/soal-6/jawab-a.webp';
import jawabB6 from '../../assets/kuis-screen/soal-6/jawab-b.webp';
import jawabC6 from '../../assets/kuis-screen/soal-6/jawab-c.webp';
import jawabD6 from '../../assets/kuis-screen/soal-6/jawab-d.webp';

// Aset Soal 7
import soal7Img from '../../assets/kuis-screen/soal-7/soal.webp';
import jawabA7 from '../../assets/kuis-screen/soal-7/jawab-a.webp';
import jawabB7 from '../../assets/kuis-screen/soal-7/jawab-b.webp';
import jawabC7 from '../../assets/kuis-screen/soal-7/jawab-c.webp';
import jawabD7 from '../../assets/kuis-screen/soal-7/jawab-d.webp';

// Aset Soal 8
import soal8Img from '../../assets/kuis-screen/soal-8/soal.webp';
import jawabA8 from '../../assets/kuis-screen/soal-8/jawab-a.webp';
import jawabB8 from '../../assets/kuis-screen/soal-8/jawab-b.webp';
import jawabC8 from '../../assets/kuis-screen/soal-8/jawab-c.webp';
import jawabD8 from '../../assets/kuis-screen/soal-8/jawab-d.webp';

// Aset Soal 9
import soal9Img from '../../assets/kuis-screen/soal-9/soal.webp';
import jawabA9 from '../../assets/kuis-screen/soal-9/jawab-a.webp';
import jawabB9 from '../../assets/kuis-screen/soal-9/jawab-b.webp';
import jawabC9 from '../../assets/kuis-screen/soal-9/jawab-c.webp';
import jawabD9 from '../../assets/kuis-screen/soal-9/jawab-d.webp';

// Aset Soal 10
import soal10Img from '../../assets/kuis-screen/soal-10/soal.webp';
import jawabA10 from '../../assets/kuis-screen/soal-10/jawab-a.webp';
import jawabB10 from '../../assets/kuis-screen/soal-10/jawab-b.webp';
import jawabC10 from '../../assets/kuis-screen/soal-10/jawab-c.webp';
import jawabD10 from '../../assets/kuis-screen/soal-10/jawab-d.webp';

// Aset Soal 11
import soal11Img from '../../assets/kuis-screen/soal-11/soal.webp';
import jawabA11 from '../../assets/kuis-screen/soal-11/jawab-a.webp';
import jawabB11 from '../../assets/kuis-screen/soal-11/jawab-b.webp';
import jawabC11 from '../../assets/kuis-screen/soal-11/jawab-c.webp';
import jawabD11 from '../../assets/kuis-screen/soal-11/jawab-d.webp';

// Aset Soal 12
import soal12Img from '../../assets/kuis-screen/soal-12/soal.webp';
import jawabA12 from '../../assets/kuis-screen/soal-12/jawab-a.webp';
import jawabB12 from '../../assets/kuis-screen/soal-12/jawab-b.webp';
import jawabC12 from '../../assets/kuis-screen/soal-12/jawab-c.webp';
import jawabD12 from '../../assets/kuis-screen/soal-12/jawab-d.webp';

// Aset Soal 13
import soal13Img from '../../assets/kuis-screen/soal-13/soal.webp';
import jawabA13 from '../../assets/kuis-screen/soal-13/jawab-a.webp';
import jawabB13 from '../../assets/kuis-screen/soal-13/jawab-b.webp';
import jawabC13 from '../../assets/kuis-screen/soal-13/jawab-c.webp';
import jawabD13 from '../../assets/kuis-screen/soal-13/jawab-d.webp';

// Aset Soal 14
import soal14Img from '../../assets/kuis-screen/soal-14/soal.webp';
import jawabA14 from '../../assets/kuis-screen/soal-14/jawab-a.webp';
import jawabB14 from '../../assets/kuis-screen/soal-14/jawab-b.webp';
import jawabC14 from '../../assets/kuis-screen/soal-14/jawab-c.webp';
import jawabD14 from '../../assets/kuis-screen/soal-14/jawab-d.webp';

// Aset Soal 15
import soal15Img from '../../assets/kuis-screen/soal-15/soal.webp';
import jawabA15 from '../../assets/kuis-screen/soal-15/jawab-a.webp';
import jawabB15 from '../../assets/kuis-screen/soal-15/jawab-b.webp';
import jawabC15 from '../../assets/kuis-screen/soal-15/jawab-c.webp';
import jawabD15 from '../../assets/kuis-screen/soal-15/jawab-d.webp';

// Aset Soal 16
import soal16Img from '../../assets/kuis-screen/soal-16/soal.webp';
import jawabA16 from '../../assets/kuis-screen/soal-16/jawab-a.webp';
import jawabB16 from '../../assets/kuis-screen/soal-16/jawab-b.webp';
import jawabC16 from '../../assets/kuis-screen/soal-16/jawab-c.webp';
import jawabD16 from '../../assets/kuis-screen/soal-16/jawab-d.webp';

// Aset Soal 17
import soal17Img from '../../assets/kuis-screen/soal-17/soal.webp';
import jawabA17 from '../../assets/kuis-screen/soal-17/jawab-a.webp';
import jawabB17 from '../../assets/kuis-screen/soal-17/jawab-b.webp';
import jawabC17 from '../../assets/kuis-screen/soal-17/jawab-c.webp';
import jawabD17 from '../../assets/kuis-screen/soal-17/jawab-d.webp';

// Aset Soal 18
import soal18Img from '../../assets/kuis-screen/soal-18/soal.webp';
import jawabA18 from '../../assets/kuis-screen/soal-18/jawab-a.webp';
import jawabB18 from '../../assets/kuis-screen/soal-18/jawab-b.webp';
import jawabC18 from '../../assets/kuis-screen/soal-18/jawab-c.webp';
import jawabD18 from '../../assets/kuis-screen/soal-18/jawab-d.webp';

// Aset Soal 19
import soal19Img from '../../assets/kuis-screen/soal-19/soal.webp';
import jawabA19 from '../../assets/kuis-screen/soal-19/jawab-a.webp';
import jawabB19 from '../../assets/kuis-screen/soal-19/jawab-b.webp';
import jawabC19 from '../../assets/kuis-screen/soal-19/jawab-c.webp';
import jawabD19 from '../../assets/kuis-screen/soal-19/jawab-d.webp';

// Aset Soal 20
import soal20Img from '../../assets/kuis-screen/soal-20/soal.webp';
import jawabA20 from '../../assets/kuis-screen/soal-20/jawab-a.webp';
import jawabB20 from '../../assets/kuis-screen/soal-20/jawab-b.webp';
import jawabC20 from '../../assets/kuis-screen/soal-20/jawab-c.webp';
import jawabD20 from '../../assets/kuis-screen/soal-20/jawab-d.webp';

// Audio Voice Recordings Kuis (Soal 3, 7, 9, 15, 19)
import audioSoal3 from '../../assets/kuis-screen/soal-3/soal-3.mp3';
import audioOptA7 from '../../assets/kuis-screen/soal-7/jawaban-a-protein.mp3';
import audioOptB7 from '../../assets/kuis-screen/soal-7/jawaban-b-vitamin.mp3';
import audioOptC7 from '../../assets/kuis-screen/soal-7/jawaban-c-mineral.mp3';
import audioOptD7 from '../../assets/kuis-screen/soal-7/jawaban-d-air.mp3';
import audioSoal9 from '../../assets/kuis-screen/soal-9/soal-9.mp3';
import audioSoal15 from '../../assets/kuis-screen/soal-15/soal-15.mp3';
import audioOptA19 from '../../assets/kuis-screen/soal-19/jawab-a-apendiksitis.mp3';
import audioOptB19 from '../../assets/kuis-screen/soal-19/jawab-b-gastritis.mp3';
import audioOptC19 from '../../assets/kuis-screen/soal-19/jawab-c-konstipasi.mp3';
import audioOptD19 from '../../assets/kuis-screen/soal-19/jawab-d-diare.mp3';

import { playSound as playSoundEffect, isSoundEnabled } from '../../services/soundService';
import './MenuKuisScreen.css';

type OptionKey = 'A' | 'B' | 'C' | 'D';

interface QuizOption {
  key: OptionKey;
  label: string;
  img: string;
  organName: string;
  speechText?: string;
  audioSrc?: string;
}

interface QuizQuestion {
  id: number;
  questionNumber: number;
  questionImg: string;
  questionAlt: string;
  cardVariant: 'square' | 'pill' | 'stack';
  questionVariant?: 'compact' | 'media';
  videoSrc?: string;
  videoPoster?: string;
  options: QuizOption[];
  correctAnswer: OptionKey;
  hasAudioPrompt?: boolean;
  audioPromptText?: string;
  audioSrc?: string;
  explanation: {
    correct: string;
    wrong: string;
  };
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    questionImg: soal1Img,
    questionAlt: 'Soal 1: Organ yang pertama kali dilalui makanan ketika manusia makan adalah ....',
    cardVariant: 'square',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA1, organName: 'Usus Halus' },
      { key: 'B', label: 'Pilihan B', img: jawabB1, organName: 'Rongga Mulut' },
      { key: 'C', label: 'Pilihan C', img: jawabC1, organName: 'Usus Besar' },
      { key: 'D', label: 'Pilihan D', img: jawabD1, organName: 'Lambung' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Rongga Mulut (Pilihan B) adalah organ pertama tempat makanan masuk. Di dalam mulut, makanan dikunyah secara mekanis oleh gigi dan dipecah secara kimiawi oleh enzim ptialin (amilase).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Makanan yang kita makan selalu pertama kali masuk dan melalui Rongga Mulut (Pilihan B) sebelum ditelan ke kerongkongan dan lambung.',
    },
  },
  {
    id: 2,
    questionNumber: 2,
    questionImg: soal2Img,
    questionAlt: 'Soal 2: Gigi yang berfungsi untuk memotong makanan adalah ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA2, organName: 'Gigi Seri' },
      { key: 'B', label: 'Pilihan B', img: jawabB2, organName: 'Gigi Taring' },
      { key: 'C', label: 'Pilihan C', img: jawabC2, organName: 'Gigi Geraham Depan' },
      { key: 'D', label: 'Pilihan D', img: jawabD2, organName: 'Gigi Geraham Belakang' },
    ],
    correctAnswer: 'A',
    explanation: {
      correct:
        'Tepat sekali! Gigi seri (Pilihan A) memiliki bentuk pipih dengan tepi tajam menyerupai pahat yang berfungsi khusus untuk memotong dan mengerat makanan saat kita menggigit.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Gigi yang berfungsi untuk memotong makanan adalah Gigi Seri (Pilihan A). Gigi taring berfungsi mengoyak/merobek makanan, sedangkan gigi geraham mengunyah dan melumatkan makanan.',
    },
  },
  {
    id: 3,
    questionNumber: 3,
    questionImg: soal3Img,
    questionAlt: 'Soal 3: Tekan tombol untuk mendengarkan pertanyaan audio kuis!',
    cardVariant: 'pill',
    hasAudioPrompt: true,
    audioSrc: audioSoal3,
    audioPromptText:
      'Enzim ptialin yang terdapat di dalam rongga mulut berfungsi untuk mencerna zat makanan berupa apa?',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA3, organName: 'Protein' },
      { key: 'B', label: 'Pilihan B', img: jawabB3, organName: 'Lemak' },
      { key: 'C', label: 'Pilihan C', img: jawabC3, organName: 'Amilum' },
      { key: 'D', label: 'Pilihan D', img: jawabD3, organName: 'Vitamin' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Enzim ptialin (amilase) yang terkandung di dalam air liur rongga mulut berfungsi memecah karbohidrat/zat tepung (Amilum - Pilihan C) menjadi maltosa (gula sederhana).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Enzim ptialin (amilase) dalam air liur bertugas memecah karbohidrat atau zat tepung yaitu Amilum (Pilihan C), bukan protein atau lemak.',
    },
  },
  {
    id: 4,
    questionNumber: 4,
    questionImg: soal4Img,
    questionAlt: 'Soal 4: Proses mengunyah menggunakan gigi termasuk pencernaan....',
    cardVariant: 'pill',
    questionVariant: 'media',
    videoSrc: videoSoal4,
    videoPoster: videoPoster4,
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA4, organName: 'Kimiawi' },
      { key: 'B', label: 'Pilihan B', img: jawabB4, organName: 'Mekanik' },
      { key: 'C', label: 'Pilihan C', img: jawabC4, organName: 'Penyerapan' },
      { key: 'D', label: 'Pilihan D', img: jawabD4, organName: 'Pengeluaran' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Proses mengunyah makanan menggunakan gigi di dalam mulut termasuk ke dalam pencernaan Mekanik (Pilihan B), yaitu proses mengubah ukuran makanan dari besar menjadi potongan kecil secara fisik.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Mengunyah makanan dengan gigi adalah contoh pencernaan Mekanik (Pilihan B). Pencernaan kimiawi melibatkan enzim pencernaan, sedangkan penyerapan terjadi di usus halus.',
    },
  },
  {
    id: 5,
    questionNumber: 5,
    questionImg: soal5Img,
    questionAlt:
      'Soal 5: Gerakan meremas-remas yang mendorong makanan melalui kerongkongan disebut ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA5, organName: 'Difusi' },
      { key: 'B', label: 'Pilihan B', img: jawabB5, organName: 'Emulsifikasi' },
      { key: 'C', label: 'Pilihan C', img: jawabC5, organName: 'Peristaltik' },
      { key: 'D', label: 'Pilihan D', img: jawabD5, organName: 'Absorpsi' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Gerakan meremas-remas bergelombang oleh kontraksi otot dinding kerongkongan yang mendorong makanan masuk menuju lambung disebut gerak Peristaltik (Pilihan C).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Gerakan mendorong makanan di sepanjang kerongkongan disebut gerak Peristaltik (Pilihan C). Difusi adalah perpindahan zat molekul, emulsifikasi adalah pelarutan lemak oleh empedu, dan absorpsi adalah penyerapan nutrisi.',
    },
  },
  {
    id: 6,
    questionNumber: 6,
    questionImg: soal6Img,
    questionAlt:
      'Soal 6: Organ yang menjadi tempat makanan diaduk oleh otot dindingnya adalah ....',
    cardVariant: 'square',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA6, organName: 'Hati' },
      { key: 'B', label: 'Pilihan B', img: jawabB6, organName: 'Usus Besar' },
      { key: 'C', label: 'Pilihan C', img: jawabC6, organName: 'Lambung' },
      { key: 'D', label: 'Pilihan D', img: jawabD6, organName: 'Mulut' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Lambung (Pilihan C) memiliki lapisan dinding berotot tebal yang berkontraksi secara teratur untuk mengaduk, meremas, dan mencampur makanan dengan getah lambung hingga menjadi bubur kimus (chyme).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Organ yang bertugas mengaduk makanan menggunakan kontraksi otot dindingnya adalah Lambung (Pilihan C). Hati memproduksi empedu, usus besar menyerap air, dan rongga mulut mengunyah makanan menggunakan gigi.',
    },
  },
  {
    id: 7,
    questionNumber: 7,
    questionImg: soal7Img,
    questionAlt:
      'Soal 7: Enzim pepsin di dalam lambung berfungsi membantu mencerna ....',
    cardVariant: 'square',
    options: [
      {
        key: 'A',
        label: 'Pilihan A',
        img: jawabA7,
        organName: 'Protein',
        audioSrc: audioOptA7,
      },
      {
        key: 'B',
        label: 'Pilihan B',
        img: jawabB7,
        organName: 'Vitamin',
        audioSrc: audioOptB7,
      },
      {
        key: 'C',
        label: 'Pilihan C',
        img: jawabC7,
        organName: 'Mineral',
        audioSrc: audioOptC7,
      },
      {
        key: 'D',
        label: 'Pilihan D',
        img: jawabD7,
        organName: 'Air',
        audioSrc: audioOptD7,
      },
    ],
    correctAnswer: 'A',
    explanation: {
      correct:
        'Tepat sekali! Enzim pepsin di dalam lambung berfungsi memecah zat makanan berupa Protein (Pilihan A) menjadi senyawa yang lebih sederhana yaitu pepton.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Enzim pepsin di dalam lambung khusus berfungsi mencerna Protein (Pilihan A) menjadi pepton. Vitamin, mineral, dan air diserap langsung oleh tubuh tanpa perlu dicerna oleh enzim pepsin.',
    },
  },
  {
    id: 8,
    questionNumber: 8,
    questionImg: soal8Img,
    questionAlt:
      'Soal 8: Asam klorida (HCl) di lambung membantu ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA8, organName: 'Mengunyah makanan' },
      { key: 'B', label: 'Pilihan B', img: jawabB8, organName: 'Membunuh kuman dalam makanan' },
      { key: 'C', label: 'Pilihan C', img: jawabC8, organName: 'Menyerap sari makanan' },
      { key: 'D', label: 'Pilihan D', img: jawabD8, organName: 'Membentuk feses' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Asam Klorida (HCl) yang dihasilkan oleh dinding lambung berfungsi membunuh kuman atau bakteri penyakit yang terbawa bersama makanan (Pilihan B), sekaligus mengaktifkan enzim pepsin untuk mencerna protein.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Asam klorida (HCl) di lambung berfungsi membunuh kuman penyakit pada makanan (Pilihan B) dan mengasamkan lambung. Mengunyah makanan dilakukan oleh gigi di rongga mulut, menyerap sari makanan terjadi di usus halus, dan pembentukan feses terjadi di usus besar.',
    },
  },
  {
    id: 9,
    questionNumber: 9,
    questionImg: soal9Img,
    questionAlt:
      'Soal 9: Tekan tombol untuk mendengarkan pertanyaan audio kuis!',
    cardVariant: 'pill',
    hasAudioPrompt: true,
    audioSrc: audioSoal9,
    audioPromptText:
      'Cairan empedu yang berfungsi untuk mengemulsikan lemak diproduksi oleh organ apa?',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA9, organName: 'Pankreas' },
      { key: 'B', label: 'Pilihan B', img: jawabB9, organName: 'Lambung' },
      { key: 'C', label: 'Pilihan C', img: jawabC9, organName: 'Hati' },
      { key: 'D', label: 'Pilihan D', img: jawabD9, organName: 'Usus besar' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Cairan empedu diproduksi oleh organ Hati (Pilihan C) dan disimpan sementara di dalam kantung empedu sebelum dialirkan ke usus halus untuk mengemulsikan lemak.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Cairan empedu diproduksi oleh Hati (Pilihan C). Pankreas menghasilkan enzim tripsin, amilase, dan lipase; lambung menghasilkan asam lambung dan pepsin; sedangkan usus besar bertugas menyerap air.',
    },
  },
  {
    id: 10,
    questionNumber: 10,
    questionImg: soal10Img,
    questionAlt:
      'Soal 10: Cairan empedu membantu proses pencernaan dengan cara ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA10, organName: 'Menghaluskan makanan menggunakan gigi' },
      { key: 'B', label: 'Pilihan B', img: jawabB10, organName: 'Mengemulsikan lemak' },
      { key: 'C', label: 'Pilihan C', img: jawabC10, organName: 'Mengubah protein menjadi pepton' },
      { key: 'D', label: 'Pilihan D', img: jawabD10, organName: 'Menyerap air' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Cairan empedu berfungsi Mengemulsikan lemak (Pilihan B), yaitu memecah gumpalan lemak menjadi butiran-butiran mikroskopis sehingga memudahkan enzim lipase mencernanya.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Cairan empedu berfungsi Mengemulsikan lemak (Pilihan B). Menghaluskan makanan dengan gigi terjadi di mulut, mengubah protein menjadi pepton adalah tugas pepsin lambung, dan menyerap air adalah fungsi usus besar.',
    },
  },
  {
    id: 11,
    questionNumber: 11,
    questionImg: soal11Img,
    questionAlt:
      'Soal 11: Sebagian besar penyerapan sari-sari makanan berlangsung di ....',
    cardVariant: 'square',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA11, organName: 'Usus Halus' },
      { key: 'B', label: 'Pilihan B', img: jawabB11, organName: 'Rongga Mulut' },
      { key: 'C', label: 'Pilihan C', img: jawabC11, organName: 'Usus Besar' },
      { key: 'D', label: 'Pilihan D', img: jawabD11, organName: 'Lambung' },
    ],
    correctAnswer: 'A',
    explanation: {
      correct:
        'Tepat sekali! Sebagian besar penyerapan sari-sari makanan berlangsung di Usus Halus (Pilihan A), khususnya pada bagian ileum (usus penyerapan) yang memiliki jutaan vili untuk menyerap nutrisi ke dalam pembuluh darah.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Penyerapan sebagian besar nutrisi makanan berlangsung di Usus Halus (Pilihan A). Rongga mulut mengunyah makanan, lambung mencerna makanan secara mekanik dan kimiawi, sedangkan usus besar menyerap air sisa makanan.',
    },
  },
  {
    id: 12,
    questionNumber: 12,
    questionImg: soal12Img,
    questionAlt:
      'Soal 12: Jonjot-jonjot pada dinding usus halus berguna untuk ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA12, organName: 'Menghasilkan air liur' },
      { key: 'B', label: 'Pilihan B', img: jawabB12, organName: 'Memperluas permukaan penyerapan' },
      { key: 'C', label: 'Pilihan C', img: jawabC12, organName: 'Mengunyah makanan' },
      { key: 'D', label: 'Pilihan D', img: jawabD12, organName: 'Mendorong makanan keluar melalui anus' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Jonjot-jonjot usus (vili) pada dinding usus halus berfungsi Memperluas permukaan penyerapan (Pilihan B), sehingga penyerapan nutrisi makanan menjadi jauh lebih cepat, luas, dan efisien.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Jonjot usus (vili) berguna untuk Memperluas permukaan penyerapan (Pilihan B). Air liur diproduksi di mulut, mengunyah dilakukan oleh gigi, dan mendorong sisa makanan keluar adalah gerak rektum dan anus.',
    },
  },
  {
    id: 13,
    questionNumber: 13,
    questionImg: soal13Img,
    questionAlt:
      'Soal 13: Organ yang membantu menyerap kembali air dari sisa makanan adalah ....',
    cardVariant: 'square',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA13, organName: 'Usus Halus' },
      { key: 'B', label: 'Pilihan B', img: jawabB13, organName: 'Usus Besar' },
      { key: 'C', label: 'Pilihan C', img: jawabC13, organName: 'Pankreas' },
      { key: 'D', label: 'Pilihan D', img: jawabD13, organName: 'Lambung' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Organ yang bertugas menyerap kembali air dan garam mineral dari sisa-sisa makanan adalah Usus Besar (Pilihan B), sehingga ampas makanan berubah menjadi feses padat.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Penyerapan air dari sisa makanan dilakukan oleh Usus Besar (Pilihan B). Usus halus menyerap nutrisi makanan, lambung mencerna makanan, dan pankreas menghasilkan enzim pencernaan.',
    },
  },
  {
    id: 14,
    questionNumber: 14,
    questionImg: soal14Img,
    questionAlt:
      'Soal 14: Bakteri Escherichia coli yang terdapat di usus besar membantu ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA14, organName: 'Memotong makanan' },
      { key: 'B', label: 'Pilihan B', img: jawabB14, organName: 'Membusukkan sisa makanan' },
      { key: 'C', label: 'Pilihan C', img: jawabC14, organName: 'Menghasilkan air liur' },
      { key: 'D', label: 'Pilihan D', img: jawabD14, organName: 'Mendorong makanan ke lambung' },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Bakteri Escherichia coli (E. coli) yang hidup di usus besar berperan penting dalam Membusukkan sisa makanan (Pilihan B) menjadi feses serta membantu pembentukan vitamin K.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Bakteri E. coli di usus besar bertugas Membusukkan sisa makanan (Pilihan B). Memotong makanan dilakukan gigi seri di mulut, menghasilkan air liur oleh kelenjar ludah, dan mendorong makanan ke lambung adalah gerak peristaltik kerongkongan.',
    },
  },
  {
    id: 15,
    questionNumber: 15,
    questionImg: soal15Img,
    questionAlt:
      'Soal 15: Tekan tombol untuk mendengarkan pertanyaan audio kuis!',
    cardVariant: 'pill',
    hasAudioPrompt: true,
    audioSrc: audioSoal15,
    audioPromptText:
      'Organ yang berfungsi sebagai tempat penyimpanan sementara feses sebelum dikeluarkan melalui anus adalah organ apa?',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA15, organName: 'Lambung' },
      { key: 'B', label: 'Pilihan B', img: jawabB15, organName: 'Usus halus' },
      { key: 'C', label: 'Pilihan C', img: jawabC15, organName: 'Rektum' },
      { key: 'D', label: 'Pilihan D', img: jawabD15, organName: 'Pankreas' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Rektum (Pilihan C) adalah bagian akhir dari usus besar yang berfungsi sebagai tempat penyimpanan sementara feses sebelum dikeluarkan dari tubuh melalui anus.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Tempat penampungan sementara feses sebelum dikeluarkan melalui anus adalah Rektum (Pilihan C). Lambung mencerna makanan, usus halus menyerap nutrisi, dan pankreas memproduksi enzim pencernaan.',
    },
  },
  {
    id: 16,
    questionNumber: 16,
    questionImg: soal16Img,
    questionAlt:
      'Soal 16: Gangguan pencernaan yang ditandai dengan sulit buang air besar disebut ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA16, organName: 'Diare' },
      { key: 'B', label: 'Pilihan B', img: jawabB16, organName: 'Gastritis' },
      { key: 'C', label: 'Pilihan C', img: jawabC16, organName: 'Konstipasi' },
      { key: 'D', label: 'Pilihan D', img: jawabD16, organName: 'Keracunan makanan' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Gangguan pencernaan yang ditandai dengan sulit buang air besar karena feses menjadi keras dan kering akibat penyerapan air berlebihan di usus besar disebut Konstipasi atau sembelit (Pilihan C).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Kondisi sulit buang air besar disebut Konstipasi atau sembelit (Pilihan C). Diare adalah BAB cair dan sering, gastritis adalah radang dinding lambung, sedangkan keracunan disebabkan konsumsi racun/kuman.',
    },
  },
  {
    id: 17,
    questionNumber: 17,
    questionImg: soal17Img,
    questionAlt:
      'Soal 17: Salah satu cara membantu mencegah sembelit adalah ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA17, organName: 'Mengurangi minum air' },
      { key: 'B', label: 'Pilihan B', img: jawabB17, organName: 'Menghindari semua sayuran' },
      { key: 'C', label: 'Pilihan C', img: jawabC17, organName: 'Mengonsumsi makanan berserat' },
      { key: 'D', label: 'Pilihan D', img: jawabD17, organName: 'Tidak melakukan aktivitas fisik' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Tepat sekali! Mengonsumsi makanan berserat tinggi (Pilihan C) seperti buah-buahan, sayur-sayuran, serta mencukupi kebutuhan air minum harian sangat efektif melancarkan buang air besar dan mencegah sembelit.',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Cara utama mencegah sembelit adalah Mengonsumsi makanan berserat (Pilihan C) dan rajin minum air putih. Mengurangi air atau menghindari sayuran justru akan membuat feses keras dan memperparah sembelit.',
    },
  },
  {
    id: 18,
    questionNumber: 18,
    questionImg: soal18Img,
    questionAlt:
      'Soal 18: Diare yang berlangsung berulang dapat menyebabkan tubuh mengalami ....',
    cardVariant: 'pill',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA18, organName: 'Kekurangan cairan' },
      { key: 'B', label: 'Pilihan B', img: jawabB18, organName: 'Pertumbuhan gigi' },
      { key: 'C', label: 'Pilihan C', img: jawabC18, organName: 'Kelebihan air' },
      { key: 'D', label: 'Pilihan D', img: jawabD18, organName: 'Peningkatan jumlah tulang' },
    ],
    correctAnswer: 'A',
    explanation: {
      correct:
        'Tepat sekali! Diare yang berulang atau berkepanjangan dapat mengakibatkan tubuh kehilangan cairan dan elektrolit secara cepat hingga mengalami Kekurangan cairan atau dehidrasi (Pilihan A).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Diare berulang dapat menyebabkan tubuh mengalami Kekurangan cairan atau dehidrasi (Pilihan A). Oleh sebab itu, penggantian cairan dengan larutan oralit sangat dianjurkan saat terkena diare.',
    },
  },
  {
    id: 19,
    questionNumber: 19,
    questionImg: soal19Img,
    questionAlt:
      'Soal 19: Peradangan pada lapisan mukosa dinding lambung disebut ....',
    cardVariant: 'square',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA19, organName: 'Apendiksitis', audioSrc: audioOptA19 },
      { key: 'B', label: 'Pilihan B', img: jawabB19, organName: 'Gastritis', audioSrc: audioOptB19 },
      { key: 'C', label: 'Pilihan C', img: jawabC19, organName: 'Konstipasi', audioSrc: audioOptC19 },
      { key: 'D', label: 'Pilihan D', img: jawabD19, organName: 'Diare', audioSrc: audioOptD19 },
    ],
    correctAnswer: 'B',
    explanation: {
      correct:
        'Tepat sekali! Peradangan dan iritasi pada selaput mukosa pelindung dinding lambung secara klinis disebut Gastritis (Pilihan B).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Peradangan pada mukosa lambung disebut Gastritis (Pilihan B). Apendiksitis adalah radang usus buntu, konstipasi adalah sembelit, dan diare adalah gangguan buang air besar berair.',
    },
  },
  {
    id: 20,
    questionNumber: 20,
    questionImg: soal20Img,
    questionAlt:
      'Soal 20: Urutan perjalanan makanan yang benar adalah....',
    cardVariant: 'stack',
    options: [
      { key: 'A', label: 'Pilihan A', img: jawabA20, organName: 'Mulut - kerongkongan - usus besar - lambung - usus halus' },
      { key: 'B', label: 'Pilihan B', img: jawabB20, organName: 'Mulut - lambung - kerongkongan - usus halus - usus besar' },
      { key: 'C', label: 'Pilihan C', img: jawabC20, organName: 'Mulut - kerongkongan - lambung - usus halus - usus besar' },
      { key: 'D', label: 'Pilihan D', img: jawabD20, organName: 'Mulut - usus halus - lambung - usus besar - kerongkongan' },
    ],
    correctAnswer: 'C',
    explanation: {
      correct:
        'Luar biasa, sempurna! Urutan perjalanan makanan dalam saluran pencernaan manusia yang benar dari awal sampai akhir adalah Mulut – Kerongkongan – Lambung – Usus Halus – Usus Besar (Pilihan C).',
      wrong:
        'Pilihan yang kamu pilih belum tepat. Urutan saluran pencernaan manusia yang benar adalah Mulut – Kerongkongan – Lambung – Usus Halus – Usus Besar (Pilihan C).',
    },
  },
];

export const MenuKuisScreen: React.FC = () => {
  const navigate = useNavigate();
  const [soundEnabled] = useState(() => isSoundEnabled());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, OptionKey | null>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, OptionKey | null>>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showHintToast, setShowHintToast] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const currentSelectedAnswer = selectedAnswers[currentIndex] ?? null;
  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;

  // Hentikan pemutaran rekaman suara atau speech synthesis secara instan
  const stopVoiceAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    setPlayingAudioKey(null);
  };

  // Bersihkan pemutaran suara saat komponen dilepas (unmount)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Efek suara interaktif terpusat
  const playSound = (type: 'pop' | 'chime' | 'soft' | 'success' | 'error') => {
    playSoundEffect(type, soundEnabled);
  };

  // Kontrol Pemutar Video Soal 4 (Animasi Mengunyah Makanan)
  const handleToggleVideo = () => {
    playSound('pop');
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsVideoPlaying(true))
          .catch(() => {});
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Putar rekaman suara audio MP3 dengan fitur restart/rewind jika tombol yang sama diklik ulang
  const playVoiceAudio = (audioUrl: string, key: string) => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    // Jika audio yang sama sedang berputar: restart/rewind dari awal (detik 0:00) per kesepakatan
    if (playingAudioKey === key && isPlayingVoice && !audio.paused) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    // Hentikan audio sebelumnya dan muat audio baru
    audio.pause();
    audio.currentTime = 0;
    audio.src = audioUrl;

    setPlayingAudioKey(key);
    setIsPlayingVoice(true);

    audio.onended = () => {
      setIsPlayingVoice(false);
      setPlayingAudioKey(null);
    };

    audio.onerror = () => {
      setIsPlayingVoice(false);
      setPlayingAudioKey(null);
    };

    audio.play().catch(() => {
      setIsPlayingVoice(false);
      setPlayingAudioKey(null);
    });
  };

  // Fitur Pemutar Suara Pertanyaan Kuis (Soal 3, 9, 15)
  const handlePlayAudioQuestion = () => {
    playSound('chime');

    if (currentQ.audioSrc) {
      playVoiceAudio(currentQ.audioSrc, 'QUESTION');
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsPlayingVoice(true);
      setPlayingAudioKey('QUESTION');
      window.speechSynthesis.cancel();
      const textToSpeak =
        currentQ.audioPromptText ||
        'Tekan tombol untuk mendengarkan pertanyaan audio kuis!';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsPlayingVoice(false);
        setPlayingAudioKey(null);
      };
      utterance.onerror = () => {
        setIsPlayingVoice(false);
        setPlayingAudioKey(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (key: OptionKey, audioSrc?: string, _speechText?: string) => {
    playSound('pop');
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    setShowHintToast(false);

    if (audioSrc) {
      playVoiceAudio(audioSrc, key);
    } else {
      stopVoiceAudio();
    }
  };

  const handleSubmit = () => {
    if (!currentSelectedAnswer) {
      playSound('soft');
      setShowHintToast(true);
      return;
    }

    stopVoiceAudio();

    const isCorrect = currentSelectedAnswer === currentQ.correctAnswer;
    setSubmittedAnswers((prev) => ({ ...prev, [currentIndex]: currentSelectedAnswer }));

    if (isCorrect) {
      playSound('success');
    } else {
      playSound('error');
    }
    setShowResultModal(true);
  };

  const handleNextStep = () => {
    playSound('pop');
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
    stopVoiceAudio();
    setShowResultModal(false);
    setShowHintToast(false);

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      playSound('chime');
      setShowFinalModal(true);
    }
  };

  const handleGoHome = () => {
    playSound('pop');
    if (videoRef.current) {
      videoRef.current.pause();
    }
    stopVoiceAudio();
    navigate('/menu');
  };

  // Navigasi keyboard interaktif (A, B, C, D, 1, 2, 3, 4, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFinalModal) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          handleGoHome();
        }
        return;
      }

      if (showResultModal) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextStep();
        }
        return;
      }

      const keyUpper = e.key.toUpperCase();
      let targetKey: OptionKey | null = null;
      if (keyUpper === 'A' || keyUpper === '1') {
        targetKey = 'A';
      } else if (keyUpper === 'B' || keyUpper === '2') {
        targetKey = 'B';
      } else if (keyUpper === 'C' || keyUpper === '3') {
        targetKey = 'C';
      } else if (keyUpper === 'D' || keyUpper === '4') {
        targetKey = 'D';
      }

      if (targetKey) {
        const matchedOpt = currentQ.options.find((o) => o.key === targetKey);
        handleSelectOption(targetKey, matchedOpt?.audioSrc, matchedOpt?.speechText);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleGoHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Evaluasi jawaban soal saat ini
  const activeAnswer = submittedAnswers[currentIndex] ?? currentSelectedAnswer;
  const isCurrentCorrect = activeAnswer === currentQ.correctAnswer;

  // Skor kumulatif kuis (Dihitung dinamis proporsional terhadap jumlah total soal)
  const correctCount = QUIZ_QUESTIONS.reduce((count, q, idx) => {
    return submittedAnswers[idx] === q.correctAnswer ? count + 1 : count;
  }, 0);
  const totalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  let finalFeedback = '';
  if (totalScore === 100) {
    finalFeedback =
      'Luar biasa, sempurna! Kamu telah menguasai seluruh materi sistem pencernaan manusia dari rongga mulut, lambung, hati dan empedu, usus halus, usus besar, hingga gangguan pencernaan dan urutan saluran makanan dengan nilai 100!';
  } else if (totalScore >= 80) {
    finalFeedback =
      'Hebat sekali! Pemahamanmu tentang sistem pencernaan manusia sudah sangat tinggi. Terus pertahankan prestasimu yang membanggakan!';
  } else if (totalScore >= 60) {
    finalFeedback =
      'Bagus! Kamu sudah memahami sebagian besar materi kuis ini. Buka kembali modul materi sistem pencernaan DIGESTA untuk memperdalam pemahamanmu!';
  } else {
    finalFeedback =
      'Tetap semangat! Pelajari kembali modul materi sistem pencernaan manusia di DIGESTA untuk memperkuat dan meningkatkan pemahamanmu!';
  }

  return (
    <div className="kuis-viewport">
      <div className="kuis-stage" ref={stageRef}>
        {/* Layer 1: Background Papan Tulis Ruang Kelas */}
        <img
          src={bgImg}
          alt="Latar Belakang Ruang Kuis DIGESTA"
          className="kuis-bg"
          draggable={false}
        />

        {/* Tombol Beranda (Kembali ke Menu) */}
        <button
          type="button"
          className="kuis-ctrl-btn kuis-btn-home"
          onClick={handleGoHome}
          title="Kembali ke Menu Utama"
          aria-label="Kembali ke Menu Utama"
        >
          <img src={btnHome} alt="Beranda" className="kuis-ctrl-img" draggable={false} />
        </button>

        {/* Badge Progres Soal Kuis (Pojok Kanan Atas) */}
        <div
          className="kuis-progress-badge"
          aria-label={`Soal ${currentIndex + 1} dari ${QUIZ_QUESTIONS.length}`}
        >
          <span>
            SOAL {currentIndex + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {/* Layer 2: Kartu Soal di Bagian Atas */}
        <header
          className={`kuis-question-container variant-${currentQ.questionVariant || 'compact'} ${currentQ.hasAudioPrompt ? 'clickable-audio' : ''}`}
          onClick={currentQ.hasAudioPrompt ? handlePlayAudioQuestion : undefined}
          title={currentQ.hasAudioPrompt ? 'Klik untuk memutar pertanyaan suara' : undefined}
        >
          <div className="kuis-question-card-wrapper">
            <img
              key={currentQ.id}
              src={currentQ.questionImg}
              alt={currentQ.questionAlt}
              className="kuis-question-img"
              draggable={false}
            />

            {/* Video Animasi Interaktif untuk Soal 4 (Mengunyah dengan Gigi) */}
            {currentQ.videoSrc && (
              <div
                className="kuis-question-video-slot"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleVideo();
                }}
                title={isVideoPlaying ? 'Klik untuk jeda video' : 'Klik untuk putar video mengunyah'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggleVideo();
                  }
                }}
                aria-label={isVideoPlaying ? 'Jeda video mengunyah' : 'Putar video mengunyah'}
              >
                <video
                  ref={videoRef}
                  src={currentQ.videoSrc}
                  poster={currentQ.videoPoster}
                  className="kuis-question-video-el"
                  playsInline
                  muted
                  loop
                  preload="auto"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                />
                {!isVideoPlaying && (
                  <div className="kuis-video-play-overlay">
                    <div className="kuis-video-play-btn-circle">
                      <svg
                        viewBox="0 0 24 24"
                        className="kuis-video-play-icon"
                        fill="currentColor"
                      >
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tombol Putar Suara di Samping Ikon Speaker (Soal 3, 9, 15) */}
            {currentQ.hasAudioPrompt && (
              <button
                type="button"
                className={`kuis-audio-play-badge ${isPlayingVoice && playingAudioKey === 'QUESTION' ? 'playing' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudioQuestion();
                }}
                title="Dengarkan Pertanyaan"
                aria-label="Dengarkan Pertanyaan"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="kuis-audio-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>{isPlayingVoice && playingAudioKey === 'QUESTION' ? 'Memutar...' : 'Putar Suara'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Layer 3: Grid 2x2 Pilihan Jawaban */}
        <section
          key={`options-${currentQ.id}`}
          className={`kuis-options-grid layout-${currentQ.cardVariant} ${currentQ.questionVariant === 'media' ? 'layout-media-question' : ''}`}
          aria-label={`Pilihan Jawaban Soal ${currentQ.questionNumber}`}
        >
          {currentQ.options.map((opt) => {
            const isSelected = currentSelectedAnswer === opt.key;
            const isAudioPlayingThisOpt = playingAudioKey === opt.key && isPlayingVoice;
            return (
              <button
                key={opt.key}
                type="button"
                className={`kuis-option-card ${isSelected ? 'selected' : ''} ${isAudioPlayingThisOpt ? 'audio-playing' : ''}`}
                onClick={() => handleSelectOption(opt.key, opt.audioSrc, opt.speechText)}
                aria-pressed={isSelected}
                aria-label={`${opt.label} - ${opt.organName}`}
              >
                <img
                  src={opt.img}
                  alt={opt.label}
                  className="kuis-option-img"
                  draggable={false}
                />
                {opt.audioSrc && isAudioPlayingThisOpt && (
                  <div className="kuis-option-audio-status">
                    <svg viewBox="0 0 24 24" className="kuis-audio-pulse-icon" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <span>Memutar...</span>
                  </div>
                )}
                {isSelected && (
                  <div className="kuis-option-active-badge">
                    <svg
                      viewBox="0 0 24 24"
                      className="kuis-active-check-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {/* Toast Petunjuk Jika Belum Memilih Jawaban */}
        {showHintToast && (
          <div className="kuis-hint-toast" role="alert">
            <span>Pilih salah satu jawaban terlebih dahulu!</span>
          </div>
        )}

        {/* Layer 4: Tombol Lanjut (Kanan Bawah) */}
        <button
          type="button"
          className={`kuis-ctrl-btn kuis-btn-next ${currentSelectedAnswer ? 'ready' : ''}`}
          onClick={handleSubmit}
          title="Periksa Jawaban"
          aria-label="Periksa Jawaban"
        >
          <img
            src={btnRight}
            alt="Tombol Periksa Jawaban"
            className="kuis-ctrl-img"
            draggable={false}
          />
        </button>

        {/* Modal Hasil Tiap Soal Bergaya Game */}
        {showResultModal && (
          <div className={`kuis-modal-overlay ${isCurrentCorrect ? 'flash-correct' : 'flash-wrong'}`}>
            <div
              className={`kuis-result-card ${isCurrentCorrect ? 'correct-theme' : 'wrong-theme'}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="kuis-result-title"
            >
              {/* Badge Plat Judul Timbul */}
              <div className="kuis-plate-badge">
                <span>EVALUASI SOAL {currentQ.questionNumber}</span>
              </div>

              {/* Ikon Game SVG */}
              <div className="kuis-result-icon-wrapper">
                {isCurrentCorrect ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="kuis-modal-svg correct"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="kuis-modal-svg wrong"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </div>

              {/* Judul Status */}
              <h2 id="kuis-result-title" className="kuis-result-title">
                {isCurrentCorrect ? 'Hebat Sekali, Jawabanmu Benar!' : 'Jawabanmu Kurang Tepat!'}
              </h2>

              {/* Badge Skor */}
              <div className="kuis-score-pill">
                <span>
                  {isCurrentCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
                </span>
              </div>

              {/* Penjelasan Edukatif */}
              <p className="kuis-result-explanation">
                {isCurrentCorrect ? currentQ.explanation.correct : currentQ.explanation.wrong}
              </p>

              {/* Tombol Aksi 3D */}
              <div className="kuis-modal-actions">
                <button
                  type="button"
                  className="kuis-action-btn kuis-btn-next-step"
                  onClick={handleNextStep}
                >
                  {isLastQuestion ? 'Lihat Hasil Akhir' : 'Lanjut ke Soal Berikutnya'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Hasil Akhir Kuis (Trophy & Skor Kumulatif) */}
        {showFinalModal && (
          <div className="kuis-modal-overlay flash-final">
            <div
              className="kuis-result-card final-theme"
              role="dialog"
              aria-modal="true"
              aria-labelledby="kuis-final-title"
            >
              {/* Badge Plat Judul Timbul */}
              <div className="kuis-plate-badge">
                <span>HASIL AKHIR KUIS</span>
              </div>

              {/* Ikon Piala Emas Game */}
              <div className="kuis-result-icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  className="kuis-trophy-svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
                </svg>
              </div>

              {/* Judul Prestasi */}
              <h2 id="kuis-final-title" className="kuis-result-title">
                {totalScore === 100
                  ? 'Sempurna! Nilai Maksimal!'
                  : totalScore >= 75
                    ? 'Bagus Sekali, Siswa Hebat!'
                    : totalScore >= 50
                      ? 'Cukup Baik, Terus Belajar!'
                      : 'Tetap Semangat Belajar!'}
              </h2>

              {/* Badge Skor Akhir */}
              <div className="kuis-score-pill">
                <span>
                  Total Skor: {totalScore} Poin ({correctCount} dari {QUIZ_QUESTIONS.length} Benar)
                </span>
              </div>

              {/* Ulasan Hasil */}
              <p className="kuis-result-explanation">{finalFeedback}</p>

              {/* Tombol Aksi 3D */}
              <div className="kuis-modal-actions">
                <button
                  type="button"
                  className="kuis-action-btn kuis-btn-menu"
                  onClick={handleGoHome}
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuKuisScreen;
