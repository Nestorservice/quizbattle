import axios from 'axios';
import axiosRetry from 'axios-retry';
import Config from 'react-native-config';
import { QuizConfig } from '../types/quiz';
import { Profile } from '../types/profile';

const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(groqClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429,
});

groqClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${Config.GROQ_API_KEY}`;
  return config;
});

const SYSTEM_PROMPT = `Tu es QuizBattle IA, un générateur de quiz expert.
Tu génères UNIQUEMENT du JSON valide, sans markdown, sans backticks, sans texte autour.
Format obligatoire :
{
  "quiz_title": "Titre du quiz",
  "difficulty": "easy|medium|hard",
  "questions": [
    {
      "id": 1,
      "question": "Texte de la question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Explication courte de la bonne réponse.",
      "category": "science"
    }
  ]
}
Règles :
- correct_index est l'index (0-3) de la bonne réponse dans options[]
- Les options ne doivent PAS avoir de préfixe A) B) C) D)
- Explication = 1 phrase max, factuelle
- Questions variées, jamais deux fois la même structure
- Adapte la difficulté au profil fourni`;

export function buildUserPrompt(config: QuizConfig, profile: Profile): string {
  return `Génère ${config.questionCount} questions sur : "${config.subject}".
Profil joueur : ${profile.level}, ${profile.ageRange}.
${profile.bio ? `Description : ${profile.bio}` : ''}
Domaines d'intérêt : ${profile.interests.join(', ')}.
Niveau cible : ${config.difficulty}.
Génère exactement ${config.questionCount} questions. JSON uniquement.`;
}

export async function generateQuiz(config: QuizConfig, profile: Profile): Promise<string> {
  const response = await groqClient.post('/chat/completions', {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(config, profile) },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.data.choices[0].message.content as string;
}
