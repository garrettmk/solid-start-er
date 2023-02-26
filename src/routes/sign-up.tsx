import { chain } from "radash";
import { createEffect, createSignal, Show } from "solid-js";
import { createRouteAction } from "solid-start";
import { Alert } from "~/components/alerts/alert";
import { Button } from "~/components/buttons/button";
import { ButtonPrev } from "~/components/buttons/button-prev";
import { NewAccountInfoForm } from "~/components/forms/new-account-info-form";
import { SelectProfessionForm } from "~/components/forms/select-profession-form";
import { CheckIcon } from "~/components/icons/check";
import { ChevronLeftIcon } from "~/components/icons/chevron-left";
import { CloudIcon } from "~/components/icons/cloud";
import { Spinner } from "~/components/spinners/spinner";
import { HStack } from "~/components/stacks/h-stack";
import { Step, Steps } from "~/components/steps/steps";
import { TabContent } from "~/components/tabs/tab-content";
import { api } from "~/lib/api/client";
import { createIndex, IndexContext } from "~/lib/contexts/index-context";
import { SelectProfessionData } from "~/lib/schemas/choose-profession";
import { NewAccountInfoData } from "~/lib/schemas/new-account-info";
import { SignUpData } from "~/lib/schemas/sign-up";

/**
 *
 * @returns The sign up page
 */
export function SignUpPage() {
  // Track the current page
  const index = createIndex();
  // Page 1 data
  const [professionData, setProfessionData] =
    createSignal<SelectProfessionData>();
  // Page 2 data
  const [newAccountData, setNewAccountData] =
    createSignal<NewAccountInfoData>();

  // Send sign up info to the API
  const [request, signUp] = createRouteAction(
    async (signUpData: SignUpData) => {
      const { data, error } = await api.public.signUp.mutate(signUpData);
      if (data.user) return data.user;
      else throw error;
    }
  );

  // Combine data from each page and call the route action
  const handleSignup = () =>
    signUp({
      ...professionData()!,
      ...newAccountData()!,
    });

  // Jump to the error or success pages after the request
  createEffect(() => {
    if (request.error) index.set(2);
    else if (request.result) index.set(3);
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
        <HStack class="mb-6" align="end">
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
          <Steps class="mb-12">
            <Step index={0}>Personal Info</Step>
            <Step index={1}>Account Info</Step>
            <Step index={2}>Confirmation</Step>
          </Steps>

          {/**
           * Choose your profession
           */}
          <TabContent index={0}>
            <SelectProfessionForm
              initialValues={professionData()}
              onSubmit={chain(setProfessionData, index.next)}
            >
              <Button type="submit" size="xl" class="mb-4 w-full">
                Next: Account Info
              </Button>
            </SelectProfessionForm>
          </TabContent>

          {/**
           * Basic user info
           */}
          <TabContent index={1}>
            <NewAccountInfoForm
              initialValues={newAccountData()}
              onSubmit={chain(setNewAccountData, handleSignup)}
            >
              <div class="columns-2 gap-6">
                <ButtonPrev
                  onClick={index.prev}
                  size="xl"
                  class="w-full"
                  color="alternative"
                >
                  Prev: Personal Info
                </ButtonPrev>

                <Show when={!request.pending}>
                  <Button
                    type="submit"
                    size="xl"
                    class="w-full border border-blue-600"
                  >
                    Next: Create Account
                  </Button>
                </Show>
                <Show when={request.pending}>
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
          </TabContent>

          {/**
           * Errors
           */}
          <TabContent index={2}>
            <h2 class="text-2xl font-bold mb-6">Uh-oh...</h2>
            <p class="mb-3">There was a problem creating your account:</p>
            <Alert class="mb-6" color="red">
              {request.error?.message}
            </Alert>
            <ButtonPrev size="xl" class="w-full" color="alternative">
              Prev: Account Info
            </ButtonPrev>
          </TabContent>

          {/**
           * Success
           */}
          <TabContent index={3}>
            <h2 class="text-2xl font-bold mb-6">Congratulations!</h2>
            <p>
              Your account has been created. A confirmation email has been sent.
              Please click on the link in the email to log in.
            </p>
          </TabContent>
        </IndexContext.Provider>
      </section>
    </main>
  );
}

export default SignUpPage;
