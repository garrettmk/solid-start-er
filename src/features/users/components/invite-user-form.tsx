import { createEffect, JSX, Setter } from "solid-js";
import { inviteUserSchema, InviteUser } from "../schema/invite-user.schema";
import { splitProps } from "solid-js";
import {
  createForm,
  zodForm,
  Form,
  Field,
  FormState,
} from "@modular-forms/solid";
import { noop } from "@/lib/util/util";
import { TextInput } from "@/lib/components/inputs/text-input";

export interface InviteUserFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<InviteUser>;
  onSubmit?: (data: InviteUser) => void;
  ref?: Setter<HTMLFormElement>;
  apiRef?: Setter<FormState<InviteUser>>;
}

export function InviteUserForm(props: InviteUserFormProps) {
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
    "ref",
    "apiRef",
  ]);

  const { initialValues } = props;
  const form = createForm<InviteUser>({
    initialValues,
    validate: zodForm(inviteUserSchema),
  });

  createEffect(() => {
    props.apiRef?.(form);
  });

  return (
    <Form
      ref={props.ref}
      of={form}
      onSubmit={props.onSubmit ?? noop}
      {...formProps}
    >
      <Field of={form} name="email">
        {(field) => (
          <TextInput
            {...field.props}
            label="Email"
            placeholder="name@mail.com"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>
      {props.children}
    </Form>
  );
}
