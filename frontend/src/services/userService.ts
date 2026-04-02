import { apiFetch } from "./api";

export type User = {
  id: string;
  email: string;
  username: string;
};

export async function getMe(): Promise<User> {
  return apiFetch<User>("/users/me", {
    method: "GET",
    auth: true,
  });
}
