import {
  createForm,
  Field,
  Form,
  getValue,
  zodForm,
} from "@modular-forms/solid";
import axios from "axios";
import { createEffect, Show } from "solid-js";
import { APIEvent, createRouteAction, json } from "solid-start";
import { z } from "zod";
import { Alert } from "~/components/alerts/alert";
import { Button } from "~/components/buttons/button";
import { ButtonNext } from "~/components/buttons/button-next";
import { ButtonPrev } from "~/components/buttons/button-prev";
import { CheckIcon } from "~/components/icons/check";
import { ChevronLeftIcon } from "~/components/icons/chevron-left";
import { CloudIcon } from "~/components/icons/cloud";
import { BigOptionButton } from "~/components/inputs/big-option-button";
import { Checkbox } from "~/components/inputs/check-box";
import { TextInput } from "~/components/inputs/text-input";
import { Spinner } from "~/components/spinners/spinner";
import { HStack } from "~/components/stacks/h-stack";
import { VStack } from "~/components/stacks/v-stack";
import { Step, Steps } from "~/components/steps/steps";
import { TabContent } from "~/components/tabs/tab-content";
import { createIndex, IndexContext } from "~/lib/contexts/index-context";
import { supabase } from "~/lib/supabase/supabase";
import { delay } from "~/lib/util/util";

/**
 * Define the schema for the sign up form
 */
const formSchema = z
  .object({
    profession: z.string(),

    fullName: z
      .string()
      .min(3, "Please enter at least 3 characters")
      .max(30, "Please, no more than 30 characters")
      .regex(
        /^[a-zA-Z' \p{L}\-]+$/,
        "Names can include any Unicode letter, hyphen, or apostrophe"
      ),

    email: z
      .string({ description: "Please enter your email address" })
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be less than 30 characters")
      .regex(/^.*[a-z]+.*$/, "Must include at least one lowercase letter")
      .regex(/^.*[A-Z]+.*$/, "Must include at least one uppercase letter")
      .regex(/^.*[0-9]+.*$/, "Must include at least one number")
      .regex(
        /^.*[#?!@$%^&*~_^&*(){}[\]\-]+.*$/,
        "Must include at least one special character (#?!@$%^&*-~_^&*(){}[])"
      ),

    confirmPassword: z.string(),
    agreeToTerms: z.boolean(),
    wantsMarketing: z.boolean(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password)
      ctx.addIssue({
        code: "custom",
        message: "Must match your password",
      });
  });

type SignUpForm = z.input<typeof formSchema>;

/**
 *
 * @param event A SignUpForm object sent via POST
 * @returns Either the User object, or an ApiAuthError object
 */
export async function POST(event: APIEvent) {
  const { email, password, confirmPassword, ...otherData } =
    (await event.request.json()) as SignUpForm;

  await delay(3000);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: otherData },
  });

  if (error) return json(error, error.status);
  return json(data.user);
}

/**
 *
 * @returns The sign up page
 */
