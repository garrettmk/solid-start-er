import { createForm, Field, Form, zodForm } from "@modular-forms/solid";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { Role, roleSchema } from "@/features/roles/schema/role-schema";
import { noop } from "@/lib/util/util";
import { TextInput } from "../../../components/inputs/text-input";

export interface NewRoleFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<Role>;
  onSubmit?: (data: Role) => void;
}

export function NewRoleForm(props: NewRoleFormProps) {
  const [, formProps] = splitProps(props, [
    "class",
    "initialValues",
    "onSubmit",
    "children",
  ]);

  const form = createForm<Role>({
    initialValues: props.initialValues,
    validate: zodForm(roleSchema),
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
