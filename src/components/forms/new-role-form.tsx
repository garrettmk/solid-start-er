import { createForm, Field, Form, zodForm } from "@modular-forms/solid";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { NewRoleData, newRoleSchema } from "~/lib/schemas/new-role";
import { noop } from "~/lib/util/util";
import { TextInput } from "../inputs/text-input";

export interface NewRoleFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<NewRoleData>;
  onSubmit?: (data: NewRoleData) => void;
}

export function NewRoleForm(props: NewRoleFormProps) {
  const [, formProps] = splitProps(props, [
    "class",
    "initialValues",
    "onSubmit",
    "children",
  ]);

  const form = createForm<NewRoleData>({
    initialValues: props.initialValues,
    validate: zodForm(newRoleSchema),
  });

  return (
    <Form
      of={form}
      onSubmit={props.onSubmit ?? noop}
      class={clsx("space-y-6", props.class)}
      {...formProps}
    >
      <Field of={form} name="name">
        {(field) => (
          <TextInput
            {...field.props}
            label="Role name"
            placeholder="Administrator"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <Field of={form} name="description">
        {(field) => (
          <TextInput
            {...field.props}
            label="Role description"
            placeholder="Can manage tenants and users"
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
