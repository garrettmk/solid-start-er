import { createEffect } from "solid-js";
import { SignInOverlay } from "~/components/overlays/sign-in-overlay";
import { useAuthContext } from "~/lib/contexts/auth-context";

export function SignIn() {
  const auth = useAuthContext();

  return (
    <main>
      <SignInOverlay />
    </main>
  );
}

export default SignIn;
