import { 
  collection, doc, addDoc, getDoc, getDocs, updateDoc, setDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, onSnapshot, limit
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { compressImageToBase64 } from '../utils/helpers';

// ─── Registration ID ────────────────────────────────────────────────
export const generateRegistrationId = async () => {
  try {
    const teamsRef = collection(db, 'teams');
    const snap = await getDocs(query(teamsRef, orderBy('createdAt', 'desc'), limit(1)));
    let lastNum = 0;
    if (!snap.empty) {
      const last = snap.docs[0].data().registrationId || 'BB-2026-0000';
      const parts = last.split('-');
      if (parts[2]) lastNum = parseInt(parts[2], 10) || 0;
    }
    const nextNum = String(lastNum + 1).padStart(4, '0');
    return `BB-2026-${nextNum}`;
  } catch (err) {
    console.warn('Could not query last registration ID (offline or rule restricted), generating random ID:', err);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BB-2026-${rand}`;
  }
};

// ─── File Upload with Automatic Timeout & Base64 Fallback ────────────
// ─── Instant Client Image Processing (100% Free - No Storage Billing Needed) ────
export const uploadFile = async (file, path, onProgress) => {
  if (!file) return '';
  if (onProgress) onProgress(40);
  try {
    const base64 = await compressImageToBase64(file);
    if (onProgress) onProgress(100);
    return base64;
  } catch (err) {
    console.error('Error compressing image:', err);
    if (onProgress) onProgress(100);
    return '';
  }
};

// ─── Teams ───────────────────────────────────────────────────────────
export const registerTeam = async (data) => {
  const teamsRef = collection(db, 'teams');

  // Check duplicate team name safely
  try {
    const dupQuery = query(teamsRef, where('teamName', '==', data.teamName));
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) {
      throw new Error('A team with this name already exists. Please choose a different name.');
    }
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      throw err;
    }
    // If permission prevented checking duplicates, proceed with registration
    console.warn('Duplicate check skipped:', err.message);
  }

  const registrationId = await generateRegistrationId();
  const docRef = await addDoc(teamsRef, {
    ...data,
    registrationId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, registrationId };
};

export const getApprovedTeams = (callback) => {
  const q = query(
    collection(db, 'teams'),
    where('status', '==', 'approved')
  );
  return onSnapshot(
    q,
    (snap) => {
      const teams = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side by createdAt descending (avoids requiring composite index in Firestore)
      teams.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(teams);
    },
    (err) => {
      console.error('Error fetching approved teams:', err);
      callback([]);
    }
  );
};

export const getAllTeams = (callback) => {
  const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getTeamById = async (id) => {
  const snap = await getDoc(doc(db, 'teams', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateTeamStatus = (id, status) =>
  updateDoc(doc(db, 'teams', id), { status, updatedAt: serverTimestamp() });

export const markPaymentPaid = (id) =>
  updateDoc(doc(db, 'teams', id), { 
    'payment.status': 'paid', 
    updatedAt: serverTimestamp() 
  });

export const updateTeam = async (id, data) => {
  if (!id) throw new Error('Missing team ID for update');
  await updateDoc(doc(db, 'teams', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTeam = async (teamOrId) => {
  const teamId = typeof teamOrId === 'string' ? teamOrId : teamOrId?.id;
  if (!teamId) throw new Error('Missing team ID for deletion');
  await deleteDoc(doc(db, 'teams', teamId));
};

// ─── Matches ─────────────────────────────────────────────────────────
export const getMatches = (callback) => {
  const q = query(collection(db, 'matches'), orderBy('scheduledAt', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const addMatch = (data) =>
  addDoc(collection(db, 'matches'), { ...data, createdAt: serverTimestamp() });

export const updateMatch = (id, data) =>
  updateDoc(doc(db, 'matches', id), { ...data, updatedAt: serverTimestamp() });

export const deleteMatch = (id) => deleteDoc(doc(db, 'matches', id));

// ─── Gallery ─────────────────────────────────────────────────────────
export const getGallery = (callback) => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const addGalleryPhoto = (data) =>
  addDoc(collection(db, 'gallery'), { ...data, createdAt: serverTimestamp() });

export const deleteGalleryPhoto = async (photo) => {
  if (photo.url && !photo.url.startsWith('data:')) {
    try {
      await deleteObject(ref(storage, photo.url));
    } catch (_) {}
  }
  await deleteDoc(doc(db, 'gallery', photo.id));
};

// ─── Settings ────────────────────────────────────────────────────────
export const getSettings = async () => {
  try {
    const snap = await getDoc(doc(db, 'settings', 'tournament'));
    return snap.exists() ? { ...getDefaultSettings(), ...snap.data() } : getDefaultSettings();
  } catch (err) {
    console.warn('Failed to load settings from Firestore, using default:', err);
    return getDefaultSettings();
  }
};

export const updateSettings = async (data) => {
  await setDoc(doc(db, 'settings', 'tournament'), { 
    ...data, 
    updatedAt: serverTimestamp() 
  }, { merge: true });
};

export const onSettingsChange = (callback) => {
  return onSnapshot(doc(db, 'settings', 'tournament'), (snap) => {
    if (snap.exists()) {
      callback({ ...getDefaultSettings(), ...snap.data() });
    } else {
      callback(getDefaultSettings());
    }
  }, (err) => {
    console.warn('Settings listener error, fallback to defaults:', err);
    callback(getDefaultSettings());
  });
};

const getDefaultSettings = () => ({
  name: 'HUSLER CUP',
  dates: '30 Ashwin 2083',
  venue: 'GLORIOUS ACADEMY CHITWAN',
  fee: 500,
  deadline: '28 Ashwin 2083',
  registrationOpen: true,
  contact: 'utsavparajuli035@gmail.com',
  countdownTarget: '2026-10-16T09:00',
});