export function SignUpPage() {
  const index = createIndex();
  const newAccountForm = createForm<SignUpForm>({
    validateOn: "blur",
    validate: zodForm(formSchema),
  });

  const stepOneComplete = () => !!getValue(newAccountForm, "profession");
  const stepTwoComplete = () =>
    getValue(newAccountForm, "fullName") &&
    getValue(newAccountForm, "email") &&
    getValue(newAccountForm, "password") &&
    getValue(newAccountForm, "agreeToTerms");

  const [request, signUp] = createRouteAction(
    async (signUpData: SignUpForm) => {
      const response = await axios.post("/sign-up", signUpData);

      if (response.status === 200) return response.data;
      else throw response.data;
    }
  );

  createEffect(() => {
    if (request.error) index[1].setIndexValue(2);
    else if (request.result) index[1].setIndexValue(3);
  });

  return (
    <main class="flex min-h-screen">
      <aside class="hidden md:block p-12 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <a href="/" class="block text-sm mb-4">
          <ChevronLeftIcon class="inline w-4 h-4 stroke-2" /> Go Back
        </a>
        <HStack class="mb-6" align="end">
          <CloudIcon class="w-12 h-12 mr-2" />
          <h1 class="text-3xl font-medium mr-6">Our Service</h1>
        </HStack>
        <section class="px-8 py-6 bg-blue-500 rounded-lg">
          <h2 class="text-2xl font-medium mb-1">Your Account</h2>
          <h3 class="text-xl font-extralight mb-3">It's free for now!</h3>
          <ul class="[&>li:not(:last-child)]:mb-2 [&>li]:flex [&_svg]:mr-2 [&_svg]:text-green-300">
            <li>
              <CheckIcon /> No setup, or hidden fees
            </li>
            <li>
              <CheckIcon />
              No oaths of allegience or fealty
            </li>
            <li>
              <CheckIcon />
              No defense pacts in the event of invasion
            </li>
          </ul>
        </section>
      </aside>
      <section class="dark bg-slate-900 text-white p-24 flex-grow">
        <IndexContext.Provider value={index}>
          <Steps class="mb-12">
            <Step index={0}>Personal Info</Step>
            <Step index={1}>Account Info</Step>
            <Step index={2}>Confirmation</Step>
          </Steps>

          <Form of={newAccountForm} onSubmit={(e) => console.log(e)}>
            <TabContent index={0}>
              <h2 class="text-2xl font-bold mb-6">Tell us about yourself</h2>
              <h3 class="text-lg text-slate-400 mb-6">
                What is your profession?
              </h3>
              <VStack as="fieldset" spacing="sm" align="stretch" class="mb-8">
                <Field of={newAccountForm} name="profession">
                  {(field) => (
                    <BigOptionButton
                      {...field.props}
                      checked={field.value === "human"}
                      value="human"
                      label="I'm a human"
                      description="Completely, totally human"
                      required
                    />
                  )}
                </Field>
                <Field of={newAccountForm} name="profession">
                  {(field) => (
                    <BigOptionButton
                      {...field.props}
                      checked={field.value === "robot"}
                      value="robot"
                      label="I'm a robot"
                      description="Better in every way"
                      required
                    />
                  )}
                </Field>
              </VStack>
              <ButtonNext
                disabled={!stepOneComplete()}
                size="xl"
                class="mb-4 w-full"
              >
                Next: Account Info
              </ButtonNext>
            </TabContent>

            <TabContent index={1}>
              <h2 class="text-2xl font-bold mb-6">Account Information</h2>
              <div class="grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-2 mb-6">
                <Field of={newAccountForm} name="fullName">
                  {(field) => (
                    <TextInput
                      {...field.props}
                      label="Full Name"
                      value={field.value}
                      error={field.error}
                      required
                    />
                  )}
                </Field>

                <Field of={newAccountForm} name="email">
                  {(field) => (
                    <TextInput
                      {...field.props}
                      label="Email"
                      value={field.value}
                      error={field.error}
                      required
                    />
                  )}
                </Field>

                <Field of={newAccountForm} name="password">
                  {(field) => (
                    <TextInput
                      {...field.props}
                      label="Password"
                      type="password"
                      value={field.value}
                      error={field.error}
                      required
                    />
                  )}
                </Field>

                <Field of={newAccountForm} name="confirmPassword">
                  {(field) => (
                    <TextInput
                      {...field.props}
                      label="Confirm Password"
                      type="password"
                      value={field.value}
                      required
                    />
                  )}
                </Field>
              </div>
              <Field of={newAccountForm} name="agreeToTerms">
                {(field) => (
                  <Checkbox
                    {...field.props}
                    checked={field.value}
                    class="mb-4"
                    required
                  >
                    I have read and agree to the{" "}
                    <a class="text-blue-500" href="#">
                      Terms and Conditions
                    </a>
                  </Checkbox>
                )}
              </Field>

              <Field of={newAccountForm} name="wantsMarketing">
                {(field) => (
                  <Checkbox {...field.props} checked={field.value} class="mb-8">
                    Send me marketing email
                  </Checkbox>
                )}
              </Field>

              <div class="columns-2 gap-6">
                <ButtonPrev size="xl" class="w-full" color="alternative">
                  Prev: Personal Info
                </ButtonPrev>

                <Show when={!request.pending}>
                  <Button
                    type="submit"
                    disabled={!stepTwoComplete()}
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
            </TabContent>
          </Form>

          <TabContent index={2}>
            <h2 class="text-2xl font-bold mb-6">Uh-oh...</h2>
            <p class="mb-3">There was a problem creating your account:</p>
            <Alert class="mb-6" color="red">
              {request.error?.response.data.message}
            </Alert>
            <ButtonPrev size="xl" class="w-full" color="alternative">
              Prev: Account Info
            </ButtonPrev>
          </TabContent>

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
