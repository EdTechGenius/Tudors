// Chapter 1 — Cardinal Thomas Wolsey, 1527–1529: "The King's Great Matter"
export const henryLook = (width, beard = '#b5651d') => ({
  robe: '#8e1f22', gown: '#3a2414', trim: '#d9ab3c', legs: '#f2efe4', hat: 'bonnet', hatColor: '#151515', feather: '#f5f2ea', jewel: true,
  beard, hair: beard, width, sleeves: '#c9a43b', bg: '#5a1a1a', chain: true, photo: 'henry',
});

const talked = (s, id) => !!s.flags['talked_' + id];

export default {
  id: 1,
  advisor: 'Cardinal Thomas Wolsey',
  short: 'Wolsey',
  title: 'The King\'s Great Matter',
  years: '1527–1529',
  you: { robe: '#a51d22', long: true, hat: 'cardinal', hatColor: '#a51d22', trim: '#f2efe4', width: 1.25, bg: '#5a1a1a', photo: 'wolsey' },
  era: { greatHall: 'old', clock: false, haInitials: false },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 55, honesty: 50 },

  intro: [
    { title: 'The year is 1527…', text: 'You are <b>Cardinal Thomas Wolsey</b>, Lord Chancellor of England. Apart from the King himself, you are the most powerful man in the kingdom: you run the law courts, control the government\'s money and advise the King on almost everything.<br><br>You were born the son of a butcher in Ipswich, yet through hard work, cleverness and ambition you rose to the very top. You even built <b>Hampton Court Palace</b>, the grandest house in England, where you now stand.' },
    { title: 'The King has a problem', text: 'King Henry VIII has been married to <b>Catherine of Aragon</b>, a Spanish princess, for eighteen years. Sadly, most of their babies died, and they have only one surviving child: a daughter, <b>Princess Mary</b>.<br><br>Henry is desperate for a <b>son</b> to become king after him, because he fears that England could fall back into civil war without a male heir. To make matters more complicated, he has fallen deeply in love with a lady of the court called <b>Anne Boleyn</b>.' },
    { title: 'Your mission', text: 'Henry wants the <b>Pope</b>, the head of the Catholic Church in Rome, to <b>annul</b> his marriage, which means declaring that it was never a true marriage in the first place.<br><br>Only the Pope has the power to do this, so your diplomatic skills will be tested to their limit. Can you persuade him? The King is waiting impatiently for you in his <b>Privy Chamber</b>…' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 36', look: henryLook(1.12), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.letter ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Ah, Thomas, at last! I have hardly slept for worrying. For eighteen long years I have been married to Catherine, and still I have no son to sit on the throne after me. Without a prince, the great lords may fight over the crown once I am gone, just as they did in my grandfather\'s time.', next: 'b' },
          b: { text: 'I have been studying the Bible very carefully, and I have come to believe that God is punishing me. You see, Catherine was first married to my older brother, Arthur, before he died. Perhaps our marriage was never truly right in God\'s eyes, and that is why our sons have not lived.', next: 'c' },
          c: { text: 'So tell me plainly, Thomas: will you persuade the Pope to grant me my annulment?', choices: [
            { t: '"Of course, Your Majesty. It will be done quickly!"', fx: { favour: 8, honesty: -8 }, next: 'd1' },
            { t: '"I will try my very best, Majesty, but I must warn you that it may not be easy."', fx: { favour: 2, honesty: 6 }, next: 'd2' },
            { t: '"Are you certain, Majesty? The Queen has been a loyal and loving wife."', fx: { favour: -10, honesty: 8 }, next: 'd3' },
          ] },
          d1: { text: 'Ha! That is exactly what I wanted to hear. You have never failed me before, Thomas, and I am certain you will not fail me now.', next: 'e' },
          d2: { text: 'Not easy? Nonsense! You are the cleverest man in England, and you have friends in every court in Europe. If anyone can make it easy, you can.', next: 'e' },
          d3: { text: '(The King\'s face turns a dangerous shade of red.) Do NOT question me, Cardinal! My conscience is troubled, and it is your duty to set it at rest, not to argue with me.', next: 'e' },
          e: { text: 'Find EVIDENCE that proves my marriage is against God\'s law. Speak to the people of my court, too: I want to know what they are saying. Then write to Pope Clement in Rome and make him understand. Now go, and do not come back empty-handed!', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: {
          a: { text: 'Well, Thomas? Have you written to the Pope yet? Search the palace for evidence, listen carefully to what people tell you, and then write your letter at the desk in your study. Every day of waiting feels like a year to me.' },
        } },
        audience: { start: 'a', nodes: {
          a: { text: 'Thomas! A messenger tells me that your letter has reached Rome at last. Well? Speak up! Will the Pope give me my annulment?', choices: [
            { t: '"Majesty, the Pope is sending Cardinal Campeggio to hear your case here in England."', fx: { favour: 6, honesty: 4 }, next: 'b' },
            { t: '"Yes, Majesty! It is as good as done!"', fx: { favour: 6, honesty: -10 }, next: 'b2' },
          ] },
          b: { text: 'A trial here in England! Excellent. You and Campeggio will sit together as judges, and between you I am sure you will see sense. You will not let me down, will you?', choices: [
            { t: '"I must be honest, Majesty: the Pope is afraid of the Emperor, Catherine\'s nephew. He may try to delay."', fx: { favour: -4, honesty: 8 }, next: 'c1' },
            { t: '"I will not let you down, Majesty."', fx: { favour: 4, honesty: -2 }, next: 'c2' },
          ] },
          b2: { text: 'As good as done! Then I shall hold you to that promise, Thomas. Remember that you said those words to me.', next: 'c2' },
          c1: { text: 'Afraid of the Emperor? Then the Pope had better learn to be even more afraid of ME. We shall see what happens, Thomas. We shall see.', next: 'end' },
          c2: { text: 'Good. Then soon Anne will be my queen, and God will finally give me my son. Do not fail me, Thomas.', next: 'end' },
          end: { who: 'narrator', text: 'You bow low and leave the Privy Chamber, with the King\'s words ringing in your ears. Now, let us discover what really happened…', end: 'chapter' },
        } },
      },
    },
    {
      id: 'catherine', name: 'Queen Catherine of Aragon', role: 'Queen of England', look: { female: true, robe: '#3b2a4a', hat: 'gable', hatColor: '#1a1a1a', trim: '#c9a43b', bg: '#5a2a2a', photo: 'aragon' },
      pos: [36, 32], yaw: Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'catherine') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Cardinal Wolsey. Do not pretend that you have come to admire the roses. I know exactly why you are here: my husband wishes to be rid of me.', choices: [
            { t: '"Your Majesty, the King sincerely believes that your marriage was against God\'s law."', fx: { honesty: 4 }, next: 'b' },
            { t: '"I am only here to admire the garden, Your Majesty."', fx: { honesty: -6 }, next: 'b0' },
          ] },
          b0: { text: 'Do not play games with me, Cardinal. I may be a foreigner here, but I am not a fool. I have heard the whispers in every corridor of this palace.', next: 'b' },
          b: { text: 'Listen to me carefully. I was married to Prince Arthur for only a few months before he died, and we were both very young. I came to Henry as a true wife. What is more, the Pope himself gave special permission for our marriage.', next: 'c' },
          c: { text: 'I have been Henry\'s loyal wife and his crowned queen for eighteen years. I have prayed for him, cared for him, and even ruled England for him while he was away at war. My daughter Mary is a true princess, and I will NEVER agree that our marriage was false. Never.', fact: 'Catherine of Aragon insisted her marriage to Henry was true and lawful, and she refused ever to agree to an annulment.', next: 'd' },
          d: { text: 'And remember this, Cardinal: my nephew is Emperor Charles V, the most powerful ruler in all of Christendom. Do you really believe that he will allow the Pope to shame his own family?', fact: 'Catherine\'s nephew, Emperor Charles V, ruled Spain, the Netherlands and large parts of Germany and Italy.', choices: [
            { t: '"I understand, Your Majesty. I am truly sorry for your troubles."', fx: { honesty: 4 } },
            { t: '"The King will get what he wants, madam."', fx: { favour: 2, honesty: -2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Every day I pray that Henry will remember the love we once shared. Now leave me in peace, Cardinal. I have nothing more to say to you.' } } },
      },
    },
    {
      id: 'anne', name: 'Lady Anne Boleyn', role: 'Lady of the court', look: { female: true, robe: '#1d1d2b', hat: 'french', hatColor: '#111', hair: '#2a1a10', trim: '#d9ab3c', bg: '#2a3a5a', photo: 'boleyn' },
      pos: [-8, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'anne') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Well, well. The great Cardinal Wolsey himself. Have you come to tell me that the Pope has finally said yes?', choices: [
            { t: '"Not yet, my lady. These matters take time."', fx: { honesty: 4 }, next: 'b' },
            { t: '"Very soon, my lady, very soon!"', fx: { honesty: -6 }, next: 'b' },
          ] },
          b: { text: 'Time! The King has waited long enough, and so have I. Let me be perfectly clear, Cardinal: I will not be merely the King\'s sweetheart, to be thrown aside when he grows bored. If Henry truly wants me, he must make me his wife and his QUEEN.', fact: 'Anne Boleyn refused to be just Henry\'s girlfriend: she would only accept him if she could become his wife and queen.', next: 'c' },
          c: { text: 'I spent many years at the French court, where people read all sorts of new ideas. I have shown the King a book by William Tyndale, which argues that a king answers only to God, and not to the Pope at all. Perhaps Henry does not need the Pope\'s permission after all…', fact: 'Anne showed Henry a book by William Tyndale which said that kings, not popes, should be in charge in their own countries.', next: 'd' },
          d: { text: 'Some people at court whisper that you are not really trying to help us, Cardinal, and that you would secretly prefer the King to marry a French princess instead. If I were you, I would be very careful indeed.', choices: [
            { t: '"I serve the King with all my heart, my lady."', fx: { favour: 2 } },
            { t: '"Are you threatening me, my lady?"', fx: { favour: -4, honesty: 2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Off you go, Cardinal. Write to your Pope, and be quick about it. Neither the King nor I am a patient person.' } } },
      },
    },
    {
      id: 'cromwell', name: 'Thomas Cromwell', role: 'Your secretary', look: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, bg: '#3a3a3a', photo: 'cromwell' },
      pos: [5.5, 19.5], yaw: -2.4, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cromwell') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master! I have been sorting through your papers all morning. I hear that the King has given you the most difficult task in the whole of Christendom.', next: 'b' },
          b: { text: 'May I offer some advice? Before you write a single word to the Pope, you must gather the right evidence. I have already found a copy of the Pope\'s permission for the King\'s marriage, the "dispensation" from 1503. It is on the table beside me.', fact: 'In 1503, Pope Julius II gave special permission, called a "dispensation", for Henry to marry his brother\'s widow, Catherine.', next: 'c' },
          c: { text: 'You should also search the Chapel Royal, because the King keeps quoting a verse from the book of Leviticus in the Bible. And look at the portrait in the Great Hall of the Emperor, the Queen\'s nephew. Ask yourself why he matters so much.', next: 'd' },
          d: { text: 'When you have gathered your evidence, sit at your desk and write the letter. Choose every word with great care. The Pope is a powerful man, and an impolite letter could ruin everything.', fact: 'Thomas Cromwell began his career as Wolsey\'s servant. He was the son of a blacksmith from Putney, near London.', choices: [
            { t: '"Thank you, Cromwell. You are a loyal and clever servant."', fx: { honesty: 2 } },
            { t: '"Yes, yes. Get back to work."', fx: {} },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Remember, master: gather the evidence first, then write the letter. Your desk is ready, and I have trimmed a fresh quill for you.' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#6a4a2a', width: 1.3, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Your Grace! Welcome to my kitchens. Mind the fires! We cook two great meals every day for around six hundred people at court, so there is never a quiet moment down here.', fact: 'The Hampton Court kitchens fed around 600 people at court, twice a day.', next: 'b' },
          b: { text: 'Shall I tell you a little gossip? The King has been sending dishes from the royal table to Mistress Anne Boleyn\'s rooms. And people say he writes her love letters, too, signed with a little heart!', fact: 'Henry wrote love letters to Anne Boleyn. Seventeen of them still survive today, in the Vatican Library in Rome.', choices: [
            { t: '"Gossip is not evidence, Master Cook!"', fx: { honesty: 2 } },
            { t: '"Tell me more…"', next: 'c' },
          ] },
          c: { text: 'They say the Queen still sews the King\'s shirts with her own hands, even now, though he hardly speaks to her. Poor lady. It makes my heart ache.', fact: 'Even while Henry tried to end their marriage, Catherine continued to sew his shirts.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Mind the fires, Your Grace! You would not want to get soot all over those fine red robes.' } } },
      },
    },
  ],

  sources: [
    {
      id: 'bible', name: 'The Bible: Leviticus', kind: 'book', pos: [21.5, -25], area: 'Chapel Royal',
      date: 'The Old Testament', origin: 'A holy book. This copy is written in Latin, the language of the Church.',
      text: '"If a man shall take his brother\'s wife… they shall be childless." (Leviticus 20:21)',
      about: 'Henry believed that this verse explained why he had no son. However, Catherine\'s supporters pointed to another part of the Bible, the book of Deuteronomy, which said that a man <i>should</i> marry his brother\'s widow!',
      question: { q: 'Why did Henry think this Bible verse helped him?', options: [
        { t: 'It seemed to explain why he had no son with Catherine.', ok: true, why: 'Yes! Henry believed God was punishing him for marrying his brother\'s widow.' },
        { t: 'It said the Pope must always obey kings.', ok: false, why: 'Not quite. This verse is about marrying your brother\'s wife.' },
        { t: 'It said that Spain was an enemy of England.', ok: false, why: 'No, the verse does not mention any countries.' },
      ] },
    },
    {
      id: 'charles', name: 'Portrait of Emperor Charles V', kind: 'portrait', pos: [-22.6, -31], rot: Math.PI / 2, area: 'Great Hall', img: 'charles',
      date: 'Painted around 1516', origin: 'A portrait by Bernard van Orley, a court painter, made to show the young ruler\'s importance.',
      portrait: ['#3a2a1a', '#222', '#111'],
      text: 'Charles V: Holy Roman Emperor, King of Spain, and nephew of Queen Catherine of Aragon.',
      about: 'In May 1527, Charles\'s army attacked and looted Rome. Pope Clement VII was trapped and became, in effect, the Emperor\'s prisoner.',
      question: { q: 'Why would the Pope be afraid to annul Catherine\'s marriage?', options: [
        { t: 'Because Catherine\'s nephew, the Emperor, controlled Rome.', ok: true, why: 'Exactly. Upsetting the Emperor\'s aunt could be very dangerous for the Pope.' },
        { t: 'Because the Pope had never heard of England.', ok: false, why: 'The Pope knew all about England. Henry had even been given the title "Defender of the Faith" by an earlier Pope!' },
        { t: 'Because Catherine was the Pope\'s sister.', ok: false, why: 'No: Catherine was the Emperor\'s aunt, not the Pope\'s sister.' },
      ] },
    },
    {
      id: 'dispensation', name: 'The Pope\'s Permission (1503)', kind: 'scroll', pos: [7.2, 18.2], area: 'Your Study',
      date: '1503', origin: 'A document called a "dispensation", written on behalf of Pope Julius II.',
      text: '"…we allow Henry, Prince of Wales, to marry Catherine, widow of his brother Arthur…"',
      about: 'An earlier Pope had already given special permission for this marriage. To annul it, Pope Clement would have to say that the Pope before him had made a mistake.',
      question: { q: 'Why is this document a PROBLEM for Henry?', options: [
        { t: 'A Pope had already said the marriage was allowed.', ok: true, why: 'Right! Popes did not like saying that an earlier Pope had been wrong.' },
        { t: 'It proves Henry was never really king.', ok: false, why: 'No: it is about his marriage, not his crown.' },
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
    intro: 'Build your letter to the Pope in Rome. Choose each part carefully: be polite, and use your evidence! Then sign it with your quill.',
    parts: [
      { label: 'Greeting', options: [
        { t: 'Most Holy Father,', score: 2, why: 'Perfect: this is the correct, respectful way to address the Pope.' },
        { t: 'Dear Pope,', score: 1, why: 'Too casual for the head of the Church!' },
        { t: 'Clement, listen to me!', score: 0, why: 'Very rude! The Pope would be offended.' },
      ] },
      { label: 'Your evidence', options: [
        { t: 'The Holy Bible says that a man must not marry his brother\'s wife (Leviticus 20:21), and the King has no son.', score: 2, needs: 'bible', why: 'Strong: you used evidence from the Bible.' },
        { t: 'The marriage was only allowed by Pope Julius, who was given wrong information.', score: 2, needs: 'dispensation', why: 'Clever: Wolsey and Henry really did argue that the 1503 permission was faulty.' },
        { t: 'The Queen is old and the King is bored of her.', score: 0, why: 'Unkind, and not a reason the Church would accept.' },
      ] },
      { label: 'Your request', options: [
        { t: 'We humbly ask that you send a cardinal to judge the case here in England.', score: 2, why: 'Excellent: this is just what Wolsey asked for, and the Pope agreed!' },
        { t: 'Do whatever the Emperor wants.', score: 0, why: 'That is the opposite of what Henry wants!' },
        { t: 'Annul the marriage at once, or England will leave the Church!', score: 1, needs: 'charles', why: 'A threat! Wolsey would never have written this, but in the end Henry did leave the Catholic Church.' },
      ] },
      { label: 'Signing off', options: [
        { t: 'Your Holiness\'s most humble servant, Thomas, Cardinal of York.', score: 2, why: 'Humble and correct.' },
        { t: 'From Wolsey, who is very busy.', score: 0, why: 'Rude: never tell the Pope you are too busy for him!' },
      ] },
    ],
    sent: 'You fold the letter and press your seal into hot red wax. A messenger gallops away. It will take him about three weeks to reach Rome!',
  },

  history: [
    { year: '1528', icon: '🏰', title: 'A gift for the King', text: 'Worried about losing the King\'s favour, Wolsey gave Hampton Court Palace to Henry. Henry loved it, and over the next twenty years he made it even bigger and grander.' },
    { year: '1528', icon: '✉️', title: 'Cardinal Campeggio arrives', text: 'The Pope sent Cardinal Campeggio to England to judge the case alongside Wolsey. Secretly, however, the Pope told Campeggio to delay for as long as possible and to avoid making any decision.' },
    { year: '1529', icon: '⚖️', title: 'The court at Blackfriars', text: 'At a special court in London, Queen Catherine knelt before Henry and begged him to remember their twenty years together. Then she walked out and refused to return. Campeggio stopped the court, and the case was sent back to Rome. Henry was furious!' },
    { year: '1529', icon: '📉', title: 'Wolsey falls from power', text: 'Henry blamed Wolsey for the failure. Anne Boleyn and Wolsey\'s many enemies turned the King against him. Wolsey lost his job as Lord Chancellor and had to give up his palaces and riches.' },
    { year: '1530', icon: '🕯️', title: 'The end of Wolsey', text: 'Wolsey was arrested for treason. He fell ill and died at Leicester on his way to London. He is reported to have said: <i>"If I had served God as well as I have served the King, He would not have given me over in my grey hairs."</i>' },
  ],
  fate: 'Wolsey failed to get the annulment. He lost his power, was arrested for treason, and died on his way to London in 1530.',

  quiz: [
    { type: 'mc', skill: 'retrieve', q: 'Who was Henry VIII\'s first wife?', options: ['Anne Boleyn', 'Catherine of Aragon', 'Jane Seymour'], answer: 1, why: 'Catherine of Aragon married Henry in 1509.' },
    { type: 'gap', skill: 'retrieve', text: 'Henry wanted the ___ to annul his marriage, but Catherine\'s nephew, ___, controlled Rome.', bank: ['Pope', 'Emperor Charles V', 'Cardinal Wolsey', 'King of France'], answers: ['Pope', 'Emperor Charles V'], why: 'Only the Pope could annul the marriage, and the Pope was in the power of Emperor Charles V.' },
    { type: 'match', skill: 'vocab', q: 'Match each word to its meaning.', pairs: [['annul', 'To declare that a marriage was never a true marriage'], ['heir', 'The person who will become king or queen next'], ['treason', 'The crime of betraying your king or country']], why: 'These three words are all important for understanding Henry\'s "Great Matter".' },
    { type: 'mc', skill: 'vocab', q: 'Catherine says, "I will NEVER agree that our marriage was false." What does "false" mean here?', options: ['Not true or not real', 'Very expensive', 'Happy and loving'], answer: 0, why: 'Catherine refused to accept that her marriage had not been a true marriage.' },
    { type: 'mc', skill: 'infer', q: 'Anne Boleyn tells Wolsey to "be very careful indeed". What can you infer about Anne?', options: ['She wanted to be Wolsey\'s friend', 'She did not trust Wolsey and was becoming powerful enough to threaten him', 'She wanted to leave the court'], answer: 1, why: 'Anne suspected Wolsey was not really helping, and she was growing powerful because the King loved her.' },
    { type: 'mc', skill: 'infer', q: 'Why do you think Wolsey gave Hampton Court Palace to the King in 1528?', options: ['He did not like living there', 'He hoped the gift would help him keep the King\'s favour', 'The palace was falling down'], answer: 1, why: 'Wolsey was worried that the King was losing patience with him.' },
    { type: 'order', skill: 'sequence', q: 'Put these events in the order they happened.', items: ['Henry marries Catherine of Aragon (1509)', 'Princess Mary is born (1516)', 'Henry asks the Pope for an annulment (1527)', 'The court at Blackfriars fails (1529)'], why: 'Use the dates to help you order events in history.' },
    { type: 'write', skill: 'explain', q: 'Explain why the Pope did not want to annul Henry\'s marriage. Give at least one reason.', model: 'The Pope did not want to annul the marriage because Catherine\'s nephew, Emperor Charles V, controlled Rome and the Pope was afraid of him. Also, an earlier Pope had already given permission for the marriage, so annulling it would mean saying that Pope had been wrong.', checklist: ['I mentioned Emperor Charles V or the attack on Rome', 'I mentioned the earlier Pope\'s permission (the dispensation)', 'I used the word "because" to explain'] },
    { type: 'mc', skill: 'predict', q: 'Henry is losing patience with the Pope. What do you predict he might do next?', options: ['Give up and stay married to Catherine forever', 'Find a way to make himself head of the Church in England', 'Move to Rome to live with the Pope'], answer: 1, why: 'Play Chapter 2 to find out if your prediction was right!' },
    { type: 'write', skill: 'summarise', q: 'Summarise what happened to Cardinal Wolsey in one or two sentences.', model: 'Wolsey tried to get the Pope to annul Henry\'s marriage, but he failed. Henry blamed him, so he lost his power and died in 1530 while being taken to London to face a charge of treason.', checklist: ['I said what Wolsey was trying to do', 'I said that he failed', 'I said what happened to him in the end'] },
  ],
  reflection: 'Wolsey was clever and powerful, but he still could not give Henry what he wanted. Do you think it was fair that Henry blamed Wolsey? Explain your answer.',
};
