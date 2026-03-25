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

const TERMS_TR = {
  lastUpdated: 'Son güncelleme: Mart 2025',
  sections: [
    {
      title: '1. Kabul',
      body: 'CV Tailor uygulamasını ("Uygulama") indirerek veya kullanarak bu Kullanım Koşulları\'nı kabul etmiş olursunuz. Koşulları kabul etmiyorsanız uygulamayı kullanmayınız.',
    },
    {
      title: '2. Hizmet Açıklaması',
      body: 'CV Tailor, yapay zeka destekli CV optimizasyon hizmeti sunan bir mobil uygulamadır. Kullanıcılar CV\'lerini yükler veya oluşturur; uygulama, yapay zeka teknolojisi aracılığıyla CV\'yi belirtilen iş ilanına uygun şekilde optimize eder.',
    },
    {
      title: '3. Abonelik Planları ve Ücretlendirme',
      body: 'Uygulama aşağıdaki ücretli seçenekler sunmaktadır:\n\n• Haftalık Abonelik: Belirtilen fiyat üzerinden haftalık otomatik yenileme\n• Yıllık Abonelik: Belirtilen fiyat üzerinden yıllık otomatik yenileme\n• Tek Seferlik Kredi Paketleri: 5, 10 veya 20 kredi içeren paketler\n\nTüm fiyatlar App Store\'da belirtilen yerel para birimi cinsindendir ve vergiler dahildir.',
    },
    {
      title: '4. Otomatik Yenileme',
      body: 'Abonelikler, mevcut dönem sona ermeden en az 24 saat önce iptal edilmediği takdirde otomatik olarak yenilenir. Yenileme ücreti, mevcut dönemin bitiminden 24 saat öncesine kadar iTunes Hesabınızdan tahsil edilir.\n\nAboneliğinizi App Store > Apple ID > Abonelikler bölümünden yönetebilir veya iptal edebilirsiniz.',
    },
    {
      title: '5. İptal ve Geri Ödeme',
      body: 'Abonelik iptalleri ve geri ödeme talepleri Apple\'ın politikalarına tabidir. İptal işlemi, Apple ID hesabınızdaki Abonelikler bölümünden gerçekleştirilir. İptal sonrasında mevcut dönem sonuna kadar hizmetleriniz devam eder.\n\nGeri ödeme talepleri için Apple\'ın destek sayfasını (reportaproblem.apple.com) ziyaret edebilirsiniz.',
    },
    {
      title: '6. Ücretsiz Kredi',
      body: 'Yeni kullanıcılara uygulama ilk açılışında 1 adet ücretsiz kredi tanınır. Ücretsiz kredi devir edilemez ve para karşılığı değiştirilemez.',
    },
    {
      title: '7. Yapay Zeka ve Veri İşleme',
      body: 'CV optimizasyon hizmeti için CV içeriğiniz ve iş ilanı metni OpenAI\'nin API\'sine iletilmektedir. Bu işleme OpenAI\'nin Gizlilik Politikası ve Kullanım Koşulları tabi dir. Kişisel verilerinizin işlenmesiyle ilgili ayrıntılar için Gizlilik Politikamızı inceleyiniz.',
    },
    {
      title: '8. Fikri Mülkiyet',
      body: 'Uygulama ve içeriği (tasarım, kod, metin, grafikler dahil) CV Tailor\'a aittir ve telif hakkı yasalarıyla korunmaktadır. Uygulamanın kopyalanması, değiştirilmesi, dağıtılması veya tersine mühendislikle incelenmesi yasaktır.',
    },
    {
      title: '9. Sorumluluk Sınırlaması',
      body: 'Uygulama "olduğu gibi" sunulmaktadır. CV Tailor, yapay zeka tarafından üretilen içeriklerin doğruluğunu, eksiksizliğini veya belirli bir amaca uygunluğunu garanti etmez. İş başvurunuzun sonucu için sorumluluk üstlenilmez.',
    },
    {
      title: '10. Yaş Gereksinimleri',
      body: 'Uygulama 17 yaş ve üzeri kullanıcılara yöneliktir. 18 yaşından küçük kullanıcıların ebeveyn veya yasal vasi onayıyla kullanması gerekmektedir.',
    },
    {
      title: '11. Koşullarda Değişiklik',
      body: 'Bu koşulları herhangi bir zamanda güncelleme hakkını saklı tutarız. Önemli değişiklikler uygulama içi bildirim veya e-posta yoluyla duyurulacaktır. Güncellemeden sonra uygulamayı kullanmaya devam etmeniz yeni koşulları kabul ettiğiniz anlamına gelir.',
    },
    {
      title: '12. Uygulanacak Hukuk',
      body: 'Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklar İstanbul mahkemelerinde çözümlenir.',
    },
    {
      title: '13. İletişim',
      body: 'Bu koşullara ilişkin sorularınız için:\n\nE-posta: support@cvtailor.app\nWeb: cvtailor.app',
    },
  ],
};

