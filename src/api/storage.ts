import type { HighScore, PlayerScore } from './types';
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import config from '../config';

const NICKNAME_STORAGE = 'couplesRun_nickname';
const PLAYER_ID_STORAGE = 'couplesRun_playerId';
const HIGH_SCORE_STORAGE = 'couplesRun_highScore';

let _firestoreDb!: Firestore;

export const getNickname = () => localStorage.getItem(NICKNAME_STORAGE) ?? '';

export const setNickname = (nickname: string) =>
  localStorage.setItem(NICKNAME_STORAGE, nickname) ?? '';

export const getPlayerId = () => localStorage.getItem(PLAYER_ID_STORAGE) ?? '';

export const setPlayerId = (playerId: string) =>
  localStorage.setItem(PLAYER_ID_STORAGE, playerId);

export const saveScore = async (score: number) => {
  let playerId = getPlayerId();
  if (!playerId) {
    playerId = window.crypto.randomUUID();
    setPlayerId(playerId);
  }

  const highScore = getHighScore();
  if (score <= highScore.amount) return true;

  setHighScore({ amount: score, stored: false });
  return await uploadHighScore();
};

export const initStorage = () => {
  const app = initializeApp({
    apiKey: config.fireBaseApiKey,
    authDomain: config.fireBaseAuthDomain,
    projectId: config.fireBaseProjectId,
    storageBucket: config.fireBaseStorageBucket,
    messagingSenderId: config.fireBaseMessagingSenderId,
    appId: config.fireBaseAppId,
  });
  _firestoreDb = getFirestore(app);

  setInterval(() => uploadHighScore(), 5000);
};

export const getLeaderboard = async () => {
  if (!navigator.onLine) return [];

  try {
    const q = query(
      collection(_firestoreDb, 'scores'),
      orderBy('score', 'desc'),
      limit(10),
    );

    const documents = await getDocs(q);
    const result: PlayerScore[] = [];

    documents.forEach((d) => {
      const data = d.data();

      result.push({
        id: d.id,
        nickname: data.nickname,
        score: data.score,
      });
    });

    return result;
  } catch (err) {
    console.error('An error occurred while fetching the leaderboard', err);
    return [];
  }
};

const uploadHighScore = async () => {
  if (!navigator.onLine) return false;

  const { amount, stored } = getHighScore();
  if (amount === 0 || stored) return true;

  try {
    await setDoc(
      doc(_firestoreDb, 'scores', getPlayerId()),
      {
        nickname: getNickname(),
        score: amount,
        timestamp: Date.now(),
      },
      { merge: true },
    );
  } catch (err) {
    console.error('An error occurred while saving to firestore', err);
    return false;
  }

  if (getHighScore().amount === amount) {
    setHighScore({ amount, stored: true });
  }

  return true;
};

const getHighScore = (): HighScore => {
  const value = localStorage.getItem(HIGH_SCORE_STORAGE);
  if (!value) return { amount: 0, stored: false };

  return JSON.parse(value);
};

const setHighScore = (score: HighScore) =>
  localStorage.setItem(HIGH_SCORE_STORAGE, JSON.stringify(score));
