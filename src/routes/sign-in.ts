import { APIEvent } from "solid-start";

export interface LoginFormData {
  email: string;
  password: string;
}

export async function POST(event: APIEvent) {
  const formData = await event.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(email, password);
}
