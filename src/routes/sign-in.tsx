import { createEffect } from "solid-js";
import { useNavigate } from "solid-start";
import { SignInOverlay } from "@/lib/components/overlays/sign-in-overlay";
import { useAuthContext } from "@/lib/contexts/auth-context";

export function SignIn() {
  const auth = useAuthContext();
  const navigate = useNavigate();

  createEffect(() => {
    if (auth.user) navigate("/app");
  });

  return (
    <main>
      <SignInOverlay />
    </main>
  );
}

export default SignIn;
