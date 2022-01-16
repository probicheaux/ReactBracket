import { User as FBUser } from 'firebase/auth'

export interface User extends FBUser {
  firebase_id: string;
  username: string;
}

export interface Tournament {
  name: string;
  id: number;
  shortId: string;
  brackets?: Bracket[];
  status?: string;
  owner?: User;
}

export interface Bracket {
  id?: number;
  name: string;
  tournament: number;
  // TODO: other stuff about brackets?
}
