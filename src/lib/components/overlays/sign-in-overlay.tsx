import clsx from "clsx";
import { JSX, Show } from "solid-js";
import { useAuthContext } from "@/lib/contexts/auth-context";
import { SignInData } from "@/lib/schemas/sign-in";
import { SignInForm } from "../forms/sign-in-form";

export interface SignInOverlayProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export function SignInOverlay(props: SignInOverlayProps) {
  const auth = useAuthContext();

  const handleSignIn = (data: SignInData) => {
    const { email, password } = data;
    auth.signInWithPassword({ email, password });
  };

  return (
    <div
      id="authentication-modal"
      data-modal-target="authentication-modal"
      tabindex="-1"
      aria-hidden="true"
      class={clsx(
        "fixed inset-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full backdrop-blur-sm backdrop-grayscale flex items-center justify-center",
        {
          hidden: auth.session,
        }
      )}
    >
      <div class="relativew-full h-full max-w-md md:h-auto flex-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            class="hidden absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="px-6 py-6 lg:px-8">
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <SignInForm onSubmit={handleSignIn} />
            <Show when={auth.error}>
              <p class="mt-2 text-xs text-red-600 dark:text-red-400">
                {auth.error?.message}
              </p>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
