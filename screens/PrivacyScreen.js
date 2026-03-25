import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { getLocales } from 'expo-localization';

const isTurkish = () => {
  try {
    const [locale] = getLocales();
    return locale?.languageCode === 'tr';
  } catch {
    return false;
  }
};

const PRIVACY_TR = {
  lastUpdated: 'Son güncelleme: Mart 2025',
  intro: 'CV Tailor olarak kişisel verilerinizin gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açıklamaktadır.',
  sections: [
    {
      title: '1. Topladığımız Veriler',
      body: 'Uygulama aşağıdaki veri kategorilerini işlemektedir:\n\n• CV İçeriği: Yüklediğiniz veya oluşturduğunuz CV dosyası ve metin içeriği\n• İş İlanı Metni: Girdiğiniz iş ilanı açıklaması\n• Yerel Depolama Verileri: Kaydedilmiş CV\'ler, kredi bakiyesi ve abonelik bilgileri (yalnızca cihazınızda)\n• Satın Alma Bilgileri: Apple App Store üzerinden gerçekleştirilen işlem kayıtları',
    },
    {
      title: '2. Verilerin Kullanım Amacı',
      body: 'Topladığımız veriler şu amaçlarla kullanılmaktadır:\n\n• CV optimizasyon hizmetinin sunulması\n• Kredi ve abonelik yönetimi\n• Uygulama işlevselliğinin iyileştirilmesi\n• Yasal yükümlülüklerin yerine getirilmesi',
    },
    {
      title: '3. OpenAI ile Veri Paylaşımı',
      body: 'CV optimizasyonu için CV içeriğiniz ve iş ilanı metni OpenAI, Inc.\'in API\'sine iletilmektedir. Bu veriler OpenAI tarafından yapay zeka modelini geliştirmek amacıyla kullanılabilir. OpenAI\'nin veri işleme pratikleri hakkında bilgi için openai.com/privacy adresini ziyaret ediniz.\n\nÖnemli: CV\'nize kişisel bilgiler (TC kimlik numarası, banka bilgileri vb.) eklememenizi tavsiye ederiz.',
    },
    {
      title: '4. Apple App Store ve Satın Almalar',
      body: 'Uygulama içi satın almalar Apple\'ın altyapısı üzerinden gerçekleştirilmektedir. Ödeme bilgileriniz doğrudan Apple tarafından işlenir; biz bu bilgilere erişemeyiz. Apple\'ın gizlilik politikası için apple.com/legal/privacy adresini ziyaret ediniz.',
    },
    {
      title: '5. Yerel Depolama',
      body: 'Kaydedilen CV\'ler, kredi bakiyesi ve abonelik bilgileri yalnızca cihazınızda yerel olarak saklanmaktadır. Bu veriler sunucularımıza aktarılmamaktadır. Uygulamayı sildiğinizde tüm yerel veriler kalıcı olarak silinir.',
    },
    {
      title: '6. Veri Güvenliği',
      body: 'Verilerinizin güvenliği için endüstri standardı güvenlik önlemleri uygulamaktayız. Ancak internet üzerinden veri iletiminin %100 güvenli olmadığını hatırlatırız. CV\'nizi üçüncü taraflarla paylaşmadan önce hassas kişisel bilgileri kaldırmanızı öneririz.',
    },
    {
      title: '7. KVKK Kapsamındaki Haklarınız',
      body: '6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• Kişisel verilerinize erişim talep etme\n• Yanlış verilerin düzeltilmesini isteme\n• Belirli koşullarda verilerin silinmesini talep etme\n• Veri işlemeye itiraz etme\n\nBu haklarınızı kullanmak için support@cvtailor.app adresine yazabilirsiniz.',
    },
    {
      title: '8. Çocukların Gizliliği',
      body: 'Uygulama 13 yaşından küçük çocuklara yönelik değildir ve bu yaş grubundan bilerek kişisel veri toplamamaktayız. Çocuğunuzun uygulamamızı kullandığını fark ederseniz lütfen bizimle iletişime geçiniz.',
    },
    {
      title: '9. Gizlilik Politikasında Değişiklikler',
      body: 'Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler uygulama içi bildirim yoluyla duyurulacaktır. Güncel politikayı bu sayfada bulabilirsiniz.',
    },
    {
      title: '10. İletişim',
      body: 'Gizlilik politikamız veya verileriniz hakkındaki sorularınız için:\n\nE-posta: support@cvtailor.app\nWeb: cvtailor.app',
    },
  ],
};

