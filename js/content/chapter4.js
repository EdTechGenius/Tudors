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
  you: { robe: '#f0ece2', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#111', trim: '#1a1a1a', bg: '#2a3a5a', photo: 'cranmer' },
  era: { greatHall: 'new', clock: true, haInitials: true },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 55 },

  intro: [
    { title: 'All Saints\' Day, 1541', text: 'You are <b>Thomas Cranmer</b>, Archbishop of Canterbury: the most important churchman in England. You are a gentle, thoughtful and careful man, and you secretly support the new Protestant ideas.<br><br>You also have a secret that could ruin you: you are <b>married</b>! Priests were not allowed to marry, so you keep your wife hidden away from the court.' },
    { title: 'An old, ill King', text: 'King Henry is now fifty years old. An old wound on his leg, from a jousting accident, causes him terrible pain and puts him in furious tempers, and he has grown very large.<br><br>Last year he married <b>Catherine Howard</b>, a lively young cousin of Anne Boleyn. Henry calls her his <b>"rose without a thorn"</b>, and he seems happier than he has been for many years.' },
    { title: 'Look up!', text: 'Notice the brand-new <b>astronomical clock</b> on Anne Boleyn\'s Gateway. Made in 1540, it shows the Sun travelling around the Earth, because that is what most people believed in Tudor times!<br><br>The King has sent for you. Make your way to the <b>Privy Chamber</b>.' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 50', look: henryLook(1.55, '#a07850'), pos: [47.2, 0], yaw: -Math.PI / 2, when: p1,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.flags.letterDelivered ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'My lord Archbishop! Welcome, welcome. You must forgive me if I do not stand up to greet you. This cursed leg of mine grows worse every winter.', next: 'b' },
          b: { text: 'But today I am a happy man, Cranmer! On this All Saints\' Day I have ordered prayers of thanks to God for my good life with Catherine. After so many troubles, He has finally given me a perfect wife: my rose without a thorn!', choices: [
            { t: '"God bless Your Majesty and the Queen."', fx: { favour: 4 }, next: 'c' },
            { t: '"How is your leg, Majesty? Perhaps you should rest."', fx: { favour: -2, honesty: 4 }, next: 'c2' },
          ] },
          c: { text: 'Thank you, my friend. You are one of the very few men at this court whom I truly trust. The others all want something from me.', next: 'd' },
          c2: { text: 'REST? I am the King of England, not some feeble old grandmother! …Forgive me, Cranmer. The pain makes me lose my temper.', next: 'd' },
          d: { text: 'Now, off you go. Your secretary Morice has been searching for you all morning, and he looked extremely worried about something.', set: 'metHenry' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Cranmer! Is something the matter? You look as pale as a ghost. Come, cheer up and enjoy the day!' } } },
        audience: { start: 'a', nodes: {
          a: { text: '(The King is holding your letter. His hands are trembling.) Cranmer… can this really be true? My Catherine? My rose?', choices: [
            { t: '"I pray that it is not, Majesty. That is why it must be looked into carefully."', fx: { favour: 4, honesty: 4 }, next: 'b' },
            { t: '"I am afraid that the evidence is strong, Majesty."', fx: { honesty: 6 }, next: 'b' },
          ] },
          b: { text: 'I do not believe it. I WILL not believe it! …Find out the truth, Archbishop. Do it quietly, and tell no one.', next: 'c' },
          c: { who: 'narrator', text: 'The investigation discovered that the stories were true. It is said that when Henry heard the news, he wept openly in front of his council. He never saw Catherine again.', next: 'd' },
          d: { who: 'narrator', text: 'Two years pass… It is now July 1543. You are standing in the Chapel Royal at Hampton Court, for yet another royal wedding!', set: 'phase2', teleport: [13.5, -25, -Math.PI / 2] },
        } },
      },
    },
    {
      id: 'morice', name: 'Ralph Morice', role: 'Your secretary', look: morice, pos: [5.5, 19.5], yaw: -2.4, when: (s) => p1(s) && s.flags.metHenry,
      dialogue: (s) => (talked(s, 'morice') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'My lord! Thank goodness you are here. A man called John Lascelles came to see you this morning, and he told me something truly terrible about the Queen.', next: 'b' },
          b: { text: 'His sister once worked in the household where Queen Catherine grew up. She says that, long before the Queen married the King, she had boyfriends, and even promised to marry one of them.', next: 'c' },
          c: { text: 'And that is not all. There are whispers that the Queen has been meeting secretly with one of the King\'s gentlemen, Thomas Culpeper. If that is true, my lord, it is TREASON.', fact: 'In Tudor times, it was treason for a queen to have a secret relationship with another man. Treason was punished by death.', next: 'd' },
          d: { text: 'You are in a terrible position, my lord. If you tell the King, he will be heartbroken, and furious with whoever brings the news. But if you say nothing, and he finds out later that you knew, you will be in danger too. What will you do?', choices: [
            { t: '"First, I must find out whether it is true. Gossip is not evidence."', fx: { honesty: 6 }, next: 'e' },
            { t: '"I will tell the King immediately!"', fx: { favour: -2 }, next: 'e2' },
            { t: '"Let us pretend we never heard any of this."', fx: { honesty: -10 }, next: 'e3' },
          ] },
          e: { text: 'A wise decision, my lord. I have left Lascelles\'s statement on the table. People say that a letter from the Queen was found in Culpeper\'s lodgings in Base Court. You should also speak to the Duke of Norfolk, because he is her uncle.', set: 'missionGiven' },
          e2: { text: 'Without any proof, my lord? The King may refuse to believe you, and then you will be the one in trouble! Find evidence first. Lascelles\'s statement is on the table, and they say a letter from the Queen was found in Culpeper\'s lodgings in Base Court.', set: 'missionGiven' },
          e3: { text: 'My lord… if this ever comes out, and the King learns that you knew all along? No, we must find out the truth. Lascelles\'s statement is on the table, and a letter from the Queen was found in Base Court.', set: 'missionGiven' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Be careful, my lord. Find out the truth, then write to the King. The desk here is ready for you.' } } },
      },
    },
    {
      id: 'howard', name: 'Queen Catherine Howard', role: 'Queen of England', look: { female: true, robe: '#7a2a4a', hat: 'french', hatColor: '#222', hair: '#8a5a2a', trim: '#d9ab3c', bg: '#5a2a4a', scale: 0.95, photo: 'howard' },
      pos: [36, 32], yaw: Math.PI / 2, when: (s) => p1(s) && s.flags.missionGiven,
      dialogue: (s) => (talked(s, 'howard') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Oh, my lord Archbishop! Isn\'t it a lovely day? I have been dancing with my ladies all morning. The King gave me these jewels yesterday. Aren\'t they the most beautiful things you have ever seen?', fact: 'Catherine Howard was probably only about 18 when she married Henry, who was nearly 50.', next: 'b' },
          b: { text: 'Henry is very generous to me. But he is so old, and his poor leg smells dreadful… Oh! I should never have said that. Please, please don\'t tell him!', choices: [
            { t: '"Your Majesty, do you know a gentleman called Thomas Culpeper?"', fx: { honesty: 4 }, next: 'c' },
            { t: '"Your secret is safe with me, Your Majesty."', fx: { honesty: -2 }, next: 'c2' },
          ] },
          c: { text: '(Her smile suddenly disappears.) Thomas Culpeper? He is… one of the King\'s gentlemen, that is all. Why do you ask, my lord? Has somebody been saying things about me?', next: 'd' },
          c2: { text: 'Thank you! You are very kind, for an Archbishop. Everyone at this court is so terribly serious.', next: 'd' },
          d: { text: 'I really must go now. My ladies are waiting for me. Good day, my lord.', fact: 'Catherine Howard was a cousin of Anne Boleyn and a niece of the Duke of Norfolk.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I am rather busy, my lord. Please excuse me.' } } },
      },
    },
    {
      id: 'norfolk', name: 'Thomas Howard, Duke of Norfolk', role: 'The Queen\'s uncle', look: { robe: '#2b2b4a', gown: '#5a3a1a', trim: '#d9ab3c', legs: '#222', hat: 'bonnet', hatColor: '#111', chain: true, width: 1.1, beard: '#cfc8b8', bg: '#2a2a4a' },
      pos: [-42, 8], yaw: Math.PI, when: (s) => p1(s) && s.flags.missionGiven,
      dialogue: (s) => (talked(s, 'norfolk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Archbishop. You are forever poking about with your Bibles and your reforms. What do you want with me now?', next: 'b' },
          b: { text: 'My niece? The Queen? What about her? I helped to arrange her marriage to the King, and it has made the Howard family more powerful than ever before.', choices: [
            { t: '"There are rumours about her, my lord."', fx: { honesty: 4 }, next: 'c' },
            { t: '"Nothing, my lord. Good day."', fx: {}, next: 'c2' },
          ] },
          c: { text: '(He turns pale.) Rumours? Listen to me very carefully, Cranmer. If my niece has been foolish, I knew NOTHING about it. Nothing at all! Do you understand me?', fact: 'When Catherine Howard fell, the Duke of Norfolk quickly wrote to the King to say that he had known nothing. He survived, but only just.' },
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
          a: { text: 'My lord Archbishop! The King eats more meat than ever before: roast swan, venison, beef, pies of every kind… but hardly a single vegetable!', fact: 'Rich Tudors ate huge amounts of meat. Vegetables were thought of as food for poor people.', next: 'b' },
          b: { text: 'The King\'s armourer told me that the King\'s waist now measures more than fifty inches around! Some days he cannot even climb the stairs, and his servants have to carry him up in a special chair.', fact: 'Henry\'s last suit of armour shows how large he became: his waist was about 52 inches (132 cm).' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Another forty pies for the King\'s supper, lads! Hurry up!' } } },
      },
    },
    // ----- 1543: the wedding of Catherine Parr -----
    {
      id: 'henry2', name: 'King Henry VIII', role: 'King of England, aged 52', look: henryLook(1.62, '#b0a08a'), pos: [21.6, -26.4], yaw: -Math.PI / 2, when: p2,
      dialogue: (s) => (talked(s, 'henry2') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Cranmer, my old friend. Thank you for being here today. Kate is a wise, gentle and learned woman. I believe she will look after me well in my old age.', next: 'b' },
          b: { text: 'Now listen carefully. Some of my councillors are plotting against you. They say that you are a heretic, and they want to lock you up in the Tower.', choices: [
            { t: '"Majesty, I have always been your loyal servant."', fx: { favour: 4, honesty: 2 }, next: 'c' },
            { t: '"Then I am ready to answer them, Majesty."', fx: { honesty: 4 }, next: 'c' },
          ] },
          c: { text: 'I know it. Here: take my ring. If they ever try to arrest you, show it to them. Then they will know that you are under MY protection, and they will not dare to touch you.', fact: 'Henry really did give Cranmer his ring to protect him from his enemies on the Council.', next: 'd' },
          d: { who: 'narrator', text: 'You bow and take the King\'s heavy gold ring. Of all Henry\'s chief advisors, you are the only one who will still be at his side at the very end…', end: 'chapter' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Keep that ring safe, Cranmer.' } } },
      },
    },
    {
      id: 'parr', name: 'Queen Catherine Parr', role: 'Henry\'s sixth wife', look: { female: true, robe: '#8e1f22', hat: 'french', hatColor: '#222', hair: '#8a4a1a', trim: '#d9ab3c', bg: '#2a4a4a', photo: 'parr' },
      pos: [21.6, -23.6], yaw: -Math.PI / 2, when: p2,
      dialogue: (s) => (talked(s, 'parr') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Archbishop Cranmer. Thank you for coming to celebrate with us. I never expected to become queen, you know. I have already been widowed twice.', fact: 'Catherine Parr married Henry at Hampton Court on 12 July 1543. She had been married twice before.', next: 'b' },
          b: { text: 'I love to read and to write. One day, I hope to publish a book of prayers, written in English, so that everyone can read and understand it, not only the scholars.', fact: 'Catherine Parr was the first queen of England to publish a book under her own name.', next: 'c' },
          c: { text: 'Most of all, I want to bring the King\'s children together: Mary, Elizabeth and little Edward. They have had such sad and lonely lives, and they deserve to be a real family.', fact: 'Catherine Parr helped Mary and Elizabeth to win back their places in the line to the throne.', choices: [
            { t: '"That is a kind and wise plan, Your Majesty."', fx: { honesty: 2 } },
            { t: '"Be careful, Your Majesty. The court can be a dangerous place."', fx: { honesty: 4 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'I shall need all my wits to keep this King happy, Archbishop. Please pray for me.' } } },
      },
    },
    {
      id: 'elizabeth', name: 'Lady Elizabeth', role: 'The King\'s daughter, aged 9', look: { female: true, robe: '#2a2a3a', hat: 'french', hatColor: '#111', hair: '#c0602a', trim: '#e8dcc0', scale: 0.72, bg: '#4a2a2a' },
      pos: [16, -21], yaw: Math.PI, when: p2, optional: true,
      dialogue: (s) => (talked(s, 'elizabeth') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Good day, my lord Archbishop. I am learning Latin, French and Italian with my tutors, and my new stepmother has promised to help me with my lessons!', fact: 'Elizabeth, daughter of Anne Boleyn, was one of the best-educated girls in England. She later became Queen Elizabeth I.', next: 'b' },
          b: { text: 'Did you know, my lord? You are my godfather! My father says that you were at my christening when I was a tiny baby. One day, I intend to do great things.', fact: 'Cranmer was Elizabeth\'s godfather. She went on to rule England for 44 years, from 1558 to 1603.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I must practise my Latin now. Vale: that means goodbye!' } } },
      },
    },
  ],

  sources: [
    {
      id: 'lascelles', name: 'Statement of John Lascelles', kind: 'scroll', pos: [7.2, 18.2], area: 'Your Study', when: (s) => s.flags.missionGiven,
      date: 'October 1541', origin: 'Written down by your secretary from what John Lascelles said. Lascelles was a Protestant who disliked the Catholic Howard family.',
      text: 'Lascelles says that his sister Mary saw the Queen\'s behaviour when she was a girl living in the old Duchess of Norfolk\'s house.',
      about: 'This is "second-hand" evidence: Lascelles is repeating what his sister told him. He also had a reason to want the Howard family to fall from power.',
      question: { q: 'Lascelles disliked the Howard family. What should Cranmer do with his evidence?', options: [
        { t: 'Ignore it completely, because Lascelles is biased.', ok: false, why: 'Not quite. Biased evidence can still be true, but we must check it.' },
        { t: 'Believe it, because Lascelles came to the Archbishop himself.', ok: false, why: 'Be careful! Coming forward does not make someone unbiased.' },
        { t: 'Check it carefully against other evidence before deciding.', ok: true, why: 'Excellent: this is exactly what good historians (and investigators) do!' },
        { t: 'Show it to the Queen and ask her to explain it.', ok: false, why: 'That might warn her before the truth was known. Checking other evidence comes first.' },
      ] },
    },
    {
      id: 'culpeper', name: 'The Queen\'s Letter to Culpeper', kind: 'letter', pos: [-36, -10], area: 'Base Court', when: (s) => s.flags.missionGiven,
      date: '1541', origin: 'A letter written by Queen Catherine herself, found among Thomas Culpeper\'s belongings in his lodgings.',
      text: '"…it makes my heart die to think that I cannot be always in your company… Yours as long as life endures, Katheryn."',
      about: 'This is the only letter written by Catherine Howard that survives today. You can still see it at the National Archives in London.',
      question: { q: 'Why is this letter such important evidence?', options: [
        { t: 'It was found in the Queen\'s own rooms by her ladies.', ok: false, why: 'No: it was found among Culpeper\'s belongings.' },
        { t: 'It was written by Culpeper, so it shows his true feelings.', ok: false, why: 'No: it was written by Catherine, and signed "Katheryn".' },
        { t: 'It was copied out by Cranmer, so it must be reliable.', ok: false, why: 'No: the original letter in Catherine\'s handwriting survives.' },
        { t: 'It is a primary source in the Queen\'s own words and hand.', ok: true, why: 'Yes: a letter written by Catherine herself is very powerful evidence.' },
      ] },
    },
    {
      id: 'greatbible', name: 'The Great Bible', kind: 'book', pos: [9.5, -18.5], area: 'Chapel Royal', when: (s) => s.flags.missionGiven, img: 'greatbible',
      date: '1539', origin: 'The first official Bible in English. You, Thomas Cranmer, wrote its preface (introduction) for the 1540 edition.',
      text: 'The title page shows King Henry handing out the Bible to Cranmer and Cromwell, who pass it on to the people. The people shout "Vivat Rex!", which means "Long live the King!"',
      about: 'Before this, church services and Bibles were in Latin, which most people could not understand. Now they could read the Bible, or hear it read aloud, in their own language.',
      question: { q: 'Why was a Bible in English so important?', options: [
        { t: 'It was the first Bible ever printed anywhere in Europe.', ok: false, why: 'No: Bibles had been printed in Germany since the 1450s.' },
        { t: 'People could read or hear it in their own language.', ok: true, why: 'Exactly! This was one of the biggest changes of the English Reformation.' },
        { t: 'It was cheaper, because it left out the Old Testament.', ok: false, why: 'No: it contained the whole Bible.' },
        { t: 'It was written by King Henry VIII himself.', ok: false, why: 'No: it was translated by scholars; Henry just appears on the title page.' },
      ] },
    },
  ],

  spots: [
    { id: 'desk', label: 'Write your letter to the King', anchor: 'desk', action: 'letter', objective: 'letter' },
    { id: 'pew', label: 'Leave the letter on the King\'s seat', anchor: 'kingsPew', action: 'flag', objective: 'pew', set: 'letterDelivered',
      message: '2 November 1541. Early in the morning, before anyone else arrives, you place your sealed letter on the King\'s seat in the Chapel Royal. When Henry comes to pray, he will find it…' },
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
    intro: 'You must tell the King what you have discovered about the Queen. It is terrible news. Be gentle, use real evidence, and be careful, because the King has a fierce temper! Then sign your letter with your quill.',
    parts: [
      { label: 'Greeting', options: [
        { t: 'Most dread and gracious Sovereign Lord,', score: 2, why: '"Dread" meant "deeply respected". A perfect start.' },
        { t: 'Henry, bad news!', score: 0, why: 'Much too blunt, and rude!' },
      ] },
      { label: 'How you begin', options: [
        { t: 'I write with great sorrow, because I know this news will hurt Your Majesty.', score: 2, why: 'Kind and careful, just like the real Cranmer.' },
        { t: 'Ha! Your new wife has fooled you!', score: 0, fx: { favour: -15 }, why: 'Never mock the King! This could cost you your head.' },
      ] },
      { label: 'Your evidence', options: [
        { t: 'Here is a letter in the Queen\'s own hand, written to Thomas Culpeper.', score: 2, needs: 'culpeper', why: 'Strong evidence: a primary source in her own words.' },
        { t: 'John Lascelles reports what his sister saw in the Queen\'s household.', score: 1, needs: 'lascelles', why: 'Useful, but second-hand, and Lascelles may be biased.' },
        { t: 'Everybody at court is gossiping about it.', score: 0, why: 'Gossip is not evidence!' },
      ] },
      { label: 'Your request', options: [
        { t: 'I ask that Your Majesty orders a careful investigation to find the truth.', score: 2, why: 'Fair and wise: find out the truth first.' },
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
    { img: 'howard', year: '1542', icon: '🕯️', title: 'The fall of Catherine Howard', text: 'In February 1542, Catherine Howard was executed at the Tower of London. She was probably only about 19 years old.' },
    { img: 'hauntedgallery', year: '👻', icon: '👻', title: 'Legend or history?', text: 'A famous legend says that Catherine escaped from her guards and ran down a gallery at Hampton Court, screaming for the King. Some people claim her ghost still haunts the "Haunted Gallery". But there is no evidence that this ever happened: it is a story, not history!' },
    { img: 'parr', year: '1543', icon: '💍', title: 'A sixth wife', text: 'Henry married Catherine Parr at Hampton Court. She was clever and kind, and she brought Henry\'s three children together as a family.' },
    { img: 'parrbook', year: '1546', icon: '📚', title: 'A narrow escape', text: 'Catherine Parr\'s enemies tried to have her arrested for her Protestant beliefs. She cleverly told Henry that she only argued with him to take his mind off the pain in his leg. He forgave her.' },
    { img: 'edward', year: '1547', icon: '👑', title: 'The death of the King', text: 'Henry VIII died on 28 January 1547, aged 55. As he died, he held Cranmer\'s hand. His nine-year-old son became King Edward VI.' },
    { img: 'cranmer', year: '1556', icon: '🕯️', title: 'Cranmer\'s end', text: 'Cranmer survived Henry. But Henry\'s Catholic daughter, Queen Mary I, had him put to death in 1556 because of his Protestant beliefs.' },
  ],
  fate: 'Cranmer was the only one of the four advisors to survive Henry VIII. He was put to death in 1556 under Queen Mary I.',

  quiz: [
    { type: 'mc', skill: 'retrieve', q: 'Which of Henry\'s wives was still married to him when he died in 1547?', options: ['Catherine of Aragon', 'Anne Boleyn', 'Jane Seymour', 'Anne of Cleves', 'Catherine Howard', 'Catherine Parr'], answer: 5, why: 'Catherine Parr was Henry\'s wife when he died. (Anne of Cleves was also still alive, but their marriage had been annulled in 1540.)' },
    { type: 'gap', skill: 'retrieve', text: 'In 1540 Henry married ___ Howard, a young cousin of Anne ___. He called her his "rose without a ___". In 1541, Archbishop Cranmer was told about her past by John ___. Cranmer wrote a letter and left it on the King\'s seat in the Chapel ___. The following year, Henry married his sixth wife, Catherine ___, at Hampton Court. She was the first queen of England to publish a ___ under her own name. Henry died in 1547, holding Cranmer\'s ___. His nine-year-old son became King ___ VI. Cranmer was later put to death in 1556, during the reign of Queen ___ I.',
      answers: ['Catherine', 'Boleyn', 'thorn', 'Lascelles', 'Royal', 'Parr', 'book', 'hand', 'Edward', 'Mary'],
      bank: ['Catherine', 'Boleyn', 'thorn', 'Lascelles', 'Royal', 'Parr', 'book', 'hand', 'Edward', 'Mary', 'Seymour', 'Culpeper', 'petal', 'ring', 'Elizabeth', 'letter'],
      why: 'Henry\'s last years were full of drama, and Cranmer saw it all.' },
    { type: 'match', skill: 'vocab', q: 'Match each word to its meaning.', pairs: [
      ['evidence', 'Information that helps to prove whether something is true'],
      ['biased', 'Favouring one side unfairly'],
      ['investigation', 'A careful search to find out the truth'],
      ['primary source', 'Something made at the time being studied'],
      ['chaplain', 'A priest who leads prayers for a person or household'],
    ], why: 'Cranmer had to think like a detective, and so do historians!' },
    { type: 'mc', skill: 'vocab', q: 'Cranmer\'s letter begins "Most dread Sovereign Lord". What did "dread" mean to the Tudors?', options: ['Tired and in poor health', 'Loved by ordinary people', 'Deeply respected and feared', 'Famous for being generous'], answer: 2, why: 'Today "dread" means fear, but to the Tudors it meant deep respect, with a little fear too!' },
    { type: 'mc', skill: 'infer', q: 'Why do you think Cranmer left a letter instead of telling the King face to face?', options: ['He wanted the Queen to read the letter before the King', 'He was busy preparing for the All Saints\' Day service', 'He did not want anyone to know he had found out', 'He feared the King\'s temper and wanted to break it gently'], answer: 3, why: 'Henry\'s temper was famous. A letter let Henry read the terrible news in private.' },
    { type: 'mc', skill: 'infer', q: 'The Duke of Norfolk says, "If my niece has been foolish, I knew NOTHING about it." What does this tell us about him?', options: ['He was completely certain that his niece was innocent of everything', 'He wanted to save himself, even if it meant abandoning her', 'He was planning to help his niece escape from England', 'He believed Cranmer himself had invented the rumours'], answer: 1, why: 'Norfolk cared most about saving himself and his power.' },
    { type: 'mc', skill: 'infer', q: 'Why did Henry give Cranmer his ring in 1543?', options: ['To show his enemies that Cranmer had the King\'s protection', 'To reward Cranmer for leading the wedding to Catherine Parr', 'To make Cranmer the new Lord Chancellor of all England', 'To return a ring that had once belonged to Cromwell'], answer: 0, why: 'Anyone who tried to arrest Cranmer would have to answer to the King himself.' },
    { type: 'order', skill: 'sequence', q: 'Put these events in the order they happened.', items: ['Henry marries Catherine Howard (July 1540)', 'Cranmer leaves his letter on the King\'s seat (November 1541)', 'Catherine Howard is executed (February 1542)', 'Henry marries Catherine Parr (July 1543)', 'Henry VIII dies (January 1547)'], why: 'These are the last years of Henry\'s reign.' },
    { type: 'write', skill: 'explain', q: 'Lascelles\'s statement and Catherine\'s own letter are both evidence. Explain which one is more reliable, and why.', model: 'Catherine\'s own letter is more reliable because it is a primary source written in her own words and handwriting. Lascelles\'s statement is second-hand, because he was repeating what his sister told him, and he disliked the Howard family, so he may have been biased.', checklist: ['I chose one source and said it was more reliable', 'I mentioned "primary source" or "her own words"', 'I mentioned bias or "second-hand" evidence'] },
    { type: 'mc', skill: 'predict', q: 'Edward VI was Protestant, but his older sister Mary was a devout Catholic. If Mary became queen, what might she do?', options: ['Give all of the monasteries\' land back to the poor people', 'Bring back the Catholic Church and punish Protestants', 'Make Cranmer the Archbishop of Canterbury for life', 'Ask Parliament to choose the next ruler for her'], answer: 1, why: 'Mary did become queen in 1553 and brought back Catholicism, which is why Cranmer was put to death in 1556.' },
    { type: 'write', skill: 'summarise', q: 'Summarise how Cranmer survived Henry VIII, when Wolsey, More and Cromwell did not.', model: 'Cranmer was careful, gentle and loyal. He made sure he had evidence before giving the King bad news, he told the truth kindly, and Henry trusted him so much that he gave Cranmer his ring for protection.', checklist: ['I mentioned that Cranmer was careful or honest', 'I mentioned the King\'s trust or the ring', 'I wrote in full sentences'] },
  ],
  reflection: 'Cranmer told the King terrible news by leaving a letter on his seat. Was this a good way to do it? What would you have done, and why?',
};
