export const mockData = {
  rooms: [
    {
      id: 1,
      name: 'General Discussion',
      unreadTopics: 5,
      topics: [
        {
          id: 1,
          title: 'Welcome to the Forum!',
          author: 'Admin',
          firstLine: 'This is the first post in the forum. the idea is to have lots of text here so that it crosses multiple lines and we cna check if all the lines are displayed of if we get an elippses instead.',
          content: 'Welcome to our new forum! Feel free to discuss anything here.',
          read: false, // Added read property
          comments: [
            { id: 1, author: 'User1', text: 'Excited to be here!', read: false },
            { id: 2, author: 'User2', text: 'Looking forward to the discussions!', read: false },
            { id: 3, author: 'User3', text: 'This is great!', read: false },
            { id: 4, author: 'User4', text: 'Can’t wait to join in!', read: false },
            { id: 5, author: 'User5', text: 'Hello everyone!', read: false },
            { id: 6, author: 'User6', text: 'What topics will we discuss?', read: false },
            { id: 7, author: 'User7', text: 'I have some ideas!', read: false },
            { id: 8, author: 'User8', text: 'Let’s talk about tech!', read: false },
            { id: 9, author: 'User9', text: 'I’m here for the memes!', read: false },
            { id: 10, author: 'User10', text: 'What’s everyone’s favorite topic?', read: false },
            { id: 11, author: 'User11', text: 'I love discussing movies!', read: false },
            { id: 12, author: 'User12', text: 'Books are my jam!', read: false },
            { id: 13, author: 'User13', text: 'I’m into gaming!', read: false },
            { id: 14, author: 'User14', text: 'Let’s share recommendations!', read: false },
            { id: 15, author: 'User15', text: 'I’m excited to learn!', read: false },
            { id: 16, author: 'User16', text: 'What about music?', read: false },
            { id: 17, author: 'User17', text: 'I love rock music!', read: false },
            { id: 18, author: 'User18', text: 'Jazz is the best!', read: false },
            { id: 19, author: 'User19', text: 'I’m a fan of classical!', read: false },
            { id: 20, author: 'User20', text: 'Let’s discuss our favorites!', read: false },
            { id: 21, author: 'User1', text: 'What about podcasts?', read: false },
            { id: 22, author: 'User2', text: 'I love true crime podcasts!', read: false },
            { id: 23, author: 'User3', text: 'I’m into comedy podcasts!', read: false },
            { id: 24, author: 'User4', text: 'Any recommendations?', read: false },
            { id: 25, author: 'User5', text: 'I listen to a lot of tech podcasts!', read: false },
            { id: 26, author: 'User6', text: 'I prefer storytelling ones!', read: false },
            { id: 27, author: 'User7', text: 'I’m here for the discussions!', read: false },
            { id: 28, author: 'User8', text: 'Let’s share our favorites!', read: false },
            { id: 29, author: 'User9', text: 'I love learning new things!', read: false },
            { id: 30, author: 'User10', text: 'What’s everyone’s favorite genre?', read: false },
            { id: 31, author: 'User11', text: 'I’m into sci-fi!', read: false },
            { id: 32, author: 'User12', text: 'Fantasy is my favorite!', read: false },
            { id: 33, author: 'User13', text: 'I love historical fiction!', read: false },
            { id: 34, author: 'User14', text: 'I’m a fan of thrillers!', read: false },
            { id: 35, author: 'User15', text: 'Let’s discuss our favorites!', read: false },
            { id: 36, author: 'User16', text: 'I love a good mystery!', read: false },
            { id: 37, author: 'User17', text: 'What about romance novels?', read: false },
            { id: 38, author: 'User18', text: 'I’m not a fan of romance!', read: false },
            { id: 39, author: 'User19', text: 'I prefer non-fiction!', read: false },
            { id: 40, author: 'User20', text: 'Let’s share our thoughts!', read: false },
            { id: 41, author: 'User1', text: 'What’s everyone reading now?', read: false },
            { id: 42, author: 'User2', text: 'I’m reading a great sci-fi book!', read: false },
            { id: 43, author: 'User3', text: 'I just finished a thriller!', read: false },
            { id: 44, author: 'User4', text: 'I’m reading a classic!', read: false },
            { id: 45, author: 'User5', text: 'I love re-reading my favorites!', read: false },
            { id: 46, author: 'User6', text: 'What’s your favorite book?', read: false },
            { id: 47, author: 'User7', text: 'I love The Great Gatsby!', read: false },
            { id: 48, author: 'User8', text: 'Pride and Prejudice is amazing!', read: false },
            { id: 49, author: 'User9', text: 'I’m a fan of 1984!', read: false },
            { id: 50, author: 'User10', text: 'Let’s discuss our favorites!', read: false },
            { id: 51, author: 'User11', text: 'What about graphic novels?', read: false },
            { id: 52, author: 'User12', text: 'I love them!', read: false },
            { id: 53, author: 'User13', text: 'They’re so much fun!', read: false },
            { id: 54, author: 'User14', text: 'I enjoy manga too!', read: false },
            { id: 55, author: 'User15', text: 'Let’s share our favorites!', read: false },
            { id: 56, author: 'User16', text: 'What’s everyone’s favorite graphic novel?', read: false },
            { id: 57, author: 'User17', text: 'I love Watchmen!', read: false },
            { id: 58, author: 'User18', text: 'Maus is a classic!', read: false },
            { id: 59, author: 'User19', text: 'I’m a fan of Sandman!', read: false },
            { id: 60, author: 'User20', text: 'Let’s discuss our favorites!', read: false },
            { id: 61, author: 'User1', text: 'What about webcomics?', read: false },
            { id: 62, author: 'User2', text: 'I love them!', read: false },
            { id: 63, author: 'User3', text: 'They’re so creative!', read: false },
            { id: 64, author: 'User4', text: 'Let’s share our favorites!', read: false },
            { id: 65, author: 'User5', text: 'What’s everyone’s favorite webcomic?', read: false },
            { id: 66, author: 'User6', text: 'I love xkcd!', read: false },
            { id: 67, author: 'User7', text: 'Sarah’s Scribbles is great!', read: false },
            { id: 68, author: 'User8', text: 'Let’s discuss our favorites!', read: false },
            { id: 69, author: 'User9', text: 'What about webtoons?', read: false },
            { id: 70, author: 'User10', text: 'I love them too!', read: false },
            { id: 71, author: 'User11', text: 'What’s everyone’s favorite webtoon?', read: false },
            { id: 72, author: 'User12', text: 'I’m a fan of Lore Olympus!', read: false },
            { id: 73, author: 'User13', text: 'Let’s share our favorites!', read: false },
            { id: 74, author: 'User14', text: 'What about comics in general?', read: false },
            { id: 75, author: 'User15', text: 'I love superhero comics!', read: false },
            { id: 76, author: 'User16', text: 'Let’s discuss our favorites!', read: false },
            { id: 77, author: 'User17', text: 'What’s everyone’s favorite superhero?', read: false },
            { id: 78, author: 'User18', text: 'I love Spider-Man!', read: false },
            { id: 79, author: 'User19', text: 'Batman is the best!', read: false },
            { id: 80, author: 'User20', text: 'Let’s discuss our favorites!', read: false },
            { id: 81, author: 'User1', text: 'What about villains?', read: false },
            { id: 82, author: 'User2', text: 'I love the Joker!', read: false },
            { id: 83, author: 'User3', text: 'Thanos is a great villain!', read: false },
            { id: 84, author: 'User4', text: 'Let’s discuss our favorites!', read: false },
            { id: 85, author: 'User5', text: 'What’s everyone’s favorite villain?', read: false },
            { id: 86, author: 'User6', text: 'I love Loki!', read: false },
            { id: 87, author: 'User7', text: 'Magneto is awesome!', read: false },
            { id: 88, author: 'User8', text: 'Let’s share our thoughts!', read: false },
            { id: 89, author: 'User9', text: 'What about anti-heroes?', read: false },
            { id: 90, author: 'User10', text: 'I love Deadpool!', read: false },
            { id: 91, author: 'User11', text: 'Wolverine is my favorite!', read: false },
            { id: 92, author: 'User12', text: 'Let’s discuss our favorites!', read: false },
            { id: 93, author: 'User13', text: 'What’s everyone’s favorite anti-hero?', read: false },
            { id: 94, author: 'User14', text: 'I love Venom!', read: false },
            { id: 95, author: 'User15', text: 'Let’s share our thoughts!', read: false },
            { id: 96, author: 'User16', text: 'What about team-ups?', read: false },
            { id: 97, author: 'User17', text: 'I love the Avengers!', read: false },
            { id: 98, author: 'User18', text: 'Justice League is awesome!', read: false },
            { id: 99, author: 'User19', text: 'Let’s discuss our favorites!', read: false },
            { id: 100, author: 'User20', text: 'What about crossovers?', read: false },
          ],
        },
        {
          id: 2,
          title: 'Forum Rules',
          author: 'Admin',
          firstLine: 'Please read the rules before posting.',
          content: 'Here are the rules of the forum...',
          read: false, // Added read property
          comments: [
            { id: 1, author: 'User3', text: 'Thanks for the info!', read: false },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Tech Talk',
      unreadTopics: 3,
      topics: [
        {
          id: 3,
          title: 'Latest Tech Trends',
          author: 'TechGuru',
          firstLine: 'Let’s discuss the latest in technology.',
          content: 'What are the latest trends in tech?',
          read: false, // Added read property
          comments: [],
        },
      ],
    },
  ],
};
