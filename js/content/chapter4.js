// Chapter 4 — Archbishop Thomas Cranmer, 1541–1547: "Surviving Henry"
import { henryLook } from './chapter1.js';

const talked = (s, id) => !!s.flags['talked_' + id];
const p1 = (s) => !s.flags.phase2;
const p2 = (s) => !!s.flags.phase2;

const morice = { robe: '#3a3a3a', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#4a4a4a', bg: '#3a3a3a' };

export default {
  id: 4,
  advisor: 'Archbishop Thomas Cranmer',
  short: 'Cranmer',
  title: 'Surviving Henry',
  years: '1541–1547',
  you: { robe: '#f0ece2', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#111', trim: '#1a1a1a', bg: '#2a3a5a' },
  era: { greatHall: 'new', clock: true, haInitials: true },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 55 },

  intro: [
    { title: 'All Saints\' Day, 1541', text: 'You are <b>Thomas Cranmer</b>, Archbishop of Canterbury — the most important churchman in England. You are a gentle, careful man who believes in the new Protestant ideas.<br><br>You have a secret: you are <b>married</b>! Priests were not allowed to marry, so you keep your wife hidden.' },
    { title: 'An old, ill King', text: 'King Henry is now 50. An old jousting wound on his leg causes him terrible pain, and he has grown very large.<br><br>Last year he married <b>Catherine Howard</b>, a lively young cousin of Anne Boleyn. Henry calls her his <b>"rose without a thorn"</b>. He seems happier than he has been for years.' },
    { title: 'Look up!', text: 'Notice the brand-new <b>astronomical clock</b> on Anne Boleyn\'s Gateway. Made in 1540, it shows the Sun going around the Earth — because that is what most people believed in Tudor times!<br><br>Now, the King has called for you. Go to the <b>Privy Chamber</b>.' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 50', look: henryLook(1.55, '#a07850'), pos: [47.2, 0], yaw: -Math.PI / 2, when: p1,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.flags.letterDelivered ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'My lord Archbishop! Welcome, welcome. Ah — forgive me if I do not stand. This cursed leg…', next: 'b' },
          b: { text: 'But I am a happy man, Cranmer! Today I have ordered prayers of thanks to God for my good life with Catherine. My rose without a thorn!', choices: [
            { t: '"God bless Your Majesty and the Queen."', fx: { favour: 4 }, next: 'c' },
            { t: '"How is your leg, Majesty? Should you rest?"', fx: { favour: -2, honesty: 4 }, next: 'c2' },
          ] },
          c: { text: 'Thank you, my friend. You are one of the few men at court I truly trust.', next: 'd' },
          c2: { text: 'REST? I am the King of England, not some old grandmother! …Forgive me. The pain makes me angry.', next: 'd' },
          d: { text: 'Now, go — your secretary Morice has been looking for you all morning. He seemed very worried about something.', set: 'metHenry' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Cranmer! Is something wrong? You look pale. Come, enjoy the day!' } } },
        audience: { start: 'a', nodes: {
          a: { text: '(The King holds your letter. His hands are shaking.) Cranmer… is this true? My Catherine? My rose?', choices: [
            { t: '"I pray it is not, Majesty. That is why it must be looked into carefully."', fx: { favour: 4, honesty: 4 }, next: 'b' },
            { t: '"I am afraid the evidence is strong, Majesty."', fx: { honesty: 6 }, next: 'b' },
          ] },
          b: { text: 'I do not believe it. I WILL not believe it! …Find out the truth, Archbishop. Quietly. Tell no one.', next: 'c' },
          c: { who: 'narrator', text: 'The investigation found the stories were true. It is said that when Henry heard, he wept in front of his council. He never saw Catherine again.', next: 'd' },
          d: { who: 'narrator', text: 'Two years pass… It is now July 1543. You are in the Chapel Royal at Hampton Court — for another royal wedding!', set: 'phase2', teleport: [13.5, -25, -Math.PI / 2] },
        } },
      },
    },
    {
      id: 'morice', name: 'Ralph Morice', role: 'Your secretary', look: morice, pos: [5.5, 19.5], yaw: -2.4, when: (s) => p1(s) && s.flags.metHenry,
      dialogue: (s) => (talked(s, 'morice') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'My lord! Thank goodness. A man called John Lascelles came here this morning. He told me something terrible about the Queen.', next: 'b' },
          b: { text: 'His sister worked in the house where Queen Catherine grew up. She says that before the Queen married the King, she had boyfriends — and promised to marry one of them.', next: 'c' },
          c: { text: 'And now there are whispers that the Queen has been meeting secretly with one of the King\'s gentlemen, Thomas Culpeper. If that is true, it is TREASON.', fact: 'In Tudor times, it was treason for a queen to have a secret relationship with another man. Treason was punished by death.', next: 'd' },
          d: { text: 'My lord, if you tell the King, he will be heartbroken — and furious. But if you say nothing and he finds out later, you will be in danger too. What will you do?', choices: [
            { t: '"First, I must find out if it is true. Gossip is not evidence."', fx: { honesty: 6 }, next: 'e' },
            { t: '"I will tell the King immediately!"', fx: { favour: -2 }, next: 'e2' },
            { t: '"Let us pretend we never heard this."', fx: { honesty: -10 }, next: 'e3' },
          ] },
          e: { text: 'Wise, my lord. I have left Lascelles\'s statement on the table. They say a letter from the Queen was found in Culpeper\'s lodgings in Base Court. And do speak to the Duke of Norfolk — he is her uncle.', set: 'missionGiven' },
          e2: { text: 'Without proof, my lord? The King may not believe you. Find evidence first! Lascelles\'s statement is on the table, and they say a letter from the Queen was found in Culpeper\'s lodgings in Base Court.', set: 'missionGiven' },
          e3: { text: 'My lord… if this comes out, and the King learns that you knew? We must find out the truth. Lascelles\'s statement is on the table, and a letter from the Queen was found in Base Court.', set: 'missionGiven' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Be careful, my lord. Find the truth, then write to the King. You can use the desk here.' } } },
      },
    },
    {
      id: 'howard', name: 'Queen Catherine Howard', role: 'Queen of England', look: { female: true, robe: '#7a2a4a', hat: 'french', hatColor: '#222', hair: '#8a5a2a', trim: '#d9ab3c', bg: '#5a2a4a', scale: 0.95 },
      pos: [36, 32], yaw: Math.PI / 2, when: (s) => p1(s) && s.flags.missionGiven,
      dialogue: (s) => (talked(s, 'howard') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Oh, my lord Archbishop! Isn\'t it a lovely day? I have been dancing all morning. The King gave me these jewels — aren\'t they beautiful?', fact: 'Catherine Howard was probably only about 18 when she married Henry, who was nearly 50.', next: 'b' },
          b: { text: 'Henry is very kind to me. But he is so old, and his leg smells terrible… Oh! I should not have said that. Please don\'t tell him!', choices: [
            { t: '"Your Majesty, do you know a gentleman called Thomas Culpeper?"', fx: { honesty: 4 }, next: 'c' },
            { t: '"Your secret is safe with me, Your Majesty."', fx: { honesty: -2 }, next: 'c2' },
          ] },
          c: { text: '(Her smile disappears.) Thomas Culpeper? He is… one of the King\'s gentlemen. Why do you ask, my lord? Has somebody said something about me?', next: 'd' },
          c2: { text: 'Thank you! You are kind, for an Archbishop. Everyone at court is so serious.', next: 'd' },
          d: { text: 'I must go. My ladies are waiting. Good day, my lord.', fact: 'Catherine Howard was a cousin of Anne Boleyn and a niece of the Duke of Norfolk.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I am busy, my lord. Please excuse me.' } } },
      },
    },
    {
      id: 'norfolk', name: 'Thomas Howard, Duke of Norfolk', role: 'The Queen\'s uncle', look: { robe: '#2b2b4a', gown: '#5a3a1a', trim: '#d9ab3c', legs: '#222', hat: 'bonnet', hatColor: '#111', chain: true, width: 1.1, beard: '#cfc8b8', bg: '#2a2a4a' },
      pos: [-42, 8], yaw: Math.PI, when: (s) => p1(s) && s.flags.missionGiven,
      dialogue: (s) => (talked(s, 'norfolk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Archbishop. You are always poking about with your Bibles and your reforms. What do you want?', next: 'b' },
          b: { text: 'My niece? The Queen? What about her? I helped arrange her marriage to the King — and it has made our family very powerful.', choices: [
            { t: '"There are rumours about her, my lord."', fx: { honesty: 4 }, next: 'c' },
            { t: '"Nothing, my lord. Good day."', fx: {}, next: 'c2' },
          ] },
          c: { text: '(He goes pale.) Rumours? Listen to me, Cranmer. If my niece has been foolish, I knew NOTHING about it. Nothing! Do you understand?', fact: 'When Catherine Howard fell, the Duke of Norfolk quickly wrote to the King saying he knew nothing. He survived — just.' },
          c2: { text: 'Hmph. Churchmen. Always so mysterious.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I have nothing more to say to you, Archbishop.' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#b8b0a0', width: 1.35, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true, when: p1,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'My lord Archbishop! The King eats more meat than ever. Roast swan, venison, beef, pies… but hardly any vegetables!', fact: 'Rich Tudors ate huge amounts of meat. Vegetables were thought of as food for poor people.', next: 'b' },
          b: { text: 'The King\'s armourer told me the King\'s waist is now more than fifty inches around! He has to be carried up the stairs in a special chair.', fact: 'Henry\'s last suit of armour shows how large he became — his waist was about 52 inches (132 cm).' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Another forty pies for the King\'s supper, lads! Hurry!' } } },
      },
    },
    // ----- 1543: the wedding of Catherine Parr -----
    {
      id: 'henry2', name: 'King Henry VIII', role: 'King of England, aged 52', look: henryLook(1.62, '#b0a08a'), pos: [21.6, -26.4], yaw: -Math.PI / 2, when: p2,
      dialogue: (s) => (talked(s, 'henry2') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Cranmer, my old friend. Thank you for being here today. Kate is a wise and gentle woman. I think she will look after me well.', next: 'b' },
          b: { text: 'Now listen. Some of my councillors are plotting against you. They say you are a heretic and want to lock you in the Tower.', choices: [
            { t: '"Majesty, I have always been your loyal servant."', fx: { favour: 4, honesty: 2 }, next: 'c' },
            { t: '"Then I am ready to answer them, Majesty."', fx: { honesty: 4 }, next: 'c' },
          ] },
          c: { text: 'I know it. Here — take my ring. If they try to arrest you, show it to them. Then they will know that you are under MY protection.', fact: 'Henry really did give Cranmer his ring to protect him from his enemies on the Council.', next: 'd' },
          d: { who: 'narrator', text: 'You bow and take the King\'s ring. Of all Henry\'s chief advisors, you are the only one who will still be at his side at the end…', end: 'chapter' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Keep that ring safe, Cranmer.' } } },
      },
    },
    {
      id: 'parr', name: 'Queen Catherine Parr', role: 'Henry\'s sixth wife', look: { female: true, robe: '#8e1f22', hat: 'french', hatColor: '#222', hair: '#8a4a1a', trim: '#d9ab3c', bg: '#2a4a4a' },
      pos: [21.6, -23.6], yaw: -Math.PI / 2, when: p2,
      dialogue: (s) => (talked(s, 'parr') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Archbishop Cranmer. Thank you for coming to celebrate with us. I never expected to be queen, you know. I have been widowed twice already.', fact: 'Catherine Parr married Henry at Hampton Court on 12 July 1543. She had been married twice before.', next: 'b' },
          b: { text: 'I love to read and to write. I hope to publish a book of prayers one day — in English, so that everyone can read it.', fact: 'Catherine Parr was the first queen of England to publish a book under her own name.', next: 'c' },
          c: { text: 'And I want to bring the King\'s children together: Mary, Elizabeth and little Edward. They have had such sad, lonely lives. They should be a family.', fact: 'Catherine Parr helped Mary and Elizabeth get back their places in the line to the throne.', choices: [
            { t: '"That is a kind and wise plan, Your Majesty."', fx: { honesty: 2 } },
            { t: '"Be careful, Your Majesty. The court can be dangerous."', fx: { honesty: 4 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'I shall need all my wits to keep this King happy, Archbishop. Pray for me.' } } },
      },
    },
    {
      id: 'elizabeth', name: 'Lady Elizabeth', role: 'The King\'s daughter, aged 9', look: { female: true, robe: '#2a2a3a', hat: 'french', hatColor: '#111', hair: '#c0602a', trim: '#e8dcc0', scale: 0.72, bg: '#4a2a2a' },
      pos: [16, -21], yaw: Math.PI, when: p2, optional: true,
      dialogue: (s) => (talked(s, 'elizabeth') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Good day, my lord Archbishop. I am learning Latin, French and Italian. My new stepmother says she will help me with my lessons!', fact: 'Elizabeth, daughter of Anne Boleyn, was one of the best-educated girls in England. She later became Queen Elizabeth I.', next: 'b' },
          b: { text: 'Did you know, my lord? You are my godfather! My father says you were at my christening when I was a baby. One day, I will do great things.', fact: 'Cranmer was Elizabeth\'s godfather. She went on to rule England for 44 years, from 1558 to 1603.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I must practise my Latin now. Vale — that means goodbye!' } } },
      },
    },
  ],

  sources: [
    {
      id: 'lascelles', name: 'Statement of John Lascelles', kind: 'scroll', pos: [7.2, 18.2], area: 'Your Study', when: (s) => s.flags.missionGiven,
      date: 'October 1541', origin: 'Written down by your secretary from what John Lascelles said. Lascelles was a Protestant who disliked the Catholic Howard family.',
      text: 'Lascelles says his sister Mary saw the Queen\'s behaviour when she was a girl living in the old Duchess of Norfolk\'s house.',
      about: 'This is "second-hand" evidence — Lascelles is repeating what his sister told him. He also had a reason to want the Howard family to fall.',
      question: { q: 'Lascelles disliked the Howard family. What should Cranmer do with his evidence?', options: [
        { t: 'Ignore it completely — he is biased.', ok: false, why: 'Not quite. Biased evidence can still be true — but we must check it.' },
        { t: 'Check it carefully against other sources.', ok: true, why: 'Excellent — this is exactly what good historians (and investigators) do!' },
        { t: 'Believe every word of it.', ok: false, why: 'Be careful! Lascelles had a reason to want the Howards in trouble.' },
      ] },
    },
    {
      id: 'culpeper', name: 'The Queen\'s Letter to Culpeper', kind: 'letter', pos: [-36, -10], area: 'Base Court', when: (s) => s.flags.missionGiven,
      date: '1541', origin: 'A letter written by Queen Catherine herself, found among Thomas Culpeper\'s belongings in his lodgings.',
      text: '"…it makes my heart die to think that I cannot be always in your company… Yours as long as life endures, Katheryn."',
      about: 'This is the only letter written by Catherine Howard that survives today. You can still see it at the National Archives in London.',
      question: { q: 'Why is this letter such important evidence?', options: [
        { t: 'It is in the Queen\'s own words and handwriting.', ok: true, why: 'Yes — a primary source written by Catherine herself is very powerful evidence.' },
        { t: 'It was written by the King.', ok: false, why: 'No — it was written by Catherine, and signed "Katheryn".' },
        { t: 'It is a recipe for pies.', ok: false, why: 'Ha! No — it is a letter to Thomas Culpeper.' },
      ] },
    },
    {
      id: 'greatbible', name: 'The Great Bible', kind: 'book', pos: [9.5, -18.5], area: 'Chapel Royal', when: (s) => s.flags.missionGiven,
      date: '1539', origin: 'The first official Bible in English. You, Thomas Cranmer, wrote its preface (introduction).',
      text: 'The front page shows King Henry handing out the Bible to Cranmer and Cromwell, who pass it on to the people. The people shout "Vivat Rex!" — "Long live the King!"',
      about: 'Before this, church services and Bibles were in Latin, which most people could not understand. Now they could read or hear the Bible in their own language.',
      question: { q: 'Why was a Bible in English so important?', options: [
        { t: 'Ordinary people could understand it for themselves.', ok: true, why: 'Exactly! This was one of the biggest changes of the English Reformation.' },
        { t: 'It was shorter than the Latin Bible.', ok: false, why: 'No — it was the same Bible, just translated.' },
        { t: 'Only the King was allowed to read it.', ok: false, why: 'The opposite — it was placed in every church for everyone.' },
      ] },
    },
  ],

  spots: [
    { id: 'desk', label: 'Write your letter to the King', anchor: 'desk', action: 'letter', objective: 'letter' },
    { id: 'pew', label: 'Leave the letter on the King\'s seat', anchor: 'kingsPew', action: 'flag', objective: 'pew', set: 'letterDelivered',
      message: '2 November 1541. Early in the morning, you place your letter on the King\'s seat in the Chapel Royal. When Henry comes to pray, he will find it…' },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'morice', text: 'Find your secretary, Ralph Morice, in your study', done: (s) => talked(s, 'morice'), after: ['meet'], targets: ['npc:morice'] },
    { id: 'sources', text: 'Find 3 sources', done: (s) => ['lascelles', 'culpeper', 'greatbible'].every((k) => s.sources[k]), after: ['morice'], targets: ['source:lascelles', 'source:culpeper', 'source:greatbible'], count: (s) => ['lascelles', 'culpeper', 'greatbible'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'people', text: 'Speak to Queen Catherine Howard and the Duke of Norfolk', done: (s) => ['howard', 'norfolk'].every((k) => talked(s, k)), after: ['morice'], targets: ['npc:howard', 'npc:norfolk'], count: (s) => ['howard', 'norfolk'].filter((k) => talked(s, k)).length + '/2' },
    { id: 'cook', text: 'Bonus: Find out about the King\'s diet', done: (s) => talked(s, 'cook'), after: ['meet'], targets: ['npc:cook'], optional: true, hideWhen: p2 },
    { id: 'letter', text: 'Write your letter to the King at your desk', done: (s) => !!s.letter, after: ['sources', 'people'], targets: ['spot:desk'] },
    { id: 'pew', text: 'Leave the letter on the King\'s seat in the Chapel Royal', done: (s) => !!s.flags.letterDelivered, after: ['letter'], targets: ['spot:pew'] },
    { id: 'audience', text: 'Go to the King', done: (s) => !!s.flags.phase2, after: ['pew'], targets: ['npc:henry'] },
    { id: 'parr', text: 'Speak to the new Queen, Catherine Parr', done: (s) => talked(s, 'parr'), after: ['audience'], targets: ['npc:parr'] },
    { id: 'eliz', text: 'Bonus: Speak to Lady Elizabeth', done: (s) => talked(s, 'elizabeth'), after: ['audience'], targets: ['npc:elizabeth'], optional: true },
    { id: 'ring', text: 'Speak to the King', done: (s) => !!s.flags.chapterDone, after: ['parr'], targets: ['npc:henry2'] },
  ],

  letter: {
    to: 'King Henry VIII', title: 'A Letter to the King',
    intro: 'You must tell the King what you have discovered about the Queen. It is terrible news. Be gentle, use real evidence, and be careful — the King has a fierce temper!',
    parts: [
      { label: 'Greeting', options: [
        { t: 'Most dread and gracious Sovereign Lord,', score: 2, why: '"Dread" meant "deeply respected". A perfect start.' },
        { t: 'Henry, bad news!', score: 0, why: 'Much too blunt — and rude!' },
      ] },
      { label: 'How you begin', options: [
        { t: 'I write with great sorrow, because I know this news will hurt Your Majesty.', score: 2, why: 'Kind and careful — just like the real Cranmer.' },
        { t: 'Ha! Your new wife has fooled you!', score: 0, fx: { favour: -15 }, why: 'Never mock the King! This could cost you your head.' },
      ] },
      { label: 'Your evidence', options: [
        { t: 'Here is a letter in the Queen\'s own hand, written to Thomas Culpeper.', score: 2, needs: 'culpeper', why: 'Strong evidence: a primary source in her own words.' },
        { t: 'John Lascelles reports what his sister saw in the Queen\'s household.', score: 1, needs: 'lascelles', why: 'Useful, but second-hand — and Lascelles may be biased.' },
        { t: 'Everybody at court is gossiping about it.', score: 0, why: 'Gossip is not evidence!' },
      ] },
      { label: 'Your request', options: [
        { t: 'I ask that Your Majesty orders a careful investigation to find the truth.', score: 2, why: 'Fair and wise — find out the truth first.' },
        { t: 'Punish her at once!', score: 0, why: 'Cranmer believed in finding the truth first.' },
      ] },
      { label: 'Signing off', options: [
        { t: 'Your Majesty\'s most humble chaplain, Thomas Cranmer, Archbishop of Canterbury.', score: 2, why: 'Humble and correct.' },
        { t: 'Love from Tom.', score: 0, why: 'Not the time for jokes!' },
      ] },
    ],
    sent: 'You seal the letter. You cannot bear to say these words to the King\'s face, so you decide to leave it where only he will find it: on his seat in the Chapel Royal.',
  },

  history: [
    { year: '1542', icon: '🕯️', title: 'The fall of Catherine Howard', text: 'In February 1542, Catherine Howard was executed at the Tower of London. She was probably only about 19 years old.' },
    { year: '👻', icon: '👻', title: 'Legend or history?', text: 'A famous legend says Catherine escaped her guards and ran down a gallery at Hampton Court, screaming for the King. Some say her ghost still haunts the "Haunted Gallery". But there is no evidence this ever happened — it is a story, not history!' },
    { year: '1543', icon: '💍', title: 'A sixth wife', text: 'Henry married Catherine Parr at Hampton Court. She was clever and kind, and she brought Henry\'s three children together as a family.' },
    { year: '1546', icon: '📚', title: 'A narrow escape', text: 'Catherine Parr\'s enemies tried to have her arrested for her Protestant beliefs. She cleverly told Henry that she only argued with him to take his mind off his painful leg. He forgave her.' },
    { year: '1547', icon: '👑', title: 'The death of the King', text: 'Henry VIII died on 28 January 1547, aged 55. As he died, he held Cranmer\'s hand. His nine-year-old son became King Edward VI.' },
    { year: '1556', icon: '🕯️', title: 'Cranmer\'s end', text: 'Cranmer survived Henry. But Henry\'s Catholic daughter, Queen Mary I, had him put to death in 1556 for his Protestant beliefs.' },
  ],
  fate: 'Cranmer was the only one of the four advisors to survive Henry VIII. He was put to death in 1556 under Queen Mary I.',

  quiz: [
    { q: 'Where did Cranmer leave his letter for the King?', options: ['Under the King\'s pillow', 'On the King\'s seat in the Chapel Royal', 'In the Great Kitchens'], answer: 1, why: 'Cranmer left the letter on the King\'s seat in the Chapel Royal at Hampton Court.' },
    { q: 'What did Henry call Catherine Howard?', options: ['"My rose without a thorn"', '"My little bird"', '"My Spanish princess"'], answer: 0, why: 'Henry called her his "rose without a thorn".' },
    { q: 'Which wife survived Henry?', options: ['Catherine Howard', 'Jane Seymour', 'Catherine Parr'], answer: 2, why: 'Catherine Parr outlived Henry.' },
    { q: 'Why was the Great Bible important?', options: ['It was in English, so ordinary people could understand it', 'It was made of gold', 'Only bishops could read it'], answer: 0, why: 'The Great Bible was placed in every church, in English.' },
    { q: 'Who became king when Henry died in 1547?', options: ['Edward VI', 'Henry IX', 'Thomas Cromwell'], answer: 0, why: 'Henry\'s son Edward became King Edward VI, aged nine.' },
  ],
  reflection: 'Cranmer told the King terrible news by leaving a letter on his seat. Was this a good way to do it? What would you have done, and why?',
};
