import { api } from "@/lib/trpc/client";
import { assign, createMachine } from "xstate";
import { RoleAssignment } from "../schema/role-assignment-schema";

export interface RoleAssignmentsContent {
  selection: RoleAssignment[];
  error?: string;
}

export type SelectionEvent = {
  type: "SELECT";
  payload: RoleAssignment[];
};

export type DeleteEvent = {
  type: "DELETE";
  payload?: RoleAssignment[];
};

export type ConfirmEvent = {
  type: "CONFIRM";
};

export type CancelEvent = {
  type: "CANCEL";
};

export type RoleAssignmentEvent =
  | SelectionEvent
  | DeleteEvent
  | ConfirmEvent
  | CancelEvent;

export const roleAssignmentsMachines = createMachine<
  RoleAssignmentsContent,
  RoleAssignmentEvent
>(
  {
    id: "roleAssignments",
    initial: "idle",
    context: {
      selection: [],
    },
    states: {
      idle: {
        on: {
          SELECT: {
            actions: "assignSelection",
          },
          DELETE: {
            cond: "hasSelection",
            target: "deleting",
          },
        },
      },
      deleting: {
        initial: "confirming",
        states: {
          confirming: {
            entry: ["assignEventSelection"],
            on: {
              CONFIRM: {
                target: "sending",
              },
              CANCEL: {
                actions: "clearError",
                target: "#roleAssignments.idle",
              },
            },
          },
          sending: {
            invoke: {
              src: "deleteAssignments",
              onDone: {
                actions: "clearSelection",
                target: "#roleAssignments.idle",
              },
              onError: {
                actions: "assignError",
                target: "confirming",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignSelection: assign({
        selection: (_, event: SelectionEvent) => event.payload,
      }),

      clearSelection: assign({
        selection: () => [],
      }),

      assignError: assign({
        error: () => "There was a problem",
      }),

      clearError: assign({
        error: () => undefined,
      }),

      assignEventSelection: assign({
        selection: (ctx, event: DeleteEvent) => event.payload ?? ctx.selection,
      }),
    },

    guards: {
      hasSelection: (ctx, event) =>
        ctx.selection.length > 0 ||
        Boolean("payload" in event && event.payload?.length),
    },

    services: {
      deleteAssignments: (ctx) =>
        api.roles.deleteRoleAssignments.mutate(ctx.selection as RoleAssignment[]),
    },
  }
);
