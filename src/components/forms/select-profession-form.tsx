import {
  createForm,
  Field,
  Form,
  getError,
  zodForm,
} from "@modular-forms/solid";
import { JSX, Show, splitProps } from "solid-js";
import { z } from "zod";
import { noop } from "~/lib/util/util";
import { BigOptionButton } from "../inputs/big-option-button";
import { VStack } from "../stacks/v-stack";

export const selectProfessionSchema = z.object({
  profession: z.enum(["human", "robot"], {
    required_error: "Please choose a profession",
  }),
});

export type SelectProfessionData = z.input<typeof selectProfessionSchema>;

export interface SelectProfessionFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<SelectProfessionData>;
  onSubmit?: (data: SelectProfessionData) => void;
}

export function SelectProfessionForm(props: SelectProfessionFormProps) {
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
  ]);
  const { initialValues } = props;
  const form = createForm<SelectProfessionData>({
    initialValues,
    validate: zodForm(selectProfessionSchema),
  });

  return (
    <Form of={form} onSubmit={props.onSubmit ?? noop} {...formProps}>
      <h2 class="text-2xl font-bold mb-6">Tell us about yourself</h2>
      <h3 class="text-lg text-slate-400 mb-6">What is your profession?</h3>
      <VStack as="fieldset" spacing="sm" align="stretch" class="mb-8">
        <Field of={form} name="profession">
          {(field) => (
            <BigOptionButton
              {...field.props}
              checked={field.value === "human"}
              value="human"
              label={"I'm a human"}
              description="Completely, totally human"
              required
            />
          )}
        </Field>
        <Field of={form} name="profession">
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
        <Show when={getError(form, "profession")}>
          <p class="text-xs text-red-600 dark:text-red-400">
            {getError(form, "profession")}
          </p>
        </Show>
      </VStack>
      {props.children}
    </Form>
  );
}
