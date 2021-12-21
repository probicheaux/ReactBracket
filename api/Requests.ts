import axios from "axios";
import { User } from "firebase/auth";
import { apiHost } from "../constants/Api";


const getHeaders = async (user: User) => {
    return {
        authorization: `Bearer ${await user.getIdToken()}`
    };
}


// Tournament Types -----------------

type GetTournamentsResponse = {
    tournaments: Tournament[]
}


// Tournament Requests ---------------

export const getTournaments = async (user: User) => {
    const url = `${apiHost}/tournaments`;
    const resp = await axios.get(url, { headers: await getHeaders(user)})
    return (resp.data as GetTournamentsResponse).tournaments;
}

export const createTournament = async (user: User, tournamentData: Partial<Tournament>) => {
    const url = `${apiHost}/tournaments`;
    const resp = await axios.post(url, tournamentData, { headers: await getHeaders(user)})
    return resp.data as Tournament;
}