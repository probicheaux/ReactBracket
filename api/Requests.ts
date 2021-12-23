import { User } from "firebase/auth";
import { apiHost } from "../constants/Api";
import { Tournament, Bracket } from "../models";
import { getRequest, postRequest } from "./BaseRequests";


// Tournament Types -----------------

type GetTournamentsResponse = {
    tournaments: Tournament[]
}


// Tournament Requests ---------------

// Get all user tournaments
export const getTournaments = async (user: User) => {
    const url = `${apiHost}/tournaments`;
    const resp = await getRequest(url, user);
    return (resp.data as GetTournamentsResponse).tournaments;
}

// Get single tournmanet details
export const getTournament = async (id: string, user: User) => {
    const url = `${apiHost}/tournaments/${id}`;
    console.log("GET: " , url);
    const resp = await getRequest(url, user);
    return resp.data as Tournament;
}

export const createTournament = async (user: User, tournamentData: Partial<Tournament>) => {
    const url = `${apiHost}/tournaments`;
    const resp = await postRequest(url, tournamentData, user);
    return resp.data as Tournament;
}

// Editing a specific tournament
export const addBracket = async (bracket: Bracket, tournamentId: string, user: User) => {
    const url = `${apiHost}/tournaments/${tournamentId}/brackets`;
    const resp = await postRequest(url, bracket, user);
    return resp.data as Bracket;
}