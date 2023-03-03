import { createForm, Field, Form, zodForm } from "@modular-forms/solid";
import { JSX, splitProps } from "solid-js";
import { createObjectURL } from "~/lib/util/create-object-url";
import { encodeFile, noop, omitFalsyProperties } from "~/lib/util/util";
import { Checkbox } from "../inputs/check-box";
import { Dropzone } from "../inputs/dropzone";
import { TextInput } from "../inputs/text-input";
import { VStack } from "../stacks/v-stack";
import {
  UpdateProfileFormData,
  updateProfileFormSchema,
} from "../../lib/schemas/update-profile-form-schema";
import { pick } from "radash";
import { UpdateProfileData } from "~/lib/schemas/update-profile";

const zodFormValidator = zodForm(updateProfileFormSchema);
const validateForm = (values: any) =>
  zodFormValidator(omitFalsyProperties(values));

export interface UpdateProfileFormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialValues?: Partial<
    Omit<UpdateProfileFormData, "avatarImage" | "avatarImageData">
  >;
  onSubmit?: (data: UpdateProfileData) => void;
}

export function UpdateProfileForm(props: UpdateProfileFormProps) {
  const [, formProps] = splitProps(props, [
    "initialValues",
    "onSubmit",
    "children",
  ]);

  const { initialValues } = props;
  const form = createForm<UpdateProfileFormData>({
    initialValues,
    validate: validateForm,
  });

  const imageURL = createObjectURL();

  const handleSubmit = async (data: UpdateProfileFormData) => {
    data = omitFalsyProperties(data);

    const avatarImage = data.avatarImage && {
      name: data.avatarImage.name,
      size: data.avatarImage.size,
      type: data.avatarImage.type,
    };
    const avatarImageData =
      data.avatarImage && (await encodeFile(data.avatarImage as File));

    props.onSubmit?.({ ...data, avatarImage, avatarImageData });
  };

  return (
    <Form
      of={form}
      onSubmit={props.onSubmit ? handleSubmit : noop}
      {...formProps}
    >
      <VStack spacing="sm">
        <Field of={form} name="avatarImage">
          {(field) => (
            <Dropzone
              {...field.props}
              class="rounded-full aspect-square mb-12 overflow-hidden"
              description="SVG, PNG, JPG or GIF (max. 800x400px)"
              onChange={imageURL.fromChangeEvent}
            >
              {imageURL.value && (
                <img
                  class="min-w-[calc(100%+theme(space.16))] min-h-[calc(100%+theme(space.16))] object-cover"
                  src={imageURL.value}
                />
              )}
            </Dropzone>
          )}
        </Field>

        <Field of={form} name="fullName">
          {(field) => (
            <TextInput
              {...field.props}
              label="Full name"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>

        <Field of={form} name="casualName">
          {(field) => (
            <TextInput
              {...field.props}
              label="Preferred name"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>

        <Field of={form} name="wantsMarketing">
          {(field) => (
            <Checkbox {...field.props} checked={field.value}>
              Send me marketing communications
            </Checkbox>
          )}
        </Field>
      </VStack>

      {props.children}
    </Form>
  );
}
