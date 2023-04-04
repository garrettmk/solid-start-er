import { Button } from "@/lib/components/buttons/button";
import { Drawer } from "@/lib/components/drawers/drawer";
import { BlurOverlay } from "@/lib/components/overlays/blur-overlay";
import { HStack } from "@/lib/components/stacks/h-stack";
import { Heading } from "@/lib/components/text/heading";
import { api } from "@/lib/trpc/client";
import { FormState, reset } from "@modular-forms/solid";
import { createResource, createSignal, Show } from "solid-js";
import { InviteUser } from "../schema/invite-user.schema";
import { InviteUserForm } from "./invite-user-form";

export interface InviteUsersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUsersDrawer(props: InviteUsersDrawerProps) {
  const [form, setForm] = createSignal<FormState<InviteUser>>();
  const [invite, setInvite] = createSignal<InviteUser>();

  const [data] = createResource(invite, (v) =>
    api.users.inviteUsers.mutate([v.email])
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
          Invite User
        </Heading>
        <p>
          Enter the email address where you would like to send an invitation.
        </p>
        <InviteUserForm apiRef={setForm} onSubmit={setInvite}>
          <HStack class="mt-4" spacing="xs" justify="end">
            <Button type="reset" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Send Invite</Button>
          </HStack>
        </InviteUserForm>
        <Show when={Boolean(data.error)}>
          <p class="text-red-500 mt-4">
            {JSON.stringify(data.error, null, "  ")}
          </p>
        </Show>
      </Drawer>
    </>
  );
}
