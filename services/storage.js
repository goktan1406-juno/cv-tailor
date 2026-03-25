import { Directory, File, Paths } from 'expo-file-system/next';

const SAVED_DIR = new Directory(Paths.document, 'saved_cvs');

function ensureDir() {
  if (!SAVED_DIR.exists) SAVED_DIR.create({ idempotent: true });
}

function safeFilename(name) {
  const slug = name.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, '').trim().replace(/\s+/g, '_');
  return `${slug}_${Date.now()}.json`;
}

export function saveCV({ cvData, jobDescription, name }) {
  ensureDir();
  const filename = safeFilename(name || jobDescription.trim().split('\n')[0].slice(0, 40));
  const file = new File(SAVED_DIR, filename);
  file.write(JSON.stringify({ cvData, jobDescription, name: name || filename, savedAt: new Date().toISOString() }));
  return filename;
}

export async function loadAllCVs() {
  ensureDir();
  const items = SAVED_DIR.list();
  const results = [];
  for (const item of items) {
    if (item instanceof File && item.name.endsWith('.json')) {
      try {
        const text = await item.text();
        const parsed = JSON.parse(text);
        results.push({
          filename: item.name,
          name: parsed.name || item.name.replace(/\.json$/, '').replace(/_\d{13}$/, '').replace(/_/g, ' '),
          savedAt: parsed.savedAt,
          jobDescription: parsed.jobDescription,
          cvData: parsed.cvData,
        });
      } catch { /* skip corrupt */ }
    }
  }
  return results.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

export function deleteCV(filename) {
  const file = new File(SAVED_DIR, filename);
  if (file.exists) file.delete();
}
