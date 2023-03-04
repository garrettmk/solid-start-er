import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

const styles = {
  root: "relative",

  input: `
    block p-2.5 w-full z-20 
    text-sm text-slate-900 dark:text-white dark:placeholder-slate-400
    bg-slate-50 dark:bg-slate-700
    rounded-lg border border-slate-300 dark:border-slate-600
    focus:ring-blue-500 
    focus:border-blue-500 dark:focus:border-blue-500
  `,
};

export interface SearchInputProps extends JSX.HTMLAttributes<HTMLFormElement> {
  placeholder?: string;
}

export function SearchInput(props: SearchInputProps) {
  const [, formProps] = splitProps(props, ["class", "placeholder"]);

  return (
    <form class={clsx(styles.root, props.class)} {...formProps}>
      <div class="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          class={styles.input}
          placeholder={props.placeholder}
          required
        />
        <button
          type="submit"
          class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}
