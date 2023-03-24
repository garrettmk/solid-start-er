import {
  createForm,
  Field,
  Form,
  getError,
  zodForm,
} from "@modular-forms/solid";
import clsx from "clsx";
import { JSX, Show, splitProps } from "solid-js";
import {
  ChooseProfessionInput,
  chooseProfessionInputSchema,
} from "@/features/sign-up/schema/choose-profession-input.schema";
import { noop } from "@/lib/util/util";
import { BigOptionButton } from "../../../components/inputs/big-option-button";
import { VStack } from "../../../components/stacks/v-stack";

export interface SelectProfessionFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<ChooseProfessionInput>;
  onSubmit?: (data: ChooseProfessionInput) => void;
}

export function ChooseProfessionForm(props: SelectProfessionFormProps) {
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
  ]);
  const { initialValues } = props;
  const form = createForm<ChooseProfessionInput>({
    initialValues,
    validate: zodForm(chooseProfessionInputSchema),
  });

  return (
    <Form of={form} onSubmit={props.onSubmit ?? noop} {...formProps}>
      <h2 class="text-2xl font-bold mb-6">Tell us about yourself</h2>
      <VStack as="fieldset" spacing="sm" align="stretch" class="mb-8">
        <legend class="text-lg text-slate-400 mb-6">
          What is your profession?
        </legend>
        <Field of={form} name="profession">
          {(field) => (
            <BigOptionButton
              {...field.props}
              checked={field.value === "human"}
              value="human"
              label={"I'm a human"}
              description="Completely, totally human"
              aria-errormessage="profession-error"
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
              aria-errormessage="profession-error"
              required
            />
          )}
        </Field>
        <p
          id="profession-error"
          class={clsx("text-xs text-red-600 dark:text-red-400", {
            "absolute opacity-0": !getError(form, "profession"),
          })}
        >
          {getError(form, "profession")}
        </p>
      </VStack>
      {props.children}
    </Form>
  );
}