const TERMS_EN = {
  lastUpdated: 'Last updated: March 2025',
  sections: [
    {
      title: '1. Acceptance',
      body: 'By downloading or using the CV Tailor application ("App"), you agree to these Terms of Use. If you do not agree, please do not use the App.',
    },
    {
      title: '2. Service Description',
      body: 'CV Tailor is a mobile application offering AI-powered CV optimization. Users upload or create their CV; the App uses artificial intelligence to tailor the CV to a specific job listing.',
    },
    {
      title: '3. Subscription Plans & Pricing',
      body: 'The App offers the following paid options:\n\n• Weekly Subscription: Auto-renewing weekly at the stated price\n• Annual Subscription: Auto-renewing yearly at the stated price\n• One-Time Credit Packs: Packs of 5, 10, or 20 credits\n\nAll prices are displayed in your local currency as shown in the App Store, inclusive of applicable taxes.',
    },
    {
      title: '4. Auto-Renewal',
      body: 'Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. The renewal charge is applied to your iTunes Account within 24 hours prior to the end of the current period.\n\nYou can manage or cancel subscriptions in App Store > Apple ID > Subscriptions.',
    },
    {
      title: '5. Cancellation & Refunds',
      body: 'Subscription cancellations and refund requests are subject to Apple\'s policies. To cancel, go to Subscriptions in your Apple ID account settings. Access to the service continues until the end of the current billing period after cancellation.\n\nFor refund requests, visit Apple\'s support page at reportaproblem.apple.com.',
    },
    {
      title: '6. Free Credit',
      body: 'New users receive 1 free credit upon first launch. The free credit cannot be transferred or exchanged for money.',
    },
    {
      title: '7. AI & Data Processing',
      body: 'To provide the CV optimization service, your CV content and job description text are transmitted to OpenAI\'s API. This processing is subject to OpenAI\'s Privacy Policy and Terms of Use. Please review our Privacy Policy for details on how your personal data is handled.',
    },
    {
      title: '8. Intellectual Property',
      body: 'The App and its content (including design, code, text, and graphics) are owned by CV Tailor and protected by copyright laws. Copying, modifying, distributing, or reverse-engineering the App is prohibited.',
    },
    {
      title: '9. Limitation of Liability',
      body: 'The App is provided "as is." CV Tailor does not warrant the accuracy, completeness, or fitness for a particular purpose of AI-generated content. We accept no responsibility for the outcome of your job applications.',
    },
    {
      title: '10. Age Requirements',
      body: 'The App is intended for users aged 17 and above. Users under 18 must use the App with parental or guardian consent.',
    },
    {
      title: '11. Changes to Terms',
      body: 'We reserve the right to update these terms at any time. Significant changes will be communicated via in-app notification or email. Continued use of the App after any update constitutes acceptance of the new terms.',
    },
    {
      title: '12. Governing Law',
      body: 'These terms are governed by the laws of the Republic of Turkey. Disputes shall be resolved in Istanbul courts.',
    },
    {
      title: '13. Contact',
      body: 'For questions about these terms:\n\nEmail: support@cvtailor.app\nWeb: cvtailor.app',
    },
  ],
};

export default function TermsScreen() {
  const content = isTurkish() ? TERMS_TR : TERMS_EN;
  const heading = isTurkish() ? 'Kullanım Koşulları' : 'Terms of Use';

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.title}>{heading}</Text>
      <Text style={s.meta}>{content.lastUpdated}</Text>
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
  meta: { fontSize: 12, color: '#94A3B8', marginBottom: 28 },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  sectionBody: { fontSize: 13, color: '#475569', lineHeight: 21 },
});
