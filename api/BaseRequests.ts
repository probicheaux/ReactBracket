import { User } from "firebase/auth";

export class BadStatusError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "BadStatusError";
    this.code = code;
  }
}

export const postRequest = async (url = "", data = {}, user?: User) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new BadStatusError(await response.text(), response.status);
  }
  return response.json();
};

export const putRequest = async (url = "", data = {}, user: User) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new BadStatusError(await response.text(), response.status);
  }
  return response.json();
};

export const getRequest = async (url = "", user: User) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
  });
  if (!response.ok) {
    throw new BadStatusError(await response.text(), response.status);
  }
  return response.json();
};
