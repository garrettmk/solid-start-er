import {
  computePosition,
  offset,
  OffsetOptions,
  Placement,
} from "@floating-ui/core";
import { platform } from "@floating-ui/dom";
import {
  Accessor,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

export type FloatingUIOptions = {
  placement?: Placement;
  offset?: OffsetOptions;
};

export type FloatingUI = {
  isOpen: boolean;
  anchorRef: (el: HTMLElement) => void;
  anchorEl: Accessor<HTMLElement | undefined>;
  floatingRef: (el: HTMLElement) => void;
  floatingEl: Accessor<HTMLElement | undefined>;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export function createFloatingUI(options: FloatingUIOptions): FloatingUI {
  const [anchorEl, anchorRef] = createSignal<HTMLElement>();
  const [floatingEl, floatingRef] = createSignal<HTMLElement>();

  const [floatingUi, setState] = createStore<FloatingUI>({
    isOpen: false,
    anchorRef,
    anchorEl,
    floatingRef,
    floatingEl,

    open: () => {
      setState("isOpen", true);
    },
    close: () => {
      setState("isOpen", false);
    },
    toggle: () => {
      setState("isOpen", (c) => !c);
    },
  });

  createEffect(() => {
    const anchor = anchorEl();
    const floating = floatingEl();

    if (anchor && floating && floatingUi.isOpen)
      computePosition(anchorEl(), floatingEl(), {
        platform,
        placement: options.placement,
        middleware: [offset(options.offset)],
      }).then(({ x, y }) => {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
  });

  return floatingUi;
}
