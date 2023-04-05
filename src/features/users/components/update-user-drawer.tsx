import { UserProfile } from "../schema/user-profile.schema";
import { createResource, createSignal } from "solid-js";
import { FormState, reset } from "@modular-forms/solid";
import { api } from "@/lib/trpc/client";
import { BlurOverlay } from "@/lib/components/overlays/blur-overlay";
import { Drawer } from "@/lib/components/drawers/drawer";
import { Heading } from "@/lib/components/text/heading";
import { HStack } from "@/lib/components/stacks/h-stack";
import { Button } from "@/lib/components/buttons/button";
import { UpdateProfileForm } from "./update-profile-form";
import { Show } from "solid-js";

export interface UpdateUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}

export function UpdateUserDrawer(props: UpdateUserDrawerProps) {
  const [form, setForm] = createSignal<FormState<UserProfile>>();
  const [newProfile, setNewProfile] = createSignal<UserProfile>();

  const [data] = createResource(newProfile, (v) =>
    api.users.updateCurrentProfile.mutate(v)
  );

  const handleClose = () => {
    if (form()) reset(form()!);
    props.onClose?.();
  };

  return (
    <>
      <BlurOverlay isOpen={props.isOpen} onClick={handleClose} />
      <Drawer isOpen={props.isOpen} placement="right" class="p-6">
        <Heading level="1" class="text-2xl font-medium mb-6">
          Update User
        </Heading>
        <UpdateProfileForm onSubmit={setNewProfile}>
          <HStack class="mt-4" spacing="xs" justify="end">
            <Button type="reset" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </HStack>
        </UpdateProfileForm>
        <Show when={Boolean(data.error)}>
          <p class="text-red-500 mt-4">
            {JSON.stringify(data.error, null, "  ")}
          </p>
        </Show>
      </Drawer>
    </>
  );
}