const PRIVACY_EN = {
  lastUpdated: 'Last updated: March 2025',
  intro: 'At CV Tailor, we take the privacy of your personal data seriously. This Privacy Policy explains what data we collect, how we use it, and your rights.',
  sections: [
    {
      title: '1. Data We Collect',
      body: 'The App processes the following categories of data:\n\n• CV Content: The CV file or text you upload or create\n• Job Description Text: The job listing description you enter\n• Local Storage Data: Saved CVs, credit balance, and subscription info (stored on your device only)\n• Purchase Information: Transaction records processed through the Apple App Store',
    },
    {
      title: '2. Purpose of Data Use',
      body: 'Collected data is used for the following purposes:\n\n• Providing the CV optimization service\n• Managing credits and subscriptions\n• Improving App functionality\n• Fulfilling legal obligations',
    },
    {
      title: '3. Data Sharing with OpenAI',
      body: 'To provide CV optimization, your CV content and job description text are transmitted to the API of OpenAI, Inc. This data may be used by OpenAI to improve their AI models. For more on OpenAI\'s data practices, visit openai.com/privacy.\n\nImportant: We recommend not including sensitive personal information (e.g., national ID numbers, banking details) in your CV.',
    },
    {
      title: '4. Apple App Store & Purchases',
      body: 'In-app purchases are processed through Apple\'s infrastructure. Your payment information is handled directly by Apple; we do not have access to it. For Apple\'s privacy policy, visit apple.com/legal/privacy.',
    },
    {
      title: '5. Local Storage',
      body: 'Saved CVs, credit balance, and subscription data are stored locally on your device only. This data is not transmitted to our servers. Deleting the App permanently removes all locally stored data.',
    },
    {
      title: '6. Data Security',
      body: 'We implement industry-standard security measures to protect your data. However, we note that no internet transmission is 100% secure. We recommend removing sensitive personal information from your CV before sharing it with any third parties.',
    },
    {
      title: '7. Your Rights (GDPR)',
      body: 'Under applicable data protection laws, you have the following rights:\n\n• To know whether your personal data is being processed\n• To access your personal data\n• To request correction of inaccurate data\n• To request deletion under certain conditions\n• To object to data processing\n\nTo exercise these rights, contact us at support@cvtailor.app.',
    },
    {
      title: '8. Children\'s Privacy',
      body: 'The App is not directed at children under 13, and we do not knowingly collect personal data from this age group. If you become aware that your child is using our App, please contact us.',
    },
    {
      title: '9. Changes to This Policy',
      body: 'We may update this policy from time to time. Significant changes will be communicated via in-app notification. You can always find the current policy on this page.',
    },
    {
      title: '10. Contact',
      body: 'For questions about our privacy policy or your data:\n\nEmail: support@cvtailor.app\nWeb: cvtailor.app',
    },
  ],
};

export default function PrivacyScreen() {
  const content = isTurkish() ? PRIVACY_TR : PRIVACY_EN;
  const heading = isTurkish() ? 'Gizlilik Politikası' : 'Privacy Policy';

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.title}>{heading}</Text>
      <Text style={s.meta}>{content.lastUpdated}</Text>
      <Text style={s.intro}>{content.intro}</Text>
      {content.sections.map((sec, i) => (
        <View key={i} style={s.section}>
          <Text style={s.sectionTitle}>{sec.title}</Text>
          <Text style={s.sectionBody}>{sec.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.5 },
  meta: { fontSize: 12, color: '#94A3B8', marginBottom: 12 },
  intro: { fontSize: 13, color: '#475569', lineHeight: 21, marginBottom: 24 },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  sectionBody: { fontSize: 13, color: '#475569', lineHeight: 21 },
});
