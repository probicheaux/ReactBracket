
export interface BracketUser {
  firebase_id: string;
  username: string;
}

export interface Tournament {
  name: string;
  id: number;
  shortId: string;
  brackets?: Bracket[];
  status?: string;
  owner?: BracketUser;
}

export interface Bracket {
  id?: number;
  name: string;
  tournament: number;
  // TODO: other stuff about brackets?
}
