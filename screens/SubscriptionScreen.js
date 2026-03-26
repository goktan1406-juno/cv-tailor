import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import { activateSubscription, loadCredits, cancelSubscription, buyCredits, PLANS, CREDIT_PACKS } from '../services/credits';
import { initPurchases, purchaseSubscription, purchaseCreditPack, restorePurchases, isUserCancelledError, PRODUCT_IDS, getProductPrices } from '../services/purchases';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';
const DARK = '#0F172A';
const MID = '#64748B';

const FEATURES = () => [
  t('sub.f1'),
  t('sub.f2'),
  t('sub.f3'),
  t('sub.f4'),
];

export default function SubscriptionScreen({ navigation }) {
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [packLoading, setPackLoading] = useState(null);
  const [subData, setSubData] = useState(null);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    initPurchases();
    loadCredits().then(setSubData);
    getProductPrices().then(p => { if (p) setPrices(p); });
  }, []);

  const isActive = subData?.subscription &&
    new Date(subData.subscription.expiresAt) > new Date();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const productId = selected === 'yearly' ? PRODUCT_IDS.SUB_YEARLY : PRODUCT_IDS.SUB_WEEKLY;
      await purchaseSubscription(productId);
      const updated = await activateSubscription(selected);
      setSubData(updated);
      Alert.alert(
        t('sub.activated'),
        `${PLANS[selected].label} ${t('sub.planStarted')} ${PLANS[selected].creditsPerWeek} ${t('sub.creditsAddedSuffix')}`,
        [{ text: t('alert.ok'), onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      if (!isUserCancelledError(err)) {
        Alert.alert(t('alert.error'), err?.message || t('sub.operationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPack = async (pack) => {
    setPackLoading(pack.id);
    try {
      const productIdMap = {
        pack5:  PRODUCT_IDS.CREDITS_5,
        pack10: PRODUCT_IDS.CREDITS_10,
        pack20: PRODUCT_IDS.CREDITS_20,
      };
      await purchaseCreditPack(productIdMap[pack.id]);
      const updated = await buyCredits(pack.id);
      setSubData(updated);
      Alert.alert(t('sub.creditsAddedTitle'), `${pack.credits} ${t('sub.creditsAddedMsg')}`);
    } catch (err) {
      if (!isUserCancelledError(err)) {
        Alert.alert(t('alert.error'), err?.message || t('sub.operationFailed'));
      }
    } finally {
      setPackLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await restorePurchases();
      const updated = await loadCredits();
      setSubData(updated);
      Alert.alert('Geri Yüklendi', 'Satın alımlarınız başarıyla geri yüklendi.');
    } catch (err) {
      Alert.alert(t('alert.error'), err?.message || t('sub.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      t('sub.cancelConfirmTitle'),
      t('sub.cancelConfirmMsg'),
      [
        { text: t('sub.cancelNo'), style: 'cancel' },
        {
          text: t('sub.cancelYes'), style: 'destructive', onPress: () => {
            cancelSubscription();
            setSubData(prev => ({ ...prev, subscription: null }));
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerBadge}>
          <Text style={s.headerBadgeText}>PRO</Text>
        </View>
        <Text style={s.headerTitle}>{t('sub.title')}</Text>
        <Text style={s.headerSub}>{t('sub.subtitle')}</Text>
      </View>

      {/* Active subscription state */}
      {isActive && (
        <View style={s.activeBanner}>
          <View>
            <Text style={s.activeBannerLabel}>{t('sub.activePlan')}</Text>
            <Text style={s.activeBannerPlan}>
              {PLANS[subData.subscription.type].label} · {subData.credits} {t('sub.creditsLeft')}
            </Text>
          </View>
          <Text style={s.activeBannerExpiry}>
            {new Date(subData.subscription.expiresAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>
      )}

      {/* Credit balance (no active sub) */}
      {!isActive && subData != null && (
        <View style={s.balanceBar}>
          <Text style={s.balanceLabel}>{t('sub.currentCredits')}</Text>
          <Text style={s.balanceNum}>{subData.credits}</Text>
        </View>
      )}

      {/* Plans */}
      {!isActive && (
        <View style={s.planSection}>
          <Text style={s.sectionTitle}>{t('sub.plans')}</Text>

          {/* Yearly */}
          <TouchableOpacity
            style={[s.planCard, selected === 'yearly' && s.planCardActive]}
            onPress={() => setSelected('yearly')}
            activeOpacity={0.8}
          >
            <View style={s.planCardInner}>
              <View style={[s.radio, selected === 'yearly' && s.radioActive]}>
                {selected === 'yearly' && <View style={s.radioDot} />}
              </View>
              <View style={s.planInfo}>
                <View style={s.planLabelRow}>
                  <Text style={s.planName}>{t('sub.yearly')}</Text>
                  <View style={s.savingBadge}>
                    <Text style={s.savingText}>{t('sub.yearlySaving')}</Text>
                  </View>
                </View>
                <Text style={s.planDetail}>{t('sub.yearlyDetail')}</Text>
              </View>
              <View style={s.planPriceCol}>
                <Text style={s.planPrice}>{prices[PRODUCT_IDS.SUB_YEARLY] || '₺1.299,99'}</Text>
                <Text style={s.planPriceSub}>{t('sub.perWeek')}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Weekly */}
          <TouchableOpacity
            style={[s.planCard, selected === 'weekly' && s.planCardActive]}
            onPress={() => setSelected('weekly')}
            activeOpacity={0.8}
          >
            <View style={s.planCardInner}>
              <View style={[s.radio, selected === 'weekly' && s.radioActive]}>
                {selected === 'weekly' && <View style={s.radioDot} />}
              </View>
              <View style={s.planInfo}>
                <Text style={s.planName}>{t('sub.weekly')}</Text>
                <Text style={s.planDetail}>{t('sub.weeklyDetail')}</Text>
              </View>
              <View style={s.planPriceCol}>
                <Text style={s.planPrice}>{prices[PRODUCT_IDS.SUB_WEEKLY] || '₺49,99'}</Text>
                <Text style={s.planPriceSub}>{t('sub.perWeek')}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.cta, loading && s.ctaBusy]}
            onPress={handlePurchase}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.ctaText}>
                  {selected === 'yearly'
  ? `${prices[PRODUCT_IDS.SUB_YEARLY] || '₺1.299,99'} ${t('sub.startWith')}`
  : `${prices[PRODUCT_IDS.SUB_WEEKLY] || '₺49,99'} ${t('sub.startWith')}`}
                </Text>
            }
          </TouchableOpacity>

          <Text style={s.trialNote}>{t('sub.cancelNote')}</Text>
        </View>
      )}

      {isActive && (
        <TouchableOpacity style={s.cancelBtn} onPress={handleCancel}>
          <Text style={s.cancelText}>{t('sub.cancelBtn')}</Text>
        </TouchableOpacity>
      )}

      {/* Feature list */}
      <View style={s.featureSection}>
        <Text style={s.sectionTitle}>{t('sub.included')}</Text>
        {FEATURES().map((f, i) => (
          <View key={i} style={s.featureRow}>
            <View style={s.featureDot} />
            <Text style={s.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Credit packs */}
      <View style={s.packSection}>
        <Text style={s.sectionTitle}>{t('sub.packs')}</Text>
        <Text style={s.packSub}>{t('sub.packsSub')}</Text>
        {CREDIT_PACKS.map(pack => (
          <TouchableOpacity
            key={pack.id}
            style={s.packRow}
            onPress={() => handleBuyPack(pack)}
            disabled={packLoading !== null}
            activeOpacity={0.8}
          >
            <View style={s.packLeft}>
              <Text style={s.packCredits}>{pack.credits} {t('sub.creditsUnit')}</Text>
              {pack.popular && (
                <View style={s.packPopular}>
                  <Text style={s.packPopularText}>{t('sub.popular')}</Text>
                </View>
              )}
            </View>
            <View style={s.packRight}>
              {packLoading === pack.id
                ? <ActivityIndicator size="small" color={ACCENT} />
                : <Text style={s.packPrice}>{prices[PRODUCT_IDS[`CREDITS_${pack.credits}`]] || pack.price}</Text>
              }
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.restoreBtn} onPress={handleRestore} disabled={loading}>
        <Text style={s.restoreText}>Satın Alımları Geri Yükle</Text>
      </TouchableOpacity>

      <Text style={s.legal}>{t('sub.legal')}</Text>

      <View style={s.legalLinks}>
        <Text style={s.legalLinksText}>{t('sub.legalLinks')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text style={s.legalLink}>{t('sub.terms')}</Text>
        </TouchableOpacity>
        <Text style={s.legalLinksText}> {t('sub.legalLinksAnd')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
          <Text style={s.legalLink}>{t('sub.privacy')}</Text>
        </TouchableOpacity>
        {t('sub.legalLinksAccept') ? <Text style={s.legalLinksText}> {t('sub.legalLinksAccept')}</Text> : null}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 56 },

  // Header
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ACCENT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1.2 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginBottom: 10 },
  headerSub: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },

  // Active banner
  activeBanner: {
    margin: 20,
    padding: 18,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBannerLabel: { fontSize: 11, color: '#16A34A', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3 },
  activeBannerPlan: { fontSize: 15, fontWeight: '700', color: '#166534' },
  activeBannerExpiry: { fontSize: 12, color: '#16A34A' },

  // Balance bar
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  balanceLabel: { fontSize: 13, color: MID, fontWeight: '500' },
  balanceNum: { fontSize: 22, fontWeight: '800', color: DARK },

  // Section title
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },

  // Plans
  planSection: { padding: 20, paddingTop: 28 },
  planCard: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  planCardActive: { borderColor: ACCENT, backgroundColor: '#EEF2FF' },
  planCardInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioActive: { borderColor: ACCENT },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT },
  planInfo: { flex: 1 },
  planLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  planName: { fontSize: 15, fontWeight: '700', color: DARK },
  planDetail: { fontSize: 12, color: MID },
  savingBadge: { backgroundColor: '#DCFCE7', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  savingText: { fontSize: 10, fontWeight: '700', color: '#16A34A' },
  planPriceCol: { alignItems: 'flex-end' },
  planPrice: { fontSize: 15, fontWeight: '800', color: DARK },
  planPriceSub: { fontSize: 11, color: MID, marginTop: 1 },

  cta: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaBusy: { opacity: 0.7 },
  ctaText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  trialNote: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 12 },

  cancelBtn: { marginHorizontal: 20, marginTop: 8, marginBottom: 4, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 13, color: '#EF4444', fontWeight: '600' },

  // Features
  featureSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT, marginTop: 7, flexShrink: 0 },
  featureText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 20 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 20, marginBottom: 24 },

  // Credit packs
  packSection: { paddingHorizontal: 20, paddingBottom: 28 },
  packSub: { fontSize: 12, color: MID, lineHeight: 18, marginTop: -8, marginBottom: 14 },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  packLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  packCredits: { fontSize: 14, fontWeight: '600', color: DARK },
  packPopular: { backgroundColor: '#EEF2FF', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  packPopularText: { fontSize: 10, fontWeight: '700', color: ACCENT },
  packRight: {},
  packPrice: { fontSize: 14, fontWeight: '700', color: ACCENT },

  restoreBtn: { alignItems: 'center', paddingVertical: 12, marginHorizontal: 24, marginBottom: 8 },
  restoreText: { fontSize: 13, color: '#64748B', textDecorationLine: 'underline' },

  legal: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 17, paddingHorizontal: 24 },
  legalLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  legalLinksText: { fontSize: 11, color: '#94A3B8', lineHeight: 18 },
  legalLink: { fontSize: 11, color: ACCENT, lineHeight: 18, textDecorationLine: 'underline' },
});
