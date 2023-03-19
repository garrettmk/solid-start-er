import {
  createForm,
  Field,
  Form,
  ValidateForm,
  zodForm,
} from "@modular-forms/solid";
import { JSX, splitProps } from "solid-js";
import {
  NewAccountInfoData,
  newAccountInfoSchema,
} from "@/features/sign-up/schema/new-account-info";
import { noop } from "@/lib/util/util";
import { Checkbox } from "../../../components/inputs/check-box";
import { TextInput } from "../../../components/inputs/text-input";

// For the moment, module-forms doesn't catch the superRefine error in the
// zod schema.
const zodFormValidator = zodForm(newAccountInfoSchema);
const formValidator: ValidateForm<NewAccountInfoData> = (values) => {
  const { password, confirmPassword } = values;
  const errors = zodFormValidator(values);

  if (!errors.password && confirmPassword !== password)
    errors.confirmPassword = "Must match your password";

  return errors;
};

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
    validate: formValidator,
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
              error={field.error}
              required
            />
          )}
        </Field>
      </div>
      <Field of={form} name="agreesToTerms">
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
