const PALETTE = [
  '#F0C93A', '#3A8EF0', '#E8453C', '#2ECC71',
  '#9B59B6', '#1ABC9C', '#E67E22', '#E91E63',
  '#3498DB', '#27AE60', '#8E44AD', '#D35400',
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
