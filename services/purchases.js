import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── RevenueCat API Keys ────────────────────────────────────────────────────
// Bunları RevenueCat Dashboard > Project Settings > API Keys bölümünden alın
const RC_IOS_KEY = 'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';   // TODO: RevenueCat iOS key
const RC_ANDROID_KEY = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // TODO: RevenueCat Android key

// ─── App Store Connect'te oluşturulacak ürün ID'leri ────────────────────────
export const PRODUCT_IDS = {
  SUB_WEEKLY: 'com.cvtailor.app.sub.weekly',
  SUB_YEARLY: 'com.cvtailor.app.sub.yearly',
  CREDITS_5:  'com.cvtailor.app.credits5',
  CREDITS_10: 'com.cvtailor.app.credits10',
  CREDITS_20: 'com.cvtailor.app.credits20',
};

// RevenueCat'ta tanımlanacak Entitlement ID
export const ENTITLEMENT_PRO = 'pro';

let initialized = false;

export function initPurchases() {
  if (initialized) return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;
  Purchases.configure({ apiKey });
  initialized = true;
}

// Abonelik satın al (WEEKLY veya YEARLY)
export async function purchaseSubscription(productId) {
  const products = await Purchases.getProducts([productId]);
  if (!products || products.length === 0) {
    throw new Error('Ürün bulunamadı. Lütfen internet bağlantınızı kontrol edin.');
  }
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
  return customerInfo;
}

// Kredi paketi satın al (consumable)
export async function purchaseCreditPack(productId) {
  const products = await Purchases.getProducts([productId]);
  if (!products || products.length === 0) {
    throw new Error('Ürün bulunamadı. Lütfen internet bağlantınızı kontrol edin.');
  }
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
  return customerInfo;
}

// Geçmiş satın alımları geri yükle
export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  return customerInfo;
}

// Mevcut müşteri bilgilerini al
export async function getCustomerInfo() {
  return await Purchases.getCustomerInfo();
}

// Pro entitlement aktif mi?
export function hasProEntitlement(customerInfo) {
  return ENTITLEMENT_PRO in customerInfo.entitlements.active;
}

// Hata kullanıcı iptali mi?
export function isUserCancelledError(err) {
  return err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}
