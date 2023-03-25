import { api } from "@/lib/trpc/client";
import { assign, createMachine, ErrorPlatformEvent } from "xstate";
import { UserProfile } from "../schema/user-profile-schema";

export interface AllUsersContext {
  users: UserProfile[];
  error?: any;
}

export type InviteUsersEvent = {
  type: "START_INVITE";
};

export type SendInvitesEvent = {
  type: "SEND_INVITES";
  payload: string[];
};

export type AllUsersEvent = InviteUsersEvent | ErrorPlatformEvent;

export const allUsersMachine = createMachine<AllUsersContext>(
  {
    id: "root",
    context: {
      users: [],
    },
    initial: "showingUsers",
    states: {
      showingUsers: {
        initial: "showing",
        states: {
          fetching: {
            invoke: {
              src: "getUsers",
              onDone: {
                actions: "assignUsers",
                target: "showing",
              },
              onError: {
                actions: "assignError",
                target: "showing",
              },
            },
          },
          showing: {
            on: {
              START_INVITE: {
                target: "#root.invitingUsers",
              },
            },
          },
        },
      },
      invitingUsers: {
        initial: "gettingEmails",
        states: {
          gettingEmails: {
            on: {
              SEND_INVITES: {
                cond: "hasEmails",
                actions: "clearError",
                target: "sendingInvites",
              },
              CANCEL: {
                actions: "clearError",
                target: "#root.showingUsers",
              },
            },
          },
          sendingInvites: {
            invoke: {
              src: "inviteUsers",
              onDone: {
                target: "success",
              },
              onError: {
                actions: "assignError",
                target: "gettingEmails",
              },
            },
          },
          success: {
            on: {
              OK: {
                target: "#root.showingUsers",
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      hasEmails: (ctx, event) => Boolean(event.payload?.length > 0),
    },

    actions: {
      assignUsers: assign({
        users: (ctx, event) => [],
      }),

      assignError: assign({
        error: (ctx, event: ErrorPlatformEvent) => event.data,
      }),

      clearError: assign({
        error: (ctx, event) => undefined,
      }),
    },

    services: {
      inviteUsers: async (ctx, event) => {
        const emails = (event as SendInvitesEvent).payload;
        const results = await api.users.inviteUsers.mutate(emails);
        const errors = results
          .filter((result) => result.error)
          .map((result) => result.error);

        if (errors.length) throw errors;
      },
    },
  }
);
