import axios from 'axios';
import { BACKEND_URL } from '../config';

export async function tailorCV({ cvUri, cvFileName, cvText, jobDescription }) {
  const formData = new FormData();

  if (cvUri) {
    formData.append('pdf', {
      uri: cvUri,
      type: 'application/pdf',
      name: cvFileName || 'cv.pdf',
    });
  } else if (cvText) {
    formData.append('cvText', cvText);
  }

  formData.append('jobDescription', jobDescription);

  const response = await axios.post(
    `${BACKEND_URL}/tailor`,
    formData,
    { timeout: 120000 }
  );
  return response.data;
}
