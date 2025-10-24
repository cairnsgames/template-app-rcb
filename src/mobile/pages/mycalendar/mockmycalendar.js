const today = new Date();
today.setHours(0, 0, 0, 0);

export const mockEvents = [
  {
    id: '1',
    name: 'The Lion King - Broadway',
  startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000),
    duration: 150,
    type: 'booked',
  },
  {
    id: '2',
    name: 'Jazz Night at Blue Note',
  startTime: new Date(today.getTime() + 11 * 60 * 60 * 1000),
    duration: 120,
    type: 'wishlisted',
  },
  {
    id: '3',
    name: 'Symphony Orchestra',
  startTime: new Date(today.getTime() + 13 * 60 * 60 * 1000),
    duration: 90,
    type: 'wishlisted',
  },
  {
    id: '4',
    name: 'Hamilton - Musical',
  startTime: new Date(today.getTime() + 19 * 60 * 60 * 1000),
    duration: 165,
    type: 'booked',
  },
  {
    id: '5',
    name: 'Comedy Show - Kevin Hart',
  startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
    duration: 90,
    type: 'booked',
  },
  {
    id: '6',
    name: 'Rock Concert - Foo Fighters',
  startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    duration: 180,
    type: 'wishlisted',
  },
  {
    id: '7',
    name: 'Ballet - Swan Lake',
  startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
    duration: 135,
    type: 'booked',
  },
  {
    id: '8',
    name: 'Stand-up Comedy Night',
  startTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
    duration: 75,
    type: 'wishlisted',
  },
  {
    id: '9',
    name: 'Cirque du Soleil',
  startTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    duration: 120,
    type: 'booked',
  },
  {
    id: '10',
    name: 'Shakespeare in the Park',
  startTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
    duration: 150,
    type: 'wishlisted',
  },
  {
    id: '11',
    name: 'Opera - La Bohème',
  startTime: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
    duration: 180,
    type: 'booked',
  },
  {
    id: '12',
    name: 'Indie Music Festival',
  startTime: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    duration: 240,
    type: 'wishlisted',
  },
];
