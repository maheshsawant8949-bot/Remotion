import { TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

// Transition Mapping Logic
// Soft -> Fade (1 sec)
// Firm -> Slide (0.5 sec)
// Release -> Fade (1.5 sec) - Longer breathe
// Minimal -> None (0 sec)

export const TRANSITION_MAP: Record<string, any> = {
  soft: { text: "Soft", type: "fade", duration: 30 },
  firm: { text: "Firm", type: "slide", duration: 15 },
  release: { text: "Release", type: "fade", duration: 45 },
  minimal: { text: "Minimal", type: "none", duration: 0 },
};

export const getTransition = (type: string | undefined) => {
  const t = TRANSITION_MAP[type || 'soft'];
  if (t.type === 'slide') return slide();
  if (t.type === 'fade') return fade();
  return null; // None
};
