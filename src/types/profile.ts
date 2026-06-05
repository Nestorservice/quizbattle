export type Level = 'beginner' | 'intermediate' | 'expert';

export interface Profile {
  id: string;
  pseudo: string;
  ageRange: string;
  level: Level;
  interests: string[];
  bio: string;
  deviceId: string;
  createdAt: string;
}
