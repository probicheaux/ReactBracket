import { User } from "firebase/auth";
import { apiHost, apiUnversionedHost } from "../constants/Api";
import { Tournament, Bracket, User as UserInterface } from "../models";
import { getRequest, postRequest } from "./BaseRequests";

type LoginResponse = {
  token: string;
};

// Authentication Requests
// TODO: Replace with direct to firebase funcs
export const loginUser = async (username: string, password: string) => {
  const resp = await postRequest(`${apiUnversionedHost}/user/login`, {
    username,
    password,
  });
  return resp.token;
};

export const createUser = async (
  user: User,
  userData: Partial<UserInterface>
) => {
  const url = `${apiHost}/users`;
  const resp = await postRequest(url, userData, user);
  return resp as UserInterface;
};

export const getUser = async (user: User) => {
  const url = `${apiHost}/users`;
  const resp = await getRequest(url, user);
  return resp as UserInterface;
};

// Tournament Requests ---------------

type GetTournamentsResponse = {
  tournaments: Tournament[];
};

// Get all user tournaments
export const getTournaments = async (user: User) => {
  const url = `${apiHost}/tournaments`;
  const resp = await getRequest(url, user);
  return (resp as GetTournamentsResponse).tournaments;
};

// Get single tournmanet details
export const getTournament = async (id: string, user: User) => {
  const url = `${apiHost}/tournaments/${id}`;
  const resp = await getRequest(url, user);
  return resp as Tournament;
};

export const createTournament = async (
  user: User,
  tournamentData: Partial<Tournament>
) => {
  const url = `${apiHost}/tournaments`;
  const resp = await postRequest(url, tournamentData, user);
  return resp as Tournament;
};

// Editing a specific tournament
export const addBracket = async (
  bracket: Bracket,
  tournamentId: string,
  user: User
) => {
  const url = `${apiHost}/tournaments/${tournamentId}/brackets`;
  const resp = await postRequest(url, bracket, user);
  return resp as Bracket;
};
