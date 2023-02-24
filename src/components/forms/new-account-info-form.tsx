import { Form, Field, createForm, zodForm } from "@modular-forms/solid";
import { JSX, splitProps } from "solid-js";
import { z } from "zod";
import { TextInput } from "../inputs/text-input";
import { Checkbox } from "../inputs/check-box";
import { VStack } from "../stacks/v-stack";
import { BigOptionButton } from "../inputs/big-option-button";
import { Button } from "../buttons/button";
import { noop } from "~/lib/util/util";
import { Show } from "solid-js";

export const newAccountInfoSchema = z.object({
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
});

export type NewAccountInfoData = z.input<typeof newAccountInfoSchema>;

export interface NewAccountInfoFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<NewAccountInfoData>;
  onSubmit?: (data: NewAccountInfoData) => void;
}

export function NewAccountInfoForm(props: NewAccountInfoFormProps) {
  const { initialValues } = props;
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
  ]);

  const form = createForm<NewAccountInfoData>({
    initialValues,
    validate: zodForm(newAccountInfoSchema),
  });

  return (
    <Form of={form} onSubmit={props.onSubmit ?? noop} {...formProps}>
      <h2 class="text-2xl font-bold mb-6">Account Information</h2>
      <div class="grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-2 mb-6">
        <Field of={form} name="fullName">
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

        <Field of={form} name="email">
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

        <Field of={form} name="password">
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

        <Field of={form} name="confirmPassword">
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
      <Field of={form} name="agreeToTerms">
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

      <Field of={form} name="wantsMarketing">
        {(field) => (
          <Checkbox {...field.props} checked={field.value} class="mb-8">
            Send me marketing email
          </Checkbox>
        )}
      </Field>

      {props.children}
    </Form>
  );
}
