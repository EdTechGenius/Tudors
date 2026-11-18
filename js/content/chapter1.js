// Chapter 1 — Cardinal Thomas Wolsey, 1527–1529: "The King's Great Matter"
export const henryLook = (width, beard = '#b5651d') => ({
  robe: '#8e1f22', gown: '#3a2414', trim: '#d9ab3c', legs: '#f2efe4', hat: 'bonnet', hatColor: '#151515', feather: '#f5f2ea', jewel: true,
  beard, hair: beard, width, sleeves: '#c9a43b', bg: '#5a1a1a', chain: true,
});

const talked = (s, id) => !!s.flags['talked_' + id];

export default {
  id: 1,
  advisor: 'Cardinal Thomas Wolsey',
  short: 'Wolsey',
  title: 'The King\'s Great Matter',
  years: '1527–1529',
  you: { robe: '#a51d22', long: true, hat: 'cardinal', hatColor: '#a51d22', trim: '#f2efe4', width: 1.25, bg: '#5a1a1a' },
  era: { greatHall: 'old', clock: false, haInitials: false },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 55, honesty: 50 },

  intro: [
    { title: 'The year is 1527…', text: 'You are <b>Cardinal Thomas Wolsey</b>, Lord Chancellor of England. After the King, you are the most powerful man in the country.<br><br>You were born the son of a butcher in Ipswich, but you rose to the top through hard work and cleverness. You even built <b>Hampton Court Palace</b> — the grandest house in England.' },
    { title: 'The King has a problem', text: 'King Henry VIII has been married to <b>Catherine of Aragon</b> for 18 years. They have one surviving child — a daughter, <b>Princess Mary</b>.<br><br>Henry is desperate for a <b>son</b> to become king after him. He has also fallen in love with a lady of the court called <b>Anne Boleyn</b>.' },
    { title: 'Your mission', text: 'Henry wants the <b>Pope</b> — the head of the Catholic Church in Rome — to <b>annul</b> his marriage. That means declaring it was never a true marriage at all.<br><br>Only the Pope can do this. Can you persuade him? The King is waiting for you in his <b>Privy Chamber</b>…' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 36', look: henryLook(1.12), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.letter ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Ah, Thomas! At last. I have not slept for worrying. Eighteen years I have been married to Catherine, and still no son to follow me on the throne.', next: 'b' },
          b: { text: 'I have been reading the Bible, and I believe God is punishing me. Catherine was married to my brother Arthur before me. Perhaps our marriage was never right in God\'s eyes.', next: 'c' },
          c: { text: 'So tell me, Thomas — will you get me my annulment from the Pope?', choices: [
            { t: '"Of course, Your Majesty. It will be done quickly!"', fx: { favour: 8, honesty: -8 }, next: 'd1' },
            { t: '"I will try my very best, Majesty, but it may not be easy."', fx: { favour: 2, honesty: 6 }, next: 'd2' },
            { t: '"Are you sure? The Queen has been a loyal wife."', fx: { favour: -10, honesty: 8 }, next: 'd3' },
          ] },
          d1: { text: 'Ha! That is what I like to hear. You have never failed me, Thomas.', next: 'e' },
          d2: { text: 'Not easy? You are the cleverest man in England. Make it easy.', next: 'e' },
          d3: { text: '(The King\'s face turns red.) Do NOT question me, Cardinal. My conscience troubles me, and it is your job to fix it.', next: 'e' },
          e: { text: 'Find EVIDENCE to prove my marriage is wrong. Speak to people at court. Then write to Pope Clement in Rome. Now go!', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: {
          a: { text: 'Well, Thomas? Have you written to the Pope yet? Search the palace for evidence, then write your letter at the desk in your study.' },
        } },
        audience: { start: 'a', nodes: {
          a: { text: 'Thomas! A messenger tells me your letter has reached Rome. Well? Will the Pope give me my annulment?', choices: [
            { t: '"Majesty, the Pope is sending Cardinal Campeggio to hear your case here in England."', fx: { favour: 6, honesty: 4 }, next: 'b' },
            { t: '"Yes, Majesty! It is as good as done!"', fx: { favour: 6, honesty: -10 }, next: 'b2' },
          ] },
          b: { text: 'A court here in England! Good. You and Campeggio will be the judges. You will not let me down, will you?', choices: [
            { t: '"I must be honest — the Pope is afraid of the Emperor, Catherine\'s nephew. He may delay."', fx: { favour: -4, honesty: 8 }, next: 'c1' },
            { t: '"I will not let you down, Majesty."', fx: { favour: 4, honesty: -2 }, next: 'c2' },
          ] },
          b2: { text: 'As good as done! I shall hold you to that promise, Thomas…', next: 'c2' },
          c1: { text: 'Afraid of the Emperor? Then the Pope had better become more afraid of ME. We shall see what happens, Thomas.', next: 'end' },
          c2: { text: 'Good. Then soon Anne will be my queen and I shall have my son. Do not fail me.', next: 'end' },
          end: { who: 'narrator', text: 'You bow and leave the Privy Chamber. Now, let us see what really happened…', end: 'chapter' },
        } },
      },
    },
    {
      id: 'catherine', name: 'Queen Catherine of Aragon', role: 'Queen of England', look: { female: true, robe: '#3b2a4a', hat: 'gable', hatColor: '#1a1a1a', trim: '#c9a43b', bg: '#5a2a2a' },
      pos: [36, 32], yaw: Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'catherine') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Cardinal Wolsey. I know why you are here. My husband wants to end our marriage.', choices: [
            { t: '"Your Majesty, the King believes your marriage was against God\'s law."', fx: { honesty: 4 }, next: 'b' },
            { t: '"I am only here to admire the garden, Your Majesty."', fx: { honesty: -6 }, next: 'b0' },
          ] },
          b0: { text: 'Do not play games with me, Cardinal. I have heard the whispers.', next: 'b' },
          b: { text: 'I was married to Arthur for only a few months before he died. We were very young. I came to Henry as a true wife, and the Pope gave his permission for our marriage.', next: 'c' },
          c: { text: 'I have been Henry\'s loyal wife and queen for eighteen years. My daughter Mary is a princess. I will NEVER agree that our marriage was false.', fact: 'Catherine of Aragon insisted her marriage to Henry was true and lawful, and she would never agree to an annulment.', next: 'd' },
          d: { text: 'And remember, Cardinal — my nephew is Emperor Charles V, the most powerful ruler in Europe. He will not let the Pope shame his family.', fact: 'Catherine\'s nephew, Emperor Charles V, ruled Spain, much of Italy and Germany, and the Netherlands.', choices: [
            { t: '"I understand, Your Majesty. I am sorry for your troubles."', fx: { honesty: 4 } },
            { t: '"The King will get what he wants, madam."', fx: { favour: 2, honesty: -2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'I pray every day that Henry will remember the love we once had. Leave me in peace, Cardinal.' } } },
      },
    },
    {
      id: 'anne', name: 'Lady Anne Boleyn', role: 'Lady of the court', look: { female: true, robe: '#1d1d2b', hat: 'french', hatColor: '#111', hair: '#2a1a10', trim: '#d9ab3c', bg: '#2a3a5a' },
      pos: [-8, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'anne') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Well, well. The great Cardinal Wolsey. Have you come to tell me the Pope has said yes at last?', choices: [
            { t: '"Not yet, my lady. These things take time."', fx: { honesty: 4 }, next: 'b' },
            { t: '"Very soon, my lady, very soon!"', fx: { honesty: -6 }, next: 'b' },
          ] },
          b: { text: 'Time! The King has waited long enough. I will not be just his sweetheart, Cardinal. If Henry wants me, he must make me his QUEEN.', fact: 'Anne Boleyn refused to be Henry\'s girlfriend — she would only accept him if she could be his wife and queen.', next: 'c' },
          c: { text: 'I have shown the King a book by William Tyndale. It says that a king answers only to God — not to the Pope! Perhaps Henry does not need the Pope at all…', fact: 'Anne showed Henry a book by William Tyndale which said kings, not popes, should be in charge in their own countries.', next: 'd' },
          d: { text: 'Some people say you are not really trying to help us, Cardinal. I would be careful, if I were you.', choices: [
            { t: '"I serve the King with all my heart, my lady."', fx: { favour: 2 } },
            { t: '"Are you threatening me?"', fx: { favour: -4, honesty: 2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Off you go, Cardinal. Write to your Pope. And do hurry.' } } },
      },
    },
    {
      id: 'cromwell', name: 'Thomas Cromwell', role: 'Your secretary', look: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, bg: '#3a3a3a' },
      pos: [5.5, 19.5], yaw: -2.4, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cromwell') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master! I have been sorting your papers. I hear the King has given you the hardest job in Christendom.', next: 'b' },
          b: { text: 'May I give advice? You must find the right evidence before you write to the Pope. I found a copy of the Pope\'s permission for the King\'s marriage — it is on the table here.', fact: 'In 1503, Pope Julius II gave special permission (a "dispensation") for Henry to marry his brother\'s widow, Catherine.', next: 'c' },
          c: { text: 'Search the Chapel Royal too. The King has been quoting the Bible — the book of Leviticus. And there is a portrait in the Great Hall of the Emperor, Catherine\'s nephew. Think about why he matters.', next: 'd' },
          d: { text: 'When you have your evidence, sit at your desk and write the letter. Choose your words carefully. The Pope is a powerful man — you must be polite!', fact: 'Thomas Cromwell started as Wolsey\'s servant. He was the son of a blacksmith from Putney.', choices: [
            { t: '"Thank you, Cromwell. You are a loyal servant."', fx: { honesty: 2 } },
            { t: '"Yes, yes. Get back to work."', fx: {} },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Remember, master: evidence first, then the letter. The desk is ready for you.' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#6a4a2a', width: 1.3, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Your Grace! Welcome to my kitchens. We cook two meals a day for around six hundred people at court!', fact: 'The Hampton Court kitchens fed around 600 people at court, twice a day.', next: 'b' },
          b: { text: 'Shall I tell you some gossip? The King has been sending meat from the royal table to Mistress Anne Boleyn\'s rooms. And people say he writes her love letters!', fact: 'Henry wrote love letters to Anne Boleyn. Seventeen of them still survive today, in the Vatican Library in Rome.', choices: [
            { t: '"Gossip is not evidence, Master Cook!"', fx: { honesty: 2 } },
            { t: '"Tell me more…"', next: 'c' },
          ] },
          c: { text: 'They say the Queen sews the King\'s shirts herself, even now, though he hardly speaks to her. Poor lady.', fact: 'Even while Henry tried to end their marriage, Catherine continued to sew his shirts.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Mind the fires, Your Grace! Don\'t get soot on those fine red robes.' } } },
      },
    },
  ],

  sources: [
    {
      id: 'bible', name: 'The Bible: Leviticus', kind: 'book', pos: [21.5, -25], area: 'Chapel Royal',
      date: 'The Old Testament', origin: 'A holy book. This copy is in Latin, the language of the Church.',
      text: '"If a man shall take his brother\'s wife… they shall be childless." — Leviticus 20:21',
      about: 'Henry believed this verse explained why he had no son. But Catherine\'s supporters pointed to another part of the Bible (Deuteronomy) which said a man <i>should</i> marry his brother\'s widow!',
      question: { q: 'Why did Henry think this Bible verse helped him?', options: [
        { t: 'It seemed to explain why he had no son with Catherine.', ok: true, why: 'Yes! Henry believed God was punishing him for marrying his brother\'s widow.' },
        { t: 'It said the Pope must always obey kings.', ok: false, why: 'Not quite. This verse is about marrying your brother\'s wife.' },
        { t: 'It said that Spain was an enemy of England.', ok: false, why: 'No — the verse doesn\'t mention any countries.' },
      ] },
    },
    {
      id: 'charles', name: 'Portrait of Emperor Charles V', kind: 'portrait', pos: [-22.6, -31], rot: Math.PI / 2, area: 'Great Hall',
      date: 'Painted around 1520', origin: 'A portrait by a court painter, made to show how powerful the Emperor was.',
      portrait: ['#3a2a1a', '#222', '#111'],
      text: 'Charles V: Holy Roman Emperor, King of Spain — and nephew of Queen Catherine of Aragon.',
      about: 'In May 1527, Charles\'s army attacked Rome. Pope Clement VII was trapped and became, in effect, the Emperor\'s prisoner.',
      question: { q: 'Why would the Pope be afraid to annul Catherine\'s marriage?', options: [
        { t: 'Because Catherine\'s nephew, the Emperor, controlled Rome.', ok: true, why: 'Exactly. Upsetting the Emperor\'s aunt could be very dangerous for the Pope.' },
        { t: 'Because the Pope had never heard of England.', ok: false, why: 'The Pope knew all about England — Henry had once been given the title "Defender of the Faith" by a Pope!' },
        { t: 'Because Catherine was the Pope\'s sister.', ok: false, why: 'No — Catherine was the Emperor\'s aunt, not the Pope\'s sister.' },
      ] },
    },
    {
      id: 'dispensation', name: 'The Pope\'s Permission (1503)', kind: 'scroll', pos: [7.2, 18.2], area: 'Your Study',
      date: '1503', origin: 'A document called a "dispensation", written by Pope Julius II.',
      text: '"…we allow Henry, Prince of Wales, to marry Catherine, widow of his brother Arthur…"',
      about: 'An earlier Pope had already given special permission for this marriage. To annul it, Pope Clement would have to say that the Pope before him had made a mistake.',
      question: { q: 'Why is this document a PROBLEM for Henry?', options: [
        { t: 'A Pope had already said the marriage was allowed.', ok: true, why: 'Right! Popes did not like saying that an earlier Pope had been wrong.' },
        { t: 'It proves Henry was never really king.', ok: false, why: 'No — it is about his marriage, not his crown.' },
        { t: 'It is written in French, so nobody can read it.', ok: false, why: 'Documents from the Pope were written in Latin, which educated people could read.' },
      ] },
    },
  ],

  spots: [
    { id: 'desk', label: 'Write your letter to the Pope', anchor: 'desk', action: 'letter', objective: 'letter' },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'sources', text: 'Find 3 pieces of evidence', done: (s) => ['bible', 'charles', 'dispensation'].every((k) => s.sources[k]), after: ['meet'], targets: ['source:bible', 'source:charles', 'source:dispensation'], count: (s) => ['bible', 'charles', 'dispensation'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'people', text: 'Speak to Catherine, Anne Boleyn and Cromwell', done: (s) => ['catherine', 'anne', 'cromwell'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:catherine', 'npc:anne', 'npc:cromwell'], count: (s) => ['catherine', 'anne', 'cromwell'].filter((k) => talked(s, k)).length + '/3' },
    { id: 'cook', text: 'Bonus: Visit the Great Kitchens', done: (s) => talked(s, 'cook'), after: ['meet'], targets: ['npc:cook'], optional: true },
    { id: 'letter', text: 'Write to the Pope at the desk in your study', done: (s) => !!s.letter, after: ['sources', 'people'], targets: ['spot:desk'] },
    { id: 'audience', text: 'Report back to the King', done: (s) => !!s.flags.chapterDone, after: ['letter'], targets: ['npc:henry'] },
  ],

  letter: {
    to: 'Pope Clement VII', title: 'A Letter to the Pope',
    intro: 'Build your letter to the Pope in Rome. Choose each part carefully: be polite, and use your evidence!',
    parts: [
      { label: 'Greeting', options: [
        { t: 'Most Holy Father,', score: 2, why: 'Perfect — this is the correct, respectful way to address the Pope.' },
        { t: 'Dear Pope,', score: 1, why: 'Too casual for the head of the Church!' },
        { t: 'Clement, listen to me!', score: 0, why: 'Very rude! The Pope would be offended.' },
      ] },
      { label: 'Your evidence', options: [
        { t: 'The Holy Bible says that a man must not marry his brother\'s wife (Leviticus 20:21), and the King has no son.', score: 2, needs: 'bible', why: 'Strong — you used evidence from the Bible.' },
        { t: 'The marriage was only allowed by Pope Julius, who was given wrong information.', score: 2, needs: 'dispensation', why: 'Clever — Wolsey and Henry really did argue that the 1503 permission was faulty.' },
        { t: 'The Queen is old and the King is bored of her.', score: 0, why: 'Unkind, and not a reason the Church would accept.' },
      ] },
      { label: 'Your request', options: [
        { t: 'We humbly ask that you send a cardinal to judge the case here in England.', score: 2, why: 'Excellent — this is just what Wolsey asked for, and the Pope agreed!' },
        { t: 'Do whatever the Emperor wants.', score: 0, why: 'That is the opposite of what Henry wants!' },
        { t: 'Annul the marriage at once, or England will leave the Church!', score: 1, needs: 'charles', why: 'A threat! Wolsey would never have written this — but in the end, Henry did leave the Catholic Church.' },
      ] },
      { label: 'Signing off', options: [
        { t: 'Your Holiness\'s most humble servant, Thomas, Cardinal of York.', score: 2, why: 'Humble and correct.' },
        { t: 'From Wolsey, who is very busy.', score: 0, why: 'Rude — never tell the Pope you are too busy for him!' },
      ] },
    ],
    sent: 'You fold the letter and press your seal into hot red wax. A messenger gallops away — it will take him about three weeks to reach Rome!',
  },

  history: [
    { year: '1528', icon: '🏰', title: 'A gift for the King', text: 'Worried about losing the King\'s favour, Wolsey gave Hampton Court Palace to Henry. Henry loved it and made it even bigger.' },
    { year: '1528', icon: '✉️', title: 'Cardinal Campeggio arrives', text: 'The Pope sent Cardinal Campeggio to England to judge the case with Wolsey. But secretly, the Pope told Campeggio to delay as long as possible.' },
    { year: '1529', icon: '⚖️', title: 'The court at Blackfriars', text: 'At a special court in London, Queen Catherine knelt before Henry and begged him to remember their years together. Then she walked out and refused to come back. Campeggio stopped the court and the case was sent back to Rome. Henry was furious!' },
    { year: '1529', icon: '📉', title: 'Wolsey falls from power', text: 'Henry blamed Wolsey. Anne Boleyn and Wolsey\'s enemies turned the King against him. Wolsey lost his job as Lord Chancellor and had to give up his palaces and riches.' },
    { year: '1530', icon: '🕯️', title: 'The end of Wolsey', text: 'Wolsey was arrested for treason. He fell ill and died at Leicester on his way to London. He is reported to have said: <i>"If I had served God as well as I have served the King, He would not have given me over in my grey hairs."</i>' },
  ],
  fate: 'Wolsey failed to get the annulment. He lost his power, was arrested for treason, and died on his way to London in 1530.',

  quiz: [
    { q: 'Who was Henry VIII\'s first wife?', options: ['Anne Boleyn', 'Catherine of Aragon', 'Jane Seymour'], answer: 1, why: 'Catherine of Aragon married Henry in 1509.' },
    { q: 'Why did Henry want to end his first marriage?', options: ['He wanted to move to Spain', 'He wanted a son to be the next king', 'Catherine wanted to be a nun'], answer: 1, why: 'Henry was desperate for a male heir — and he had fallen in love with Anne Boleyn.' },
    { q: 'Who did Henry need to agree to annul his marriage?', options: ['The Pope', 'The Mayor of London', 'The King of France'], answer: 0, why: 'At this time, England was a Catholic country, and only the Pope could annul a marriage.' },
    { q: 'Why wouldn\'t the Pope agree?', options: ['Henry had not paid him', 'He had never met Henry', 'Catherine\'s nephew, Emperor Charles V, controlled Rome'], answer: 2, why: 'The Pope was in the power of Charles V, Catherine\'s nephew.' },
    { q: 'What happened to Wolsey?', options: ['He became king', 'He lost his power and died on his way to face trial', 'He retired happily to Hampton Court'], answer: 1, why: 'Wolsey fell from power in 1529 and died in 1530.' },
  ],
  reflection: 'Wolsey was clever and powerful, but he still could not give Henry what he wanted. Do you think it was fair that Henry blamed Wolsey? Explain your answer.',
};
