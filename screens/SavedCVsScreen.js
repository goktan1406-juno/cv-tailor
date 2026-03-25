import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadAllCVs, deleteCV } from '../services/storage';
import { t } from '../services/i18n';

const ACCENT = '#4F46E5';

export default function SavedCVsScreen({ navigation }) {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadAllCVs().then(data => {
        if (active) {
          setCvs(data);
          setLoading(false);
        }
      });
      return () => { active = false; };
    }, [])
  );

  const handleDelete = (filename, name) => {
    Alert.alert(t('saved.deleteTitle'), `"${name}" ${t('saved.deleteMsg')}`, [
      { text: t('saved.deleteCancel'), style: 'cancel' },
      {
        text: t('saved.deleteConfirm'),
        style: 'destructive',
        onPress: () => {
          deleteCV(filename);
          setCvs(prev => prev.filter(c => c.filename !== filename));
        },
      },
    ]);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (cvs.length === 0) {
    return (
      <View style={s.center}>
        <Text style={s.emptyIcon}>📄</Text>
        <Text style={s.emptyTitle}>{t('saved.empty')}</Text>
        <Text style={s.emptySubtitle}>{t('saved.emptySub')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={s.list}
      contentContainerStyle={s.listContent}
      data={cvs}
      keyExtractor={item => item.filename}
      ItemSeparatorComponent={() => <View style={s.sep} />}
      renderItem={({ item }) => {
        const name = item.name;
        const snippet = item.jobDescription?.trim().slice(0, 80) ?? '';
        return (
          <TouchableOpacity
            style={s.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Result', { cvData: item.cvData, jobDescription: item.jobDescription })}
          >
            <View style={s.cardLeft}>
              <View style={s.dot} />
            </View>
            <View style={s.cardBody}>
              <Text style={s.cardName} numberOfLines={1}>{name}</Text>
              <Text style={s.cardSnippet} numberOfLines={2}>{snippet}</Text>
              <Text style={s.cardDate}>{formatDate(item.savedAt)}</Text>
            </View>
            <TouchableOpacity
              style={s.deleteBtn}
              onPress={() => handleDelete(item.filename, name)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.deleteIcon}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

  list: { flex: 1, backgroundColor: '#F9FAFB' },
  listContent: { padding: 16 },
  sep: { height: 10 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: { marginRight: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT },
  cardBody: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardSnippet: { fontSize: 12, color: '#6B7280', lineHeight: 18, marginBottom: 6 },
  cardDate: { fontSize: 11, color: '#9CA3AF' },

  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 14, color: '#9CA3AF' },
});
