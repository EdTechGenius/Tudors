// Shared content: the six wives, the timeline, and palace staff who share facts.

export const WIVES = [
  { id: 'aragon', name: 'Catherine of Aragon', married: '1509', fate: 'Divorced', fateLong: 'Marriage annulled in 1533',
    note: 'A Spanish princess, first married to Henry\'s older brother Arthur. Mother of Mary I. She never accepted that her marriage was over. Died in 1536.',
    early: 'A Spanish princess, first married to Henry\'s older brother Arthur. Mother of Princess Mary.',
    look: { photo: 'aragon',  female: true, robe: '#3b2a4a', hat: 'gable', hatColor: '#1a1a1a', trim: '#c9a43b', bg: '#5a2a2a' } },
  { id: 'boleyn', name: 'Anne Boleyn', married: '1533', fate: 'Beheaded', fateLong: 'Executed in 1536',
    note: 'Clever and well-educated, she grew up partly in France. Mother of Elizabeth I.',
    early: 'Clever and well-educated, she grew up partly in France.',
    look: { photo: 'boleyn',  female: true, robe: '#1d1d2b', hat: 'french', hatColor: '#111', hair: '#2a1a10', trim: '#d9ab3c', bg: '#2a3a5a' } },
  { id: 'seymour', name: 'Jane Seymour', married: '1536', fate: 'Died', fateLong: 'Died in 1537, soon after giving birth',
    note: 'Gave Henry the son he wanted: Edward, born at Hampton Court. Her motto was "Bound to obey and serve".',
    look: { photo: 'seymour',  female: true, robe: '#7a2a2a', hat: 'gable', hatColor: '#2a1a10', trim: '#d9ab3c', bg: '#3a5a3a' } },
  { id: 'cleves', name: 'Anne of Cleves', married: '1540', fate: 'Divorced', fateLong: 'Marriage annulled in 1540',
    note: 'A German princess. Henry chose her after seeing her portrait. After the annulment she was given houses and money and called "the King\'s beloved sister".',
    look: { photo: 'cleves',  female: true, robe: '#6b3a1a', hat: 'cap', hatColor: '#e9e0c9', trim: '#d9ab3c', bg: '#5a4a2a' } },
  { id: 'howard', name: 'Catherine Howard', married: '1540', fate: 'Beheaded', fateLong: 'Executed in 1542',
    note: 'A young cousin of Anne Boleyn and niece of the powerful Duke of Norfolk. Henry called her his "rose without a thorn".',
    early: 'A young cousin of Anne Boleyn and niece of the powerful Duke of Norfolk.',
    look: { photo: 'howard',  female: true, robe: '#7a2a4a', hat: 'french', hatColor: '#222', hair: '#8a5a2a', trim: '#d9ab3c', bg: '#5a2a4a' } },
  { id: 'parr', name: 'Catherine Parr', married: '1543', fate: 'Survived', fateLong: 'Outlived Henry',
    note: 'Married Henry at Hampton Court. She was the first English queen to publish a book under her own name, and she brought Henry\'s three children together.',
    look: { photo: 'parr',  female: true, robe: '#8e1f22', hat: 'french', hatColor: '#222', hair: '#8a4a1a', trim: '#d9ab3c', bg: '#2a4a4a' } },
];

// What pupils know about each wife at the start (s) and end (e) of each chapter.
// 'hidden' | 'known' (name and story so far) | 'married' | 'fate'
export const WIFE_STATUS = {
  1: { s: { aragon: 'married', boleyn: 'known' }, e: { aragon: 'married', boleyn: 'known' } },
  2: { s: { aragon: 'married', boleyn: 'known' }, e: { aragon: 'fate', boleyn: 'married' } },
  3: { s: { aragon: 'fate', boleyn: 'fate', seymour: 'fate' }, e: { aragon: 'fate', boleyn: 'fate', seymour: 'fate', cleves: 'fate', howard: 'married' } },
  4: { s: { aragon: 'fate', boleyn: 'fate', seymour: 'fate', cleves: 'fate', howard: 'married' }, e: { aragon: 'fate', boleyn: 'fate', seymour: 'fate', cleves: 'fate', howard: 'fate', parr: 'fate' } },
};

