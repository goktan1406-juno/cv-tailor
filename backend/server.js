require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const SYSTEM_PROMPT = `Sen bir uzman CV yazarı ve kariyer danışmanısın.
Kullanıcının orijinal CV'sini ve başvurmak istediği iş ilanını alacaksın.
CV'yi iş ilanına göre optimize edeceksin.

SADECE aşağıdaki JSON yapısını döndür, başka hiçbir metin ekleme, markdown code block da ekleme:
{
  "score": 78,
  "personalInfo": {
    "name": "Ad Soyad",
    "title": "Pozisyona uygun iş unvanı",
    "email": "email",
    "phone": "telefon",
    "location": "şehir, ülke",
    "linkedin": "linkedin url veya boş string",
    "website": "website url veya boş string"
  },
  "summary": "İş ilanına göre kişiselleştirilmiş 2-3 cümlelik profesyonel özet",
  "experience": [
    {
      "company": "Şirket Adı",
      "position": "Pozisyon",
      "startDate": "Ay Yıl",
      "endDate": "Ay Yıl veya Halen",
      "bullets": ["Başarı ve sorumluluk maddesi 1", "Madde 2", "Madde 3", "Madde 4"]
    }
  ],
  "education": [
    {
      "school": "Okul Adı",
      "degree": "Lisans / Yüksek Lisans vb.",
      "field": "Bölüm",
      "year": "Mezuniyet yılı"
    }
  ],
  "skills": ["Beceri 1", "Beceri 2"],
  "languages": [{"language": "Dil", "level": "Seviye"}],
  "certifications": ["Sertifika 1"],
  "missingSkills": [
    {
      "skill": "Docker",
      "placement": "skills",
      "suggestion": "Docker ile container tabanlı geliştirme ortamları kurdum.",
      "experienceIndex": null
    }
  ]
}

Kurallar:
1. İş ilanının dilini otomatik algıla ve tüm CV içeriğini (summary, bullets, title, section başlıkları dahil) o dilde yaz. İlan Türkçe ise Türkçe, İngilizce ise İngilizce, başka bir dildeyse o dilde üret.
2. KİŞİSEL BİLGİLER DOKUNULMAZDIR: Ad, e-posta, telefon, konum kesinlikle değiştirme. personalInfo.title alanını sadece ilandaki pozisyon unvanına göre uyarla, ancak kişinin gerçek meslek alanını (örn. kimya mühendisliği → endüstri mühendisliği gibi) ASLA değiştirme.
3. EĞİTİM DOKUNULMAZDIR: Okul adı, bölüm, derece ve mezuniyet yılı hiçbir şekilde değiştirilemez. Kişi kimya mühendisiyse "Kimya Mühendisliği" olarak kalır.
4. DENEYİM DOKUNULMAZDIR: Şirket adları, pozisyon unvanları ve tarihler olduğu gibi korunur. Sadece bullet maddeleri ilanla uyumlu hale getirilebilir — ancak içerik gerçek deneyime dayanmalı, uydurulmamalı.
5. Orijinal CV'de olmayan hiçbir şirket, ünvan, beceri veya başarı ekleme. Sadece var olan bilgileri daha iyi ifade et.
6. Özet ve deneyim maddelerini iş ilanındaki anahtar kelimelerle örtüştür — ama kişinin gerçek uzmanlık alanı dışına çıkma.
7. Her iş deneyimi için mutlaka 4 madde (bullet) yaz; bilgi azsa kişinin alanından makul çıkarımlar yap ama alan değiştirme.
8. İlgili becerileri öne çıkar, iş ilanıyla eşleşenleri başa al.
9. Bilgi eksikse ilgili alanı boş string veya boş array olarak bırak.
10. score: CV'nin iş ilanıyla uyum puanı (0-100). Optimize edilmiş hali için ver, ham CV için değil.
11. missingSkills: ilanda açıkça geçen ama CV'de hiç olmayan önemli beceriler (max 5). Her biri için:
    - skill: beceri adı
    - placement: "skills" (beceriler listesine ekle) | "summary" (özet bölümüne ekle) | "experience" (deneyim maddesine ekle)
    - suggestion: bu beceriyi kullanan kısa, doğal bir cümle veya madde. İlanın diline uygun yaz.
    - experienceIndex: placement "experience" ise en uygun deneyimin index numarası (0,1,2...), değilse null
12. Sadece saf JSON döndür`;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/tailor', async (req, res) => {
  const { cvBase64, cvFileName, cvText, jobDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: 'jobDescription is required' });
  }
  if (!cvBase64 && !cvText) {
    return res.status(400).json({ error: 'cvBase64 or cvText is required' });
  }

  const cvContent = cvBase64
    ? [
        {
          type: 'file',
          file: {
            filename: cvFileName || 'cv.pdf',
            file_data: `data:application/pdf;base64,${cvBase64}`,
          },
        },
        { type: 'text', text: `## İş İlanı:\n${jobDescription}` },
      ]
    : [
        { type: 'text', text: `## CV Bilgileri:\n${cvText}\n\n## İş İlanı:\n${jobDescription}` },
      ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: cvContent },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 90000,
      }
    );

    const raw = response.data.choices[0].message.content;
    res.json(JSON.parse(raw));
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message || 'Unexpected error';
    res.status(status).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`cv-tailor backend running on port ${PORT}`));
