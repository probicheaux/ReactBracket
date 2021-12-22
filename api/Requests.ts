import { User } from "firebase/auth";
import { apiHost } from "../constants/Api";
import { getRequest, postRequest } from "./BaseRequests";


// Tournament Types -----------------

type GetTournamentsResponse = {
    tournaments: Tournament[]
}


// Tournament Requests ---------------

export const getTournaments = async (user: User) => {
    const url = `${apiHost}/tournaments`;
    const resp = await getRequest(url, user);
    return (resp.data as GetTournamentsResponse).tournaments;
}

export const createTournament = async (user: User, tournamentData: Partial<Tournament>) => {
    const url = `${apiHost}/tournaments`;
    const resp = await postRequest(url, tournamentData, user);
    return resp.data as Tournament;
}