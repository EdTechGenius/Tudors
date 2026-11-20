// Chapter 3 — Thomas Cromwell, 1539–1540: "Find the King a Wife"
// This chapter plays differently: royal matchmaking, a portrait detective challenge,
// planning a welcome on a budget, and damage control when the marriage goes wrong.
import { henryLook } from './chapter1.js';
import { norfolkLook, kitLook } from './chapter2.js';

const talked = (s, id) => !!s.flags['talked_' + id];

export default {
  id: 3,
  advisor: 'Thomas Cromwell',
  short: 'Cromwell',
  v: 2,
  title: 'Find the King a Wife',
  years: '1539–1540',
  you: { robe: '#222', gown: '#2a2a2a', long: true, hat: 'cap', hatColor: '#111', trim: '#5a4a3a', width: 1.15, chain: true, bg: '#3a3a3a', photo: 'cromwell' },
  era: { greatHall: 'new', clock: false, haInitials: true },
  start: { x: 41, z: 0, yaw: -Math.PI / 2 },
  meters: { favour: 60, honesty: 45 },
  kingMood: true,
  kit: 'kit3',

  intro: [
    { title: 'The blacksmith\'s son', text: 'It is 1539. You are <b>Thomas Cromwell</b>, the son of a blacksmith from Putney. In your adventurous youth you were a soldier in Italy, a merchant in the Netherlands and then a lawyer in London. Now you are the King\'s chief minister, and the most powerful man in England.<br><br>It was you who made Henry <b>Supreme Head of the Church</b>, and it was you who closed hundreds of <b>monasteries</b>, sending their land and treasure to the King.' },
    { title: 'Seven troubled years', text: 'Much has happened since Thomas More\'s death. In 1536, <b>Anne Boleyn</b> was accused of terrible crimes (most historians believe the charges were invented) and she was executed. You played a leading part in her downfall.<br><br>Henry then married <b>Jane Seymour</b>. In 1537 she gave birth to a son, <b>Prince Edward</b>, right here at Hampton Court. Tragically, just twelve days later, Jane died.' },
    { title: 'England in danger', text: 'Now the Pope has thrown Henry out of the Catholic Church altogether. Worse still, the Emperor and the King of France have made peace with each other, and they might join forces to invade England!<br><br>Henry needs <b>allies</b>, <b>money</b> for defence… and a <b>new wife</b>. Your job is to find him the right bride.<br><br>This chapter is different. Watch the <b>King\'s face</b> to see his mood. You will compare <b>four possible brides</b>, test whether a <b>portrait</b> can be trusted, plan a royal welcome on a <b>budget</b>… and try to fix things when it all goes wrong!' },
  ],

  npcs: [
    {
      id: 'henry', name: 'King Henry VIII', role: 'King of England, aged 48', look: henryLook(1.38, '#a8642a'), pos: [47.2, 0], yaw: -Math.PI / 2,
      dialogue: (s) => (!talked(s, 'henry') ? 'intro' : s.tasks.budget ? 'audience' : 'waiting'),
      dialogues: {
        intro: { start: 'a', nodes: {
          a: { text: 'Come in, Cromwell. I still dream of my sweet Jane, you know. She gave me my son at last, and then God took her away from me. Sometimes I think that I shall never be happy again.', next: 'b' },
          b: { text: 'But Edward is strong and healthy, thanks be to God, and England must come first. The Pope calls me a heretic, and France and the Emperor have become friends. If they decide to attack us together, we could be in grave danger!', next: 'c' },
          c: { text: 'They tell me there are several ladies who might be my queen. Tell me honestly, Cromwell: will she be beautiful?', choices: [
            { t: '"I promise you she will be the most beautiful lady in Europe, Majesty!"', fx: { favour: 6, honesty: -8 }, next: 'd1' },
            { t: '"I cannot promise that, Majesty. But Master Holbein will paint the ladies, so you can see for yourself."', fx: { favour: 2, honesty: 6 }, next: 'd2' },
          ] },
          d1: { text: 'Excellent! Then I am already half in love with her.', next: 'e' },
          d2: { text: 'A sensible idea. Holbein paints the truth, and I trust his eye completely.', next: 'e' },
          e: { text: 'Find out everything you can. Then go to your desk, compare the ladies, and choose the best bride for me, and for England. Make it happen, Cromwell! You always do.', set: 'missionGiven' },
        } },
        waiting: { start: 'a', nodes: { a: { text: 'Well? Have you found me a bride yet? I am not getting any younger, Cromwell, and England cannot wait for ever. Check your tasks!' } } },
        audience: { start: 'a', nodes: {
          a: { who: 'narrator', text: 'On New Year\'s Day 1540, Henry rushes to Rochester in disguise to surprise Anne. She does not recognise the large stranger who tries to kiss her, and she politely turns away to watch a bull-baiting from the window. The King is humiliated…', next: 'b' },
          b: { text: 'CROMWELL! I have met the Lady Anne. I like her NOT! She is nothing like what I was told, nothing at all!', choices: [
            { t: '"It must be Holbein\'s fault, Majesty. He made her look too pretty."', fx: { favour: 2, honesty: -8 }, next: 'c1' },
            { t: '"Majesty, the alliance is still very important for England\'s safety."', fx: { favour: -6, honesty: 6 }, next: 'c2' },
            { t: '"I am very sorry, Majesty. I truly did my best."', fx: { favour: -2, honesty: 4 }, next: 'c2' },
          ] },
          c1: { text: 'Hmph. Perhaps. But it was YOUR idea, Cromwell, not Holbein\'s. You chose her, and you promised me she would please me.', next: 'd' },
          c2: { text: 'England\'s safety… Yes, yes, I know. I shall marry her, because I must. But I am NOT happy, and everyone will know it.', next: 'd' },
          d: { text: 'You have put me in this mess, Cromwell. Now get me OUT of it!', next: 'cr' },
          cr: { run: 'crisis', next: 'end' },
          end: { who: 'narrator', text: 'As you leave, you notice the Duke of Norfolk watching you with a cold smile. Your enemies at court sense a chance at last. Let us discover what really happened…', end: 'chapter' },
        } },
      },
    },
    {
      id: 'cranmer', name: 'Archbishop Thomas Cranmer', role: 'Archbishop of Canterbury', look: { robe: '#f0ece2', gown: '#1a1a1a', long: true, hat: 'cap', hatColor: '#111', trim: '#1a1a1a', bg: '#2a3a5a', photo: 'cranmer' },
      pos: [13, -25], yaw: -Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'cranmer') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'My dear friend Cromwell! Look at this: the Great Bible, printed in ENGLISH, thanks to you. Now every parish church in England has a copy, and ordinary people can understand God\'s word for themselves instead of hearing it in Latin.', fact: 'In 1539 the Great Bible was published in English. Cromwell ordered a copy to be placed in every church.', next: 'b' },
          b: { text: 'Your plan for Cleves is a wise one. Duke William of Cleves is an enemy of the Emperor, and his lands lie in a useful position. With Cleves as our friend, England will not have to stand alone.', fact: 'The Duke of Cleves ruled a small German state and was quarrelling with Emperor Charles V, which made him a useful ally for England.', next: 'c' },
          c: { text: 'But please be careful. The Duke of Norfolk and the old Catholic lords hate the changes we have made to the Church. If this marriage goes wrong, they will make sure that you take the blame.', choices: [
            { t: '"Let them try. The King trusts me."', fx: { honesty: -2 } },
            { t: '"Thank you, my friend. I will be careful."', fx: { honesty: 4 } },
          ] },
        } },
        again: { start: 'a', nodes: { a: { text: 'I shall pray that this marriage brings the King happiness. He has known so little of it these past few years.' } } },
      },
    },
    {
      id: 'norfolk', name: 'Thomas Howard, Duke of Norfolk', role: 'England\'s most powerful lord', look: norfolkLook,
      pos: [-42, 8], yaw: Math.PI, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'norfolk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Well, if it isn\'t Master Cromwell. The blacksmith\'s boy, giving orders to dukes and earls. How the world has changed, and not for the better.', fact: 'Rich nobles like the Duke of Norfolk looked down on Cromwell because his family were ordinary working people.', choices: [
            { t: '"I serve the King, my lord, just as you do."', fx: { honesty: 2 }, next: 'b' },
            { t: '"At least I earned my place, my lord."', fx: { honesty: 4, favour: -2 }, next: 'b' },
          ] },
          b: { text: 'You have smashed the ancient monasteries and filled the churches with your English Bibles. Many good, God-fearing people hate you for it, Cromwell, and they have long memories.', next: 'c' },
          c: { text: (s) => `And now you are finding a bride for the King? Then let me help you. My young niece, Catherine Howard, has just arrived at court. Such a pretty, cheerful girl! She would make a perfect lady-in-waiting for the new Queen. Arrange it, and the Howards will be your friends.${s.flags.kitTip ? ' (You remember Kit\'s warning…)' : ''}`, fact: 'The Duke of Norfolk was the uncle of both Anne Boleyn and Catherine Howard.', choices: [
            { t: '"What a kind idea, my lord. I will arrange it at once."', rival: false, fx: { favour: 2 }, next: 'd1' },
            { t: '"The new Queen should choose her own ladies, my lord."', rival: true, fx: { honesty: 4 }, next: 'd2' },
          ] },
          d1: { who: 'narrator', text: 'Norfolk bows and walks away, smiling. Too late, you see his trick: he wants his pretty niece close to the King, in case the new marriage goes wrong!', next: 'e' },
          d2: { text: '(His eyes narrow.) You see everything, don\'t you, Cromwell? Everything. We shall see how long that lasts.', next: 'e' },
          e: { who: 'narrator', text: 'In real life, Catherine Howard did become one of Anne of Cleves\'s ladies-in-waiting. That is where King Henry first noticed her.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Still here, Cromwell? Enjoy your power… while it lasts.' } } },
      },
    },
    {
      id: 'kit', name: 'Kit', role: 'A royal messenger, aged 17', look: { ...kitLook, apron: false, robe: '#7b1d1d', trim: '#d9ab3c', hat: 'bonnet', hatColor: '#222', scale: 0.92 },
      pos: [-22, -6], yaw: Math.PI / 2, optional: true, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'kit') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: (s) => (s.legacy.kit2
            ? 'My lord Cromwell! You won\'t know me. I\'m Kit. Years ago, when I was a kitchen boy, the Lord Chancellor helped me pick up the King\'s bread. I swore that I would always help the King\'s advisors in return.'
            : 'Oh. One of the King\'s great advisors. Years ago, when I was a kitchen boy, I dropped the King\'s bread and the Lord Chancellor just walked straight past me. You great men never notice people like me.'),
          next: (s) => (s.legacy.kit2 ? 'tip' : 'b') },
          tip: { text: 'So here is a secret, my lord. I carry letters all over the palace, and I hear things. The Duke of Norfolk wants to put his pretty niece, Catherine Howard, close to the King. Watch out for him!', set: 'kitTip', next: 'b' },
          b: { text: 'I\'m a royal messenger now. But my horse has gone lame, and I must carry the King\'s letters to Dover by tomorrow! If I\'m late, I\'ll lose my job.', choices: [
            { t: '"Take one of my own horses from the stables, Kit."', legacy: { kit3: true }, fx: { honesty: 3 }, next: 'c1' },
            { t: '"That is not my problem, boy."', legacy: { kit3: false }, next: 'c2' },
          ] },
          c1: { text: 'Your own horse? Thank you, my lord! I\'ll ride like the wind. I owe you a great favour now, and Kit always pays back a favour.' },
          c2: { who: 'narrator', text: 'Kit sighs and hurries away on foot.' },
        } },
        again: { start: 'a', nodes: { a: { text: (s) => (s.legacy.kit3 ? 'Thank you for the horse, my lord!' : 'I am busy, my lord.') } } },
      },
    },
    {
      id: 'monk', name: 'Brother John', role: 'A former monk', look: { robe: '#1e1e1e', long: true, hat: 'hood', hatColor: '#1e1e1e', bg: '#3a3a2a' },
      pos: [37, 48.6], yaw: Math.PI, optional: true, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'monk') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master Cromwell. You will not remember me, but I remember you. I was a monk at an abbey that your officials closed down. I had lived there, praying and working, for thirty years.', fact: 'Between 1536 and 1540, around 800 monasteries, nunneries and friaries were closed.', next: 'b' },
          b: { text: 'I was given a small pension, so at least I can eat. But what about the poor people we used to feed at our gate? The sick we cared for? The children we taught to read? Who will help them now?', fact: 'Monasteries gave food to the poor, cared for the sick and taught children. When they closed, many people lost this help.', choices: [
            { t: '"Some monasteries were badly run and very rich. The King needs that money to defend England."', fx: { favour: 2, honesty: 2 }, next: 'c' },
            { t: '"I am sorry. I had not thought enough about the poor."', fx: { honesty: 6 }, next: 'c' },
          ] },
          c: { text: 'In the North, tens of thousands of people marched in protest. They called it the Pilgrimage of Grace. The King promised to listen to them… and then he had their leaders executed.', fact: 'In 1536, around 30,000 people in the North rebelled against the closing of the monasteries. It was called the Pilgrimage of Grace.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'I come here to watch the river flow past. It is peaceful, just as my abbey used to be.' } } },
      },
    },
    {
      id: 'holbein', name: 'Hans Holbein', role: 'The King\'s Painter', look: { robe: '#4a3a2a', gown: '#2a2016', trim: '#8a6a3a', legs: '#2a2016', hat: 'bonnet', hatColor: '#1a1a1a', beard: '#6a4a2a', bg: '#4a3a2a' },
      pos: [33, 6], yaw: Math.PI / 2, when: (s) => talked(s, 'henry'),
      dialogue: (s) => (talked(s, 'holbein') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Ah, Master Cromwell! I have only just returned from Germany. Come and look: here is my portrait of the Lady Anne of Cleves.', fact: 'Hans Holbein was a German painter who worked for Henry VIII. He painted the most famous portraits of Henry.', next: 'b' },
          b: { text: 'I painted her facing straight towards us, exactly as I saw her. She is calm, gentle and dignified. She does not sing or play music, and she speaks only German, but she is extremely skilled at needlework.', fact: 'Anne of Cleves did not speak English when she arrived, but she learned it quickly.', next: 'c' },
          c: { text: 'You know, my great painting of the King on the palace wall at Whitehall makes him look enormous and powerful, standing with his legs wide apart like a warrior. That is precisely how he wanted the world to see him!', fact: 'Holbein\'s famous portrait of Henry was designed to make him look strong and powerful.', choices: [
            { t: '"So portraits do not always show the plain truth?"', fx: { honesty: 4 }, next: 'd' },
            { t: '"Make sure the Lady Anne looks beautiful, Holbein!"', fx: { honesty: -4 }, next: 'd' },
          ] },
          d: { text: 'A painter shows what his patron wishes to be seen, Master Cromwell. Remember that whenever you look at any portrait, including mine.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'Careful, the paint is still wet!' } } },
      },
    },
    {
      id: 'cook', name: 'Master Cook', role: 'Head of the kitchens', look: { robe: '#d8cfb8', legs: '#5a4a3a', hat: 'chef', apron: true, beard: '#8a7a6a', width: 1.35, bg: '#5a3a2a' },
      pos: [-12, -46], yaw: Math.PI / 2, optional: true,
      dialogue: (s) => (talked(s, 'cook') ? 'again' : 'main'),
      dialogues: {
        main: { start: 'a', nodes: {
          a: { text: 'Master Cromwell. I shall never forget October 1537. Prince Edward was born here, in this very palace! The bells rang all over England, and we cooked feasts for days on end.', fact: 'Prince Edward was born at Hampton Court on 12 October 1537. He was christened in the Chapel Royal.', next: 'b' },
          b: { text: 'And then, just twelve days later, poor Queen Jane died. The King wore black for months afterwards. It was the saddest time I can remember in all my years in this kitchen.', fact: 'Jane Seymour died at Hampton Court twelve days after Edward\'s birth. She was the only one of Henry\'s wives to be buried beside him.' },
        } },
        again: { start: 'a', nodes: { a: { text: 'The King eats more than ever these days. I shall need bigger pie dishes!' } } },
      },
    },
  ],

  sources: [
    {
      id: 'valor', name: 'The Valor Ecclesiasticus', kind: 'book', pos: [7.2, 18.2], area: 'Your Study',
      date: '1535', origin: 'A huge survey ordered by Cromwell. Officials visited every church and monastery to write down exactly what it owned.',
      text: 'Its Latin name means "the value of the Church". It lists the lands, money and treasures of every monastery in England.',
      about: 'Cromwell\'s inspectors also wrote reports claiming that many monks were lazy or badly behaved. Some of these reports were exaggerated to help the King.',
      question: { q: 'Why did Cromwell want to know how rich the monasteries were?', options: [
        { t: 'So the Pope would know how much tax to collect.', ok: false, why: 'No: England had broken away from the Pope by 1535.' },
        { t: 'So the monks could be paid fairer wages.', ok: false, why: 'No: monks did not earn wages, and the money went to the King.' },
        { t: 'So the richest monasteries could be given more land.', ok: false, why: 'No: the money went the other way!' },
        { t: 'So the King could take their land, money and treasure.', ok: true, why: 'Exactly. The King used some of this wealth to build forts to defend England.' },
      ] },
    },
    {
      id: 'cleves', name: 'Portrait of Anne of Cleves', kind: 'portrait', pos: [37.3, 6], rot: -Math.PI / 2, area: 'Presence Chamber', img: 'cleves',
      portrait: ['#2a4a2a', '#6b3a1a', '#e9e0c9'],
      date: '1539', origin: 'Painted by Hans Holbein in Germany, to show the King what his bride looked like.',
      text: 'A calm young woman in a rich red dress and a pearl-covered headdress, looking straight at the viewer.',
      about: 'Henry agreed to marry Anne after seeing this portrait. When they met, he complained that she did not look as he had been told. Was the portrait wrong? Historians still argue! Many think Holbein\'s painting was fair.',
      question: { q: 'Why should historians be careful with portraits?', options: [
        { t: 'Painters often showed people as their patron wanted them to look.', ok: true, why: 'Yes! Portraits are useful sources, but we must ask who made them and why.' },
        { t: 'Portraits were always painted many years after the person died.', ok: false, why: 'Not always: Holbein painted Anne from life in 1539.' },
        { t: 'Tudor painters were not allowed to paint women\'s faces.', ok: false, why: 'No: Holbein painted many women, including several queens.' },
        { t: 'Paint fades so much that we can no longer see the faces.', ok: false, why: 'No: Tudor paintings can still be seen clearly today.' },
      ] },
    },
    {
      id: 'ha', name: 'The "HA" Initials', kind: 'carving', pos: [-22.6, -19], area: 'Great Hall',
      date: '1532–1535', origin: 'Carved into the wood of the brand-new Great Hall, while Henry was in love with Anne Boleyn.',
      text: 'The letters H and A, for Henry and Anne, joined together, carved and painted gold.',
      about: 'After Anne was executed in 1536, carpenters were ordered to change the initials. But they missed some! You can still see "H and A" in the Great Hall at Hampton Court today.',
      question: { q: 'What does this carving tell historians?', options: [
        { t: 'Anne Boleyn designed the Great Hall herself.', ok: false, why: 'No: the hall was designed and built by the King\'s craftsmen.' },
        { t: 'The hall was built while Henry was with Anne Boleyn.', ok: true, why: 'Well done! Buildings can be sources too: they tell us when things happened and who was important.' },
        { t: 'Henry built the hall after Anne\'s death, in her memory.', ok: false, why: 'No: after her death, Henry ordered the initials to be changed!' },
        { t: 'Victorian builders added the initials as decoration.', ok: false, why: 'No: the initials date from Tudor times, 1532 to 1535.' },
      ] },
    },
  ],

  spots: [
    { id: 'match', label: 'Compare the possible brides', anchor: 'desk', action: 'run', run: 'matchmaker', objective: 'match' },
    { id: 'portrait', label: 'Portrait detective: can you trust a painting?', pos: [31, -8], action: 'run', run: 'portrait', objective: 'portrait' },
    { id: 'desk', label: 'Write to the Duke of Cleves', anchor: 'desk', action: 'letter', objective: 'letter' },
    { id: 'budget', label: 'Plan the royal welcome with the Treasurer\'s accounts', pos: [-12, -22], action: 'run', run: 'budget', objective: 'budget' },
  ],

  objectives: [
    { id: 'meet', text: 'Speak to King Henry in his Privy Chamber', done: (s) => talked(s, 'henry'), targets: ['npc:henry'] },
    { id: 'people', text: 'Speak to Cranmer, Holbein and the Duke of Norfolk', done: (s) => ['cranmer', 'holbein', 'norfolk'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:cranmer', 'npc:holbein', 'npc:norfolk'], count: (s) => ['cranmer', 'holbein', 'norfolk'].filter((k) => talked(s, k)).length + '/3' },
    { id: 'sources', text: 'Find 3 sources', done: (s) => ['valor', 'cleves', 'ha'].every((k) => s.sources[k]), after: ['meet'], targets: ['source:valor', 'source:cleves', 'source:ha'], count: (s) => ['valor', 'cleves', 'ha'].filter((k) => s.sources[k]).length + '/3' },
    { id: 'bonus', text: 'Bonus: Find Brother John, the Master Cook and a royal messenger', done: (s) => ['monk', 'cook', 'kit'].every((k) => talked(s, k)), after: ['meet'], targets: ['npc:monk', 'npc:cook', 'npc:kit'], optional: true },
    { id: 'match', text: 'Royal matchmaking: compare the brides at your desk', done: (s) => !!s.tasks.matchmaker, after: ['people', 'sources'], targets: ['spot:match'] },
    { id: 'portrait', text: 'Portrait detective in the Presence Chamber', done: (s) => !!s.tasks.portrait, after: ['match'], targets: ['spot:portrait'] },
    { id: 'letter', text: 'Write to the Duke of Cleves at your desk', done: (s) => !!s.letter, after: ['portrait'], targets: ['spot:desk'] },
    { id: 'budget', text: 'Plan Anne\'s welcome in the Great Hall', done: (s) => !!s.tasks.budget, after: ['letter'], targets: ['spot:budget'] },
    { id: 'audience', text: 'Report to the King', done: (s) => !!s.flags.chapterDone, after: ['budget'], targets: ['npc:henry'] },
  ],

  activities: {
    matchmaker: {
      type: 'matchmaker', label: 'Royal matchmaking', icon: '💍',
      title: 'Royal matchmaking', heading: 'Who should be the next Queen?',
      intro: 'The King needs a new wife who brings England a strong <b>ally</b> against the Emperor and France. Read about each lady. For each one, decide: would she be <b>good for England\'s safety</b>? Remember: what Henry WANTS is not always what England NEEDS!',
      candidates: [
        { id: 'christina', name: 'Christina of Denmark', who: 'Duchess of Milan, aged 17', img: 'christina',
          facts: ['The niece of <b>Emperor Charles V</b>, England\'s most dangerous enemy', 'A young widow: her husband died in 1535', 'Holbein painted this portrait of her in 1538', 'The Emperor keeps delaying his answer'],
          henry: 'Clever, witty and very pretty. Henry liked her portrait very much!', england: false,
          verdict: 'Not good for England now. Her uncle, the Emperor, is the danger, and he will not let her marry Henry.',
          pick: 0, pickWhy: 'The Emperor would never allow it. A famous story says that Christina joked: "If I had two heads, one would be at the King of England\'s service!"' },
        { id: 'guise', name: 'Marie of Guise', who: 'A French noblewoman, aged 23', img: 'guise',
          facts: ['From a powerful French family', '<b>Already married</b> to King James V of Scotland in 1538', 'Tall and strong, with a young son', 'France has just made friends with the Emperor'],
          henry: 'Henry said that he was a big man, so he needed a big wife!', england: false,
          verdict: 'Not possible. She has already married the King of Scotland!',
          pick: 0, pickWhy: 'She was already married to the King of Scotland! A famous story says she joked: "I may be a big woman, but I have a very little neck." (Think about what happened to Anne Boleyn…)' },
        { id: 'anne', name: 'Anne of Cleves', who: 'Sister of the Duke of Cleves, aged 24', img: 'cleves',
          facts: ['Her brother, Duke William, is an <b>enemy of the Emperor</b>', 'Cleves has friends among the German princes', 'She is free to marry', 'She speaks only German, and is skilled at needlework'],
          henry: 'Calm and gentle. She does not sing, dance or play music.', england: true,
          verdict: 'Good for England. Cleves is an enemy of the Emperor, and she is free to marry.',
          pick: 2, pickWhy: 'Excellent! This was Cromwell\'s real choice: a strong ally against the Emperor, and a bride who was free to marry.' },
        { id: 'amalia', name: 'Amalia of Cleves', who: 'Anne\'s younger sister, aged 22', look: { female: true, robe: '#5a2a1a', hat: 'gable', hatColor: '#2a1a10', trim: '#d9ab3c', bg: '#3a4a2a' },
          facts: ['From the same family, so the <b>same useful alliance</b>', 'She is free to marry', 'Holbein painted her too, but the picture is lost', 'She is younger, and less well known'],
          henry: 'Almost nothing. Nobody at Henry\'s court has met her.', england: true,
          verdict: 'Good for England. She brings the same alliance as her sister, and she is free to marry.',
          pick: 1, pickWhy: 'A sensible choice: the same alliance! But the Duke offered his elder sister, Anne, and she was the one Cromwell chose.' },
      ],
      reasons: [
        { t: 'She brings a strong ally against the Emperor, and she is free to marry.', ok: true, why: 'That is the best reason. England needed friends against the Emperor and France.' },
        { t: 'She looks the most beautiful lady of all in the portraits.', ok: false, why: 'Beauty pleases Henry, but England needs allies more. And can you trust a portrait?' },
        { t: 'She is the youngest, so she is sure to have many sons.', ok: false, why: 'Henry did want more sons, but nobody could be sure of that. The alliance was the main reason.' },
        { t: 'Her uncle is the Emperor, so he will have to be our friend.', ok: false, why: 'Not so. The Emperor was the danger, and he was not willing to help England.' },
      ],
      real: 'Cromwell chose <b>Anne of Cleves</b>, because Cleves was an enemy of the Emperor and she was free to marry. The rest of this chapter follows what really happened.',
    },
    portrait: {
      type: 'portraitDetective', label: 'Portrait detective', icon: '🖼️',
      title: 'Portrait detective', heading: 'Can you trust a painting?', img: 'cleves',
      intro: 'Henry agreed to marry Anne of Cleves after seeing this portrait by Hans Holbein. But did she really look like it? Read what different people said (their words have been simplified). Decide whether each person thought she <b>looked like the painting</b> or <b>did not</b>.',
      statements: [
        { who: 'Nicholas Wotton, the English ambassador in Cleves', when: 'August 1539', quote: 'Holbein has made the likeness of my Lady Anne very lively.', side: true, why: '"Very lively" meant "very lifelike". Wotton met Anne many times. But he was the King\'s servant, and he wanted the marriage to happen.' },
        { who: 'King Henry VIII', when: 'January 1540', quote: 'She is nothing so fair as she has been reported.', side: false, why: 'Henry was embarrassed after their first meeting went badly, and he wanted a way out of the marriage.' },
        { who: 'Charles de Marillac, the French ambassador', when: '1540', quote: 'She is not as young as people expected, nor as beautiful as everyone said.', side: false, why: 'France did not want England and Cleves to become friends, so the French ambassador may have been happy to report bad news.' },
        { who: 'The Earl of Southampton, who welcomed Anne at Calais', when: 'December 1539', quote: 'The Lady Anne is a fair and gracious lady, as fine as her picture.', side: true, why: 'The marriage was already agreed, and he wanted to please the King. Later, Henry angrily asked him why he had praised her so much!' },
      ],
      question: { q: 'So, can we trust Holbein\'s painting of Anne of Cleves?', options: [
        { t: 'Partly: we must compare it with other sources and ask why each person said what they did.', ok: true, why: 'That is how historians think: compare the sources, and ask who made each one and why.' },
        { t: 'Completely: paintings always show people exactly as they looked, just like photographs.', ok: false, why: 'Painters often flattered people, especially kings and queens.' },
        { t: 'Not at all: Henry was the King, so he must have been the one telling the truth.', ok: false, why: 'Henry had his own reasons for complaining. Being important does not make someone unbiased.' },
        { t: 'Not at all: Holbein was always paid to make every royal lady look more beautiful.', ok: false, why: 'Many people who met Anne thought that Holbein\'s portrait was a fair likeness.' },
      ] },
      after: 'Most historians today think Holbein\'s painting was a fair likeness. The real problem may have been the first meeting at Rochester, where Henry turned up in disguise!',
    },
    budget: {
      type: 'budget', label: 'Planning the royal welcome', icon: '💰',
      title: 'Plan the royal welcome', heading: 'Welcome, Lady Anne!', budget: 1000,
      intro: 'The marriage treaty is signed! Now you must plan Anne\'s journey from Calais to London, and her grand welcome. The King\'s Treasurer has given you <b>£1,000</b>. Choose carefully: what is <b>essential</b>, and what is just for show? (The prices are made up for this game.)',
      items: [
        { id: 'ships', icon: '🚢', name: 'Warships to guard her crossing', desc: 'The sea is full of pirates and French ships.', cost: 300, essential: true, why: 'Anne must cross the sea safely. Without protection, the whole alliance could sink!' },
        { id: 'horses', icon: '🐎', name: 'Horses and carriages from Dover to London', desc: 'A journey of over 70 miles in the middle of winter.', cost: 150, essential: true, why: 'Anne and her 260 servants need a way to travel to London.' },
        { id: 'tents', icon: '⛺', name: 'Golden tents for the meeting at Blackheath', desc: 'Cloth of gold, to show off England\'s wealth.', cost: 250 },
        { id: 'cannon', icon: '💥', name: 'A cannon salute from the Tower and the ships', desc: 'BOOM! A noisy royal welcome.', cost: 50 },
        { id: 'gowns', icon: '👗', name: 'New gowns for 100 ladies of the court', desc: 'Velvet and silk in the latest fashions.', cost: 200 },
        { id: 'feast', icon: '🍖', name: 'A welcome feast for 1,000 guests', desc: 'Roast swans, peacocks and sugar sculptures.', cost: 250 },
        { id: 'gift', icon: '💎', name: 'A jewelled gift from the King', desc: 'Sable furs and a golden brooch.', cost: 150 },
        { id: 'masque', icon: '🎭', name: 'A masque with dancers and musicians', desc: 'A play with music, costumes and dancing.', cost: 100 },
        { id: 'tutor', icon: '🔤', name: 'An English tutor for the Lady Anne', desc: 'Holbein says she speaks only German!', cost: 10, bonus: true, why: 'A clever and cheap idea! The real Anne learned English quickly once she arrived.' },
      ],
      maths: { q: 'There are 20 shillings in one pound (£1). The cannon salute cost £50. How many shillings is that?', hint: 'Tudor money: 12 pennies = 1 shilling, and 20 shillings = £1.', options: ['70 shillings', '500 shillings', '1,000 shillings', '2,000 shillings'], answer: 2, why: '50 × 20 = 1,000 shillings.' },
    },
    crisis: {
      type: 'crisis', label: 'Damage control', icon: '🔥',
      title: 'Damage control', start: { alliance: 70, safety: 60 },
      rounds: [
        { year: '2 January 1540', title: 'The King wants a way out',
          text: 'Henry is furious after meeting Anne at Rochester. He shouts: <i>"Is there no remedy? Must I put my neck in the yoke?"</i> He wants you to find a way to stop the wedding, which is only four days away.',
          choices: [
            { t: 'Search for a legal reason: was Anne once promised to another prince?', mood: 6, alliance: -10, safety: 5, result: 'The King is pleased that you are trying. But the Cleves ambassadors are offended by your questions.' },
            { t: 'Tell the King that he must marry her, for England\'s safety.', mood: -10, alliance: 10, safety: -10, result: 'Honest, and wise for England… but the King glares at you. He will not forget this.' },
            { t: 'Blame Holbein and the ambassadors for describing her wrongly.', mood: 4, alliance: 0, safety: -8, result: 'The King calms down a little, but the other councillors are furious that you blamed them. Now you have even more enemies.' },
          ],
          real: 'Cromwell really did search for a legal way out. Anne had once been promised to the son of the Duke of Lorraine, but the Cleves ambassadors proved that the promise had been cancelled.' },
        { year: '6 January 1540', title: 'The wedding day',
          text: 'There is no way out. The Emperor and the King of France are watching closely. If Henry sends Anne home now, her brother will be insulted, and England will be alone. What do you advise?',
          choices: [
            { t: 'Go ahead with the wedding to keep the alliance safe.', mood: -6, alliance: 15, safety: -4, result: 'The wedding takes place at Greenwich Palace. The King grumbles all the way through it.' },
            { t: 'Delay the wedding for a few months.', mood: 4, alliance: -12, safety: 0, result: 'The Duke of Cleves is insulted by the delay, and the Emperor laughs at England.' },
            { t: 'Send Anne home to Cleves at once.', mood: 10, alliance: -30, safety: -6, result: 'The King is relieved, but the alliance is destroyed, and England is alone again.' },
          ],
          real: 'Henry married Anne on 6 January 1540. He told Cromwell: <i>"If it were not to satisfy the world and my realm, I would not do what I must do this day."</i>' },
        { year: 'June 1540', title: 'Your enemies strike',
          text: 'The Emperor and France have quarrelled again, so England no longer needs Cleves so badly. The Duke of Norfolk is whispering to the King that you are a heretic, and his niece, Catherine Howard, has caught the King\'s eye. What do you do?',
          choices: [
            { t: 'Help the King end his marriage to Anne as quickly as possible.', mood: 8, alliance: -15, safety: 5, result: 'The King is grateful… but is it already too late?' },
            { t: 'Arrest some of Norfolk\'s friends before they can strike.', mood: -4, alliance: 0, safety: 8, result: 'Bold! But it makes Norfolk even more determined to destroy you.' },
            { t: 'Remind the King of all your years of faithful service.', mood: 2, alliance: 0, safety: -4, result: 'Henry listens, but his mind is already on young Catherine Howard.' },
          ],
          real: 'On 10 June 1540, Cromwell was arrested at a Council meeting. From the Tower, he helped the King to end the marriage, and he wrote to Henry: <i>"Most gracious Prince, I cry for mercy, mercy, mercy."</i>' },
      ],
      ending: 'Damage control is one of the hardest jobs for any advisor. Cromwell kept England safe for a while. But once the alliance was no longer needed, the King blamed him for the marriage, and his enemies saw their chance.',
    },
  },

  letter: {
    to: 'Duke William of Cleves', title: 'A Letter to the Duke of Cleves',
    intro: 'Write to Duke William of Cleves to arrange a marriage between his sister Anne and King Henry. Be persuasive and polite, use your evidence, and then sign the letter with your quill!',
    parts: [
      { label: 'Greeting', options: [
        { t: 'To the most noble Duke William of Cleves,', score: 2, why: 'Polite and correct.' },
        { t: 'Oi, Duke!', score: 0, why: 'Not the way to start a royal marriage!' },
      ] },
      { label: 'Why an alliance?', options: [
        { t: 'A friendship between England and Cleves will protect us both from the Emperor.', score: 2, needs: 'flag:talked_cranmer', why: 'Excellent: this was the real reason for the marriage.' },
        { t: 'England is very rich now, for we have taken the treasures of the monasteries.', score: 1, needs: 'valor', why: 'True, but boastful. Not very persuasive!' },
        { t: 'The King needs a wife, and any wife will do.', score: 0, why: 'Insulting to the Duke\'s sister!' },
      ] },
      { label: 'A compliment', options: [
        { t: 'Master Holbein\'s portrait of the Lady Anne has greatly pleased His Majesty.', score: 2, needs: 'cleves', why: 'Good: it shows the King is happy with the match.' },
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
    sent: 'The letter is sealed and sent across the sea to Germany. Soon afterwards, the marriage treaty is signed!',
  },

  history: [
    { img: 'cleves', year: '1540', icon: '💍', title: 'A disappointing wedding', text: 'Henry married Anne of Cleves in January 1540. When they first met, Henry was in disguise and Anne did not recognise him; some historians think this embarrassed him. Afterwards he said, "I like her not."' },
    { img: 'hever', year: '1540', icon: '🏡', title: 'The King\'s beloved sister', text: 'Just six months later, the marriage was annulled. Anne wisely agreed. She was given houses, money and the title "the King\'s beloved sister", and she lived longer than any of Henry\'s other wives.' },
    { img: 'cromwell', year: '1540', icon: '⚔️', title: 'Cromwell is arrested', text: 'Cromwell\'s enemies, led by the Duke of Norfolk, told the King that Cromwell was a traitor and a heretic. At a council meeting in June, Cromwell was arrested. Norfolk tore the badge of honour from his neck.' },
    { img: 'tower', year: '1540', icon: '🕯️', title: 'Executed', text: 'On 28 July 1540, Thomas Cromwell was executed. On the very same day, Henry married Norfolk\'s niece, Catherine Howard.' },
    { img: 'henry', year: '1541', icon: '😔', title: 'Regret', text: 'Within a year, Henry said that he had been tricked into killing the most faithful servant he had ever had.' },
  ],
  fate: 'The Anne of Cleves marriage failed. Cromwell\'s enemies turned the King against him, and he was executed in 1540.',

  quiz: [
    { type: 'mc', skill: 'retrieve', q: 'Which of Henry\'s wives gave birth to Prince Edward?', options: ['Catherine of Aragon', 'Anne Boleyn', 'Jane Seymour', 'Anne of Cleves', 'Catherine Howard', 'Catherine Parr'], answer: 2, why: 'Jane Seymour gave birth to Edward at Hampton Court in October 1537.' },
    { type: 'gap', skill: 'retrieve', text: 'Thomas Cromwell was the son of a ___ from Putney. As Henry\'s chief minister, he closed around 800 ___ and sent their land and treasure to the King. In the North, about 30,000 people rebelled in the Pilgrimage of ___. Cromwell also ordered that the Great ___, written in English, should be placed in every church. In 1537, Queen Jane Seymour gave birth to Prince ___ at Hampton Court. To find allies against the ___, Cromwell arranged for Henry to marry Anne of ___. Henry had seen her portrait by Hans ___, but when they met he said, "I like her ___." Cromwell\'s enemies, led by the Duke of ___, turned the King against him.',
      answers: ['blacksmith', 'monasteries', 'Grace', 'Bible', 'Edward', 'Emperor', 'Cleves', 'Holbein', 'not', 'Norfolk'],
      bank: ['blacksmith', 'monasteries', 'Grace', 'Bible', 'Edward', 'Emperor', 'Cleves', 'Holbein', 'not', 'Norfolk', 'butcher', 'castles', 'Arthur', 'well', 'Suffolk', 'Pope'],
      why: 'Cromwell rose from humble beginnings to enormous power, then fell just as quickly.' },
    { type: 'match', skill: 'vocab', q: 'Match each word to its meaning.', pairs: [
      ['monastery', 'A building where monks lived, worked and prayed'],
      ['alliance', 'An agreement between countries to help each other'],
      ['pension', 'Money paid regularly to someone who has stopped working'],
      ['patron', 'A person who pays an artist and tells them what they want'],
      ['heretic', 'A person whose beliefs go against the Church\'s teaching'],
    ], why: 'All five words appear in Cromwell\'s story.' },
    { type: 'mc', skill: 'vocab', q: 'The closing of the monasteries is called the "Dissolution". What does "dissolution" mean here?', options: ['Repairing something old and broken', 'Moving something to a new place', 'Bringing something to an end', 'Making something larger and richer'], answer: 2, why: 'The monasteries were dissolved: closed down for good.' },
    { type: 'mc', skill: 'infer', q: 'Norfolk wanted his niece, Catherine Howard, to become one of the new Queen\'s ladies-in-waiting. What was he really hoping for?', options: ['That his niece would keep a close eye on Anne of Cleves for him', 'That the King would notice his niece if the marriage failed', 'That his niece would teach the new Queen to speak English', 'That the King would reward him with a place at the wedding'], answer: 1, why: 'Norfolk hoped his niece would catch the King\'s eye, which is exactly what happened.' },
    { type: 'mc', skill: 'infer', q: 'Why might some of the inspectors\' reports about lazy, badly behaved monks be unreliable?', options: ['The reports were written years after the monasteries closed', 'The inspectors were monks who wanted to protect their friends', 'The inspectors knew the King wanted reasons to close them', 'The inspectors could not read or write very well at all'], answer: 2, why: 'The inspectors knew what answer Cromwell and the King wanted to hear.' },
    { type: 'mc', skill: 'infer', q: 'Henry later said he had been tricked into killing "the most faithful servant he ever had". What does this suggest?', options: ['He believed Cromwell really had been plotting against him', 'He realised Cromwell\'s enemies had lied to him about Cromwell', 'He was pleased that Norfolk had become his chief minister', 'He thought Anne of Cleves had tricked him into the marriage'], answer: 1, why: 'Henry came to believe that Norfolk and his friends had turned him against an innocent man.' },
    { type: 'order', skill: 'sequence', q: 'Put these events in the order they happened.', items: ['Anne Boleyn is executed (May 1536)', 'The Pilgrimage of Grace begins (October 1536)', 'Prince Edward is born (October 1537)', 'Henry marries Anne of Cleves (January 1540)', 'Cromwell is executed (July 1540)'], why: 'In just four years, Henry\'s court changed completely.' },
    { type: 'write', skill: 'explain', q: 'Explain why the Dissolution of the Monasteries was good for the King but bad for many ordinary people.', model: 'It was good for the King because he took the monasteries\' land, money and treasure, which made him much richer and paid for defences. It was bad for ordinary people because the monasteries had fed the poor, cared for the sick and taught children, and that help disappeared.', checklist: ['I explained how the King gained (money, land or treasure)', 'I explained how ordinary people lost out (food, care or schooling)', 'I used "because" or "but" to compare'] },
    { type: 'write', skill: 'predict', q: 'Henry has just married young Catherine Howard. Predict what you think might happen next, and give a reason.', model: 'I predict that the marriage might go wrong, because Henry is much older than Catherine and his marriages have often ended badly. Her powerful family, the Howards, also have many enemies at court.', checklist: ['I made a clear prediction', 'I gave a reason using what I know so far', 'I used "because"'] },
    { type: 'mc', skill: 'summarise', q: 'Which sentence is the BEST summary of this chapter?', options: ['Cromwell closed the monasteries because the monks were lazy, and he was rewarded when Henry married Anne of Cleves.', 'Cromwell made Henry rich by closing the monasteries, but the failed Cleves marriage let his enemies destroy him.', 'Cromwell arranged the Cleves marriage to please the Pope, and Henry executed him for closing the monasteries.', 'Cromwell was executed for painting a portrait that made Anne of Cleves look prettier than she really was.'], answer: 1, why: 'A good summary covers the most important events accurately, not just one detail.' },
  ],
  reflection: 'Was Cromwell a good advisor or a bad one? Think about the monasteries, the English Bible and the Anne of Cleves marriage. Explain your answer.',
};
