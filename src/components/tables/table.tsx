import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import clsx from "clsx";
import { For, JSX, Show, splitProps } from "solid-js";

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  data: any[];
  columns: ColumnDef<any>[];
}

export function Table(props: TableProps) {
  const [, tableProps] = splitProps(props, ["class", "columns", "data"]);

  const table = createSolidTable({
    data: props.data ?? [],
    columns: props.columns ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      class={clsx(
        "w-full text-sm text-left text-slate-800 dark:text-slate-200 rounded-lg",
        props.class
      )}
      {...tableProps}
    >
      <thead class="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-400">
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th scope="col" class="px-6 py-3">
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
            <tr class="bg-white border-b last:border-0 dark:bg-slate-800 dark:border-slate-700">
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <td class="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )}
              </For>
            </tr>
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
