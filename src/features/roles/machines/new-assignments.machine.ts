import { api } from "@/lib/trpc/client";
import { assign, createMachine, ErrorPlatformEvent } from "xstate";

export interface NewRoleAssignmentsContext {
  users: any[];
  roles: any[];
  error?: any;
}

export type SelectEvent = {
  type: "SELECT";
  payload: any[];
};

export type NextEvent = {
  type: "NEXT";
};

export type BackEvent = {
  type: "BACK";
};

export type ConfirmEvent = {
  type: "CONFIRM";
};

export type ResetEvent = {
  type: "RESET";
};

export type NewRoleAssignmentsEvent =
  | SelectEvent
  | NextEvent
  | BackEvent
  | ConfirmEvent
  | ResetEvent
  | ErrorPlatformEvent;

export const newRoleAssignmentsMachine = createMachine<
  NewRoleAssignmentsContext,
  NewRoleAssignmentsEvent
>(
  {
    id: "root",
    context: {
      users: [],
      roles: [],
    },
    initial: "selectingUsers",
    states: {
      selectingUsers: {
        on: {
          SELECT: {
            actions: "assignUsers",
          },
          NEXT: {
            cond: "hasUsers",
            target: "selectingRoles",
          },
        },
      },
      selectingRoles: {
        on: {
          SELECT: {
            actions: "assignRoles",
          },
          BACK: {
            target: "selectingUsers",
          },
          NEXT: {
            cond: "hasRoles",
            target: "assigningRoles",
          },
        },
      },
      assigningRoles: {
        initial: "confirming",
        states: {
          confirming: {
            on: {
              CONFIRM: {
                target: "sending",
              },
              BACK: {
                actions: "clearError",
                target: "#root.selectingRoles",
              },
            },
          },
          sending: {
            invoke: {
              src: "assignRoles",
              onDone: {
                target: "#root.success",
              },
              onError: {
                actions: "assignError",
                target: "confirming",
              },
            },
          },
        },
      },
      success: {
        on: {
          RESET: {
            actions: "reset",
            target: "selectingUsers",
          },
        },
      },
    },
  },
  {
    actions: {
      assignUsers: assign({
        users: (_, event: SelectEvent) => event.payload,
      }),

      assignRoles: assign({
        roles: (_, event: SelectEvent) => event.payload,
      }),

      assignError: assign({
        error: (_, event: ErrorPlatformEvent) => event.data,
      }),

      clearError: assign((ctx, event) => ({
        users: ctx.users,
        roles: ctx.roles,
      })),

      reset: assign((ctx, event) => ({
        users: [],
        roles: [],
      })),
    },
    guards: {
      hasUsers: (ctx) => ctx.users.length > 0,

      hasRoles: (ctx) => ctx.roles.length > 0,
    },
    services: {
      assignRoles: (ctx) =>
        api.roles.assignRoles.mutate({
          userIds: ctx.users.map((user) => user.id),
          roleIds: ctx.roles.map((role) => role.id),
        }),
    },
  }
);
