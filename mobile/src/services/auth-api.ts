import { http } from "../util/http";

export async function apiRegister(payload: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
}): Promise<{ ok: true }> {
  const form = new FormData();

  form.append("firstName", payload.firstName);
  form.append("lastName", payload.lastName);
  form.append("phone", payload.phone);
  form.append("email", payload.email);
  form.append("username", payload.username);
  form.append("password", payload.password);

  const res = await http.post("/users/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function apiLogin(payload: {
  username: string,
  password: string;
}): Promise<{ token: string }> {
  const res = await http.post("/users/login", payload);
  
  return res.data;
}
