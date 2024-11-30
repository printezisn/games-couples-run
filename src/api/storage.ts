import type { HighScore } from './types';
import { initializeApp } from 'firebase/app';
import { doc, Firestore, getFirestore, setDoc } from 'firebase/firestore';

const NICKNAME_STORAGE = 'couplesRun_nickname';
const PLAYER_ID_STORAGE = 'couplesRun_playerId';
const HIGH_SCORE_STORAGE = 'couplesRun_highScore';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBPCVBnq-hw94nmIEYtfMwT5PiCLvNDWQs',
  authDomain: 'couples-run.firebaseapp.com',
  projectId: 'couples-run',
  storageBucket: 'couples-run.firebasestorage.app',
  messagingSenderId: '817663008433',
  appId: '1:817663008433:web:6271fc6c5a91e2b95fcc90',
};

let _firestoreDb!: Firestore;

export const getNickname = () => localStorage.getItem(NICKNAME_STORAGE) ?? '';

export const setNickname = (nickname: string) =>
  localStorage.setItem(NICKNAME_STORAGE, nickname) ?? '';

export const saveScore = async (score: number) => {
  let playerId = getPlayerId();
  if (!playerId) {
    playerId = window.crypto.randomUUID();
    setPlayerId(playerId);
  }

  const highScore = getHighScore();
  if (score <= highScore.amount) return;

  setHighScore({ amount: score, stored: false });
  await uploadHighScore();
};

export const initStorage = () => {
  const app = initializeApp(FIREBASE_CONFIG);
  _firestoreDb = getFirestore(app);

  setInterval(() => uploadHighScore(), 5000);
};

const uploadHighScore = async () => {
  const { amount, stored } = getHighScore();
  if (amount === 0 || stored) return;

  await setDoc(
    doc(_firestoreDb, 'scores', getPlayerId()),
    {
      nickname: getNickname(),
      score: amount,
      timestamp: Date.now(),
    },
    { merge: true },
  );

  if (getHighScore().amount === amount) {
    setHighScore({ amount, stored: true });
  }
};

const getPlayerId = () => localStorage.getItem(PLAYER_ID_STORAGE) ?? '';

const setPlayerId = (playerId: string) =>
  localStorage.setItem(PLAYER_ID_STORAGE, playerId);

const getHighScore = (): HighScore => {
  const value = localStorage.getItem(HIGH_SCORE_STORAGE);
  if (!value) return { amount: 0, stored: false };

  return JSON.parse(value);
};

const setHighScore = (score: HighScore) =>
  localStorage.setItem(HIGH_SCORE_STORAGE, JSON.stringify(score));
