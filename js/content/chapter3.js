// Chapter 3 — Thomas Cromwell, 1539–1540: "The King's Fixer"
import { henryLook } from './chapter1.js';

const talked = (s, id) => !!s.flags['talked_' + id];

export default {
  id: 3,
  advisor: 'Thomas Cromwell',
  short: 'Cromwell',
  title: 'The King\'s Fixer',
  years: '1539–1540',
  you: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, chain: true, bg: '#3a3a3a' },
  era: { greatHall: 'new', clock: false, haInitials: true },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 45 },

  intro: [
    { title: 'The blacksmith\'s son', text: 'It is 1539. You are <b>Thomas Cromwell</b>, the son of a blacksmith from Putney. You have been a soldier, a merchant and a lawyer. Now you are the King\'s chief minister — and the most powerful man in England.<br><br>You made Henry <b>Supreme Head of the Church</b>, and you closed hundreds of <b>monasteries</b>, sending their riches to the King.' },
    { title: 'Seven troubled years', text: 'Much has happened. In 1536, <b>Anne Boleyn</b> was accused of crimes — most historians think the charges were made up — and she was executed. You helped bring her down.<br><br>Henry then married <b>Jane Seymour</b>. In 1537 she gave birth to a son, <b>Prince Edward</b>, right here at Hampton Court. But twelve days later, Jane died.' },
    { title: 'England in danger', text: 'Now the Pope has thrown Henry out of the Catholic Church. The Emperor and the King of France have made peace — and might invade England together!<br><br>Henry needs <b>allies</b>, <b>money</b> for defence… and a <b>new wife</b>. Your plan: marry Henry to a German princess, <b>Anne of Cleves</b>.' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 48', look: henryLook(1.38, '#a8642a'), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.letter ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Cromwell. Come in. I still dream of my sweet Jane, you know. She gave me my son, and God took her away.', next: 'b' },
          b: { text: 'But Edward is healthy, thank God. And England is in danger. The Pope calls me a heretic, and France and the Emperor are friends now. They could attack us together!', next: 'c' },
          c: { text: 'You have a plan, I hear. A German princess? Tell me, Cromwell — is she beautiful?', choices: [
            { t: '"Everyone says she is very beautiful, Majesty!"', fx: { favour: 6, honesty: -8 }, next: 'd1' },
            { t: '"I have not seen her, Majesty. I will send Master Holbein to paint her portrait."', fx: { favour: 2, honesty: 6 }, next: 'd2' },
          ] },
          d1: { text: 'Excellent! Then I am already half in love.', next: 'e' },
          d2: { text: 'Good thinking. Holbein paints the truth — I trust his eye.', next: 'e' },
          e: { text: 'Find out everything you can. Then write to the Duke of Cleves and ask for his sister\'s hand. Make it happen, Cromwell!', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Well? Have you written to the Duke of Cleves yet? I am not getting any younger, Cromwell!' } } },
        audience: { start: 'a', nodes: {
          a: { who: 'narrator', text: 'Months pass. The marriage is agreed. In January 1540, Anne of Cleves arrives in England. Henry rushes to meet her in disguise… but things do not go well.', next: 'b' },
          b: { text: 'CROMWELL! I have met the Lady Anne. I like her NOT! She is nothing like what people told me!', choices: [
            { t: '"It must be Holbein\'s fault, Majesty. He made her look too pretty."', fx: { favour: 2, honesty: -8 }, next: 'c1' },
            { t: '"Majesty, the alliance is still very important for England\'s safety."', fx: { favour: -6, honesty: 6 }, next: 'c2' },
            { t: '"I am very sorry, Majesty. I did my best."', fx: { favour: -2, honesty: 4 }, next: 'c2' },
          ] },
          c1: { text: 'Hmph. Maybe. But it was YOUR idea, Cromwell. Not Holbein\'s.', next: 'd' },
          c2: { text: 'England\'s safety… Yes, yes. I know. I will marry her, because I must. But I am NOT happy.', next: 'd' },
          d: { text: 'You have put me in this mess, Cromwell. Remember that. Remember it well.', next: 'end' },
          end: { who: 'narrator', text: 'Your enemies at court are watching closely. Let us see what really happened…', end: 'chapter' },
        } },
      },
    },
    {
      id: 'cranmer', name: 'Archbishop Thomas Cranmer', role: 'Archbishop of Canterbury', look: { robe: '#f0ece2', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#111', trim: '#1a1a1a', bg: '#2a3a5a' },
      pos: [13, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cranmer') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'My friend Cromwell! Look — the Great Bible, in ENGLISH, thanks to you. Now every church in England has one, and ordinary people can understand God\'s word.', fact: 'In 1539 the Great Bible was published in English. Cromwell ordered a copy to be placed in every church.', next: 'b' },
          b: { text: 'Your plan for Cleves is wise. Duke William of Cleves is an enemy of the Emperor. With Cleves as our friend, England will not stand alone.', fact: 'The Duke of Cleves ruled a small German state and was quarrelling with Emperor Charles V. That made him a useful ally for England.', next: 'c' },
          c: { text: 'But be careful. The Duke of Norfolk and the old Catholic lords hate our changes to the Church. If this marriage fails, they will blame you.', choices: [
            { t: '"Let them try. The King trusts me."', fx: { honesty: -2 } },
            { t: '"Thank you, my friend. I will be careful."', fx: { honesty: 4 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'I will pray that the marriage brings the King happiness. He has had so little of it.' } } },
      },
    },
    {
      id: 'norfolk', name: 'Thomas Howard, Duke of Norfolk', role: 'England\'s most powerful lord', look: { robe: '#2b2b4a', gown: '#5a3a1a', trim: '#d9ab3c', legs: '#222', hat: 'bonnet', hatColor: '#111', chain: true, width: 1.1, bg: '#2a2a4a' },
      pos: [-42, 8], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'norfolk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Well, if it isn\'t Master Cromwell. The blacksmith\'s boy, giving orders to dukes. How the world has changed.', fact: 'Rich nobles like the Duke of Norfolk looked down on Cromwell because his family were ordinary working people.', choices: [
            { t: '"I serve the King, my lord, as you do."', fx: { honesty: 2 }, next: 'b' },
            { t: '"At least I earned my place, my lord."', fx: { honesty: 4, favour: -2 }, next: 'b' },
          ] },
          b: { text: 'You have smashed the monasteries and filled the churches with your English Bibles. Many good people hate you for it.', next: 'c' },
          c: { text: 'And now a German bride for the King? Let us hope she pleases him. If not… well. My young niece, Catherine Howard, has just arrived at court. Such a pretty, cheerful girl.', fact: 'The Duke of Norfolk was the uncle of both Anne Boleyn and Catherine Howard.', choices: [
            { t: '"Is that a threat, my lord?"', fx: { honesty: 2 } },
            { t: '"Good day, my lord."', fx: {} },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'Still here, Cromwell? Enjoy your power… while it lasts.' } } },
      },
    },
    {
      id: 'monk', name: 'Brother John', role: 'A former monk', look: { robe: '#1e1e1e', long: true, hat: 'hood', hatColor: '#1e1e1e', bg: '#3a3a2a' },
      pos: [37, 48.6], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'monk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master Cromwell. You won\'t remember me. I was a monk at an abbey that your men closed down. I lived there for thirty years.', fact: 'Between 1536 and 1540, around 800 monasteries, nunneries and friaries were closed.', next: 'b' },
          b: { text: 'I was given a small pension, so I can eat. But what about the poor people we fed? The sick we cared for? The children we taught? Who helps them now?', fact: 'Monasteries gave food to the poor, cared for the sick and taught children. When they closed, many people lost this help.', choices: [
            { t: '"Some monasteries were badly run and very rich. The King needs that money."', fx: { favour: 2, honesty: 2 }, next: 'c' },
            { t: '"I am sorry. I had not thought about the poor."', fx: { honesty: 6 }, next: 'c' },
          ] },
          c: { text: 'In the North, thousands marched in protest — the Pilgrimage of Grace, they called it. The King promised to listen… then he executed the leaders.', fact: 'In 1536, around 30,000 people in the North rebelled against the closing of the monasteries. It was called the Pilgrimage of Grace.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I come here to watch the river. It is peaceful, like my abbey used to be.' } } },
      },
    },
    {
      id: 'holbein', name: 'Hans Holbein', role: 'The King\'s Painter', look: { robe: '#4a3a2a', gown: '#2a2016', trim: '#8a6a3a', legs: '#2a2016', hat: 'bonnet', hatColor: '#1a1a1a', beard: '#6a4a2a', bg: '#4a3a2a' },
      pos: [33, 6], yaw: Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'holbein') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Ah, Master Cromwell! I have just come back from Germany. Look — my portrait of the Lady Anne of Cleves.', fact: 'Hans Holbein was a German painter who worked for Henry VIII. He painted the most famous portraits of Henry.', next: 'b' },
          b: { text: 'I painted her face-on, just as I saw her. She is calm and gentle. She does not sing or play music, and she speaks only German — but she is very good at needlework.', fact: 'Anne of Cleves did not speak English when she arrived, but she learned quickly.', next: 'c' },
          c: { text: 'You know, my great painting of the King makes him look enormous and powerful, standing with his legs wide apart. That is what he wanted people to see!', fact: 'Holbein\'s famous portrait of Henry was designed to make him look strong and powerful.', choices: [
            { t: '"So portraits do not always show the plain truth?"', fx: { honesty: 4 }, next: 'd' },
            { t: '"Make sure the Lady Anne looks beautiful, Holbein!"', fx: { honesty: -4 }, next: 'd' },
          ] },
          d: { text: 'A painter shows what his master wishes, Master Cromwell. Remember that when you look at any portrait.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Mind the paint! It is still wet.' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#8a7a6a', width: 1.35, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master Cromwell. I will never forget October 1537. Prince Edward was born here, in this very palace! The bells rang and we cooked a feast for days.', fact: 'Prince Edward was born at Hampton Court on 12 October 1537. He was christened in the Chapel Royal.', next: 'b' },
          b: { text: 'And then, just twelve days later, poor Queen Jane died. The King wore black for months. It was the saddest time I can remember.', fact: 'Jane Seymour died at Hampton Court twelve days after Edward\'s birth. She was the only one of Henry\'s wives to be buried with him.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'The King eats more than ever these days. I need bigger pies!' } } },
      },
    },
  ],

  sources: [
    {
      id: 'valor', name: 'The Valor Ecclesiasticus', kind: 'book', pos: [7.2, 18.2], area: 'Your Study',
      date: '1535', origin: 'A huge survey ordered by Cromwell. Inspectors visited every church and monastery to write down what they owned.',
      text: 'Its Latin name means "the value of the Church". It lists the lands, money and treasures of every monastery in England.',
      about: 'Cromwell\'s inspectors also wrote reports claiming that many monks were lazy or badly behaved. Some of these reports were exaggerated to help the King.',
      question: { q: 'Why did Cromwell want to know how rich the monasteries were?', options: [
        { t: 'So the King could take their wealth.', ok: true, why: 'Exactly. The King took the monasteries\' land and treasure — and used some of it to build forts to defend England.' },
        { t: 'So he could give them more money.', ok: false, why: 'No — the money went the other way!' },
        { t: 'So he could become a monk.', ok: false, why: 'Cromwell had no plans to become a monk!' },
      ] },
    },
    {
      id: 'cleves', name: 'Portrait of Anne of Cleves', kind: 'portrait', pos: [37.3, 6], rot: -Math.PI / 2, area: 'Presence Chamber',
      portrait: ['#2a4a2a', '#6b3a1a', '#e9e0c9'],
      date: '1539', origin: 'Painted by Hans Holbein in Germany, to show the King what his bride looked like.',
      text: 'A calm young woman in a rich red dress and a pearl-covered headdress, looking straight at the viewer.',
      about: 'Henry agreed to marry Anne after seeing this portrait. When they met, he said she did not look like what he had been told. Was the portrait wrong? Historians still argue! Many think Holbein\'s painting was fair.',
      question: { q: 'Why should historians be careful with portraits?', options: [
        { t: 'Painters often showed people the way their master wanted them to look.', ok: true, why: 'Yes! Portraits are useful sources, but we must ask who made them and why.' },
        { t: 'Portraits are always completely accurate, like photographs.', ok: false, why: 'Paintings are made by people, who make choices about what to show.' },
        { t: 'Tudor paint was invisible.', ok: false, why: 'Ha! No — Tudor paintings can still be seen today.' },
      ] },
    },
    {
      id: 'ha', name: 'The "HA" Initials', kind: 'carving', pos: [-22.6, -19], area: 'Great Hall',
      date: '1532–1535', origin: 'Carved into the wood of the brand-new Great Hall, while Henry was in love with Anne Boleyn.',
      text: 'The letters H and A — for Henry and Anne — joined together, carved and painted gold.',
      about: 'After Anne was executed in 1536, carpenters were ordered to change the initials. But they missed some! You can still see "H and A" in the Great Hall at Hampton Court today.',
      question: { q: 'What does this carving tell historians?', options: [
        { t: 'The Great Hall was built while Henry was with Anne Boleyn.', ok: true, why: 'Well done! Buildings can be sources too — they tell us when things happened and who was important.' },
        { t: 'Henry did not like Anne Boleyn.', ok: false, why: 'The opposite — he put her initials all over his new hall!' },
        { t: 'Anne Boleyn was a carpenter.', ok: false, why: 'No — the carvings were made by the King\'s craftsmen.' },
      ] },
    },
  ],

  spots: [
    { id: 'desk', label: 'Write to the Duke of Cleves', anchor: 'desk', action: 'letter', objective: 'letter' },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'sources', text: 'Find 3 sources', done: (s) => ['valor', 'cleves', 'ha'].every((k) => s.sources[k]), after: ['meet'], targets: ['source:valor', 'source:cleves', 'source:ha'], count: (s) => ['valor', 'cleves', 'ha'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'people', text: 'Speak to Cranmer, Holbein, Norfolk and Brother John', done: (s) => ['cranmer', 'holbein', 'norfolk', 'monk'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:cranmer', 'npc:holbein', 'npc:norfolk', 'npc:monk'], count: (s) => ['cranmer', 'holbein', 'norfolk', 'monk'].filter((k) => talked(s, k)).length + '/4' },
    { id: 'cook', text: 'Bonus: Hear the kitchen\'s memories of Prince Edward', done: (s) => talked(s, 'cook'), after: ['meet'], targets: ['npc:cook'], optional: true },
    { id: 'letter', text: 'Write to the Duke of Cleves at your desk', done: (s) => !!s.letter, after: ['sources', 'people'], targets: ['spot:desk'] },
    { id: 'audience', text: 'Report to the King', done: (s) => !!s.flags.chapterDone, after: ['letter'], targets: ['npc:henry'] },
  ],

  letter: {
    to: 'Duke William of Cleves', title: 'A Letter to the Duke of Cleves',
    intro: 'Write to Duke William of Cleves to arrange a marriage between his sister Anne and King Henry. Be persuasive and polite — and use your evidence!',
    parts: [
      { label: 'Greeting', options: [
        { t: 'To the most noble Duke William of Cleves,', score: 2, why: 'Polite and correct.' },
        { t: 'Oi, Duke!', score: 0, why: 'Not the way to start a royal marriage!' },
      ] },
      { label: 'Why an alliance?', options: [
        { t: 'A friendship between England and Cleves will protect us both from the Emperor.', score: 2, needs: 'flag:talked_cranmer', why: 'Excellent — this was the real reason for the marriage.' },
        { t: 'England is very rich now, for we have taken the treasures of the monasteries.', score: 1, needs: 'valor', why: 'True, but boastful. Not very persuasive!' },
        { t: 'The King needs a wife, and any wife will do.', score: 0, why: 'Insulting to the Duke\'s sister!' },
      ] },
      { label: 'A compliment', options: [
        { t: 'Master Holbein\'s portrait of the Lady Anne has greatly pleased His Majesty.', score: 2, needs: 'cleves', why: 'Good — it shows the King is happy with the match.' },
        { t: 'We hear the Lady Anne is very skilled at needlework.', score: 1, needs: 'flag:talked_holbein', why: 'True and kind, if not very exciting!' },
      ] },
      { label: 'Your request', options: [
        { t: 'We ask that the Lady Anne may travel to England to marry the King.', score: 2, why: 'Clear and polite.' },
        { t: 'Send her quickly, before the King changes his mind!', score: 0, why: 'Oops! That sounds as if the King is not sure.' },
      ] },
      { label: 'Signing off', options: [
        { t: 'Thomas Cromwell, Lord Privy Seal of England.', score: 2, why: 'Your proper title. Very impressive.' },
        { t: 'Tom.', score: 0, why: 'Much too friendly for a letter between two countries!' },
      ] },
    ],
    sent: 'The letter is sealed and sent across the sea to Germany. Soon the marriage treaty is signed!',
  },

  history: [
    { year: '1540', icon: '💍', title: 'A disappointing wedding', text: 'Henry married Anne of Cleves in January 1540. When they first met, Henry was in disguise and Anne did not recognise him — some historians think this embarrassed him. Henry said, "I like her not."' },
    { year: '1540', icon: '🏡', title: 'The King\'s beloved sister', text: 'Just six months later, the marriage was annulled. Anne wisely agreed. She was given houses, money and the title "the King\'s beloved sister". She lived longer than any of Henry\'s other wives.' },
    { year: '1540', icon: '⚔️', title: 'Cromwell is arrested', text: 'Cromwell\'s enemies, led by the Duke of Norfolk, told the King that Cromwell was a traitor. At a council meeting in June, Cromwell was arrested. Norfolk tore the badge of honour from his neck.' },
    { year: '1540', icon: '🕯️', title: 'Executed', text: 'On 28 July 1540, Thomas Cromwell was executed. On the very same day, Henry married Norfolk\'s niece, Catherine Howard.' },
    { year: '1541', icon: '😔', title: 'Regret', text: 'Within a year, Henry said that he had been tricked into killing the most faithful servant he had ever had.' },
  ],
  fate: 'The Anne of Cleves marriage failed. Cromwell\'s enemies turned the King against him, and he was executed in 1540.',

  quiz: [
    { q: 'What did Henry close down and take money from?', options: ['Schools', 'Monasteries', 'Castles'], answer: 1, why: 'Around 800 monasteries were closed between 1536 and 1540.' },
    { q: 'Which wife gave Henry a son, Edward?', options: ['Jane Seymour', 'Anne of Cleves', 'Anne Boleyn'], answer: 0, why: 'Jane Seymour gave birth to Edward in 1537.' },
    { q: 'Where was Prince Edward born?', options: ['The Tower of London', 'Hampton Court Palace', 'Rome'], answer: 1, why: 'Edward was born at Hampton Court on 12 October 1537.' },
    { q: 'Why did Henry agree to marry Anne of Cleves?', options: ['For an alliance — and after seeing her portrait', 'She was his cousin', 'She was the Pope\'s daughter'], answer: 0, why: 'England needed allies, and Henry liked Holbein\'s portrait.' },
    { q: 'What happened to Thomas Cromwell?', options: ['He became Pope', 'He was executed in 1540', 'He married Anne of Cleves'], answer: 1, why: 'His enemies turned Henry against him.' },
  ],
  reflection: 'Was Cromwell a good advisor or a bad one? Think about the monasteries, the English Bible and the Anne of Cleves marriage. Explain your answer.',
};