// Timeline events revealed at the start (s) or end (e) of a chapter.
export const TIMELINE = [
  { y: 1491, t: 'Henry is born, the second son of King Henry VII.', ch: 1, at: 's' },
  { y: 1502, t: 'Henry\'s older brother Arthur dies. Henry is now heir to the throne.', ch: 1, at: 's' },
  { y: 1509, t: 'Henry becomes King Henry VIII, aged 17, and marries Catherine of Aragon, Arthur\'s widow.', ch: 1, at: 's' },
  { y: 1515, t: 'Thomas Wolsey becomes Lord Chancellor and a Cardinal. He starts building Hampton Court.', ch: 1, at: 's' },
  { y: 1516, t: 'Princess Mary is born — the only one of Catherine\'s children to survive.', ch: 1, at: 's' },
  { y: 1527, t: 'Henry asks the Pope to annul his marriage. The Emperor\'s army attacks Rome.', ch: 1, at: 's' },
  { y: 1528, t: 'Wolsey gives Hampton Court to the King.', ch: 1, at: 'e' },
  { y: 1529, t: 'A special court at Blackfriars fails to end Henry\'s marriage. Wolsey loses his job.', ch: 1, at: 'e' },
  { y: 1530, t: 'Wolsey is arrested for treason and dies on the way to London.', ch: 1, at: 'e' },
  { y: 1532, t: 'Sir Thomas More resigns as Lord Chancellor.', ch: 2, at: 'e' },
  { y: 1533, t: 'Henry marries Anne Boleyn. Archbishop Cranmer declares his first marriage void. Princess Elizabeth is born.', ch: 2, at: 'e' },
  { y: 1534, t: 'The Act of Supremacy makes Henry Supreme Head of the Church of England. England breaks with Rome.', ch: 2, at: 'e' },
  { y: 1535, t: 'Thomas More is executed for refusing to accept Henry as Head of the Church.', ch: 2, at: 'e' },
  { y: 1536, t: 'Catherine of Aragon dies. Anne Boleyn is executed. Henry marries Jane Seymour.', ch: 3, at: 's' },
  { y: 1536, t: 'Smaller monasteries are closed. In the North, the Pilgrimage of Grace rebellion fails.', ch: 3, at: 's' },
  { y: 1537, t: 'Prince Edward is born at Hampton Court. Queen Jane dies twelve days later.', ch: 3, at: 's' },
  { y: 1539, t: 'The Great Bible, in English, is placed in every church.', ch: 3, at: 's' },
  { y: 1540, t: 'Henry marries and divorces Anne of Cleves. Cromwell is executed. Henry marries Catherine Howard.', ch: 3, at: 'e' },
  { y: 1540, t: 'The astronomical clock is made for Anne Boleyn\'s Gateway at Hampton Court.', ch: 4, at: 's' },
  { y: 1541, t: 'Archbishop Cranmer leaves a letter about Queen Catherine on the King\'s seat in the Chapel Royal.', ch: 4, at: 'e' },
  { y: 1542, t: 'Catherine Howard is executed.', ch: 4, at: 'e' },
  { y: 1543, t: 'Henry marries Catherine Parr in Hampton Court Palace.', ch: 4, at: 'e' },
  { y: 1546, t: 'A warrant is signed for Queen Catherine Parr\'s arrest, but she persuades Henry to forgive her.', ch: 4, at: 'e' },
  { y: 1547, t: 'Henry VIII dies, aged 55. His nine-year-old son becomes King Edward VI.', ch: 4, at: 'e' },
];

// Palace staff who appear in every chapter and share facts about Tudor life.
export const STAFF = [
  { id: 'guard', name: 'Yeoman of the Guard', role: 'Guard', pos: [-55.5, 3], yaw: Math.PI / 2,
    look: { robe: '#a51d22', trim: '#d9ab3c', legs: '#a51d22', hat: 'bonnet', hatColor: '#1a1a1a', beard: '#5a3a22', width: 1.1, bg: '#5a2a2a' },
    facts: [
      'The Yeomen of the Guard were created by Henry\'s father, Henry VII, in 1485 to protect the King. They still exist today — they are the oldest royal bodyguard in Britain!',
      'At great celebrations, fountains like the one in this courtyard could flow with wine for everyone to drink.',
    ] },
  { id: 'page', name: 'Page Boy', role: 'Servant', pos: [-10, 8], yaw: Math.PI,
    look: { robe: '#2f6b3a', trim: '#f2efe4', legs: '#f2efe4', hat: 'bonnet', hatColor: '#2f6b3a', scale: 0.82, bg: '#2a4a3a' },
    facts: [
      'Green and white were the Tudor colours. Servants like me wear them to show we belong to the King\'s household.',
      'Hampton Court had a giant toilet called the Great House of Easement. It could seat up to 28 people at once! The waste drained into the River Thames.',
    ] },
  { id: 'spitboy', name: 'Spit Boy', role: 'Kitchen servant', pos: [-9, -52.2], yaw: 0,
    look: { robe: '#8a7a5a', legs: '#5a4a3a', hat: 'coif', apron: true, scale: 0.8, bg: '#5a3a2a' },
    facts: [
      'I turn the spit so the meat roasts evenly. It\'s hot work! In winter, though, this is the warmest place in the palace.',
      'In one year the court ate around 8,200 sheep, 1,240 oxen and 2,300 deer — and drank about 600,000 gallons of ale!',
    ] },
  { id: 'gardener', name: 'Gardener', role: 'Gardener', pos: [52, 32], yaw: -Math.PI / 2,
    look: { robe: '#6b5a3a', legs: '#4a3a2a', hat: 'bonnet', hatColor: '#4a3a2a', beard: '#7a6a5a', apron: true, bg: '#3a5a2a' },
    facts: [
      'These posts are painted in the Tudor green and white. The golden beasts on top are the King\'s badges — lions, dragons and greyhounds.',
      'The River Thames is the fastest road to London. The King travels in his royal barge — much quicker than bumpy roads!',
    ] },
  { id: 'musician', name: 'Court Musician', role: 'Musician', pos: [-17, -25], yaw: Math.PI / 2,
    look: { robe: '#24407a', trim: '#d9ab3c', legs: '#d8cfb8', hat: 'bonnet', hatColor: '#24407a', feather: '#f2efe4', bg: '#2a3a5a' },
    facts: [
      'King Henry loves music! He plays the lute, the organ and the virginals, and writes songs too. One famous song, "Pastime with Good Company", is said to be his.',
      'When he was young, Henry was famous for being tall, handsome and sporty. He loved jousting, hunting, tennis and dancing.',
    ] },
];
