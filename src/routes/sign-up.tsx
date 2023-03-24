import { Alert } from "@/components/alerts/alert";
import { Button } from "@/components/buttons/button";
import { CheckIcon } from "@/components/icons/check-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { CloudIcon } from "@/components/icons/cloud-icon";
import { Spinner } from "@/components/spinners/spinner";
import { HStack } from "@/components/stacks/h-stack";
import { Step, Steps } from "@/components/steps/steps";
import { ChooseProfessionForm } from "@/features/sign-up/components/choose-profession-form";
import { NewAccountInfoForm } from "@/features/sign-up/components/new-account-info-form";
import { signUpMachine } from "@/features/sign-up/machines/sign-up.machine";
import { IndexContext } from "@/lib/contexts/index-context";
import { useStateIndex } from "@/lib/util/use-state-index";
import { useMachine } from "@xstate/solid";
import { createEffect, Show } from "solid-js";

/**
 *
 * @returns The sign up page
 */
export function SignUpPage() {
  const [state, send] = useMachine(signUpMachine);
  const index = useStateIndex(state, [
    "gettingProfession",
    "gettingAccountInfo",
    "signingUp",
    "error",
    "success",
  ]);

  createEffect(() => {
    console.log(state.value, state);
  });

  return (
    <main class="flex min-h-screen">
      {/**
       * Sidebar gives the user a way back to the main page. It's also meant to disappear
       * below the medium breakpoint.
       */}
      <aside class="hidden md:block p-12 bg-gradient-to-b from-blue-700 to-blue-900 text-white">
        <a href="/" class="block text-sm mb-4">
          <ChevronLeftIcon class="inline w-4 h-4 stroke-2" /> Go Back
        </a>
        <HStack class="mb-6" align="center">
          <CloudIcon class="w-12 h-12 mr-2" />
          <h1 class="text-3xl font-medium mr-6">Our Service</h1>
        </HStack>
        <section class="px-8 py-6 bg-blue-600 rounded-lg">
          <h2 class="text-2xl font-medium mb-1">Your Account</h2>
          <h3 class="text-xl font-extralight mb-3">It's free for now!</h3>
          <ul class="[&>li:not(:last-child)]:mb-2 [&>li]:flex [&_svg]:mr-2 [&_svg]:text-green-300">
            <li>
              <CheckIcon aria-hidden="true" /> No setup, or hidden fees
            </li>
            <li>
              <CheckIcon aria-hidden="true" />
              No oaths of allegience or fealty
            </li>
            <li>
              <CheckIcon aria-hidden="true" />
              No defense pacts in the event of invasion
            </li>
          </ul>
        </section>
      </aside>

      {/**
       * The main content is organized into several tabs. The first two tabs contain
       * forms for collecting user input. The third tab is for displaying errors, while
       * the fourth tab is for showing the success method.
       */}
      <section class="dark bg-slate-900 text-white p-24 flex-grow">
        <IndexContext.Provider value={index}>
          <Steps class="mb-12 justify-center">
            <Step index={0}>Personal Info</Step>
            <Step index={1}>Account Info</Step>
            <Step index={2}>Confirmation</Step>
          </Steps>

          {/**
           * Choose your profession
           */}
          <Show when={state.matches("gettingProfession")}>
            <ChooseProfessionForm
              initialValues={{ ...state.context.profession }}
              onSubmit={(payload) => {
                send({ type: "SAVE", payload });
                send({ type: "NEXT" });
              }}
            >
              <Button type="submit" size="xl" class="mb-4 w-full">
                Next: Account Info
              </Button>
            </ChooseProfessionForm>
          </Show>

          {/**
           * Basic user info
           */}
          <Show
            when={
              state.matches("gettingAccountInfo") || state.matches("signingUp")
            }
          >
            <NewAccountInfoForm
              initialValues={{ ...state.context.account }}
              onSubmit={(payload) => {
                send({ type: "SAVE", payload });
                send({ type: "NEXT" });
              }}
            >
              <div class="columns-2 gap-6">
                <Button
                  onClick={() => send("BACK")}
                  size="xl"
                  class="w-full"
                  color="alternative"
                >
                  Prev: Personal Info
                </Button>

                <Show when={!state.matches("signingUp")}>
                  <Button
                    type="submit"
                    size="xl"
                    class="w-full border border-blue-600"
                  >
                    Next: Create Account
                  </Button>
                </Show>
                <Show when={state.matches("signingUp")}>
                  <Button
                    disabled
                    size="xl"
                    class="w-full border border-blue-600"
                  >
                    <Spinner
                      color="white"
                      size="sm"
                      class="mr-3 dark:text-gray-400"
                    />{" "}
                    Please wait...
                  </Button>
                </Show>
              </div>
            </NewAccountInfoForm>
          </Show>

          {/**
           * Errors
           */}
          <Show when={state.matches("error")}>
            <h2 class="text-2xl font-bold mb-6">Uh-oh...</h2>
            <p class="mb-3">There was a problem creating your account:</p>
            <Alert class="mb-6" color="red">
              {state.context.error?.message ??
                JSON.stringify(state.context.error, null, "  ")}
            </Alert>
            <Button
              size="xl"
              class="w-full"
              color="alternative"
              onClick={() => send("BACK")}
            >
              Prev: Account Info
            </Button>
          </Show>

          {/**
           * Success
           */}
          <Show when={state.matches("success")}>
            <h2 class="text-2xl font-bold mb-6">Congratulations!</h2>
            <p>
              Your account has been created. A confirmation email has been sent.
              Please click on the link in the email to log in.
            </p>
          </Show>
        </IndexContext.Provider>
      </section>
    </main>
  );
}

export default SignUpPage;
