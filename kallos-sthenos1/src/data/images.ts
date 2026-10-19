// Free-to-use photos from Unsplash (unsplash.com/license), served from their image CDN.
// Only the ID is stored; size and format are picked at render time so phones download small files.

export const IMG = {
  // Tab banners
  workout: 'photo-1634225251578-d5f6ffced78a',
  nutrition: 'photo-1543352632-5a4b24e4d2a6',
  skills: 'photo-1678387995796-ba65b52e159a',
  library: 'photo-1635031520206-2bbe2dfa4d68',
  rehab: 'photo-1661751462825-1b7f1a93d641',
  progress: 'photo-1536922246289-88c42f957773',
} as const;

export const DAY_IMG: Record<string, string> = {
  Push: 'photo-1593455026613-e30bfc0a54a9',
  Pull: 'photo-1634225251578-d5f6ffced78a',
  Legs: 'photo-1536922246289-88c42f957773',
  Upper: 'photo-1595554919371-7e38f2558855',
  Lower: 'photo-1454486837617-ce8e1ba5ebfe',
  'Full Body': 'photo-1598266663439-2056e6900339',
  Rest: 'photo-1552196527-bffef41ef674',
};

export const MEAL_IMG: Record<string, string> = {
  Breakfast: 'photo-1497888329096-51c27beff665',
  Lunch: 'photo-1783196736260-dd788dff4132',
  Dinner: 'photo-1539136788836-5699e78bfc75',
  Snack: 'photo-1559826521-abd2bdc6d026',
};

// Only skills with a photo that actually matches the movement
export const SKILL_IMG: Record<string, string> = {
  handstand: 'photo-1634225252941-66fd95aaa7c3',
  'muscle-up': 'photo-1634225251578-d5f6ffced78a',
  'front-lever': 'photo-1595554919371-7e38f2558855',
  'back-lever': 'photo-1571726656333-2640ca759d22',
  lsit: 'photo-1516082669438-2d2bb5082626',
  'bar-gainer': 'photo-1704375058325-e51b6382a95d',
};

export const REHAB_IMG: Record<string, string> = {
  wrists: 'photo-1600026453194-11ae289732b8',
  elbows: 'photo-1516082669438-2d2bb5082626',
  shoulders: 'photo-1661751462825-1b7f1a93d641',
  'rotator-cuff': 'photo-1645005512968-0c1fe99f0093',
  'lower-back': 'photo-1663012948067-0478e4f9d9c6',
  knees: 'photo-1649751361457-01d3a696c7e6',
  'ankles': 'photo-1607962837359-5e7e89f86776',
};

export const imgUrl = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=60`;
