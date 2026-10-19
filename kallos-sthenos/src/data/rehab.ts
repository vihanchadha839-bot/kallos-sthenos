export interface Protocol {
  id: string;
  name: string;
  biomechanics: string;
  commonIssues: string[];
  warmup: { name: string; dose: string }[];
  regressions: { from: string; to: string }[];
  load: string[];
  redFlags: string[];
}

export const PROTOCOLS: Protocol[] = [
  {
    id: 'wrists', name: 'Wrists',
    biomechanics: 'Calisthenics loads the wrist in deep extension (push-ups, planche, handstands), often 90° or more under full bodyweight. The radiocarpal joint, forearm flexors and the TFCC on the pinky side absorb that load, so mobility and gradual tissue conditioning both matter.',
    commonIssues: ['Pain on the back of the wrist in deep extension', 'Pinky-side (ulnar) pain from rotation', 'Forearm flexor tightness'],
    warmup: [
      { name: 'Wrist circles', dose: '10 each direction' },
      { name: 'Kneeling palm-down rocks', dose: '10 slow rocks' },
      { name: 'Reverse-palm (fingers back) rocks', dose: '10 slow rocks' },
      { name: 'Fist push-up position hold', dose: '2 × 20s' },
      { name: 'Finger lift-offs in plank', dose: '10 reps' },
    ],
    regressions: [
      { from: 'Flat palm push-ups', to: 'Push-ups on parallettes or fists (neutral wrist)' },
      { from: 'Planche lean', to: 'Incline planche lean on a bench' },
      { from: 'Handstand on floor', to: 'Pike hold on parallettes' },
    ],
    load: ['Increase wrist extension volume by no more than 10% per week', 'Train planche or handstand on non-consecutive days', 'Pain up to 3/10 that settles within 24h is acceptable; above that, regress'],
    redFlags: ['Swelling or clicking with pain after a fall', 'Numbness or tingling in the fingers', 'Pain that wakes you at night'],
  },
  {
    id: 'elbows', name: 'Elbows',
    biomechanics: 'Straight-arm skills and high pull-up volume load the elbow tendons. The inner elbow (flexor tendon) gets stressed by gripping and pulling, the outer elbow by extensors, and the biceps tendon in levers. Tendons adapt slower than muscle, so volume jumps are the main cause of elbow pain.',
    commonIssues: ['Inner elbow pain from pull-ups (golfer\'s elbow)', 'Outer elbow pain from grip (tennis elbow)', 'Front of elbow pain from back lever or rings'],
    warmup: [
      { name: 'Band bicep curl, light', dose: '2 × 20' },
      { name: 'Wrist flexor and extensor curls (light band)', dose: '15 each' },
      { name: 'Forearm pronation/supination with stick', dose: '15 each way' },
      { name: 'Isometric elbow flexion hold at 90°', dose: '3 × 30s at 50% effort' },
    ],
    regressions: [
      { from: 'Pull-ups', to: 'Neutral grip or ring pull-ups (free rotation)' },
      { from: 'Back lever', to: 'Tuck German hang holds with bent knees' },
      { from: 'Straight-arm holds', to: 'Bent-arm versions for 2 to 3 weeks' },
    ],
    load: ['Use slow tempo (3s lowering) when symptomatic', 'Isometrics can reduce tendon pain short term', 'Avoid adding both new skills and more volume in the same week'],
    redFlags: ['Sudden pop with bruising at the front of the elbow', 'Locking or catching', 'Persistent numbness in the ring and pinky fingers'],
  },
  {
    id: 'shoulders', name: 'Shoulders',
    biomechanics: 'The shoulder trades stability for range. Overhead skills need full flexion with upward scapular rotation, while dips and Korean dips need extension. Healthy scapular control (serratus anterior and lower traps) keeps the humeral head centered so the joint isn\'t pinched.',
    commonIssues: ['Pinching at the top of overhead movements', 'Front shoulder pain at the bottom of dips', 'Scapular winging'],
    warmup: [
      { name: 'Band pull-aparts', dose: '2 × 15' },
      { name: 'Scapular push-ups', dose: '2 × 12' },
      { name: 'Wall slides with lift-off', dose: '10 reps' },
      { name: 'Scapular pull-ups', dose: '2 × 8' },
      { name: 'Arm circles small to big', dose: '10 each way' },
    ],
    regressions: [
      { from: 'Deep dips', to: 'Dips to 90° elbow or bench dips' },
      { from: 'Wall HSPU', to: 'Pike push-ups with limited range' },
      { from: 'Wide-grip pull-ups', to: 'Shoulder-width or neutral grip' },
    ],
    load: ['Balance pushing and pulling volume (roughly 1:1)', 'Keep 1 to 2 reps in reserve on overhead work', 'Add rear delt and external rotation work twice weekly'],
    redFlags: ['Inability to lift the arm after a fall', 'Feeling of the shoulder slipping out', 'Night pain lying on the side'],
  },
  {
    id: 'rotator-cuff', name: 'Rotator Cuff',
    biomechanics: 'Four small muscles (supraspinatus, infraspinatus, teres minor, subscapularis) keep the ball centered in the socket during every push, pull and hold. They fatigue before the big movers, so heavy ring work without cuff conditioning invites irritation.',
    commonIssues: ['Ache on the outside of the upper arm', 'Pain reaching behind the back', 'Weakness lifting the arm to the side'],
    warmup: [
      { name: 'Band external rotation (elbow at side)', dose: '2 × 15 each' },
      { name: 'Band internal rotation', dose: '2 × 15 each' },
      { name: 'Prone Y-T-W raises', dose: '8 each shape' },
      { name: 'Side-lying external rotation (no weight)', dose: '2 × 15' },
    ],
    regressions: [
      { from: 'Ring dips', to: 'Parallel bar dips' },
      { from: 'Ring push-ups', to: 'Floor push-ups' },
      { from: 'Skin the cat', to: 'Tuck hang holds' },
    ],
    load: ['Cuff work 2 to 3 times weekly, light and high rep', 'Stop sets if the shoulder feels unstable', 'Progress ring instability last, after strength on stable bars'],
    redFlags: ['Sudden weakness after a lift', 'Pain that keeps worsening over 2 weeks', 'Night pain'],
  },
  {
    id: 'lower-back', name: 'Lower Back',
    biomechanics: 'The lumbar spine is built for stability more than range. In calisthenics, back pain usually comes from arching during holds (handstands, levers, push-ups) or rounding under fatigue in hinges. Strong abs and glutes and a neutral pelvis protect it.',
    commonIssues: ['Ache after leg raises with an arched back', 'Tightness after long handstand practice', 'Pain bending forward'],
    warmup: [
      { name: 'Cat-cow', dose: '10 slow reps' },
      { name: 'Dead bug', dose: '2 × 8 each side' },
      { name: 'Bird dog', dose: '2 × 8 each side' },
      { name: 'Glute bridge', dose: '2 × 12' },
      { name: 'Side plank', dose: '2 × 20s each' },
    ],
    regressions: [
      { from: 'Lying leg raises', to: 'Reverse crunch or dead bug' },
      { from: 'Dragon flags', to: 'Tuck hollow holds' },
      { from: 'Arched handstands', to: 'Chest-to-wall handstands' },
    ],
    load: ['Prioritise anti-extension core work', 'Keep moving: gentle walking helps most back pain settle', 'Avoid long static holds when flared up'],
    redFlags: ['Numbness in the groin or saddle area', 'Loss of bladder or bowel control (seek emergency care)', 'Leg weakness or pain below the knee with numbness'],
  },
  {
    id: 'knees', name: 'Knees',
    biomechanics: 'Single-leg squats, pistols and jumps put high load through the patellar tendon and kneecap joint. Knee pain often comes from the knee caving inward (weak glute medius) or too much jumping volume too soon. The knee can safely travel past the toes when built up gradually.',
    commonIssues: ['Pain below the kneecap when jumping (patellar tendon)', 'Ache around the kneecap on stairs', 'Pain on the inside of the knee from caving'],
    warmup: [
      { name: 'Band lateral walks', dose: '2 × 12 steps each way' },
      { name: 'Wall sit (isometric)', dose: '3 × 30s' },
      { name: 'Slow step-downs', dose: '2 × 8 each' },
      { name: 'Terminal knee extensions (band)', dose: '2 × 15' },
      { name: 'Tibialis raises', dose: '2 × 15' },
    ],
    regressions: [
      { from: 'Pistol squats', to: 'Box pistols to a high bench' },
      { from: 'Jump squats', to: 'Tempo bodyweight squats' },
      { from: 'Sissy squats', to: 'Partial-range wall sits' },
    ],
    load: ['Wall sits and isometrics can calm tendon pain', 'Limit plyometrics to 2 sessions a week', 'Track knee alignment over the second toe'],
    redFlags: ['Swelling within hours of an injury', 'Knee giving way', 'Locking or unable to straighten'],
  },
  {
    id: 'ankles', name: 'Ankles / Achilles',
    biomechanics: 'The Achilles is the strongest tendon in the body and stores energy during jumps and landings. Ankle dorsiflexion range limits squat and pistol depth. Calf strength (especially the soleus) and controlled landings protect both.',
    commonIssues: ['Achilles stiffness in the morning', 'Heel lifting during squats (limited dorsiflexion)', 'Rolled ankles on landings'],
    warmup: [
      { name: 'Knee-to-wall ankle mobilisation', dose: '10 each side' },
      { name: 'Calf raises, slow', dose: '2 × 15' },
      { name: 'Bent-knee calf raises (soleus)', dose: '2 × 15' },
      { name: 'Single-leg balance', dose: '30s each, eyes closed if easy' },
      { name: 'Heel walks', dose: '20 steps' },
    ],
    regressions: [
      { from: 'Broad jumps', to: 'Calf raises and pogo hops' },
      { from: 'Single-leg calf raise off a step', to: 'Double-leg flat-ground calf raise' },
      { from: 'Pistol squats', to: 'Heel-elevated squats' },
    ],
    load: ['Heavy slow calf raises 3x weekly build tendon capacity', 'Morning stiffness lasting more than 30 minutes means reduce load', 'Land softly and quietly'],
    redFlags: ['A snap or kick feeling at the back of the heel', 'Unable to rise onto the toes', 'Severe swelling after a roll'],
  },
];
