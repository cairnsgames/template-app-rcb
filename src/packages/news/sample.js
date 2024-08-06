import React from 'react';
import News from './news';

const exampleNewsItems = [
  {
    id: 1,
    image: 'images/100.jpg',
    title: 'Breaking News: Event A',
    body: 'Detailed description of the event A goes here. This includes all the pertinent information and insights.',
    date: '2024-08-01',
    author: 'Reporter One',
  },
  {
    id: 2,
    image: 'images/101.jpg',
    title: 'Latest Update: Event B',
    body: 'The latest updates and findings about event B are discussed here, providing a comprehensive overview.',
    date: '2024-08-02',
    author: 'Reporter Two',
  },
  {
    id: 3,
    image: 'images/102.jpg',
    title: 'Insightful Analysis: Event C',
    body: 'A deep dive into the implications and outcomes of event C, offering an analytical perspective.',
    date: '2024-08-03',
    author: 'Reporter Three',
  },
];

function NewsSample() {
  return (
      <News items={exampleNewsItems} />
  );
}

export default NewsSample;
