import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  Row,
  TableOptions,
} from "@tanstack/solid-table";
import clsx from "clsx";
import { Accessor } from "solid-js";
import { Component, For, JSX, Show, splitProps } from "solid-js";

const styles = {
  base: "w-full text-left text-slate-800 dark:text-slate-200",

  header: {
    base: "uppercase bg-slate-100 text-slate-500  dark:bg-slate-700 dark:text-slate-400",

    size: {
      sm: "text-xs px-4 py-1",
      md: "text-sm px-6 py-3",
      lg: "text-md px-8 py-5",
    },
  },

  row: {
    base: "bg-white dark:bg-slate-800 border-b last:border-0 border-slate-200 dark:border-slate-700",
  },

  body: {
    base: "",

    size: {
      sm: "text-sm px-4 py-1.5",
      md: "text-md px-6 py-3",
      lg: "text-lg px-8 py-5",
    },
  },
};

export interface TableProps<T = any, V = T>
  extends JSX.HTMLAttributes<HTMLTableElement> {
  data?: T[] | Accessor<T[] | undefined>;
  columns?: ColumnDef<T, V>[];
  options?: Omit<TableOptions<T>, "data" | "columns" | "getCoreRowModel">;
  expandedComponent?: Component<{ row: Row<T> }>;
  size?: "sm" | "md" | "lg";
}

export function Table(props: TableProps) {
  const [, tableProps] = splitProps(props, [
    "class",
    "columns",
    "data",
    "options",
    "size",
  ]);

  const table = createSolidTable({
    get data() {
      return typeof props.data === "function"
        ? props.data() ?? []
        : props.data ?? [];
    },
    columns: props.columns ?? [],
    getCoreRowModel: getCoreRowModel(),
    ...props.options,
  });

  return (
    <table class={clsx(styles.base, props.class)} {...tableProps}>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th
                    scope="col"
                    class={clsx(
                      styles.header.base,
                      styles.header.size[props.size ?? "md"]
                    )}
                  >
                    <Show when={!header.isPlaceholder}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <>
              <tr class={styles.row.base}>
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td
                      class={clsx(
                        styles.body.base,
                        styles.body.size[props.size ?? "md"]
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )}
                </For>
              </tr>
              <Show when={row.getIsExpanded() && props.expandedComponent}>
                {props.expandedComponent!({ row })}
              </Show>
            </>
          )}
        </For>
      </tbody>
      <tfoot>
        <For each={table.getFooterGroups()}>
          {(footerGroup) => (
            <tr>
              <For each={footerGroup.headers}>
                {(header) => (
                  <th>
                    <Show when={!header.isPlaceholder}>
                      {flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </tfoot>
    </table>
  );
}
