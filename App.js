import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { t } from './services/i18n';
import HomeScreen from './screens/HomeScreen';
import ResultScreen from './screens/ResultScreen';
import SavedCVsScreen from './screens/SavedCVsScreen';
import EditCVScreen from './screens/EditCVScreen';
import CreateCVScreen from './screens/CreateCVScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';

const ACCENT = '#4F46E5';

// ─── Aluminum Pro badge ───────────────────────────────────────────────────────
function ProBadge({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={b.wrap}>
      <View style={b.tag}>
        <View style={b.tagInner}>
          <Text style={b.tagText}>PRO</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const b = StyleSheet.create({
  wrap: { justifyContent: 'center', alignItems: 'center' },
  tag: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#C2C7D0',
    borderWidth: 1,
    borderColor: '#A8ADB8',
    borderTopColor: '#DDE0E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  tagInner: {
    backgroundColor: '#CDD2DB',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: '900', color: '#2D3240', letterSpacing: 1.5 },
});

// ─── Center logo ─────────────────────────────────────────────────────────────
function Logo() {
  return (
    <View style={l.container}>
      {/* Icon mark */}
      <View style={l.iconWrap}>
        <View style={l.iconBg}>
          {/* Document lines */}
          <View style={l.line1} />
          <View style={l.line2} />
          <View style={l.line3} />
          {/* Spark */}
          <View style={l.spark} />
        </View>
      </View>
      {/* Wordmark */}
      <View style={l.textWrap}>
        <Text style={l.wordmark}>cv<Text style={l.wordmarkAccent}>tailor</Text></Text>
      </View>
    </View>
  );
}

const l = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  iconWrap: {
    width: 32, height: 32,
    borderRadius: 9,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  iconBg: {
    width: 18, height: 22,
    justifyContent: 'center',
    gap: 3,
  },
  line1: { height: 2, width: 18, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 1 },
  line2: { height: 2, width: 13, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 1 },
  line3: { height: 2, width: 10, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1 },
  spark: {
    position: 'absolute',
    top: -1, right: -3,
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: '#A5F3FC',
  },

  textWrap: {},
  wordmark: { fontSize: 17, fontWeight: '300', color: '#6B7280', letterSpacing: 0.2 },
  wordmarkAccent: { fontWeight: '800', color: '#111827', letterSpacing: -0.4 },
});

// ─── CV'lerim tag ─────────────────────────────────────────────────────────────
const r = StyleSheet.create({
  tag: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#C2C7D0',
    borderWidth: 1,
    borderColor: '#A8ADB8',
    borderTopColor: '#DDE0E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  tagInner: {
    backgroundColor: '#CDD2DB',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: '900', color: '#2D3240', letterSpacing: 1 },
});

// ─── Navigator ───────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#111827',
            headerTitleStyle: { fontWeight: '700', fontSize: 16 },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            contentStyle: { backgroundColor: '#fff' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => <Logo />,
              headerLeft: () => (
                <ProBadge onPress={() => navigation.navigate('Subscription')} />
              ),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('SavedCVs')}
                  activeOpacity={0.75}
                  style={r.tag}
                >
                  <View style={r.tagInner}>
                    <Text style={r.tagText}>{t('header.cvlerim')}</Text>
                  </View>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Result"    component={ResultScreen}       options={{ title: t('header.editedCV') }} />
          <Stack.Screen name="SavedCVs"  component={SavedCVsScreen}     options={{ title: t('header.cvlerim') }} />
          <Stack.Screen name="EditCV"    component={EditCVScreen}       options={{ title: t('header.editCV') }} />
          <Stack.Screen name="CreateCV"  component={CreateCVScreen}     options={{ title: t('header.createCV') }} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: t('header.goPro') }} />
          <Stack.Screen name="Terms"   component={TermsScreen}   options={{ title: 'Kullanım Koşulları' }} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Gizlilik Politikası' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
