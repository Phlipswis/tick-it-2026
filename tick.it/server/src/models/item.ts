export type Lane =
  | 'lane-backlog'
  | 'lane-in-progress'
  | 'lane-review'
  | 'lane-done';

export type Item = {
  id: string;
  titel: string;
  beschreibung?: string;
  date?: string;
  lane: Lane;
};
