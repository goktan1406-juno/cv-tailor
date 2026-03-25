import { File, Paths } from 'expo-file-system/next';

const FILE = new File(Paths.document, 'credits.json');
const FREE_CREDITS = 1; // yeni kullanıcıya verilen ücretsiz kredi

const PLANS = {
  weekly: {
    label: 'Haftalık',
    price: '₺79,99',
    priceRaw: 79.99,
    creditsPerWeek: 5,
    intervalDays: 7,
  },
  yearly: {
    label: 'Yıllık',
    price: '₺1.299,99',
    priceRaw: 1299.99,
    creditsPerWeek: 5,
    intervalDays: 365,
    weeklyEquiv: '₺24,99/hafta',
    saving: '%69 tasarruf',
  },
};

const CREDIT_PACKS = [
  { id: 'pack5',  label: '5 Kredi',  credits: 5,  price: '₺39,99',  priceRaw: 39.99,  popular: false },
  { id: 'pack10', label: '10 Kredi', credits: 10, price: '₺69,99',  priceRaw: 69.99,  popular: true  },
  { id: 'pack20', label: '20 Kredi', credits: 20, price: '₺119,99', priceRaw: 119.99, popular: false },
];

function readData() {
  try {
    if (FILE.exists) {
      return JSON.parse(FILE.readAsString ? FILE.readAsString() : null);
    }
  } catch { /* ignore */ }
  return null;
}

function writeData(data) {
  FILE.write(JSON.stringify(data));
}

function defaultData() {
  return { credits: FREE_CREDITS, subscription: null, lastCredited: null };
}

export function loadCreditsSync() {
  const data = readData();
  if (!data) {
    const d = defaultData();
    writeData(d);
    return d;
  }
  return data;
}

export async function loadCredits() {
  const data = readData();
  if (!data) {
    const d = defaultData();
    writeData(d);
    return d;
  }
  // Haftalık kredi yenileme kontrolü
  if (data.subscription) {
    const now = Date.now();
    const last = data.lastCredited ? new Date(data.lastCredited).getTime() : 0;
    const msWeek = 7 * 24 * 60 * 60 * 1000;
    const subExpires = new Date(data.subscription.expiresAt).getTime();
    if (now < subExpires && now - last >= msWeek) {
      data.credits += PLANS[data.subscription.type].creditsPerWeek;
      data.lastCredited = new Date().toISOString();
      writeData(data);
    }
  }
  return data;
}

export function getCreditsSync() {
  return loadCreditsSync().credits;
}

export function deductCredit() {
  const data = loadCreditsSync();
  if (data.credits <= 0) return false;
  data.credits -= 1;
  writeData(data);
  return true;
}

export function activateSubscription(type) {
  const data = loadCreditsSync();
  const plan = PLANS[type];
  const now = new Date();
  const expires = new Date(now.getTime() + plan.intervalDays * 24 * 60 * 60 * 1000);
  data.subscription = { type, expiresAt: expires.toISOString() };
  data.credits += plan.creditsPerWeek; // ilk hafta kredisi
  data.lastCredited = now.toISOString();
  writeData(data);
  return data;
}

export function cancelSubscription() {
  const data = loadCreditsSync();
  data.subscription = null;
  writeData(data);
  return data;
}

export function buyCredits(packId) {
  const pack = CREDIT_PACKS.find(p => p.id === packId);
  if (!pack) throw new Error('Geçersiz paket');
  const data = loadCreditsSync();
  data.credits += pack.credits;
  writeData(data);
  return data;
}

export function getSubscription() {
  const data = loadCreditsSync();
  return data.subscription;
}

export function hasActiveSubscription() {
  const data = loadCreditsSync();
  if (!data.subscription) return false;
  return new Date(data.subscription.expiresAt) > new Date();
}

export { PLANS, CREDIT_PACKS, FREE_CREDITS };
