'use client';

import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import {
  animate,
  cubicBezier,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion';
import {
  CAT_VIEWBOX,
  HEAD_CENTER,
  PEEK_Y,
  PUPIL_MAX,
  SLEEP_AFTER_MS,
  STAR_COOLDOWN_MS,
  STAR_WAKE_COOLDOWN_MS,
  WAKE_RADIUS_PX,
  closestApproach,
  crossesViewport,
  gazeOffset,
  lerpPoint,
  randomBetween,
} from '@/lib/catLife';
import { onShootingStar, type ShootingStar } from '@/lib/skyEvents';

const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);
const CUBIC_OUT = cubicBezier(0.33, 1, 0.68, 1);

/** Critically damped (damping = 2 * sqrt(stiffness)): glides to the target, never overshoots. */
const GAZE_SPRING = { stiffness: 120, damping: 21.9, mass: 1, restDelta: 0.01 } as const;

const BREATH_PERIOD_S = 3.5;
const SLEEP_BREATH_PERIOD_S = 6;

export interface MantecadoLife {
  /** Attach to the cat's SVG so gaze can be measured against its head. */
  svgRef: RefObject<SVGSVGElement | null>;
  /** 0 = head peeking, 1 = fully risen. */
  rise: MotionValue<number>;
  /** 0 = awake, 1 = asleep. */
  sleep: MotionValue<number>;
  /** 0 = eyes open, 1 = shut (blinks only; sleep closes the eyes separately). */
  blink: MotionValue<number>;
  /** 0..1..0 breathing phase. */
  breath: MotionValue<number>;
  /** Ear flick amount, 0 = at rest. Magnitude in degrees; the component applies the side. */
  twitchL: MotionValue<number>;
  twitchR: MotionValue<number>;
  /** 0..1 ears perked up. */
  perk: MotionValue<number>;
  /** -1..1 continuous tail sway. */
  tailPhase: MotionValue<number>;
  /** One-off tail flick, about -0.4..1. */
  flick: MotionValue<number>;
  /** 0..1 looping clock for the drifting z glyphs. */
  zClock: MotionValue<number>;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
  /** Pointer and focus handlers for the cat's button. */
  bind: {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onFocus: (e: React.FocusEvent<HTMLElement>) => void;
    onBlur: () => void;
  };
}

/**
 * All of Mantecado's life lives in motion values: breathing, blinking, ear
 * flicks, tail, gaze, sleep and star watching. React never re-renders for any
 * of it. Timers and listeners are cleaned up on unmount and loops pause while
 * the tab is hidden.
 */
