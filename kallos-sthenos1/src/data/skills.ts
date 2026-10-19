import type { Benchmarks } from '../types';

export interface SkillStep {
  name: string;
  req: Partial<Benchmarks>;
  extra?: string;
  goal: string;
  cue: string;
}

export interface Skill {
  id: string;
  name: string;
  type: 'Static' | 'Dynamic';
  equipment: string;
  summary: string;
  warning?: string;
  steps: SkillStep[];
}

export const BENCH_LABEL: Record<keyof Benchmarks, string> = {
  pushups: 'push-ups',
  pullups: 'pull-ups',
  dips: 'bar dips',
  plank: 's plank hold',
  lsit: 's L-sit hold',
  hlr: 'hanging leg raises',
  handstand: 's wall handstand',
  slsquat: 'single-leg squats (each leg)',
};

export const SKILLS: Skill[] = [
  {
    id: 'handstand', name: 'Handstand', type: 'Static', equipment: 'Wall, floor',
    summary: 'Balancing inverted on straight arms with a stacked, hollow line. The gateway to all overhead skills.',
    steps: [
      { name: 'Pike Hold on Box', req: { pushups: 10, plank: 45 }, goal: 'Hold 30s with hips over shoulders', cue: 'Push the floor away, ears covered by arms.' },
      { name: 'Chest-to-Wall Handstand', req: { pushups: 15, plank: 60, handstand: 0 }, goal: 'Hold 60s', cue: 'Nose and toes touch the wall, ribs pulled in.' },
      { name: 'Back-to-Wall Toe Pulls', req: { handstand: 45, pushups: 20 }, goal: '10 pulls holding 5s off the wall', cue: 'Shift weight to the fingertips to pull off.' },
      { name: 'Freestanding Kick-Up', req: { handstand: 60, pushups: 20 }, goal: 'Hold 10s freestanding, 5 times', cue: 'Kick softly, correct with fingers and palms.' },
      { name: 'Freestanding Handstand', req: { handstand: 90, pushups: 25 }, goal: 'Hold 30s freestanding', cue: 'Stack wrists, shoulders, hips and ankles.' },
      { name: 'Handstand Push-Up', req: { handstand: 90, dips: 15, pushups: 30 }, goal: '5 strict wall HSPU', cue: 'Tripod at the bottom, press back to a stacked line.' },
    ],
  },
  {
    id: 'lsit', name: 'L-Sit', type: 'Static', equipment: 'Floor, parallettes or dip bars',
    summary: 'Straight-arm support with legs held horizontal. Builds compression, hip flexor and scapular depression strength.',
    steps: [
      { name: 'Foot-Supported L-Sit', req: { plank: 45, dips: 3 }, goal: 'Hold 30s with heels lightly touching', cue: 'Shoulders down, arms locked.' },
      { name: 'Tuck L-Sit', req: { plank: 60, dips: 5 }, goal: 'Hold 20s', cue: 'Knees to chest, lift the hips high.' },
      { name: 'One-Leg L-Sit', req: { lsit: 5, hlr: 5 }, extra: 'tuck L-sit 20s', goal: 'Hold 15s each leg', cue: 'Extended leg locked, toes pointed.' },
      { name: 'Full L-Sit', req: { lsit: 10, hlr: 8 }, goal: 'Hold 20s', cue: 'Legs parallel, lean slightly forward.' },
      { name: 'L-Sit 30s', req: { lsit: 20, hlr: 10, dips: 10 }, goal: 'Hold 30s on floor', cue: 'Compress hard, push tall.' },
    ],
  },
  {
    id: 'vsit', name: 'V-Sit', type: 'Static', equipment: 'Parallettes or floor',
    summary: 'Legs raised above horizontal in support. Needs elite compression and hamstring flexibility.',
    steps: [
      { name: 'Strong L-Sit', req: { lsit: 30, hlr: 12 }, goal: 'Hold 30s', cue: 'Legs above parallel briefly.' },
      { name: 'Straddle L-Sit', req: { lsit: 30, hlr: 15 }, goal: 'Hold 15s', cue: 'Open legs wide, push hands back.' },
      { name: '45° V-Sit', req: { lsit: 40, hlr: 15, dips: 15 }, extra: 'pike compression: forehead toward knees seated', goal: 'Hold 10s', cue: 'Shoulders lean back, hips forward.' },
      { name: 'Full V-Sit', req: { lsit: 45, hlr: 20, dips: 20 }, goal: 'Hold 10s', cue: 'Pull legs toward the face, arms behind.' },
    ],
  },
  {
    id: 'planche', name: 'Planche', type: 'Static', equipment: 'Floor, parallettes',
    summary: 'Body held horizontal over straight arms. Extreme anterior deltoid and wrist strength. Progress slowly.',
    warning: 'High wrist and elbow load. Do the Wrists and Elbows rehab warm-ups first.',
    steps: [
      { name: 'Planche Lean', req: { pushups: 20, plank: 60 }, goal: 'Hold 30s with shoulders past wrists', cue: 'Protract, lock elbows.' },
      { name: 'Frog Stand', req: { pushups: 20, plank: 60 }, goal: 'Hold 30s', cue: 'Knees on elbows, lean until feet float.' },
      { name: 'Tuck Planche', req: { pushups: 30, dips: 15 }, extra: 'planche lean 30s', goal: 'Hold 15s', cue: 'Arms straight, round the upper back.' },
      { name: 'Advanced Tuck Planche', req: { pushups: 40, dips: 20 }, goal: 'Hold 15s', cue: 'Flat back, hips level with shoulders.' },
      { name: 'Straddle Planche', req: { pushups: 50, dips: 25, handstand: 60 }, goal: 'Hold 10s', cue: 'Legs wide, squeeze glutes.' },
      { name: 'Full Planche', req: { pushups: 50, dips: 30, handstand: 90 }, goal: 'Hold 5s', cue: 'Legs together, total body tension.' },
    ],
  },
  {
    id: 'front-lever', name: 'Front Lever', type: 'Static', equipment: 'Pull-up bar or rings',
    summary: 'Hanging horizontal face up. Lats, core and straight-arm pulling strength.',
    steps: [
      { name: 'Tuck Front Lever', req: { pullups: 8, hlr: 8 }, goal: 'Hold 15s', cue: 'Push the bar down, back horizontal.' },
      { name: 'Advanced Tuck', req: { pullups: 12, hlr: 12 }, goal: 'Hold 15s', cue: 'Flatten the back, open the hips.' },
      { name: 'One-Leg Front Lever', req: { pullups: 15, hlr: 12 }, goal: 'Hold 10s each side', cue: 'Extended leg in line with torso.' },
      { name: 'Straddle Front Lever', req: { pullups: 18, hlr: 15 }, goal: 'Hold 10s', cue: 'Legs wide, glutes tight.' },
      { name: 'Full Front Lever', req: { pullups: 20, hlr: 15, plank: 120 }, goal: 'Hold 5s', cue: 'Straight line from shoulders to toes.' },
    ],
  },
  {
    id: 'back-lever', name: 'Back Lever', type: 'Static', equipment: 'Rings or pull-up bar',
    summary: 'Horizontal face down hang. Biceps tendon and shoulder extension strength. Most accessible lever.',
    warning: 'Stresses the biceps tendon. Build German hang tolerance slowly.',
    steps: [
      { name: 'German Hang', req: { pullups: 5, dips: 5 }, goal: 'Hold 30s', cue: 'Relax into the stretch gradually.' },
      { name: 'Tuck Back Lever', req: { pullups: 8, dips: 10 }, goal: 'Hold 15s', cue: 'Hips level with shoulders, arms straight.' },
      { name: 'Advanced Tuck', req: { pullups: 10, dips: 15 }, goal: 'Hold 15s', cue: 'Open hips, flat back.' },
      { name: 'Straddle Back Lever', req: { pullups: 12, dips: 20 }, goal: 'Hold 10s', cue: 'Point toes, squeeze glutes.' },
      { name: 'Full Back Lever', req: { pullups: 15, dips: 25, plank: 90 }, goal: 'Hold 10s', cue: 'Hollow-to-straight body line.' },
    ],
  },
  {
    id: 'muscle-up', name: 'Muscle-Up', type: 'Dynamic', equipment: 'Pull-up bar or rings',
    summary: 'Explosive pull that transitions over the bar into a dip. Combines pulling power and pushing strength.',
    steps: [
      { name: 'Explosive Pull-Ups', req: { pullups: 8, dips: 10 }, goal: '5 reps chin well over bar', cue: 'Accelerate hard from the bottom.' },
      { name: 'Chest-to-Bar Pull-Ups', req: { pullups: 10, dips: 12 }, goal: '5 clean reps', cue: 'Touch the sternum to the bar.' },
      { name: 'Straight Bar Dips', req: { pullups: 10, dips: 15 }, goal: '10 reps', cue: 'Lean over the bar, elbows back.' },
      { name: 'Negative Muscle-Up', req: { pullups: 12, dips: 15 }, goal: '5 slow negatives (5s)', cue: 'Control the transition on the way down.' },
      { name: 'Strict Bar Muscle-Up', req: { pullups: 12, dips: 18 }, goal: '3 strict reps', cue: 'Pull to the waist, snap wrists over.' },
      { name: 'Ring Muscle-Up', req: { pullups: 15, dips: 20 }, extra: 'false grip hang 30s', goal: '3 reps', cue: 'False grip, rings close to the body.' },
    ],
  },
  {
    id: 'human-flag', name: 'Human Flag', type: 'Static', equipment: 'Vertical pole or stall bars',
    summary: 'Body held horizontally on a vertical pole. Top arm pulls, bottom arm pushes, obliques brace.',
    steps: [
      { name: 'Side Plank Mastery', req: { plank: 60, pushups: 15 }, extra: '60s side plank each side', goal: 'Hold 60s each side', cue: 'Stack hips, push the floor away.' },
      { name: 'Vertical Flag', req: { pullups: 10, pushups: 25 }, goal: 'Hold 15s', cue: 'Bottom arm locked and pushing.' },
      { name: 'Tuck Flag', req: { pullups: 12, plank: 90, dips: 12 }, goal: 'Hold 10s', cue: 'Knees tucked, hips high.' },
      { name: 'Straddle Flag', req: { pullups: 15, dips: 15 }, goal: 'Hold 8s', cue: 'Open the legs, keep shoulders stacked.' },
      { name: 'Full Human Flag', req: { pullups: 18, pushups: 40, dips: 20 }, goal: 'Hold 5s', cue: 'Legs together, straight line.' },
    ],
  },
  {
    id: 'bar-gainer', name: 'Bar Gainer Dismount', type: 'Dynamic', equipment: 'High bar, crash mats, spotter',
    summary: 'A backward flipping release from a bar swing landing on the feet. An advanced acrobatic dismount.',
    warning: 'Learn only with a qualified coach, crash mats and a spotter. Head and neck injury risk is serious.',
    steps: [
      { name: 'Controlled Hollow-Arch Swing', req: { pullups: 5, hlr: 5 }, goal: '10 controlled swings', cue: 'Swing from the shoulders, not the hips.' },
      { name: 'Tap Swing', req: { pullups: 8, hlr: 8 }, goal: '10 rhythmic taps', cue: 'Arch behind, snap to hollow in front.' },
      { name: 'Floor Back Tuck (spotted)', req: { slsquat: 3, plank: 60 }, extra: 'coach sign-off', goal: '5 spotted back tucks', cue: 'Jump up first, then tuck.' },
      { name: 'Swing Release to Mat', req: { pullups: 10, hlr: 10 }, goal: '5 clean releases landing on feet', cue: 'Release at the top of the front swing.' },
      { name: 'Spotted Bar Gainer', req: { pullups: 12, hlr: 12 }, goal: '5 spotted reps', cue: 'Release, tuck tight, spot the landing.' },
      { name: 'Solo Bar Gainer', req: { pullups: 12, hlr: 12 }, extra: 'coach approval', goal: 'Consistent landings onto mats', cue: 'Commit fully to the rotation.' },
    ],
  },
];
