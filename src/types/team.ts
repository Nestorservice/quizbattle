export interface Team {
  id: string;
  name: string;
  color: string;
  icon: string;
  members: string[];
}

export interface TeamSummary {
  id: string;
  name: string;
  color: string;
  icon: string;
  memberCount: number;
}
