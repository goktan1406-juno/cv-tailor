require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// Hata yakalayıcı
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'PDF dosyası çok büyük. 15MB altı bir dosya deneyin.' });
  }
  if (err.message === 'request aborted') {
    return res.status(400).json({ error: 'Bağlantı kesildi. Lütfen tekrar deneyin.' });
  }
  next(err);
});

const SYSTEM_PROMPT = `You are an expert CV writer and career consultant.
You will receive a user's CV and a job listing. Optimize the CV for that job listing.

⚠️ CRITICAL — OUTPUT LANGUAGE RULE (highest priority):
Detect the language of the job listing. Write ALL generated text in THAT language — including summary, bullets, personalInfo.title, skill names, language level names, certification names, and missing skill suggestions.
- Job listing in English → ALL output in English (translate skill names, summary, bullets from original language)
- Job listing in Turkish → ALL output in Turkish
- Job listing in German → ALL output in German
- Any other language → output in that language
If the original CV has skills or content in a different language (e.g. Turkish CV, English job listing), TRANSLATE them to the job listing language.
This rule overrides everything. Never produce text in a different language than the job listing.

Return ONLY the following JSON structure. No extra text, no markdown code blocks:
{
  "score": 78,
  "personalInfo": {
    "name": "full name",
    "title": "job title matching the listing",
    "email": "email",
    "phone": "phone",
    "location": "city, country",
    "linkedin": "linkedin url or empty string",
    "website": "website url or empty string"
  },
  "summary": "2-3 sentence professional summary tailored to the job listing",
  "experience": [
    {
      "company": "Company Name",
      "position": "Position",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3", "Achievement 4"]
    }
  ],
  "education": [
    {
      "school": "School Name",
      "degree": "Bachelor / Master etc.",
      "field": "Field of Study",
      "year": "Graduation year"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "languages": [{"language": "Language", "level": "Level"}],
  "certifications": ["Certification 1"],
  "missingSkills": [
    {
      "skill": "Docker",
      "placement": "skills",
      "suggestion": "A short natural sentence using this skill, written in the job listing language.",
      "experienceIndex": null
    }
  ]
}

Rules:
1. LANGUAGE: Already stated above — use the job listing language for all generated content. This is mandatory.
2. PERSONAL INFO IS IMMUTABLE: Never change name, email, phone, or location. Only adapt personalInfo.title to match the listing's position — never change the person's actual field (e.g. chemistry engineer → industrial engineer is forbidden).
3. EDUCATION IS IMMUTABLE: School name, degree, field, and graduation year cannot be changed under any circumstances.
4. EXPERIENCE IS IMMUTABLE: Company names, position titles, and dates stay exactly as they are. Only bullet points may be adapted to align with the listing — but content must reflect real experience, never fabricated.
5. Never add companies, titles, skills, or achievements not present in the original CV. Only rephrase existing information better.
6. Align summary and experience bullets with keywords from the job listing — but stay within the person's real expertise.
7. Write exactly 4 bullets per experience entry; if information is limited, make reasonable inferences from the person's actual field.
8. Highlight relevant skills first; put the ones matching the job listing at the top.
9. If information is missing, leave the field as empty string or empty array.
10. score: match score between the CV and the job listing (0-100). Score the optimized version, not the original.
11. missingSkills: important skills explicitly mentioned in the listing but absent from the CV (max 5). For each:
    - skill: skill name (in job listing language)
    - placement: "skills" | "summary" | "experience"
    - suggestion: short natural sentence using this skill, in the job listing language
    - experienceIndex: index of most relevant experience if placement is "experience", otherwise null
12. Return pure JSON only.`;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/tailor', upload.single('pdf'), async (req, res) => {
  // Client bağlantıyı keserse OpenAI isteğini iptal et
  let aborted = false;
  req.on('close', () => { aborted = true; });

  const { cvText, jobDescription } = req.body;
  const pdfFile = req.file;

  if (!jobDescription) {
    return res.status(400).json({ error: 'jobDescription is required' });
  }
  if (!pdfFile && !cvText) {
    return res.status(400).json({ error: 'pdf file or cvText is required' });
  }

  const cvBase64 = pdfFile ? pdfFile.buffer.toString('base64') : null;
  const cvFileName = pdfFile?.originalname || 'cv.pdf';

  const cvContent = cvBase64
    ? [
        {
          type: 'file',
          file: {
            filename: cvFileName,
            file_data: `data:application/pdf;base64,${cvBase64}`,
          },
        },
        { type: 'text', text: `## Job Listing:\n${jobDescription}` },
      ]
    : [
        { type: 'text', text: `## CV:\n${cvText}\n\n## Job Listing:\n${jobDescription}` },
      ];

  try {
    const controller = new AbortController();
    req.on('close', () => controller.abort());

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
        timeout: 100000,
        signal: controller.signal,
      }
    );

    if (aborted) return;

    const raw = response.data.choices[0].message.content;
    res.json(JSON.parse(raw));
  } catch (err) {
    if (aborted || err.code === 'ERR_CANCELED') return;
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message || 'Unexpected error';
    res.status(status).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`cv-tailor backend running on port ${PORT}`));
