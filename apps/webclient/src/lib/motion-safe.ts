import type { TargetAndTransition, Transition } from "framer-motion";

import { subtleRevealTransition } from "./motion";

/** Final visible state — use instead of `animate={undefined}` which can leave opacity stuck at 0. */
export const MOTION_VISIBLE: TargetAndTransition = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
};

export const MOTION_HIDDEN_Y: TargetAndTransition = {
  opacity: 0,
  y: 40,
};

export const MOTION_INSTANT: Transition = { duration: 0 };

export function safeRevealTransition(reduced: boolean, transition?: Transition): Transition {
  return reduced ? MOTION_INSTANT : (transition ?? subtleRevealTransition);
}

export function revealInitial(
  reduced: boolean,
  hidden: TargetAndTransition | false | string = MOTION_HIDDEN_Y,
) {
  return reduced ? false : hidden;
}

/** Drive `animate` from reduced-motion + in-view (with optional timeout fallback). */
export function revealAnimate(
  reduced: boolean,
  show: boolean,
  hidden: TargetAndTransition = MOTION_HIDDEN_Y,
): TargetAndTransition {
  if (reduced || show) return MOTION_VISIBLE;
  return hidden;
}

/** Variant-driven reveal — never returns undefined for `animate`. */
export function revealVariantAnimate(reduced: boolean, show: boolean, visible = "visible") {
  return reduced || show ? visible : "hidden";
}