export function useMantecadoLife(): MantecadoLife {
  const reduceMotion = useReducedMotion() ?? false;
  const svgRef = useRef<SVGSVGElement>(null);

  const rise = useMotionValue(0);
  const sleep = useMotionValue(0);
  const blink = useMotionValue(0);
  const breath = useMotionValue(0);
  const twitchL = useMotionValue(0);
  const twitchR = useMotionValue(0);
  const perk = useMotionValue(0);
  const tailPhase = useMotionValue(-1);
  const flick = useMotionValue(0);
  const zClock = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pupilX = useSpring(rawX, GAZE_SPRING);
  const pupilY = useSpring(rawY, GAZE_SPRING);

  const hovered = useRef(false);
  const focused = useRef(false);

  const syncRise = useCallback(() => {
    const target = hovered.current || focused.current ? 1 : 0;
    if (reduceMotion) {
      rise.set(target);
      return;
    }
    animate(rise, target, { duration: target ? 0.55 : 0.45, ease: EXPO_OUT });
  }, [reduceMotion, rise]);

  const bind = useMemo<MantecadoLife['bind']>(
    () => ({
      onPointerEnter: (e) => {
        if (e.pointerType === 'touch') return;
        hovered.current = true;
        syncRise();
      },
      onPointerLeave: (e) => {
        if (e.pointerType === 'touch') return;
        hovered.current = false;
        syncRise();
      },
      onFocus: (e) => {
        if (!e.currentTarget.matches(':focus-visible')) return;
        focused.current = true;
        syncRise();
      },
      onBlur: () => {
        focused.current = false;
        syncRise();
      },
    }),
    [syncRise],
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let pointer: { x: number; y: number } | null = null;
    let rect = svg.getBoundingClientRect();
    const refreshRect = () => {
      rect = svg.getBoundingClientRect();
    };

    const headCenter = () => {
      const k = rect.width / CAT_VIEWBOX.w;
      const sink = PEEK_Y * (1 - rise.get());
      return {
        x: rect.left + (HEAD_CENTER.x - CAT_VIEWBOX.x) * k,
        y: rect.top + (HEAD_CENTER.y + sink - CAT_VIEWBOX.y) * k,
      };
    };

    /** Point the pupils at a viewport position. */
    const aim = (x: number, y: number, snap = false) => {
      const c = headCenter();
      const o = gazeOffset(x - c.x, y - c.y, PUPIL_MAX);
      if (snap) {
        pupilX.jump(o.x);
        pupilY.jump(o.y);
      } else {
        rawX.set(o.x);
        rawY.set(o.y);
      }
    };

    /* Reduced motion: a still cat whose eyes snap to the pointer. */
    if (reduceMotion) {
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        aim(e.clientX, e.clientY, true);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('resize', refreshRect, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', refreshRect);
      };
    }

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };
    const cancel = (id: number) => {
      window.clearTimeout(id);
      timers.delete(id);
    };

    const loops: { breath?: AnimationPlaybackControls; tail?: AnimationPlaybackControls; z?: AnimationPlaybackControls } = {};
    const allLoops = () => Object.values(loops).filter(Boolean) as AnimationPlaybackControls[];

    let asleep = false;
    let lastInput = performance.now();
    let sleepTimer = 0;
    let starActive = false;
    let starStartedAt = -Infinity;
    let lastStarWake = -Infinity;
    let starAnim: AnimationPlaybackControls | undefined;
    let resleepTimer = 0;

    /* Breathing: eases back to rest, then loops at the requested pace. */
    const startBreath = (periodS: number) => {
      loops.breath?.stop();
      loops.breath = animate(breath, 0, {
        duration: 0.5,
        ease: 'easeOut',
        onComplete: () => {
          loops.breath = animate(breath, [0, 1, 0], {
            duration: periodS,
            ease: 'easeInOut',
            repeat: Infinity,
          });
          if (document.hidden) loops.breath.pause();
        },
      });
    };

    const releaseGaze = () => {
      if (pointer) aim(pointer.x, pointer.y);
      else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    /* Blinking: every 3 to 7 seconds, sometimes twice. */
    const blinkOnce = () =>
      animate(blink, [0, 1, 0], { duration: 0.24, times: [0, 0.4, 1], ease: 'easeOut' });
    const scheduleBlink = () =>
      later(() => {
        if (!asleep && !document.hidden) {
          blinkOnce();
          if (Math.random() < 0.2) later(blinkOnce, 340);
        }
        scheduleBlink();
      }, randomBetween(3000, 7000));

    /* Ear twitch: one ear, every 6 to 14 seconds. */
    const scheduleTwitch = () =>
      later(() => {
        if (!asleep && !document.hidden) {
          animate(Math.random() < 0.5 ? twitchL : twitchR, [0, 14, 2, 9, 0], {
            duration: 0.42,
            times: [0, 0.22, 0.5, 0.75, 1],
            ease: 'easeOut',
          });
        }
        scheduleTwitch();
      }, randomBetween(6000, 14000));

    const perkEars = (seconds: number) =>
      animate(perk, [0, 1, 1, 0], { duration: seconds, times: [0, 0.14, 0.7, 1], ease: 'easeOut' });

    const flickTail = () =>
      animate(flick, [0, 1, -0.4, 0.5, 0], {
        duration: 0.9,
        times: [0, 0.2, 0.45, 0.7, 1],
        ease: 'easeInOut',
      });

    /* Sleep and wake */
    const pointerNear = () => {
      if (!pointer) return false;
      const c = headCenter();
      return Math.hypot(pointer.x - c.x, pointer.y - c.y) < WAKE_RADIUS_PX;
    };

    const fallAsleep = () => {
      if (asleep) return;
      asleep = true;
      animate(sleep, 1, { duration: 2.4, ease: EXPO_OUT });
      rawX.set(0);
      rawY.set(0);
      startBreath(SLEEP_BREATH_PERIOD_S);
      loops.z?.stop();
      loops.z = animate(zClock, [0, 1], { duration: 5.4, ease: 'linear', repeat: Infinity });
      if (document.hidden) loops.z.pause();
    };

    const wake = () => {
      if (!asleep) return;
      asleep = false;
      animate(sleep, 0, { duration: 0.45, ease: EXPO_OUT });
      perkEars(1.1);
      startBreath(BREATH_PERIOD_S);
      later(() => loops.z?.stop(), 600);
    };

    const checkSleep = () => {
      sleepTimer = 0;
      if (asleep) return;
      const idle = performance.now() - lastInput;
      if (document.hidden || idle < SLEEP_AFTER_MS) {
        sleepTimer = later(checkSleep, Math.max(1000, SLEEP_AFTER_MS - idle));
        return;
      }
      if (pointerNear()) {
        sleepTimer = later(checkSleep, 5000);
        return;
      }
      fallAsleep();
    };
    const armSleep = () => {
      if (!sleepTimer) sleepTimer = later(checkSleep, SLEEP_AFTER_MS);
    };

    const onInput = () => {
      lastInput = performance.now();
      if (resleepTimer) cancel(resleepTimer);
      resleepTimer = 0;
      if (asleep) wake();
      armSleep();
    };

    const onPointerMove = (e: PointerEvent) => {
      onInput();
      if (e.pointerType === 'touch') return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!starActive) aim(e.clientX, e.clientY);
    };

    /* Shooting stars: the gaze rides the star, the ears perk, the tail flicks as it passes. */
    const watchStar = (star: ShootingStar) => {
      if (document.hidden) return;
      const now = performance.now();
      if (now - starStartedAt < STAR_COOLDOWN_MS) return;
      if (!crossesViewport(star, window.innerWidth, window.innerHeight)) return;
      if (asleep && now - lastStarWake < STAR_WAKE_COOLDOWN_MS) return;
      starStartedAt = now;

      starAnim?.stop();
      if (asleep) {
        lastStarWake = now;
        wake();
        // Doze off again a few seconds after the star, unless real input arrives.
        if (resleepTimer) cancel(resleepTimer);
        resleepTimer = later(() => {
          resleepTimer = 0;
          if (!asleep && performance.now() - lastInput >= SLEEP_AFTER_MS) fallAsleep();
        }, star.durationMs + 3000);
      }

      starActive = true;
      const passesAt = closestApproach(star.from, star.to, headCenter());
      let flicked = false;
      perkEars(Math.min(1.8, Math.max(0.9, star.durationMs / 1000)));
      starAnim = animate(0, 1, {
        duration: star.durationMs / 1000,
        ease: CUBIC_OUT,
        onUpdate: (v) => {
          const p = lerpPoint(star.from, star.to, v);
          aim(p.x, p.y);
          if (!flicked && v >= passesAt) {
            flicked = true;
            flickTail();
          }
        },
        onComplete: () => {
          starActive = false;
          releaseGaze();
        },
      });
    };

    /* Visibility: pause loops in a background tab. */
    const onVisibility = () => {
      if (document.hidden) {
        allLoops().forEach((c) => c.pause());
        starAnim?.pause();
      } else {
        allLoops().forEach((c) => c.play());
        starAnim?.play();
        onInput();
      }
    };

    // Life starts here.
    loops.tail = animate(tailPhase, [-1, 1], {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'mirror',
    });
    startBreath(BREATH_PERIOD_S);
    scheduleBlink();
    scheduleTwitch();
    armSleep();

    const passive = { passive: true } as const;
    window.addEventListener('pointermove', onPointerMove, passive);
    window.addEventListener('pointerdown', onInput, passive);
    window.addEventListener('touchstart', onInput, passive);
    window.addEventListener('keydown', onInput, passive);
    window.addEventListener('wheel', onInput, passive);
    window.addEventListener('scroll', onInput, passive);
    window.addEventListener('resize', refreshRect, passive);
    document.addEventListener('visibilitychange', onVisibility);
    const offStar = onShootingStar(watchStar);

    return () => {
      offStar();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onInput);
      window.removeEventListener('touchstart', onInput);
      window.removeEventListener('keydown', onInput);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('scroll', onInput);
      window.removeEventListener('resize', refreshRect);
      document.removeEventListener('visibilitychange', onVisibility);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      allLoops().forEach((c) => c.stop());
      starAnim?.stop();
    };
  }, [reduceMotion, breath, blink, flick, perk, pupilX, pupilY, rawX, rawY, rise, sleep, tailPhase, twitchL, twitchR, zClock]);

  return {
    svgRef,
    rise,
    sleep,
    blink,
    breath,
    twitchL,
    twitchR,
    perk,
    tailPhase,
    flick,
    zClock,
    pupilX,
    pupilY,
    bind,
  };
}
