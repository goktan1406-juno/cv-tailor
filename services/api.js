import axios from 'axios';
import { BACKEND_URL } from '../config';

export async function tailorCV({ cvBase64, cvFileName, cvText, jobDescription }) {
  const response = await axios.post(
    `${BACKEND_URL}/tailor`,
    { cvBase64, cvFileName, cvText, jobDescription },
    { timeout: 120000 }
  );
  return response.data;
}
