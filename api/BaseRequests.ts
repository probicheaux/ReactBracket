import { User } from "firebase/auth";

export const postRequest = async (url = '', data = {}, user?: User) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await user?.getIdToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
}

export const putRequest = async (url = '', data = {}, user: User) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await user.getIdToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
}

export const getRequest = async (url = '', user: User) => {
    const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
      });
      return response.json();
}