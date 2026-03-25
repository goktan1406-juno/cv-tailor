import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';
const SCAN_BOX_H = 260;

const STEPS = () => [
  { label: t('scan.step1'), pct: 10 },
  { label: t('scan.step2'), pct: 22 },
  { label: t('scan.step3'), pct: 36 },
  { label: t('scan.step4'), pct: 50 },
  { label: t('scan.step5'), pct: 64 },
  { label: t('scan.step6'), pct: 76 },
  { label: t('scan.step7'), pct: 87 },
  { label: t('scan.step8'), pct: 94 },
];

// Placeholder document lines (PDF içeriğini simüle eder)
const DOC_LINES = [
  { w: '60%', bold: true },
  { w: '40%', bold: false },
  { w: '80%', bold: false },
  { w: '30%', bold: true, mt: 10 },
  { w: '90%', bold: false },
  { w: '75%', bold: false },
  { w: '85%', bold: false },
  { w: '50%', bold: false },
  { w: '30%', bold: true, mt: 10 },
  { w: '70%', bold: false },
  { w: '95%', bold: false },
  { w: '60%', bold: false },
  { w: '80%', bold: false },
];

export default function ScanningOverlay({ fileName }) {
  const steps = STEPS();
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [stepIdx, setStepIdx] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: SCAN_BOX_H,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx = Math.min(idx + 1, steps.length - 1);
      setStepIdx(idx);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const isLastStep = stepIdx === steps.length - 1;
    const target = isLastStep ? 99 : steps[stepIdx].pct;
    // Son stepta çok yavaş ilerle (API bekleniyor hissi vermesin)
    const interval = isLastStep ? 1200 : 18;
    const tick = setInterval(() => {
      setDisplayPct(prev => {
        if (prev >= target) { clearInterval(tick); return prev; }
        return Math.min(prev + 1, target);
      });
    }, interval);
    return () => clearInterval(tick);
  }, [stepIdx]);

  return (
    <Animated.View style={[s.root, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.iconWrap}>
          <Text style={s.icon}>✦</Text>
        </View>
        <Text style={s.title}>{t('scan.title')}</Text>
        <Text style={s.subtitle}>{t('scan.subtitle')}</Text>
      </View>

      {/* Document Scanner */}
      <View style={s.docCard}>
        {/* File name */}
        <View style={s.fileRow}>
          <Text style={s.fileIcon}>📄</Text>
          <Text style={s.fileName} numberOfLines={1}>{fileName || 'cv.pdf'}</Text>
        </View>

        {/* Document lines */}
        <View style={s.scanBox}>
          <View style={s.linesWrap}>
            {DOC_LINES.map((line, i) => (
              <View
                key={i}
                style={[
                  s.docLine,
                  { width: line.w, height: line.bold ? 10 : 7, marginTop: line.mt || 5 },
                  line.bold && s.docLineBold,
                ]}
              />
            ))}
          </View>

          {/* Scan overlay */}
          <View style={s.scanOverlay} />

          {/* Scan line */}
          <Animated.View
            style={[s.scanLineWrap, { transform: [{ translateY: scanAnim }] }]}
            pointerEvents="none"
          >
            <View style={s.glowTop} />
            <View style={s.scanCore} />
            <View style={s.glowBottom} />
          </Animated.View>

          {/* Corner brackets */}
          <View style={[s.corner, s.cTL]} />
          <View style={[s.corner, s.cTR]} />
          <View style={[s.corner, s.cBL]} />
          <View style={[s.corner, s.cBR]} />
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressSection}>
        <View style={s.progressHeader}>
          <Text style={s.progressLabel}>{steps[stepIdx].label}...</Text>
          <Text style={s.progressPct}>{displayPct}%</Text>
        </View>
        <View style={s.track}>
          <View style={[s.fill, { width: `${displayPct}%` }]} />
        </View>
      </View>

      {/* Steps */}
      <View style={s.stepsRow}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              s.stepDot,
              i < stepIdx && s.stepDotDone,
              i === stepIdx && s.stepDotActive,
            ]}
          />
        ))}
      </View>

    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  iconWrap: {
    width: 52, height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 22, color: ACCENT },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

  docCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 28,
  },
  fileRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, gap: 8,
  },
  fileIcon: { fontSize: 16 },
  fileName: { fontSize: 13, fontWeight: '600', color: '#374151', flex: 1 },

  scanBox: {
    height: SCAN_BOX_H,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  linesWrap: { padding: 16 },
  docLine: {
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  docLineBold: { backgroundColor: '#D1D5DB' },

  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  scanLineWrap: {
    position: 'absolute', left: 0, right: 0, top: 0,
  },
  glowTop: { height: 24, backgroundColor: 'rgba(79,70,229,0.07)' },
  scanCore: {
    height: 2,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  glowBottom: { height: 24, backgroundColor: 'rgba(79,70,229,0.07)' },

  corner: { position: 'absolute', width: 12, height: 12, borderColor: ACCENT },
  cTL: { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
  cTR: { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
  cBL: { bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
  cBR: { bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },

  progressSection: { marginBottom: 20 },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: '#374151', fontWeight: '500' },
  progressPct: { fontSize: 13, fontWeight: '700', color: ACCENT },
  track: {
    height: 4, backgroundColor: '#E5E7EB',
    borderRadius: 2, overflow: 'hidden',
  },
  fill: {
    height: '100%', backgroundColor: ACCENT, borderRadius: 2,
  },

  stepsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  slowWrap: { alignItems: 'center', marginTop: 24, gap: 10 },
  slowText: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  cancelText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  stepDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB',
  },
  stepDotDone: { backgroundColor: '#A5B4FC' },
  stepDotActive: { backgroundColor: ACCENT, width: 18 },
});
