export interface Subject {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'science', label: 'Sciences', icon: 'flask', color: '#3A8EF0' },
  { id: 'history', label: 'Histoire', icon: 'bank', color: '#E8A33C' },
  { id: 'technology', label: 'Technologie', icon: 'cpu-64-bit', color: '#2ECC71' },
  { id: 'music', label: 'Musique', icon: 'music-note', color: '#9B59B6' },
  { id: 'sport', label: 'Sport', icon: 'trophy', color: '#E8453C' },
  { id: 'geography', label: 'Géographie', icon: 'earth', color: '#1ABC9C' },
  { id: 'cinema', label: 'Cinéma', icon: 'movie-open', color: '#E74C3C' },
  { id: 'cooking', label: 'Cuisine', icon: 'chef-hat', color: '#F39C12' },
  { id: 'literature', label: 'Littérature', icon: 'book-open-variant', color: '#8E44AD' },
  { id: 'business', label: 'Business', icon: 'briefcase', color: '#2980B9' },
  { id: 'art', label: 'Art', icon: 'palette', color: '#E91E63' },
  { id: 'health', label: 'Santé', icon: 'heart-pulse', color: '#27AE60' },
];

export const TEAM_COLORS = [
  '#F0C93A',
  '#3A8EF0',
  '#E8453C',
  '#2ECC71',
  '#9B59B6',
  '#1ABC9C',
  '#E67E22',
  '#E91E63',
];

export const TEAM_ICONS = [
  'sword',
  'shield',
  'lightning-bolt',
  'fire',
  'star',
  'crown',
  'rocket',
  'skull',
  'dragon',
  'alien',
  'robot',
  'ghost',
];
