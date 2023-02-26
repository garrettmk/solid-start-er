import { createForm, Field, Form, zodForm } from "@modular-forms/solid";
import { JSX, splitProps } from "solid-js";
import { SignInData, signInSchema } from "~/lib/schemas/sign-in";
import { noop } from "~/lib/util/util";
import { Button } from "../buttons/button";
import { Checkbox } from "../inputs/check-box";
import { TextInput } from "../inputs/text-input";

export interface SignInFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<SignInData>;
  onSubmit?: (data: SignInData) => void;
}

export function SignInForm(props: SignInFormProps) {
  const { initialValues } = props;
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
  ]);
  const form = createForm<SignInData>({
    initialValues,
    validate: zodForm(signInSchema),
  });

  return (
    <Form
      of={form}
      class="space-y-6"
      onSubmit={props.onSubmit ?? noop}
      {...formProps}
    >
      <Field of={form} name="email">
        {(field) => (
          <TextInput
            {...field.props}
            label="Your email"
            placeholder="name@company.com"
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
            label="Your password"
            placeholder="••••••••"
            type="password"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>
      <div class="flex justify-between">
        <Field of={form} name="rememberMe">
          {(field) => (
            <Checkbox {...field.props} checked={field.value}>
              Remember me
            </Checkbox>
          )}
        </Field>

        <a
          href="#"
          class="text-sm text-blue-700 hover:underline dark:text-blue-500"
        >
          Lost Password?
        </a>
      </div>
      <Button type="submit" size="lg" class="text-sm font-medium w-full">
        Login to your account
      </Button>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?{" "}
        <a
          href="/sign-up"
          class="text-blue-700 hover:underline dark:text-blue-500"
        >
          Create account
        </a>
      </div>
    </Form>
  );
}
