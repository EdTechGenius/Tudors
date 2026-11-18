// Tricky words, explained. Any of these words appearing in dialogue, sources or cards
// is underlined, and pupils can tap it to see the meaning. They also appear in the Word Bank.
// forms = other spellings of the word that should also be highlighted.

export const GLOSSARY = [
  { w: 'alliance', d: 'An agreement between countries or people to help and support each other.', forms: ['alliances', 'ally', 'allies'] },
  { w: 'annul', d: 'To officially declare that a marriage was never a true marriage at all, so it is cancelled.', forms: ['annulment', 'annulled', 'annuls'] },
  { w: 'archbishop', d: 'The most senior kind of bishop. The Archbishop of Canterbury is the leader of the Church in England.', forms: ['archbishops', 'Archbishop'] },
  { w: 'beadsman', d: 'Someone who promises to pray for another person.', forms: [] },
  { w: 'biased', d: 'Favouring one side unfairly, so that something may not tell the whole truth.', forms: ['bias'] },
  { w: 'cardinal', d: 'A very senior leader in the Catholic Church, chosen by the Pope. Cardinals wear red.', forms: ['cardinals', 'Cardinal'] },
  { w: 'Catholic', d: 'A Christian who belongs to the Church led by the Pope in Rome. Everyone in England was Catholic until Henry\'s time.', forms: ['Catholics'] },
  { w: 'chaplain', d: 'A priest who looks after the prayers and religious life of a person or household.', forms: [] },
  { w: 'conscience', d: 'Your inner sense of what is right and wrong.', forms: [] },
  { w: 'courtier', d: 'A person who lives and works at the royal court, close to the King.', forms: ['courtiers'] },
  { w: 'dispensation', d: 'Special permission from the Pope to do something that the Church\'s rules would normally forbid.', forms: [] },
  { w: 'dissolution', d: 'The closing down of something. The Dissolution of the Monasteries was when Henry closed the monasteries and took their wealth.', forms: [] },
  { w: 'Emperor', d: 'A ruler of many lands. Charles V, the Holy Roman Emperor, ruled Spain, much of Germany and Italy, and the Netherlands.', forms: [] },
  { w: 'evidence', d: 'Information that helps to prove whether something is true.', forms: [] },
  { w: 'excommunicate', d: 'To throw someone out of the Catholic Church.', forms: ['excommunicated'] },
  { w: 'executed', d: 'Put to death as a punishment.', forms: ['execution', 'executions', 'execute'] },
  { w: 'heir', d: 'The person who will become king or queen next.', forms: ['heirs'] },
  { w: 'heresy', d: 'Beliefs that go against the official teachings of the Church. A person with such beliefs was called a heretic.', forms: ['heretic', 'heretics'] },
  { w: 'investigation', d: 'A careful search for the truth about something.', forms: ['investigate', 'investigated'] },
  { w: 'Lord Chancellor', d: 'The King\'s most important minister, who was in charge of the law courts and looked after the Great Seal.', forms: [] },
  { w: 'monastery', d: 'A building where monks lived, worked and prayed together.', forms: ['monasteries', 'abbey', 'abbeys'] },
  { w: 'negotiate', d: 'To discuss something in order to reach an agreement.', forms: ['negotiations', 'negotiating'] },
  { w: 'oath', d: 'A serious, solemn promise, often made in God\'s name.', forms: ['oaths'] },
  { w: 'Parliament', d: 'The group of lords, bishops and elected men who met to make the laws of England with the King.', forms: [] },
  { w: 'pension', d: 'Money paid regularly to someone after they stop working.', forms: [] },
  { w: 'Pope', d: 'The leader of the Catholic Church, who lives in Rome.', forms: [] },
  { w: 'primary source', d: 'Something made or written at the time being studied, like a letter, painting or building.', forms: ['primary sources'] },
  { w: 'Protestant', d: 'A Christian who broke away from the Pope\'s Church, wanting the Church to be reformed (changed).', forms: ['Protestants'] },
  { w: 'Reformation', d: 'The great change in the 1500s when many countries broke away from the Pope\'s Church.', forms: [] },
  { w: 'reliable', d: 'Able to be trusted.', forms: ['unreliable', 'reliability'] },
  { w: 'resign', d: 'To give up your job by choice.', forms: ['resigned', 'resigns', 'resignation'] },
  { w: 'rebellion', d: 'When people fight against or openly refuse to obey their rulers.', forms: ['rebels', 'rebelled'] },
  { w: 'source', d: 'Anything that gives us information about the past.', forms: ['sources'] },
  { w: 'Supreme Head', d: 'The highest leader. In 1534 Henry made himself Supreme Head of the Church of England instead of the Pope.', forms: [] },
  { w: 'treason', d: 'The crime of betraying or plotting against your king or country. It was punished by death.', forms: ['traitor', 'traitors'] },
  { w: 'treaty', d: 'A written agreement between countries.', forms: ['treaties'] },
  { w: 'tyrant', d: 'A ruler who uses their power cruelly and unfairly.', forms: [] },
  { w: 'widow', d: 'A woman whose husband has died.', forms: ['widowed'] },
];

// Lookup table: lower-case form -> entry
export const GLOSS_INDEX = new Map();
for (const g of GLOSSARY) for (const f of [g.w, ...g.forms]) GLOSS_INDEX.set(f.toLowerCase(), g);
