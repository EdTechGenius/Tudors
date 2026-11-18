// Chapter 2 — Sir Thomas More, 1529–1532: "Conscience or the Crown"
import { henryLook } from './chapter1.js';

const talked = (s, id) => !!s.flags['talked_' + id];

export default {
  id: 2,
  advisor: 'Sir Thomas More',
  short: 'More',
  title: 'Conscience or the Crown',
  years: '1529–1532',
  you: { robe: '#2a2a2a', gown: '#3a2a20', long: true, hat: 'cap', hatColor: '#111', trim: '#6a4a2a', chain: true, beard: null, width: 1.1, bg: '#2a3a2a' },
  era: { greatHall: 'building', clock: false, haInitials: false },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 55 },

  intro: [
    { title: 'Wolsey has fallen…', text: 'It is 1532. Cardinal Wolsey failed to get the King\'s annulment and lost everything. In his place, Henry chose <b>you</b>: <b>Sir Thomas More</b>, a lawyer, scholar and writer.<br><br>You are famous across Europe for your book <b>Utopia</b>. You are also a deeply religious Catholic.' },
    { title: 'The King\'s friend', text: 'Henry likes you. He has visited your house in Chelsea and walked in your garden with his arm around your neck.<br><br>But you have told your family: <i>"If my head could win him a castle in France, it would not fail to go."</i> You know how dangerous kings can be.' },
    { title: 'A dangerous idea', text: 'The Pope <b>still</b> will not annul Henry\'s marriage. So Henry has a new plan: if the Pope will not help, perhaps <b>the King</b> should become head of the Church in England instead!<br><br>As a Catholic, you believe the Pope is the head of the Church. Can you serve the King — <b>and</b> keep your conscience?' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 40', look: henryLook(1.2), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.letter ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Thomas! My good friend. Come, sit. You know what troubles me. Five years I have waited for the Pope, and he does NOTHING.', next: 'b' },
          b: { text: 'Cromwell tells me that Parliament could pass new laws. The priests of England would obey the King, not the Pope. I would be Supreme Head of the Church in England!', next: 'c' },
          c: { text: 'You are my Lord Chancellor, Thomas. I need you beside me. Will you support me?', choices: [
            { t: '"Majesty, I must think and pray about this. Give me a little time."', fx: { favour: -2, honesty: 6 }, next: 'd1' },
            { t: '"Of course, Majesty. Whatever you wish."', fx: { favour: 8, honesty: -10 }, next: 'd2' },
            { t: '"Majesty, I do not believe any king can be head of the Church."', fx: { favour: -12, honesty: 10 }, next: 'd3' },
          ] },
          d1: { text: 'Hmm. Pray, then. But do not take too long, Thomas.', next: 'e' },
          d2: { text: 'Ha! I knew I could count on you. Still… you look troubled. Go and speak to people. Then write to me with your answer.', next: 'e' },
          d3: { text: '(The room goes very quiet.) …I will pretend I did not hear that, Thomas. Go and think VERY carefully.', next: 'e' },
          e: { text: 'Speak to people at court. Read what you must. Then send me a letter with your true answer. I will be waiting.', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Still thinking, Thomas? Find out what others believe, then write your answer at your desk.' } } },
        audience: { start: 'a', nodes: {
          a: { text: 'I have read your letter, Thomas.', next: (s) => (s.flags.chose_resign ? 'r1' : 's1') },
          r1: { who: 'you', text: 'Majesty, I cannot agree, and so I cannot stay as your Lord Chancellor. Here is the Great Seal of England. I give it back to you.', next: 'r2' },
          r2: { text: '(Henry takes the heavy silver seal and looks at it for a long time.) You were my friend, Thomas. I hope you know what you are doing.', choices: [
            { t: '"I will always pray for Your Majesty."', fx: { honesty: 4 }, next: 'end' },
            { t: '"I am sorry, Majesty. I must follow my conscience."', fx: { honesty: 6, favour: -4 }, next: 'end' },
          ] },
          s1: { text: 'You will support me! Good, good. With the Church behind me, nothing can stop me now. Anne shall be queen!', next: 's2' },
          s2: { who: 'narrator', text: 'In this game you chose to support the King. But the real Thomas More could not do it. His conscience would not let him…', next: 'end' },
          end: { who: 'narrator', text: 'Let us see what really happened to Sir Thomas More…', end: 'chapter' },
        } },
      },
    },
    {
      id: 'cromwell', name: 'Thomas Cromwell', role: 'The King\'s rising advisor', look: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, bg: '#3a3a3a' },
      pos: [-6, -10], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cromwell') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Sir Thomas. You look worried. Is it the King\'s little plan?', next: 'b' },
          b: { text: 'It is simple, really. Parliament makes the laws of England. If Parliament says the King is Head of the Church, then he IS. No more waiting for Rome.', fact: 'Thomas Cromwell planned to use Parliament to pass laws that would break England away from the Pope.', next: 'c' },
          c: { text: 'And think of the money! Every year, English churches send taxes to Rome. That money could stay here, with the King.', fact: 'Before the break with Rome, money from English churches was sent to the Pope every year.', choices: [
            { t: '"The Church is not a business, Master Cromwell."', fx: { honesty: 4 }, next: 'd' },
            { t: '"It is clever, I must admit."', fx: { favour: 2 }, next: 'd' },
          ] },
          d: { text: 'A word of advice, Sir Thomas. The King rewards those who help him… and remembers those who do not. Meanwhile, he is rebuilding the Great Hall here — have you seen the scaffolding? He thinks big, our King.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Choose wisely, Sir Thomas. The King is watching.' } } },
      },
    },
    {
      id: 'margaret', name: 'Margaret Roper', role: 'Your eldest daughter', look: { female: true, robe: '#2f4a2a', hat: 'gable', hatColor: '#2a1a10', trim: '#c9a43b', bg: '#2a4a3a' },
      pos: [43, 40], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'margaret') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Father! I came by boat from Chelsea as soon as I could. Everyone in London is talking about the King and the Pope.', fact: 'Thomas More believed girls should be educated as well as boys. His daughter Margaret was one of the cleverest women in England.', next: 'b' },
          b: { text: 'Father, I am frightened. Do you remember what you told me about the King? That if your head could win him a castle in France, it would not fail to go?', choices: [
            { t: '"I remember, Meg. Kings can be dangerous friends."', fx: { honesty: 4 }, next: 'c' },
            { t: '"Do not worry. The King loves me."', fx: { honesty: -4 }, next: 'c' },
          ] },
          c: { text: 'Could you not just agree with him? Then we could all be safe and happy at home in Chelsea.', choices: [
            { t: '"I must do what I believe is right, even if it is hard."', fx: { honesty: 6 }, next: 'd' },
            { t: '"Perhaps you are right, Meg. Perhaps I should agree."', fx: { favour: 2 }, next: 'd' },
          ] },
          d: { text: 'Whatever you choose, Father, I will love you. Please be careful.', fact: 'Margaret Roper stayed loyal to her father all her life and later kept his memory alive.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Look at the boats on the river, Father. I wish we could sail home together right now.' } } },
      },
    },
    {
      id: 'fisher', name: 'Bishop John Fisher', role: 'Bishop of Rochester', look: { robe: '#e8e2d4', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#1a1a1a', trim: '#1a1a1a', bg: '#3a2a4a' },
      pos: [13, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'fisher') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Peace be with you, Sir Thomas. I have been praying for Queen Catherine. I have defended her marriage in front of the whole court.', fact: 'Bishop John Fisher bravely defended Catherine of Aragon\'s marriage in public.', next: 'b' },
          b: { text: 'For fifteen hundred years, the Church has been led by the Pope in Rome. No king can change that. The Church belongs to all Christian people, everywhere.', next: 'c' },
          c: { text: 'I fear that dark days are coming for those of us who will not bend. Will you stand with the Church, Sir Thomas?', choices: [
            { t: '"I do not know yet, my lord. I am praying for guidance."', fx: { honesty: 4 } },
            { t: '"I stand with the Church, my lord."', fx: { honesty: 6, favour: -2 }, set: 'fisherAlly' },
            { t: '"We must obey the King, my lord."', fx: { favour: 2, honesty: -2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'God keep you, Sir Thomas. Follow your conscience.' } } },
      },
    },
    {
      id: 'anne', name: 'Lady Anne Boleyn', role: 'Marquess of Pembroke', look: { female: true, robe: '#1d1d2b', hat: 'french', hatColor: '#111', hair: '#2a1a10', trim: '#d9ab3c', bg: '#2a3a5a' },
      pos: [30.5, -4], yaw: Math.PI / 2, optional: true, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'anne') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Sir Thomas More. You never come to my rooms. Do you not like me?', choices: [
            { t: '"I serve the King and the Queen, my lady."', fx: { honesty: 4, favour: -2 }, next: 'b' },
            { t: '"I am very busy, my lady."', fx: {}, next: 'b' },
          ] },
          b: { text: 'The Queen. You mean CATHERINE. Soon there will be a new queen, Sir Thomas, and she will remember who her friends were.', fact: 'In 1532 Henry made Anne Boleyn the Marquess of Pembroke — a title of her own, which was very unusual for a woman.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I am waiting, Sir Thomas. We are all waiting.' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#6a4a2a', width: 1.3, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Sir Thomas! Mind your head — the builders are everywhere. The King is pulling down the old Great Hall and building a new one, even grander.', fact: 'Henry rebuilt the Great Hall at Hampton Court between 1532 and 1535. Builders worked through the night by candlelight to finish it.', next: 'b' },
          b: { text: 'They say the builders work day AND night, by candlelight. The King wants it finished in time to show off his new queen… whoever she is!' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Bang, bang, bang! All day long. I can hardly hear my own pots boiling.' } } },
      },
    },
  ],

  sources: [
    {
      id: 'utopia', name: 'Utopia, by Thomas More', kind: 'book', pos: [7.2, 18.2], area: 'Your Study',
      date: '1516', origin: 'A book written by you, Thomas More, in Latin. It was read all over Europe.',
      text: 'Utopia describes an imaginary island where everyone shares, nobody is poor, and rulers listen to wise advice.',
      about: 'The word "utopia" means "no place" in Greek — it was More\'s joke. Today we use the word "utopia" to mean a perfect world.',
      question: { q: 'What does Utopia tell us about Thomas More?', options: [
        { t: 'He was a clever writer who thought about how to rule well.', ok: true, why: 'Yes! More thought deeply about what makes a good ruler and a fair society.' },
        { t: 'He was a famous sailor who discovered a new island.', ok: false, why: 'No — Utopia is an imaginary island. More never sailed there!' },
        { t: 'He did not like reading or writing.', ok: false, why: 'The opposite — More was one of the most famous writers in Europe.' },
      ] },
    },
    {
      id: 'tyndale', name: 'Tyndale\'s Book', kind: 'book', pos: [30.5, 9], area: 'Presence Chamber',
      date: '1528', origin: '"The Obedience of a Christian Man" by William Tyndale, a Protestant writer living in hiding abroad.',
      text: '"The king is, in this world, without law… and shall give accounts but to God only."',
      about: 'Anne Boleyn showed this book to Henry, who loved it. But Thomas More thought books like this were dangerous. As Lord Chancellor, More hunted down people who owned banned Protestant books, and some were punished very harshly.',
      question: { q: 'Why did Henry like this book so much?', options: [
        { t: 'It said a king should answer to God, not to the Pope.', ok: true, why: 'Correct — exactly what Henry wanted to hear!' },
        { t: 'It was full of jokes.', ok: false, why: 'No — it was a serious book about religion and power.' },
        { t: 'It was written by Thomas More.', ok: false, why: 'No — it was by William Tyndale. More strongly disagreed with it.' },
      ] },
    },
    {
      id: 'universities', name: 'Opinions of the Universities', kind: 'scroll', pos: [-21.5, -25], area: 'Great Hall',
      date: '1530', origin: 'Letters collected from universities in England, France and Italy, giving their opinion on the King\'s marriage.',
      text: '"…the marriage of a man to his brother\'s widow is against the law of God…" — the University of Paris',
      about: 'Henry asked universities all over Europe for their opinion. Several agreed with him. But Henry\'s agents had paid money to some of the experts!',
      question: { q: 'Some experts were paid to agree with Henry. What does that mean for this source?', options: [
        { t: 'It is completely reliable.', ok: false, why: 'Think again — if someone is paid to give an answer, can we trust it?' },
        { t: 'We should be careful: the opinions may not be honest.', ok: true, why: 'Well done! Historians always ask WHO made a source and WHY.' },
        { t: 'It proves the Pope was wrong.', ok: false, why: 'It only shows what some universities said — and some were paid.' },
      ] },
    },
  ],

  spots: [
    { id: 'desk', label: 'Write your answer to the King', anchor: 'desk', action: 'letter', objective: 'letter' },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'sources', text: 'Read 3 important sources', done: (s) => ['utopia', 'tyndale', 'universities'].every((k) => s.sources[k]), after: ['meet'], targets: ['source:utopia', 'source:tyndale', 'source:universities'], count: (s) => ['utopia', 'tyndale', 'universities'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'people', text: 'Speak to Cromwell, Bishop Fisher and your daughter Margaret', done: (s) => ['cromwell', 'fisher', 'margaret'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:cromwell', 'npc:fisher', 'npc:margaret'], count: (s) => ['cromwell', 'fisher', 'margaret'].filter((k) => talked(s, k)).length + '/3' },
    { id: 'bonus', text: 'Bonus: Find Anne Boleyn and the Master Cook', done: (s) => talked(s, 'anne') && talked(s, 'cook'), after: ['meet'], targets: ['npc:anne', 'npc:cook'], optional: true },
    { id: 'letter', text: 'Write your answer to the King at your desk', done: (s) => !!s.letter, after: ['sources', 'people'], targets: ['spot:desk'] },
    { id: 'audience', text: 'Take your answer to the King', done: (s) => !!s.flags.chapterDone, after: ['letter'], targets: ['npc:henry'] },
  ],

  letter: {
    to: 'King Henry VIII', title: 'Your Answer to the King',
    intro: 'This is the hardest letter of your life. There is no single right answer about what you believe — but you must be polite, clear and honest. The King is a dangerous man to upset!',
    parts: [
      { label: 'Greeting', options: [
        { t: 'Most gracious Sovereign Lord,', score: 2, why: 'Respectful and correct.' },
        { t: 'Hello Henry,', score: 0, why: 'Far too casual for a king — even a friend!' },
      ] },
      { label: 'What you believe', options: [
        { t: 'My conscience will not let me agree that any king can be Head of the Church. The Church belongs to all Christian people.', score: 2, set: 'chose_resign', fx: { honesty: 8, favour: -8 }, why: 'Honest and brave. This is what the real Thomas More believed.' },
        { t: 'I will support Your Majesty as Supreme Head of the Church, as Parliament decides.', score: 2, set: 'chose_support', fx: { favour: 8, honesty: -6 }, why: 'Clear and loyal. Many people at court made this choice to stay safe.' },
        { t: 'You are wrong, and everybody knows it!', score: 0, fx: { favour: -15 }, why: 'Never insult a Tudor king!' },
      ] },
      { label: 'Your reason', options: [
        { t: 'As I wrote in Utopia, a good ruler must always listen to wise and honest advice.', score: 2, needs: 'utopia', why: 'Clever — you used your own famous book.' },
        { t: 'The universities agreed with you only because some of them were paid.', score: 1, needs: 'universities', fx: { honesty: 4, favour: -4 }, why: 'True, but risky! The King will not like being told this.' },
        { t: 'Lady Anne\'s books are full of dangerous ideas.', score: 0, needs: 'tyndale', fx: { favour: -8 }, why: 'Attacking the woman the King loves? Very dangerous!' },
      ] },
      { label: 'Your request', options: [
        { t: 'I humbly ask to give back the Great Seal and to live quietly, praying for Your Majesty.', score: 2, set: 'chose_resign', why: 'This is exactly what More did in May 1532.' },
        { t: 'I humbly ask to go on serving you faithfully as Lord Chancellor.', score: 2, why: 'Polite and loyal.' },
        { t: 'Forget Lady Anne and go back to the Queen!', score: 0, fx: { favour: -10 }, why: 'Ordering the King about? Disaster!' },
      ] },
      { label: 'Signing off', options: [
        { t: 'Your Majesty\'s faithful servant and daily beadsman, Thomas More.', score: 2, why: 'A "beadsman" is someone who prays for another person. More really did sign his letters to Henry like this.' },
        { t: 'Thomas More, Knight.', score: 1, why: 'Correct, but a bit cold for a letter to a friend and king.' },
      ] },
    ],
    sent: 'You seal the letter with wax and hand it to a royal messenger. Your hands are shaking a little.',
  },

  history: [
    { year: '1532', icon: '🔏', title: 'More resigns', text: 'In May 1532 the Church in England agreed to obey the King instead of the Pope. The very next day, Thomas More resigned and gave back the Great Seal. He lost most of his money.' },
    { year: '1533', icon: '👑', title: 'A new queen', text: 'Henry secretly married Anne Boleyn. The new Archbishop of Canterbury, Thomas Cranmer, declared Henry\'s marriage to Catherine void. Anne was crowned queen — but More refused to go. In September, Princess Elizabeth was born.' },
    { year: '1534', icon: '⛪', title: 'The break with Rome', text: 'Parliament passed the Act of Supremacy: Henry became Supreme Head of the Church of England. Everyone had to swear an oath accepting Anne\'s children as heirs. More refused, and was locked in the Tower of London.' },
    { year: '1535', icon: '🕯️', title: 'The King\'s good servant', text: 'Thomas More was put on trial and executed. Before he died he said he was <i>"the King\'s good servant, but God\'s first."</i> Bishop Fisher was executed too.' },
    { year: '1935', icon: '✝️', title: 'Saint Thomas More', text: '400 years later, the Catholic Church made Thomas More a saint. People still argue about him: was he a hero who stood up for his beliefs, or was he too stubborn? Remember, he also punished Protestants very harshly.' },
  ],
  fate: 'Thomas More resigned rather than accept the King as Head of the Church. He refused to swear the King\'s oath and was executed in 1535.',

  quiz: [
    { q: 'What famous book did Thomas More write?', options: ['Utopia', 'Hamlet', 'The Bible'], answer: 0, why: 'More wrote Utopia in 1516.' },
    { q: 'What did Henry want to become?', options: ['The Pope', 'Supreme Head of the Church of England', 'King of Spain'], answer: 1, why: 'The Act of Supremacy (1534) made Henry Supreme Head of the Church of England.' },
    { q: 'Why did More resign as Lord Chancellor?', options: ['He was bored', 'His conscience would not let him accept the King as Head of the Church', 'He wanted to become a cook'], answer: 1, why: 'More believed the Pope should lead the Church.' },
    { q: 'Who did Henry marry in 1533?', options: ['Jane Seymour', 'Anne Boleyn', 'Catherine Parr'], answer: 1, why: 'Henry married Anne Boleyn in 1533. Their daughter Elizabeth was born that September.' },
    { q: 'More said he was "the King\'s good servant, but…"', options: ['"…God\'s first."', '"…very tired."', '"…the Pope\'s friend."'], answer: 0, why: 'More put his faith in God above his loyalty to the King.' },
  ],
  reflection: 'Thomas More chose his conscience over the King, and it cost him his life. Would you have done the same? Give reasons for your answer.',
};
