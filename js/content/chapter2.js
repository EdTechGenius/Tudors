// Chapter 2 — Sir Thomas More, 1532–1535: "The Oath"
// This chapter plays differently: instead of writing a letter, the player makes hard choices on the
// Conscience Scale, cracks an ambassador's code, and survives Cromwell's questions in the Tower.
import { henryLook } from './chapter1.js';

const talked = (s, id) => !!s.flags['talked_' + id];

export const norfolkLook = { robe: '#2b2b4a', gown: '#5a3a1a', trim: '#d9ab3c', legs: '#222', hat: 'bonnet', hatColor: '#111', chain: true, width: 1.1, bg: '#2a2a4a', photo: 'norfolk' };
export const kitLook = { robe: '#8a7a5a', legs: '#5a4a3a', hat: 'cap', hatColor: '#5a4a3a', hair: '#8a5a2a', apron: true, scale: 0.72, bg: '#5a4a2a' };
const richLook = { robe: '#2a2a2a', gown: '#3a2a3a', long: true, hat: 'cap', hatColor: '#111', trim: '#6a5a4a', beard: '#5a3a1a', bg: '#3a2a3a' };

export default {
  id: 2,
  v: 2,
  advisor: 'Sir Thomas More',
  short: 'More',
  title: 'The Oath',
  years: '1532–1535',
  you: { robe: '#2a2a2a', gown: '#3a2a20', long: true, hat: 'cap', hatColor: '#111', trim: '#6a4a2a', chain: true, beard: null, width: 1.1, bg: '#2a3a2a', photo: 'more' },
  era: { greatHall: 'building', clock: false, haInitials: false },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 55 },
  kingMood: true,
  honestyName: 'Conscience',
  honestyIcon: '✝️',
  kit: 'kit2',

  intro: [
    { title: 'Wolsey has fallen…', text: 'It is 1532. Cardinal Wolsey failed to win the King\'s annulment and lost everything he owned. In his place, Henry chose <b>you</b>: <b>Sir Thomas More</b>, a brilliant lawyer, scholar and writer.<br><br>You are famous across Europe for your book <b>Utopia</b>. You are also a deeply religious Catholic, who prays every day and believes that the Pope is the rightful head of the Church.' },
    { title: 'The King\'s friend', text: 'Henry admires you and enjoys your company. He has visited your house in Chelsea and strolled around your garden with his arm around your neck, which is a great honour.<br><br>Yet you are not fooled. You have quietly told your family: <i>"If my head could win him a castle in France, it would not fail to go."</i> You understand how dangerous it can be to be close to a king.' },
    { title: 'Conscience or the Crown?', text: 'The Pope <b>still</b> refuses to annul Henry\'s marriage. So Henry has a bold new plan: <b>the King himself</b> will become head of the Church in England!<br><br>This chapter is different. Watch the <b>King\'s face</b> in the corner of the screen to see his mood. You will crack a <b>secret code</b>, make the hardest choices of your life on the <b>Conscience Scale</b>, and face <b>questions in the Tower of London</b>. Choose your words very carefully…' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 40', look: henryLook(1.2), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Thomas, my good friend! Come in and sit with me. You know perfectly well what troubles me. For five long years I have waited patiently for the Pope to see sense, and in all that time he has done absolutely NOTHING.', next: 'b' },
          b: { text: 'Master Cromwell has suggested a clever solution. Parliament could pass new laws so that the priests of England obey their King instead of a foreigner in Rome. I would become Supreme Head of the Church in England, and then nobody could stop me from ending my marriage!', next: 'c' },
          c: { text: 'You are my Lord Chancellor, Thomas, and the most respected man in England. I need you standing beside me. Will you support me in this?', choices: [
            { t: '"Majesty, I must think and pray about this. Please give me a little time."', fx: { favour: -2, honesty: 6 }, next: 'd1' },
            { t: '"Of course, Majesty. Whatever you wish."', fx: { favour: 8, honesty: -10 }, next: 'd2' },
            { t: '"Majesty, I do not believe that any king can be head of the Church."', fx: { favour: -12, honesty: 10 }, next: 'd3' },
          ] },
          d1: { text: 'Hmm. Very well, pray if you must. But do not take too long about it, Thomas. My patience is not endless.', next: 'e' },
          d2: { text: 'Ha! I knew that I could count on you. And yet… you look troubled. I can always tell when a man says one thing and thinks another.', next: 'e' },
          d3: { text: '(The room falls silent. Even the guards stop moving.) …I shall pretend that I did not hear that, Thomas. Go away and think VERY carefully before you speak to me again.', next: 'e' },
          e: { text: 'Speak to the people of my court, and read whatever you need to read. Then go to your desk and decide where you stand. Watch my face, Thomas: I always know who is truly with me.', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Still thinking, Thomas? Find out what others believe, then go to your desk and make up your mind. Do not keep me waiting too long.' } } },
      },
    },
    {
      id: 'cromwell', name: 'Thomas Cromwell', role: 'The King\'s rising advisor', look: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, bg: '#3a3a3a', photo: 'cromwell' },
      pos: [-6, -10], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cromwell') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Good day, Sir Thomas. You look worried. Could it be the King\'s little plan that is troubling you?', next: 'b' },
          b: { text: 'It is really very simple. Parliament makes the laws of England. So if Parliament declares that the King is Supreme Head of the Church, then he IS, and there will be no more waiting for permission from Rome.', fact: 'Thomas Cromwell planned to use Parliament to pass laws that would break England away from the Pope.', next: 'c' },
          c: { text: 'And think of the money! Every year, English churches send taxes to Rome. That money could stay right here, in the King\'s treasury, where it belongs.', fact: 'Before the break with Rome, money from English churches was sent to the Pope every year.', choices: [
            { t: '"The Church is not a business, Master Cromwell."', fx: { honesty: 4 }, next: 'd' },
            { t: '"I must admit that it is clever."', fx: { favour: 2 }, next: 'd' },
          ] },
          d: { text: 'A friendly word of advice, Sir Thomas. Soon, everyone important will be asked to swear an oath to the King. Those who swear will be safe. Those who refuse… well. I would hate to be the man who asks you the questions.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Choose wisely, Sir Thomas. The King is watching all of us very closely.' } } },
      },
    },
    {
      id: 'norfolk', name: 'Thomas Howard, Duke of Norfolk', role: 'England\'s most powerful lord', look: norfolkLook,
      pos: [-42, 8], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'norfolk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Ah, Sir Thomas. You look like a man carrying the weight of the world on his shoulders. My niece, Lady Anne Boleyn, will soon be queen, you know. Wise men are making friends with her now, while they still can.', fact: 'The Duke of Norfolk was Anne Boleyn\'s uncle. He was one of the richest and most powerful lords in England.', next: 'b' },
          b: { text: 'But I know your heart, Sir Thomas. Poor Queen Catherine is so lonely. A kind letter from you would comfort her greatly. Write it in secret, and give it to me. I shall make sure that it reaches her safely.', choices: [
            { t: '"That is very kind, my lord. I will write to her tonight."', rival: false, fx: { favour: -4 }, next: 'c1' },
            { t: '"I write no secret letters, my lord. Everything I do, the King may see."', rival: true, fx: { favour: 4 }, next: 'c2' },
          ] },
          c1: { text: '(He smiles a thin smile.) Excellent. I shall take VERY good care of it.', next: 'c1b' },
          c1b: { who: 'narrator', text: 'Later that night, you realise your mistake. A secret letter to Catherine would be PROOF that you were on her side against the King. Norfolk could have carried it straight to Henry! You decide not to write it. That was a narrow escape.', next: 'd' },
          c2: { text: '(His smile vanishes.) Hmph. You are cleverer than you look, More. Much cleverer.', next: 'd' },
          d: { text: 'Then let me give you some advice instead, for free. "Indignatio principis mors est." It is Latin, as you know: the anger of the King means death.', choices: [
            { t: '"Is that all, my lord? Then the only difference between us is that I shall die today, and you tomorrow."', fx: { honesty: 4 }, fact: 'The Duke of Norfolk really did warn More that "the anger of the King means death". More really did give this witty reply.' },
            { t: '"Thank you, my lord. I shall be careful."', fx: { favour: 2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Remember, Sir Thomas: the anger of the King means death.' } } },
      },
    },
    {
      id: 'margaret', name: 'Margaret Roper', role: 'Your eldest daughter', look: { female: true, robe: '#2f4a2a', hat: 'gable', hatColor: '#2a1a10', trim: '#c9a43b', bg: '#2a4a3a' },
      pos: [43, 40], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'margaret') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Father! I came up the river by boat from Chelsea as soon as I could. Everyone in London is talking about the King and the Pope, and I could not bear to stay at home and wait for news.', fact: 'Thomas More believed that girls should be educated as well as boys. His daughter Margaret was one of the most learned women in England.', next: 'b' },
          b: { text: 'Father, I am frightened. Do you remember what you told me about the King? That if your head could win him a castle in France, it would not fail to go?', choices: [
            { t: '"I remember, Meg. Kings can be dangerous friends."', fx: { honesty: 4 }, next: 'c' },
            { t: '"Do not worry. The King loves me."', fx: { honesty: -4 }, next: 'c' },
          ] },
          c: { text: 'Could you not simply agree with him, just this once? Then we could all live safely and happily together at home in Chelsea, as we used to.', choices: [
            { t: '"I must do what I believe is right, even when it is hard."', fx: { honesty: 6 }, next: 'd' },
            { t: '"Perhaps you are right, Meg. Perhaps I should agree."', fx: { favour: 2 }, next: 'd' },
          ] },
          d: { text: 'Whatever you decide, Father, I will always love you and stand by you. But please, please be careful.', fact: 'Margaret Roper stayed loyal to her father all her life and kept his memory alive after his death.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Look at the boats on the river, Father. I wish we could sail home together right now and forget all about kings and popes.' } } },
      },
    },
    {
      id: 'fisher', name: 'Bishop John Fisher', role: 'Bishop of Rochester', look: { robe: '#e8e2d4', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#1a1a1a', trim: '#1a1a1a', bg: '#3a2a4a' },
      pos: [13, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'fisher') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Peace be with you, Sir Thomas. I have been praying for Queen Catherine. I have defended her marriage in front of the whole court, and I would do so again tomorrow.', fact: 'Bishop John Fisher bravely defended Catherine of Aragon\'s marriage in public.', next: 'b' },
          b: { text: 'For fifteen hundred years, the Church has been led by the Pope in Rome. No king, however powerful, can change that. The Church does not belong to one country: it belongs to all Christian people, everywhere.', next: 'c' },
          c: { text: 'I fear that dark days are coming for those of us who will not bend to the King\'s will. Tell me honestly, Sir Thomas: will you stand with the Church?', choices: [
            { t: '"I do not know yet, my lord. I am praying for guidance."', fx: { honesty: 4 } },
            { t: '"I stand with the Church, my lord."', fx: { honesty: 6, favour: -2 }, set: 'fisherAlly' },
            { t: '"We must obey the King, my lord."', fx: { favour: 2, honesty: -2 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'God keep you safe, Sir Thomas. Follow your conscience, wherever it may lead.' } } },
      },
    },
    {
      id: 'kit', name: 'Kit', role: 'A kitchen boy, aged 10', look: kitLook,
      pos: [-3, -42], yaw: -Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'kit') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: '(A small boy is scrabbling about on the floor. A whole basket of bread rolls has spilled across the stones.) Oh no, oh no… Master Cook will beat me black and blue! These manchet loaves are for the King\'s own table!', fact: 'Manchet was the finest white bread, eaten by the rich. Poor people ate darker bread made from rye or barley.', choices: [
            { t: '"Here, let me help you pick them up before anyone sees."', legacy: { kit2: true }, fx: { honesty: 3 }, next: 'b1' },
            { t: '"Out of my way, boy. I have important business with the King."', legacy: { kit2: false }, next: 'b2' },
          ] },
          b1: { text: 'You… you\'re the Lord Chancellor! And you helped ME? Thank you, my lord! My name is Kit. I shall never forget this, never!', next: 'c' },
          b2: { text: '(Kit stares at the floor as you walk past.) Yes, my lord. Sorry, my lord.', next: 'c' },
          c: { who: 'narrator', text: 'Kit is not a real historical person, but hundreds of boys like him worked in the Tudor kitchens. Remember him: you may meet him again in later chapters!' },
        } },
        again: { start: 'a', nodes: { a: { text: (s) => (s.legacy.kit2 ? 'Thank you again, my lord! Not one loaf was lost.' : 'I am busy, my lord.') } } },
      },
    },
    {
      id: 'anne', name: 'Lady Anne Boleyn', role: 'Marquess of Pembroke', look: { female: true, robe: '#1d1d2b', hat: 'french', hatColor: '#111', hair: '#2a1a10', trim: '#d9ab3c', bg: '#2a3a5a', photo: 'boleyn' },
      pos: [30.5, -4], yaw: Math.PI / 2, optional: true, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'anne') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Sir Thomas More. You never come to visit my rooms, although everyone else at court does. Do you dislike me?', choices: [
            { t: '"I serve the King and the Queen, my lady."', fx: { honesty: 4, favour: -2 }, next: 'b' },
            { t: '"I am simply very busy, my lady."', fx: {}, next: 'b' },
          ] },
          b: { text: 'The Queen? You mean CATHERINE. Very soon there will be a new queen, Sir Thomas, and she will remember exactly who her friends were, and who they were not.', fact: 'In 1532 Henry made Anne Boleyn the Marquess of Pembroke: a title of her own, which was very unusual for a woman.' },
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
          a: { text: 'Sir Thomas! Mind your head: there are builders everywhere. The King is pulling down the old Great Hall and building a brand-new one, even grander than before.', fact: 'Henry rebuilt the Great Hall at Hampton Court between 1532 and 1535. The builders worked through the night by candlelight to finish it.', next: 'b' },
          b: { text: 'They say the builders work day AND night, by candlelight. The King wants it finished in time to show off his new queen… whoever she turns out to be!' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Bang, bang, bang! All day long. I can hardly hear my own pots bubbling.' } } },
      },
    },
  ],

  sources: [
    {
      id: 'utopia', name: 'Utopia, by Thomas More', kind: 'book', pos: [7.2, 18.2], area: 'Your Study', img: 'utopia',
      date: '1516', origin: 'A book written by you, Thomas More, in Latin. It was read by educated people all over Europe. This woodcut map appeared in the very first edition.',
      text: 'Utopia describes an imaginary island where everyone shares what they have, nobody is poor, and rulers listen carefully to wise advice.',
      about: 'The word "utopia" means "no place" in Greek; it was More\'s little joke. Today, we use the word "utopia" to mean a perfect world.',
      question: { q: 'What does Utopia tell us about Thomas More?', options: [
        { t: 'He had sailed to a newly discovered island in the Americas.', ok: false, why: 'No: Utopia is an imaginary island. More never sailed there!' },
        { t: 'He believed that kings should never listen to advisors.', ok: false, why: 'The opposite: in Utopia, rulers listen carefully to wise advice.' },
        { t: 'He thought deeply about how a country should be ruled.', ok: true, why: 'Yes! More thought deeply about what makes a good ruler and a fair society.' },
        { t: 'He wanted England to be ruled directly by the Pope.', ok: false, why: 'No: Utopia is about an imaginary fair society, not the Pope.' },
      ] },
    },
    {
      id: 'tyndale', name: 'Tyndale\'s Book', kind: 'book', pos: [30.5, 9], area: 'Presence Chamber',
      date: '1528', origin: '"The Obedience of a Christian Man" by William Tyndale, a Protestant writer living in hiding abroad.',
      text: '"The king is, in this world, without law… and shall give accounts but to God only."',
      about: 'Anne Boleyn showed this book to Henry, who loved it. But Thomas More believed that books like this were dangerous. As Lord Chancellor, More hunted down people who owned banned Protestant books, and some of them were punished very harshly.',
      question: { q: 'Why did Henry like this book so much?', options: [
        { t: 'It said that only priests should be allowed to read the Bible.', ok: false, why: 'No: Tyndale wanted everyone to read the Bible in English.' },
        { t: 'It said that a king answers to God, not to the Pope.', ok: true, why: 'Correct: exactly what Henry wanted to hear!' },
        { t: 'It said that a king must always obey his advisors.', ok: false, why: 'No: it said the king answers to God alone.' },
        { t: 'It said that a marriage can never be cancelled.', ok: false, why: 'No: and Henry would not have liked that at all!' },
      ] },
    },
    {
      id: 'universities', name: 'Opinions of the Universities', kind: 'scroll', pos: [-21.5, -25], area: 'Great Hall',
      date: '1530', origin: 'Letters collected from universities in England, France and Italy, giving their opinions on the King\'s marriage.',
      text: 'The University of Paris (1530): the marriage of a man to his brother\'s widow is against the law of God.',
      about: 'Henry asked universities all over Europe for their opinions, and several agreed with him. However, Henry\'s agents had paid money to some of the experts!',
      question: { q: 'Some experts were paid to agree with Henry. What does that mean for this source?', options: [
        { t: 'It proves that every university really disagreed with Henry.', ok: false, why: 'Not quite: it does not prove what they really thought, only that we must be careful.' },
        { t: 'It shows that the paid experts must have known the most.', ok: false, why: 'Being paid does not make someone more of an expert!' },
        { t: 'Their opinions might not be honest, so we must be careful.', ok: true, why: 'Well done! Historians always ask WHO made a source and WHY.' },
        { t: 'It means the source must have been written after Henry died.', ok: false, why: 'No: the opinions were collected in 1530.' },
      ] },
    },
  ],

  spots: [
    { id: 'code', label: 'Crack the ambassador\'s secret letter', pos: [33, -9], action: 'run', run: 'cipher', objective: 'cipher' },
    { id: 'desk', label: 'Face the hardest choices of your life', anchor: 'desk', action: 'run', run: ['conscience', 'toTower', 'interrogation', 'meg'], objective: 'choices', finish: true },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'people', text: 'Speak to Cromwell, Bishop Fisher, the Duke of Norfolk and your daughter Margaret', done: (s) => ['cromwell', 'fisher', 'norfolk', 'margaret'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:cromwell', 'npc:fisher', 'npc:norfolk', 'npc:margaret'], count: (s) => ['cromwell', 'fisher', 'norfolk', 'margaret'].filter((k) => talked(s, k)).length + '/4' },
    { id: 'sources', text: 'Read 3 important sources', done: (s) => ['utopia', 'tyndale', 'universities'].every((k) => s.sources[k]), after: ['meet'], targets: ['source:utopia', 'source:tyndale', 'source:universities'], count: (s) => ['utopia', 'tyndale', 'universities'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'cipher', text: 'Crack the secret code in the Presence Chamber', done: (s) => !!s.tasks.cipher, after: ['meet'], targets: ['spot:code'] },
    { id: 'bonus', text: 'Bonus: Find Anne Boleyn, the Master Cook and a kitchen boy', done: (s) => talked(s, 'anne') && talked(s, 'cook') && talked(s, 'kit'), after: ['meet'], targets: ['npc:anne', 'npc:cook', 'npc:kit'], optional: true },
    { id: 'choices', text: 'Go to your desk and face the hardest choices of your life', done: (s) => !!s.tasks.meg, after: ['people', 'sources', 'cipher'], targets: ['spot:desk'] },
  ],

  activities: {
    cipher: {
      type: 'cipher', label: 'The ambassador\'s code', icon: '🔐',
      title: 'A secret letter', heading: 'The ambassador\'s code',
      intro: 'On a table lies a letter from <b>Eustace Chapuys</b>, the ambassador of Emperor Charles V. It is written in a secret code! Ambassadors sent home news about everything they saw at court. Can you crack it?',
      message: 'HENRY WILL MAKE HIMSELF HEAD OF THE CHURCH',
      shift: 5,
      clue: 'Chapuys\'s secret key is written in the corner of the letter: <b>"A = F"</b>. Turn the red inner wheel until the letter <b>F</b> sits just under the <b>A</b> at the top.',
      hint1: 'Find the first letter of the code on the <b>red inner wheel</b>. Which letter is just outside it?',
      meaning: 'Chapuys wrote hundreds of letters about Henry\'s court, many of them in code. Historians still use them today. But be careful: Chapuys was a loyal friend of Catherine of Aragon, and he strongly disliked Anne Boleyn, so his letters are <b>biased</b>.',
      question: { q: 'Why did ambassadors like Chapuys write their letters in code?', options: [
        { t: 'Their letters could be stolen and read by the King\'s spies.', ok: true, why: 'Yes! Letters travelled a long way by messenger, and spies were everywhere.' },
        { t: 'Spanish words could not be written with English letters.', ok: false, why: 'No: Spanish uses the same alphabet as English.' },
        { t: 'Codes made the letters shorter and cheaper to send.', ok: false, why: 'No: a coded letter is just as long as the ordinary one.' },
        { t: 'It was the law that every royal letter had to be in code.', ok: false, why: 'No: there was no such law. Codes were used to keep secrets.' },
      ] },
    },
    conscience: {
      type: 'conscience', label: 'The Conscience Scale', icon: '⚖️',
      title: 'The Conscience Scale',
      dilemmas: [
        { year: 'May 1532', title: 'The Great Seal', img: 'more',
          text: 'The bishops have agreed that the Church in England will obey the King instead of the Pope. As Lord Chancellor, you keep the <b>Great Seal of England</b>, which is pressed into wax to make the King\'s laws official. Can you go on stamping laws that you believe are wrong?',
          choices: [
            { t: 'Give the Great Seal back to the King, and resign.', loyalty: -6, conscience: 10, result: 'You hand over the heavy silver seal. You lose your job and most of your money, but your conscience is clear.' },
            { t: 'Keep the Seal and say nothing. Perhaps things will get better.', loyalty: 8, conscience: -8, result: 'The King is pleased with you. But every time you stamp a new law, you feel a little sick inside.' },
            { t: 'Keep the Seal, but argue against the King in his Council.', loyalty: -10, conscience: 4, result: 'The King is furious that his own Lord Chancellor is arguing with him in front of everyone!' },
          ],
          real: 'On 16 May 1532, More gave the Great Seal back to the King in a garden at Whitehall. He said he was resigning because of poor health, which was a polite way of not criticising Henry.' },
        { year: 'June 1533', title: 'The coronation', img: 'boleyn',
          text: 'Henry has secretly married Anne Boleyn, and she will be crowned queen on 1 June. Three bishops send you a gift of <b>£20</b>, a large sum of money, to buy a fine new gown so that you can come to the coronation.',
          choices: [
            { t: 'Buy the gown and go to the coronation, smiling.', loyalty: 8, conscience: -8, result: 'You cheer as Anne is crowned. Henry notices you and nods. But in your heart, you still believe that Catherine is his true wife.' },
            { t: 'Send the money back and stay at home.', loyalty: -6, conscience: 6, result: 'Everyone notices your empty seat. The King notices it most of all.' },
            { t: 'Keep the bishops\' money, buy the gown… and still stay at home.', loyalty: -4, conscience: 4, result: 'A cheeky choice! You do not insult the bishops by refusing their gift, but you do not celebrate the marriage either.' },
          ],
          real: 'More kept the money but did not go. He joked to the bishops that if they could persuade him to attend the coronation, they would soon persuade him to do far worse things.' },
        { year: 'April 1534', title: 'Meg\'s letter', img: 'morefamily',
          text: 'Parliament has passed a new law, and everyone important must swear an <b>oath</b> accepting it. Your daughter Meg has already sworn it. She writes to you, begging you to swear too, so that you can come home to your family.',
          choices: [
            { t: 'Write back lovingly, but explain that you cannot swear.', loyalty: -2, conscience: 8, result: 'Your hand shakes as you write. It is the hardest letter of your life.' },
            { t: 'Tell Meg you will swear, so that you can come home.', loyalty: 8, conscience: -8, result: 'Meg is overjoyed. But you lie awake that night, wondering whether you can really do it.' },
            { t: 'Do not reply. It is too painful to think about.', loyalty: 0, conscience: -2, result: 'Meg waits and waits for an answer that never comes. Avoiding a problem does not make it go away.' },
          ],
          real: 'More wrote Meg loving letters, but he would not swear. He also said that he would never judge other people, like Meg, who had sworn.' },
        { year: '13 April 1534', title: 'The Oath at Lambeth', img: 'cromwell',
          text: 'You are called to Lambeth Palace. Cromwell and Archbishop Cranmer order you to swear the <b>Oath of Succession</b>. It says that Anne Boleyn\'s children will rule after Henry, and it rejects the power of the Pope.',
          choices: [
            { t: 'Swear the whole oath. Your family needs you alive.', loyalty: 12, conscience: -12, result: 'You are free to go home. The King is delighted. But was it worth it?' },
            { t: 'Refuse completely, and tell them exactly why it is wrong.', loyalty: -12, conscience: 6, result: 'Dangerous! Saying WHY you refuse could be called treason. You are arrested at once.' },
            { t: 'Agree that Anne\'s children can be heirs, but refuse the rest, without saying why.', loyalty: -6, conscience: 8, result: 'A very careful answer. You do not give them any words that they can use against you… but you are still arrested.' },
          ],
          real: 'More agreed that Parliament could choose the next king or queen, but he would not swear to the parts about the Church, and he would not explain why. Four days later, he was sent to the Tower of London.' },
      ],
      ending: 'In real life, almost every bishop and lord in England swore the oath to stay safe. Only a few people, such as More and Bishop Fisher, refused. Was More brave, or was he stubborn? Historians still argue about it today.',
    },
    toTower: {
      type: 'cards', title: '1534–1535',
      cards: [
        { img: 'tower', year: '1534', icon: '🏰', title: 'The Tower of London', text: 'On 17 April 1534, Thomas More was locked in the <b>Tower of London</b>. He stayed there for fifteen months. At first he was allowed books, pens, ink and visits from Meg. He spent his days praying and writing.' },
        { img: 'whitehall', year: '1534', icon: '📜', title: 'A new law', text: 'In November 1534, Parliament passed the <b>Act of Supremacy</b>, making Henry the Supreme Head of the Church of England. A new <b>Treasons Act</b> said that anyone who even SAID that the King was not Head of the Church could be executed.<br><br>But More had a plan: if he said nothing at all, how could they prove what he believed?' },
      ],
    },
    interrogation: {
      type: 'interrogation', label: 'Questions in the Tower', icon: '🗝️',
      title: 'The Tower of London, 1535', heading: 'Cromwell\'s questions', img: 'tower',
      intro: 'It is 1535. Thomas Cromwell has come to your cell to question you. If you say the King is NOT Head of the Church, it is treason, and you will be executed. But surely nobody can be punished just for staying silent… can they?',
      questions: [
        { who: 'Thomas Cromwell', photo: 'cromwell', q: 'Sir Thomas, Parliament has made the King Supreme Head of the Church. Do you accept this law?', options: [
          { kind: 'careful', t: '"I am the King\'s true and faithful subject, and I pray for him every day. More than that, I will not say."', why: 'You praised the King without answering the question. Cromwell frowns: he has nothing to write down.' },
          { kind: 'no', t: '"No. Parliament has no power to make any king the head of the Church."', why: 'Cromwell\'s clerk writes down every word. Those words alone could send you to the executioner.' },
          { kind: 'yes', t: '"Yes. I accept the law completely."', why: 'You are safe… but you have said something you do not believe.' },
        ] },
        { who: 'Thomas Cromwell', photo: 'cromwell', q: 'Then why will you not swear the oath? Tell me your reasons.', options: [
          { kind: 'careful', t: '"If I told you my reasons, I might anger the King. So I shall keep them to myself."', why: 'This is very close to what the real More said. He refused to give his reasons, so nobody could call them treason.' },
          { kind: 'no', t: '"Because the oath is wicked, and so is the King\'s new marriage!"', why: 'That is exactly what Cromwell hoped you would say!' },
          { kind: 'yes', t: '"I have no reasons. Give me the oath and I will swear it."', why: 'You could go home… but you have gone against your conscience.' },
        ] },
        { who: 'Thomas Cromwell', photo: 'cromwell', q: 'Your silence shows that you think the law is wrong. Silence is a kind of answer, is it not?', options: [
          { kind: 'careful', t: '"There is an old saying in law: silence means agreement. If anything, my silence AGREES with you!"', why: 'Brilliant! More really used this old legal saying in his defence. You turned Cromwell\'s trick upside down.' },
          { kind: 'no', t: '"Very well. Yes, my silence means that I believe the law is wrong."', why: 'TRAP! Now you have told him exactly what you believe.' },
          { kind: 'yes', t: '"Then I will break my silence: the King IS Head of the Church."', why: 'You gave in. Cromwell smiles: another important man has bent to the King\'s will.' },
        ] },
        { who: 'Thomas Cromwell', photo: 'cromwell', q: 'Bishop Fisher has refused the oath too. Did you plan this together? Did you write secret letters to each other?', options: [
          { kind: 'careful', t: '"We sent each other a few notes about our health and our prayers. Nothing more."', why: 'A careful answer. More and Fisher did send each other notes in the Tower, but they were burnt, so nobody could prove what they said.' },
          { kind: 'no', t: '"Yes. We agreed that the King\'s new law goes against God."', why: 'TRAP! Now you have put Bishop Fisher in danger too.' },
          { kind: 'yes', t: '"Bishop Fisher is a foolish old man. I want nothing to do with him."', why: 'You betrayed a brave friend to save yourself.' },
        ] },
        { who: 'Sir Richard Rich', look: richLook, q: '(Richard Rich comes to take away your books.) Just between friends, Sir Thomas… If Parliament made ME king, would you accept me? And if Parliament made the King Head of the Church, would you accept that too?', options: [
          { kind: 'careful', t: '"That is a clever question, Master Rich. But I will not play games with my life."', why: 'Wise! You refused to be drawn into a trick conversation.' },
          { kind: 'no', t: '"Parliament can make you king, but it can NEVER make the King Head of the Church!"', why: 'TRAP! Rich hurries straight to Cromwell with your words.' },
          { kind: 'yes', t: '"If Parliament says so, then I suppose it must be true."', why: 'You have said something you do not believe.' },
        ] },
      ],
      after: 'On 1 July 1535, Thomas More was put on trial. Richard Rich told the court that, in the Tower, More had said Parliament could NOT make the King Head of the Church. More said that Rich was lying, and <b>most historians believe More</b>. But it did not matter: the jury found him guilty in just fifteen minutes.',
    },
    meg: {
      type: 'freewrite', label: 'A last letter to Meg', icon: '✒️',
      kicker: 'The last letter', title: 'A letter to Meg', img: 'morefamily', height: 300,
      text: 'Your pens and ink have been taken away. On 5 July 1535, the day before you are to die, you write a last letter to your daughter Meg using <b>a piece of charcoal</b>. The real More wrote to her: <i>"I never liked your manner towards me better than when you kissed me last."</i><br><br>What would you want to tell Meg? Use your Apple Pencil.',
      starters: ['My dearest Meg, …', 'Please do not be sad, because …', 'I chose to … because …', 'Always remember …'],
      placeholder: 'My dearest Meg…',
    },
  },

  history: [
    { img: 'morefamily', year: '1532', icon: '🔏', title: 'More resigns', text: 'In May 1532 the Church in England agreed to obey the King instead of the Pope. The very next day, Thomas More resigned and gave back the Great Seal. He lost most of his income and lived quietly with his family in Chelsea.' },
    { img: 'boleyn', year: '1533', icon: '👑', title: 'A new queen', text: 'Henry secretly married Anne Boleyn. The new Archbishop of Canterbury, Thomas Cranmer, declared Henry\'s marriage to Catherine void. Anne was crowned queen, but More refused to attend. In September, Princess Elizabeth was born.' },
    { img: 'whitehall', year: '1534', icon: '⛪', title: 'The break with Rome', text: 'Parliament passed the Act of Supremacy: Henry became Supreme Head of the Church of England. Everyone important had to swear an oath accepting Anne\'s children as heirs. More refused, and he was locked in the Tower of London.' },
    { img: 'tower', year: '1535', icon: '🕯️', title: 'The King\'s good servant', text: 'Thomas More was put on trial and executed. Before he died, he said that he was <i>"the King\'s good servant, but God\'s first."</i> Bishop Fisher was executed too.' },
    { img: 'more', year: '1935', icon: '✝️', title: 'Saint Thomas More', text: '400 years later, the Catholic Church made Thomas More a saint. People still argue about him today: was he a hero who stood up for his beliefs, or was he too stubborn? Remember, too, that he punished Protestants very harshly.' },
  ],
  fate: 'Thomas More resigned rather than accept the King as Head of the Church. He refused to swear the King\'s oath and was executed in 1535.',

  quiz: [
    { type: 'mc', skill: 'retrieve', q: 'Which of Henry\'s advisors wrote the famous book "Utopia"?', options: ['Cardinal Thomas Wolsey', 'Sir Thomas More', 'Thomas Cromwell', 'Archbishop Thomas Cranmer'], answer: 1, why: 'Thomas More wrote Utopia in 1516.' },
    { type: 'gap', skill: 'retrieve', text: 'Thomas More was a lawyer and writer, famous across Europe for his book ___. He became Lord ___ in 1529, after Wolsey fell from power. As a devout ___, More believed that the ___ was the rightful head of the Church. Henry, however, wanted to become Supreme ___ of the Church in England. In 1532 More ___ and gave back the Great ___. In 1534 he refused to swear an ___ accepting Anne Boleyn\'s children as heirs, so he was locked in the ___ of London. He was executed in ___.',
      answers: ['Utopia', 'Chancellor', 'Catholic', 'Pope', 'Head', 'resigned', 'Seal', 'oath', 'Tower', '1535'],
      bank: ['Utopia', 'Chancellor', 'Catholic', 'Pope', 'Head', 'resigned', 'Seal', 'oath', 'Tower', '1535', 'Protestant', 'Archbishop', 'promoted', 'Crown', '1533', 'treaty'],
      why: 'More put his conscience before his career, and in the end before his life.' },
    { type: 'match', skill: 'vocab', q: 'Match each word to its meaning.', pairs: [
      ['conscience', 'Your inner sense of what is right and wrong'],
      ['resign', 'To give up your job by your own choice'],
      ['oath', 'A serious promise, often made in God\'s name'],
      ['beadsman', 'Someone who promises to pray for another person'],
      ['Parliament', 'The lords and elected men who made laws with the King'],
    ], why: 'These words explain More\'s difficult choice.' },
    { type: 'mc', skill: 'vocab', q: 'More was "a devout Catholic". What does "devout" mean?', options: ['Unwilling to change his mind', 'Deeply and sincerely religious', 'Famous in many different countries', 'Very rich, powerful and important'], answer: 1, why: 'More\'s faith was the most important thing in his life.' },
    { type: 'mc', skill: 'infer', q: 'More said, "If my head could win him a castle in France, it would not fail to go." What does this suggest about how More saw the King?', options: ['He hoped the King would give him a castle in France', 'He thought England should invade France to win land', 'He knew the King would sacrifice even a friend to win', 'He believed the King would always reward his loyalty'], answer: 2, why: 'More realised that the King\'s friendship could not be trusted when Henry wanted something.' },
    { type: 'mc', skill: 'infer', q: 'Norfolk warned More, "The anger of the King means death." More replied, "Then I shall die today, and you tomorrow." What did More mean?', options: ['He thought Norfolk was planning to murder him that night', 'Anyone, even Norfolk, could lose the King\'s favour one day', 'He was sure the King would forgive him the next morning', 'He believed Norfolk was much older and sicker than he was'], answer: 1, why: 'More meant that nobody was safe from Henry\'s anger. He was right: in 1546, Norfolk himself was arrested!' },
    { type: 'mc', skill: 'infer', q: 'Why do you think More refused to go to Anne Boleyn\'s coronation in 1533?', options: ['He was too ill to travel from his house in Chelsea', 'Anne had banned Wolsey\'s old friends from the court', 'He thought the celebrations cost the country too much', 'Going would suggest he accepted Henry\'s new marriage'], answer: 3, why: 'More believed Henry was still married to Catherine in God\'s eyes, so he would not celebrate the new queen.' },
    { type: 'order', skill: 'sequence', q: 'Put these events in the order they happened.', items: ['More resigns as Lord Chancellor (May 1532)', 'Henry secretly marries Anne Boleyn (January 1533)', 'Princess Elizabeth is born (September 1533)', 'The Act of Supremacy is passed (1534)', 'More is executed (1535)'], why: 'Each event led to the next: More\'s refusal grew more dangerous over time.' },
    { type: 'write', skill: 'explain', q: 'Explain why Thomas More would not accept Henry as Head of the Church.', model: 'More was a devout Catholic who believed that the Pope was the rightful head of the Church, which belongs to Christians everywhere, not just to one country. His conscience would not let him agree, even though refusing was dangerous.', checklist: ['I mentioned More\'s Catholic beliefs or the Pope', 'I mentioned his conscience', 'I used "because" or "so" to explain'] },
    { type: 'mc', skill: 'predict', q: 'Henry is now Head of the Church in England, and the monasteries are very rich. What do you predict he will do next?', options: ['Turn every monastery into a school for poor children', 'Close the monasteries and take their land and treasure', 'Give the monasteries more land to thank the Church', 'Invite monks from Rome to run the English monasteries'], answer: 1, why: 'Play Chapter 3 to find out if you were right!' },
    { type: 'write', skill: 'summarise', q: 'Summarise Thomas More\'s story in one or two sentences.', model: 'Thomas More was Henry\'s Lord Chancellor, but he resigned because he would not accept the King as Head of the Church. He refused to swear the King\'s oath and was executed in 1535.', checklist: ['I said who More was', 'I said why he resigned', 'I said what happened to him'] },
  ],
  reflection: 'Thomas More chose his conscience over the King, and it cost him his life. Would you have done the same? Give reasons for your answer.',
};
