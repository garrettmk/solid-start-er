import { createStore } from "solid-js/store";

export type ObjectURL = {
  value: string;
  setSource: (src: Blob | MediaSource | File) => void;
  fromChangeEvent: (event: Event) => void;
};

export function createObjectURL() {
  const [objectURL, setState] = createStore<ObjectURL>({
    value: "",

    setSource: (src) =>
      setState("value", (c) => {
        if (c) URL.revokeObjectURL(c);
        return URL.createObjectURL(src);
      }),

    fromChangeEvent: (event: Event) => {
      if (
        event.type !== "change" ||
        !(event.target instanceof HTMLInputElement)
      )
        throw new Error("Invalid change event");

      const file = event.target.files?.[0];
      const url = file ? URL.createObjectURL(file) : "";

      setState("value", (c) => {
        if (c) URL.revokeObjectURL(c);
        return url;
      });
    },
  });

  return objectURL;
}
