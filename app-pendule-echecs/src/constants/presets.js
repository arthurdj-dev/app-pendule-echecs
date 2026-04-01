export const PRESETS = [
  { label: 'Bullet',   modes: [
    { name: '1 + 0',  time: 60,   increment: 0 },
    { name: '2 + 1',  time: 120,  increment: 1 },
  ]},
  { label: 'Blitz',   modes: [
    { name: '3 + 2',  time: 180,  increment: 2 },
    { name: '5 + 0',  time: 300,  increment: 0 },
    { name: '5 + 3',  time: 300,  increment: 3 },
  ]},
  { label: 'Rapide',  modes: [
    { name: '10 + 0', time: 600,  increment: 0 },
    { name: '15 + 10',time: 900,  increment: 10 },
  ]},
  { label: 'Classique', modes: [
    { name: '30 + 0', time: 1800, increment: 0 },
  ]},
];