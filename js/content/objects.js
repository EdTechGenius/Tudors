// The King's Inventory: Tudor objects and features pupils can discover around Hampton Court.
// pos = [x, z] on the map, y = height of the object (for tapping), r = how close you must be.
// ch = only in these chapters (because the object did not exist yet in earlier years).
// img = a real picture in assets/img (see assets/img/credits.json).

export const OBJECTS = [
  // ---------------- The West Front ----------------
  { id: 'beasts', name: 'The King\'s Beasts', area: 'The West Front', pos: [-71, 0], y: 2.2, r: 4.5, img: 'beast',
    text: 'Henry VIII lined the bridge over the moat with stone beasts, each holding a shield decorated with a royal coat of arms. The lions, dragons, greyhounds and other creatures were heraldic symbols of the King\'s family, chosen to show visitors how ancient and powerful the Tudors were.',
    fact: 'The beasts you can see on the bridge at Hampton Court today are copies, carved in 1950.' },
  { id: 'moat', name: 'The Moat', area: 'The West Front', pos: [-78.5, 9], y: 0.2, r: 3,
    text: 'A wide moat of water surrounds the front of the palace. In earlier centuries, castles used moats to keep attackers out, but by Tudor times the moat at Hampton Court was mostly for show, making the palace look like a grand, old-fashioned castle.',
    fact: 'Later, the moat was filled in. It was dug out again in 1910, so that visitors could see it as it was in Tudor times.' },
  { id: 'royalarms', name: 'The Royal Coat of Arms', area: 'The West Front', pos: [-62.5, 0], y: 7.9, r: 4,
    text: 'Above the great gate is the King\'s coat of arms. It combines the three golden lions of England with the golden lilies of France, because English kings still claimed to be kings of France too. A lion and a dragon hold the shield on either side.',
    fact: 'The motto "Dieu et mon droit" is French for "God and my right". It is still the motto of the British monarch today.' },
  { id: 'chimneys', name: 'The Twisted Chimneys', area: 'The West Front', pos: [-63, -22], y: 13, r: 6, img: 'chimneys',
    text: 'Look up! Hampton Court is famous for its tall brick chimneys, decorated with spirals, zig-zags and diamond patterns. Each chimney let smoke out from a fireplace below, and a palace with hundreds of fireplaces needed hundreds of chimneys.',
    fact: 'Hampton Court has more than 200 chimneys. Many were rebuilt in Victorian times, carefully copying the Tudor designs.' },

  // ---------------- Base Court ----------------
  { id: 'fountain', name: 'The Wine Fountain', area: 'Base Court', pos: [-45, 0], y: 2.5, r: 3.5,
    text: 'At great celebrations, Tudor kings put up fountains that flowed with wine, so that everyone could drink to the King\'s health. It was a way of showing off the King\'s wealth and generosity.',
    fact: 'At the Field of the Cloth of Gold in 1520, when Henry met the King of France, a fountain flowed with red wine, white wine and spiced wine. A copy of a Tudor wine fountain stands in Base Court today.' },
  { id: 'roundel', name: 'Terracotta Roundel', area: 'Base Court', pos: [-32.8, 4.6], y: 8, r: 4, img: 'roundel',
    text: 'High on the gateway turrets are round plaques showing the heads of ancient Roman emperors. Cardinal Wolsey ordered them from an Italian sculptor, Giovanni da Maiano, in 1521. They show that Wolsey knew all about the new Renaissance fashions from Italy.',
    fact: 'They are made of terracotta, which is baked clay, and were glazed and painted in bright colours.' },
  { id: 'tudorrose', name: 'The Tudor Rose', area: 'Base Court', pos: [-57.8, 0], y: 7, r: 3.5,
    text: 'The Tudor rose joins together a red rose and a white rose. The red rose was the badge of the House of Lancaster and the white rose belonged to the House of York, two families who fought each other in the Wars of the Roses.',
    fact: 'Henry VIII\'s father, Henry VII, ended the wars by marrying Elizabeth of York in 1486. Their son, Henry VIII, was both Lancaster and York.' },
  { id: 'halberds', name: 'Yeoman\'s Halberds', area: 'Base Court', pos: [-59, 8.5], y: 1.8, r: 2.6, model: 'halberds', rot: -Math.PI / 2,
    text: 'A halberd is a long pole with an axe blade and a sharp spike on top. The Yeomen of the Guard carried halberds when they protected the King and guarded the doors of the palace.',
    fact: 'The King\'s guards decided who could come further into the palace. The closer you were allowed to get to the King, the more important you were.' },

  // ---------------- Clock Court ----------------
  { id: 'wolseyarms', name: 'Wolsey\'s Coat of Arms', area: 'Clock Court', pos: [-27.4, 2.2], y: 7.3, r: 3.5,
    text: 'Above the arch of the gateway is the coat of arms of Cardinal Wolsey, made of terracotta. The red cardinal\'s hat on top shows that he was a prince of the Church. His Latin motto, "Dominus mihi adjutor", means "The Lord is my helper".',
    fact: 'Even though Wolsey fell from power, his coat of arms can still be seen above the gateway today.' },
  { id: 'clock', name: 'The Astronomical Clock', area: 'Clock Court', pos: [-25.5, -2.5], y: 10, r: 5, ch: [4], img: 'clock',
    text: 'This clock was made in 1540 by Nicholas Oursian. As well as the time, it shows the month, the phases of the moon and the signs of the zodiac. It even shows the time of high tide at London Bridge, which was useful for planning a journey by boat on the Thames.',
    fact: 'The clock shows the Sun going around the Earth! That is what most people believed in Tudor times.' },
  { id: 'tennis', name: 'Real Tennis Racquet', area: 'Clock Court', pos: [22, 13.3], y: 1.05, r: 2.4, model: 'racquet',
    text: 'Henry loved "real tennis", an indoor game played with wooden racquets and a hard, heavy ball that bounces off the walls and sloping roofs of the court. He built tennis courts at Hampton Court and played often when he was young and fit.',
    fact: 'People still play real tennis at Hampton Court today, in a court that has been in use for about 400 years.' },

  // ---------------- The Great Hall ----------------
  { id: 'hammerbeam', name: 'The Hammerbeam Roof', area: 'Great Hall', pos: [-6, -25], y: 13, r: 6, ch: [3, 4], img: 'greathall',
    text: 'Look up at the magnificent hammerbeam roof, built between 1532 and 1535. Short wooden beams called "hammer beams" stick out from the walls to support the roof, so there is no need for pillars. It is carved with badges, painted and covered in gold.',
    fact: 'The builders worked through the night by candlelight, because Henry was so impatient for his new hall to be finished.' },
  { id: 'trencher', name: 'A Trencher', area: 'Great Hall', pos: [-6, -21], y: 0.95, r: 2.4, model: 'trencher',
    text: 'A trencher was a Tudor plate. Rich people used square wooden boards, but a trencher could also be a thick slice of stale bread, which soaked up the gravy from the meat.',
    fact: 'After the meal, bread trenchers soaked in gravy were often given to the poor to eat.' },
  { id: 'salt', name: 'The Great Salt', area: 'Great Hall', pos: [3.3, -22.5], y: 1.25, r: 2.4, model: 'saltcellar',
    text: 'Salt was precious, so it was kept in a splendid container called a salt cellar, often made of silver or gold. It stood on the table near the most important people.',
    fact: 'Important guests sat "above the salt", near the top of the table. Less important people sat "below the salt", further away.' },
  { id: 'lute', name: 'A Lute', area: 'Great Hall', pos: [-19.5, -22.8], y: 0.8, r: 2.4, model: 'lute',
    text: 'The lute was the most popular instrument at the Tudor court. It has a round, pear-shaped body and is played by plucking its strings. Music was played during feasts, dances and quiet evenings.',
    fact: 'Henry VIII was a talented musician. He could play the lute, the organ and the virginals, and he wrote songs.' },
  { id: 'tapestry', name: 'Tapestries', area: 'Great Hall', pos: [-11, -31.3], y: 5, r: 3,
    text: 'Tapestries are huge woven pictures, often showing stories from the Bible or ancient history. They made cold stone rooms warmer and showed off the owner\'s wealth, because the best ones were woven with real gold and silver thread.',
    fact: 'When Henry died, he owned more than 2,000 tapestries. They were rolled up and carried from palace to palace as the court moved around.' },
  { id: 'stainedglass', name: 'Stained Glass', area: 'Great Hall', pos: [-5.1, -17.2], y: 10.5, r: 4,
    text: 'The tall windows are filled with coloured glass showing royal coats of arms and Tudor roses. Glass was expensive, so large coloured windows were another way of showing how rich and important the King was.',
    fact: 'Ordinary Tudor homes often had no glass at all. People used wooden shutters, cloth or thin sheets of horn to cover their windows.' },
  { id: 'candles', name: 'The Candle Ring', area: 'Great Hall', pos: [-15, -25], y: 7, r: 3,
    text: 'With no electricity, rooms were lit by candles and firelight. Cheap candles were made from tallow, which is animal fat. They smoked and smelled, so the King\'s rooms used candles made of beeswax instead.',
    fact: 'Beeswax candles were so expensive that servants were sometimes allowed to keep the leftover stubs as a reward.' },
  { id: 'clothofgold', name: 'The Field of the Cloth of Gold', area: 'Great Hall', pos: [-21.6, -25], y: 3.2, r: 3, ch: [4], img: 'clothofgold',
    text: 'This enormous painting, made around 1545, shows Henry\'s meeting with King Francis I of France in 1520. The two kings tried to outdo each other with tents and clothes made of cloth woven with gold thread. Look closely and you can find the wine fountain, a dragon in the sky and Henry on his horse.',
    fact: 'The painting still hangs at Hampton Court today. It is a source that was made about 25 years after the event it shows.' },

  // ---------------- The Great Kitchens ----------------
  { id: 'spit', name: 'The Spit', area: 'Great Kitchens', pos: [-18, -51.8], y: 1.5, r: 2.6,
    text: 'Meat was roasted in front of the huge open fires on long iron spits. Someone had to turn the spit by hand for hours so that the meat cooked evenly and did not burn.',
    fact: 'The boys who turned the spits were called "turnspits". It was hot, sweaty work, but they were always warm in winter!' },
  { id: 'cauldron', name: 'The Great Cauldron', area: 'Great Kitchens', pos: [-4, -48.5], y: 1, r: 2.6,
    text: 'Huge cauldrons were used to boil meat and to make pottage, a thick stew of vegetables, grains and sometimes meat. Pottage was the everyday food of ordinary Tudor people.',
    fact: 'Hampton Court had a special "boiling house" with a cauldron so big that it held around 75 gallons.' },
  { id: 'pie', name: 'A Tudor Pie', area: 'Great Kitchens', pos: [-10.2, -48], y: 1.1, r: 2.4,
    text: 'Tudor pies were filled with meat, fish or fruit and baked inside a thick, hard pastry case called a "coffin". The pastry was often not eaten. It was there to hold the filling, like a dish.',
    fact: 'Some pies were made for fun: a surprise pie might have live birds inside that flew out when it was cut open!' },
  { id: 'subtlety', name: 'A Sugar Subtlety', area: 'Great Kitchens', pos: [0, -40], y: 1.2, r: 2.4, model: 'subtlety',
    text: 'A "subtlety" was a showpiece made of sugar and marchpane (marzipan), shaped into castles, animals or coats of arms. Subtleties were brought out between the courses of a feast to amaze the guests.',
    fact: 'Sugar was so expensive that only the very rich could afford it. Eating too much of it gave many rich Tudors rotten, blackened teeth.' },
  { id: 'spices', name: 'The Spice Chest', area: 'Great Kitchens', pos: [-22.4, -45], y: 0.7, r: 2.4, model: 'spicechest', rot: Math.PI / 2,
    text: 'Pepper, cinnamon, cloves and nutmeg came from far-away lands in Asia and were extremely expensive. They were kept locked away in a chest and used to flavour food and to show off the King\'s wealth.',
    fact: 'The palace had a whole department, called the Spicery, just to look after the spices.' },
  { id: 'gamebirds', name: 'Hanging Game Birds', area: 'Great Kitchens', pos: [5.2, -44], y: 2.1, r: 2.6, model: 'gamebirds',
    text: 'Birds such as swans, herons, peacocks and pheasants were hung up in the kitchens before being cooked for the King\'s table. Rich Tudors ate a huge amount of meat, but not many vegetables.',
    fact: 'A roasted peacock was sometimes put back inside its own feathers before being served, to look as if it were still alive!' },
  { id: 'block', name: 'Chopping Block and Cleaver', area: 'Great Kitchens', pos: [-2, -38], y: 0.85, r: 2.4, model: 'block',
    text: 'Butchers used a heavy cleaver to chop meat on a thick wooden block. The kitchens prepared whole animals delivered from farms all over the countryside.',
    fact: 'Hundreds of people worked in the kitchens, each with their own job, from bakers and butchers to the boys who washed the pots.' },
  { id: 'ale', name: 'Barrels of Ale', area: 'Great Kitchens', pos: [4.5, -38.5], y: 0.8, r: 2.4,
    text: 'Tudor people drank weak ale and beer with their meals, even children. Brewing the ale made it safer to drink than water from rivers and wells, which was often dirty.',
    fact: 'The court drank around 600,000 gallons of ale in a year, enough to fill about one Olympic swimming pool!' },

  // ---------------- The Chapel Royal ----------------
  { id: 'bookofhours', name: 'A Book of Hours', area: 'Chapel Royal', pos: [21.6, -21], y: 1.0, r: 2.4, model: 'priedieu', rot: -Math.PI / 2,
    text: 'A Book of Hours was a prayer book with prayers for different hours of the day, often beautifully painted by hand. Wealthy people knelt at a prayer desk like this one to read them.',
    fact: 'Anne Boleyn\'s own Book of Hours survives. In it she wrote a little rhyme to Henry, promising to be "both loving and kind".' },
  { id: 'rosary', name: 'Rosary Beads', area: 'Chapel Royal', pos: [17.6, -17.8], y: 0.75, r: 2.4, model: 'rosary',
    text: 'Catholics used a string of beads called a rosary to keep count of their prayers, moving one bead along for each prayer they said.',
    fact: 'As England became more Protestant after Henry\'s death, some old Catholic customs like this were discouraged or banned.' },
  { id: 'altarcandles', name: 'Beeswax Altar Candles', area: 'Chapel Royal', pos: [22.4, -29.6], y: 1.7, r: 2.4, model: 'candlestand',
    text: 'Tall candlesticks stood near the altar. Candles in church were made of beeswax, which burned with a cleaner, sweeter-smelling flame than cheaper tallow candles.',
    fact: 'Candles were also used to measure time: some had marks down the side that showed how many hours had passed as they burned.' },
  { id: 'chapelceiling', name: 'The Starry Ceiling', area: 'Chapel Royal', pos: [16, -25], y: 8.8, r: 5, ch: [3, 4], img: 'chapel',
    text: 'Henry ordered this ceiling in 1535–36. It is painted deep blue and covered in golden stars, with carved and gilded decorations. It was meant to look like the heavens above.',
    fact: 'This Tudor ceiling still survives in the Chapel Royal, which is still used for church services today.' },
  { id: 'kingspew', name: 'The King\'s Pew', area: 'Chapel Royal', pos: [8.4, -27.2], y: 1.5, r: 2.6,
    text: 'The royal family had their own private seat, called a pew, where they could hear the service apart from everyone else. In the real chapel it is upstairs, like a balcony.',
    fact: 'Kings and queens sometimes read letters or did paperwork in their pew during long church services!' },

  // ---------------- The Presence Chamber ----------------
  { id: 'clothofestate', name: 'The Cloth of Estate', area: 'Presence Chamber', pos: [32, -12], y: 2.5, r: 3,
    text: 'The canopy above the throne is called a cloth of estate. It showed that this was the King\'s place, even when he was not there. Courtiers took off their hats and bowed to the empty chair as they walked past.',
    fact: 'Only kings, queens and the very highest nobles were allowed to sit under a cloth of estate.' },
  { id: 'armour', name: 'The King\'s Armour', area: 'Presence Chamber', pos: [36.8, -10], y: 1.3, r: 2.6, model: 'armour', rot: -Math.PI / 2, img: 'armour',
    text: 'When he was young, Henry was a champion at jousting, charging at other knights on horseback with a long wooden lance. His suits of armour were made to fit his body perfectly, so they show how his size changed over his life.',
    fact: 'In 1536 Henry was badly hurt in a jousting accident. Afterwards he could not exercise as before, and he grew much larger.' },
  { id: 'familypainting', name: 'The Family of Henry VIII', area: 'Presence Chamber', pos: [27.6, -9], y: 2.6, r: 3, ch: [4], img: 'family',
    text: 'This painting, made around 1545, shows Henry with his son Edward, his daughters Mary and Elizabeth, and Edward\'s mother, Jane Seymour. Look carefully: Jane had died in 1537, years before it was painted! She is included because she was the mother of Henry\'s heir.',
    fact: 'In the archways at each side you can see the King\'s jester, Will Somer, and a woman fool, Jane. The painting hangs at Hampton Court today.' },
  { id: 'virginals', name: 'The Virginals', area: 'Presence Chamber', pos: [30.4, 13.6], y: 1, r: 2.4, model: 'virginals', rot: Math.PI,
    text: 'The virginals is a keyboard instrument in a box. When you press a key, a little quill plucks a string inside, making a bright, tinkling sound.',
    fact: 'A list of Henry\'s belongings made after he died includes dozens of virginals, organs, lutes, flutes and other instruments.' },

  // ---------------- The Privy Chamber ----------------
  { id: 'closestool', name: 'The Close Stool', area: 'Privy Chamber', pos: [48.9, 13.2], y: 0.6, r: 2.4, model: 'closestool', rot: Math.PI,
    text: 'This box with a padded velvet seat is a "close stool", the King\'s private toilet! A pot inside was emptied by a servant.',
    fact: 'The "Groom of the Stool" looked after it. Because he spent so much private time with the King, it became one of the most powerful jobs at court.' },
  { id: 'chess', name: 'A Chess Set', area: 'Privy Chamber', pos: [40.4, 8.6], y: 0.85, r: 2.4, model: 'chesstable',
    text: 'Chess, cards, dice and backgammon were popular pastimes at court, especially on long winter evenings. Courtiers often played for money.',
    fact: 'Records of the King\'s spending show that Henry sometimes lost large sums of money gambling at cards and dice.' },
  { id: 'pomander', name: 'A Pomander', area: 'Privy Chamber', pos: [48.4, -4.5], y: 1.1, r: 2.4, model: 'pomander',
    text: 'A pomander was a small, decorated metal ball filled with sweet-smelling spices and perfumes. People carried them or hung them from their belts to cover up bad smells.',
    fact: 'Many Tudors believed that diseases were spread by bad smells, so a pomander was also thought to protect you from illness.' },
  { id: 'henryportrait', name: 'Holbein\'s Portrait of Henry VIII', area: 'Privy Chamber', pos: [40, -12.8], y: 2.6, r: 3, ch: [3, 4], img: 'henry',
    text: 'Hans Holbein painted Henry many times. This portrait shows him standing proudly in rich clothes covered in jewels, looking powerful and in control. It was exactly the image Henry wanted people to see.',
    fact: 'Holbein\'s most famous painting of Henry was a huge picture on a wall in Whitehall Palace. It was destroyed in a fire in 1698, but copies survive.' },
  { id: 'globe', name: 'The Globe', area: 'Privy Chamber', pos: [44.6, 10], y: 1.3, r: 2.4,
    text: 'Educated Tudors were fascinated by maps and globes. Explorers were discovering new lands, and map-makers kept adding them to their globes as news arrived.',
    fact: 'Christopher Columbus reached the Americas in 1492, the year after Henry was born. Ferdinand Magellan\'s expedition sailed all the way around the world between 1519 and 1522.' },

  // ---------------- Your Study ----------------
  { id: 'quill', name: 'Quill and Inkpot', area: 'Your Study', pos: [-3.5, 25.6], y: 0.95, r: 2.4, model: 'writingslope', activity: 'quill', img: 'signature',
    text: 'Tudor writers used a quill pen made from a goose feather, sharpened with a small "penknife". The ink was made from oak galls (lumps that grow on oak trees) mixed with iron, so it was very dark and long-lasting. Writers had to dip their quill in the ink every few words.',
    fact: 'Henry VIII signed important documents "Henry R". The R stands for "Rex", which is Latin for "king".' },
  { id: 'seal', name: 'Wax and Seal', area: 'Your Study', pos: [8.6, 25.6], y: 0.95, r: 2.4, model: 'sealset',
    text: 'Letters were folded and closed with a blob of melted wax. Then a metal seal was pressed into the wax, leaving a picture or coat of arms. If the seal was broken, you knew someone had opened the letter.',
    fact: 'The most important seal in England was the Great Seal, used to approve the King\'s official documents. The Lord Chancellor looked after it.' },
  { id: 'hourglass', name: 'The Hourglass', area: 'Your Study', pos: [5.8, 25.9], y: 1, r: 2.2, model: 'hourglass',
    text: 'An hourglass measured time with sand trickling from the top glass into the bottom glass. When all the sand had run through, you turned it over to start again.',
    fact: 'Some churches used hourglasses to time sermons. A preacher who talked for longer than one hour might be given a meaningful look!' },
  { id: 'countingboard', name: 'Counting Board', area: 'Your Study', pos: [-1.6, 25.9], y: 0.8, r: 2.2, model: 'countingboard',
    text: 'Accountants added up money by moving small metal counters, called jettons, across lines marked on a cloth or board. It worked rather like an abacus.',
    fact: 'The government department that looked after the King\'s money is called the Exchequer, named after the chequered cloth that was used for counting.' },
  { id: 'hornbook', name: 'A Hornbook', area: 'Your Study', pos: [-4.8, 23.4], y: 0.5, r: 2.2, model: 'hornbook', img: 'hornbook',
    text: 'Children learned to read using a hornbook: a wooden paddle with a sheet showing the alphabet and the Lord\'s Prayer. It was covered with a thin, see-through layer of animal horn to protect the paper.',
    fact: 'Only some children went to school in Tudor times, and they were mostly boys. Girls from rich families, like Henry\'s daughters, were often taught at home by tutors.' },
  { id: 'coins', name: 'Tudor Coins', area: 'Your Study', pos: [8.7, 21], y: 0.85, r: 2.2, model: 'coins', img: 'groat',
    text: 'This purse holds silver groats. A groat was worth four pennies. Coins showed the King\'s head, reminding everyone who ruled the country every time they paid for something.',
    fact: 'Late in his reign, Henry mixed cheap copper into his "silver" coins to make more money. As the silver wore off, the copper showed through on his nose, and people nicknamed him "Old Coppernose".' },

  // ---------------- The Privy Garden ----------------
  { id: 'sundial', name: 'The Sundial', area: 'Privy Garden', pos: [43, 32], y: 1.4, r: 2.6,
    text: 'A sundial tells the time using the shadow cast by the sun. As the sun moves across the sky, the shadow moves around the dial, pointing to the hour.',
    fact: 'A sundial is useless on a cloudy day or at night, which is one reason clocks were so valuable.' },
  { id: 'posts', name: 'Heraldic Beast Posts', area: 'Privy Garden', pos: [41.5, 17.4], y: 3.2, r: 2.6,
    text: 'Henry\'s garden was decorated with posts painted in the Tudor colours of green and white. On top of each sat a carved and painted golden beast holding a little flag.',
    fact: 'Gardens were meant to impress visitors just as much as buildings were. They were full of symbols of the King\'s power.' },
  { id: 'bowls', name: 'Bowls', area: 'Privy Garden', pos: [56, 48.6], y: 0.2, r: 2.4, model: 'bowls',
    text: 'In the game of bowls, players roll heavy balls across the grass, trying to stop them as close as possible to a small target ball called the "jack". Henry had bowling alleys built at his palaces.',
    fact: 'A law of 1541 said that ordinary people were not allowed to play bowls, except at Christmas. The King wanted them practising archery instead!' },
  { id: 'archery', name: 'Archery Butt', area: 'Privy Garden', pos: [29.8, 48.6], y: 0.8, r: 2.6, model: 'archery', rot: Math.PI / 2,
    text: 'An archery target was called a "butt". English archers with longbows had won famous battles, and Henry wanted every man to be ready to fight for him.',
    fact: 'The same law of 1541 said that men had to practise archery regularly. Henry himself was a skilled archer.' },
  { id: 'falcon', name: 'A Falcon', area: 'Privy Garden', pos: [49, 33.4], y: 1.4, r: 2.4, model: 'falcon',
    text: 'Hawking (hunting with trained falcons and hawks) was a favourite sport of kings and nobles. The birds were trained to catch other birds and rabbits and return to their owner.',
    fact: 'There were rules about who could fly which bird. A king might fly a gyrfalcon, while a poor man might only be allowed a kestrel.' },
  { id: 'skep', name: 'A Beehive', area: 'Privy Garden', pos: [58.5, 32], y: 0.8, r: 2.4, model: 'skep',
    text: 'Tudor beehives, called skeps, were made of woven straw. Honey was the main sweetener for most people, because sugar was so expensive.',
    fact: 'Bees also gave beeswax, used to make the best candles and to seal letters.' },
  { id: 'barge', name: 'The Royal Barge', area: 'Privy Garden', pos: [44, 48.8], y: 1.5, r: 3.5,
    text: 'The River Thames was the fastest and smoothest road in Tudor England. The King travelled between his riverside palaces in a magnificent barge rowed by oarsmen in royal uniforms.',
    fact: 'Hampton Court is about 12 miles from London. By barge, with the tide behind you, the journey took several hours.' },
  { id: 'herbs', name: 'Strewing Herbs', area: 'Privy Garden', pos: [42.3, 24.5], y: 0.4, r: 2.4, model: 'herbbasket',
    text: 'Herbs like lavender, rosemary and mint were grown for cooking and medicine. They were also scattered on floors, so that they gave off a sweet smell when people walked on them.',
    fact: 'Floors were often covered with rushes and herbs, which were swept out and replaced from time to time.' },
];

// Real paintings hung in the palace (only in the chapters when they existed).
export const PAINTINGS = [
  { img: 'family', pos: [26.45, 2.6, -9], rot: Math.PI / 2, w: 3.4, h: 1.37, ch: [4] },
  { img: 'henry', pos: [40, 2.6, -14.55], rot: 0, w: 1.05, h: 1.47, ch: [3, 4] },
  { img: 'clothofgold', pos: [-23.55, 3.2, -25], rot: Math.PI / 2, w: 3.4, h: 1.64, ch: [4] },
  { img: 'wolsey', pos: [9.55, 2.4, 21], rot: -Math.PI / 2, w: 0.9, h: 1.1, ch: [1] },
  { img: 'more', pos: [9.55, 2.4, 21], rot: -Math.PI / 2, w: 0.9, h: 1.13, ch: [2] },
  { img: 'cromwell', pos: [9.55, 2.4, 21], rot: -Math.PI / 2, w: 0.9, h: 1.1, ch: [3] },
  { img: 'cranmer', pos: [9.55, 2.4, 21], rot: -Math.PI / 2, w: 0.9, h: 1.2, ch: [4] },
];

export const forChapter = (list, chId) => list.filter((o) => !o.ch || o.ch.includes(chId));

// A picture-symbol for each object that has no photograph.
export const ICONS = {
  moat: '🌊', royalarms: '🛡️', fountain: '🍷', tudorrose: '🌹', halberds: '🪓', wolseyarms: '🎩', tennis: '🎾',
  trencher: '🍞', salt: '🧂', lute: '🪕', tapestry: '🧵', stainedglass: '🪟', candles: '🕯️', spit: '🍖', cauldron: '🍲',
  pie: '🥧', subtlety: '🏰', spices: '🌶️', gamebirds: '🦢', block: '🔪', ale: '🍺', bookofhours: '📖', rosary: '📿',
  altarcandles: '🕯️', kingspew: '🪑', clothofestate: '👑', virginals: '🎹', closestool: '🚽', chess: '♟️', pomander: '🌸',
  globe: '🌍', seal: '🔏', hourglass: '⏳', countingboard: '🧮', sundial: '☀️', posts: '🦁', bowls: '🎳', archery: '🏹',
  falcon: '🦅', skep: '🐝', barge: '🚣', herbs: '🌿',
};

// More paintings in the rooms (added in the second update).
PAINTINGS.push(
  { img: 'dover', pos: [-23.55, 3.2, -31.2], rot: Math.PI / 2, w: 3, h: 1.45, ch: [4] },
  { img: 'ambassadors', pos: [37.55, 2.6, -5.6], rot: -Math.PI / 2, w: 1.9, h: 1.9, ch: [2, 3, 4] },
);

// Portraits for the Long Gallery, in order of importance. "from" = the first chapter in which
// the portrait appears, so that pupils do not meet future wives too early.
export const GALLERY = [
  { img: 'henry7', aspect: 0.677, from: 1 }, { img: 'aragon', aspect: 0.728, from: 1 }, { img: 'boleyn', aspect: 0.765, from: 1 }, { img: 'mary', aspect: 0.773, from: 1 },
  { img: 'whitehall', aspect: 0.509, from: 3 }, { img: 'seymour', aspect: 0.621, from: 3 }, { img: 'cleves', aspect: 0.75, from: 3 }, { img: 'edward', aspect: 0.779, from: 3 },
  { img: 'howard', aspect: 1.008, from: 4 }, { img: 'parr', aspect: 0.901, from: 4 }, { img: 'elizabeth', aspect: 0.759, from: 3 },
  { img: 'charles', aspect: 0.717, from: 1 }, { img: 'francis', aspect: 0.785, from: 1 }, { img: 'more', aspect: 0.795, from: 1 }, { img: 'wolsey', aspect: 0.828, from: 1 }, { img: 'cromwell', aspect: 0.821, from: 1 },
];

// Information shown when a painting is tapped and enlarged.
export const PAINTING_INFO = {
  family: { title: 'The Family of Henry VIII', when: 'About 1545', who: 'Unknown artist (Royal Collection)', text: 'Henry sits on his throne with his son Edward beside him, and Edward\'s mother, Jane Seymour, on the other side. His daughters Mary and Elizabeth stand further out. The painting was made to show that the Tudor family line was safe.', look: 'Jane Seymour had died eight years before this was painted. Why do you think the artist included her? Can you also spot the jester, Will Somer, in the archway?' },
  clothofgold: { title: 'The Field of the Cloth of Gold', when: 'About 1545', who: 'British School (Royal Collection)', text: 'In 1520, Henry VIII met King Francis I of France near Calais. Both kings tried to impress the other with enormous tents, feasts and tournaments. The meeting cost a fortune, but the two countries were at war again within two years.', look: 'Can you find Henry on his horse, the golden fountain of wine, and the dragon flying in the sky?' },
  dover: { title: 'The Embarkation of Henry VIII at Dover', when: 'About 1545', who: 'Unknown artist (Royal Collection)', text: 'This shows Henry\'s ships setting sail from Dover in 1520, on the way to the Field of the Cloth of Gold. Henry built up a strong navy of warships during his reign.', look: 'Look at the sails and flags. What colours and symbols tell you that these are the King\'s ships?' },
  ambassadors: { title: 'The Ambassadors', when: '1533', who: 'Hans Holbein the Younger (National Gallery, London)', text: 'Holbein painted two French ambassadors who were visiting Henry\'s court in 1533, the year Henry married Anne Boleyn. The table is covered with globes, books and scientific instruments, showing how clever and well-travelled the men were.', look: 'There is a strange stretched shape on the floor. It is a hidden skull, which you can only see properly if you look at the painting from the side!' },
  henry: { title: 'Henry VIII', when: 'About 1537', who: 'Hans Holbein the Younger (Thyssen-Bornemisza Museum, Madrid)', text: 'Holbein shows Henry in his late forties, wearing rich clothes covered in jewels and gold. He looks broad, strong and powerful, exactly as Henry wanted to be seen.', look: 'Find three things in this portrait that show how rich Henry was.' },
  wolsey: { title: 'Cardinal Thomas Wolsey', when: '16th century', who: 'Unknown artist', text: 'Wolsey is shown in profile (from the side) in his red cardinal\'s robes and cap. He was the son of a butcher who became the most powerful man in England after the King.', look: 'Why might Wolsey have chosen to be painted wearing his cardinal\'s red robes?' },
  more: { title: 'Sir Thomas More', when: '1527', who: 'Hans Holbein the Younger (Frick Collection, New York)', text: 'More wears a gold chain of office with the letter "S" repeated on it, a sign that he served the King. Holbein even painted the stubble on his chin!', look: 'Does Thomas More look happy, worried or thoughtful? What makes you think so?' },
  cromwell: { title: 'Thomas Cromwell', when: '1532–33', who: 'Hans Holbein the Younger (Frick Collection, New York)', text: 'Cromwell sits at a desk holding a document, surrounded by papers and a book. He is shown as a hard-working, serious man of business.', look: 'What objects has Holbein included to show what Cromwell\'s job was?' },
  cranmer: { title: 'Archbishop Thomas Cranmer', when: '1545', who: 'Gerlach Flicke (National Portrait Gallery, London)', text: 'Cranmer is shown holding a book, a sign of his learning and his work on the English Bible and prayers.', look: 'Cranmer did not grow a beard until after Henry died. Does this portrait show him with or without a beard?' },
  charles: { title: 'Emperor Charles V', when: 'About 1516', who: 'Bernard van Orley', text: 'Charles was only a teenager here, but he would become the most powerful ruler in Europe, ruling Spain, the Netherlands and much of Germany and Italy. He was Catherine of Aragon\'s nephew.', look: 'The golden chain around his neck is the Order of the Golden Fleece, a very important badge. Why might rulers wear badges like this?' },
  aragon: { title: 'Catherine of Aragon', when: 'About 1525', who: 'Unknown artist', text: 'Catherine was the daughter of the King and Queen of Spain. She was Henry\'s wife and queen for over twenty years.', look: 'What kind of headdress is she wearing? (Hint: it is shaped like the roof of a house!)' },
  boleyn: { title: 'Anne Boleyn', when: 'Late 16th century (a copy of a lost portrait)', who: 'Unknown artist (National Portrait Gallery, London)', text: 'This famous portrait shows Anne with a "B" necklace. It was painted after her death, copying an earlier picture that is now lost.', look: 'This painting was made years after Anne died. Does that make it less useful as a source? Why?' },
  seymour: { title: 'Jane Seymour', when: '1536–37', who: 'Hans Holbein the Younger (Kunsthistorisches Museum, Vienna)', text: 'Jane wears a pointed English gable hood and many jewels. Holbein painted her soon after she became queen.', look: 'Compare Jane\'s headdress with Anne Boleyn\'s. How are they different?' },
  cleves: { title: 'Anne of Cleves', when: '1539', who: 'Hans Holbein the Younger (Louvre, Paris)', text: 'This is the portrait Henry saw before agreeing to marry Anne. She looks straight at us, calm and serious, in a rich red German dress.', look: 'Henry said she did not look like this portrait. Do you think Holbein made her look different? How could we find out?' },
  howard: { title: 'Portrait of a Lady, perhaps Katherine Howard', when: 'About 1540', who: 'Hans Holbein the Younger (Royal Collection)', text: 'This tiny round painting, called a miniature, may show Catherine Howard. Historians are not completely sure who the lady is!', look: 'The title says "perhaps". Why might historians be unsure who is in a painting?' },
  parr: { title: 'Catherine Parr', when: 'About 1545', who: 'Attributed to Master John (National Portrait Gallery, London)', text: 'Catherine Parr wears a splendid red and gold gown. She was a clever, well-read queen who wrote books of her own.', look: 'What can you tell about Catherine\'s wealth and importance from her clothes?' },
  henry7: { title: 'King Henry VII', when: '1505', who: 'Unknown Netherlandish artist (National Portrait Gallery, London)', text: 'Henry VII was Henry VIII\'s father. He won the crown at the Battle of Bosworth in 1485 and began the Tudor dynasty. He holds a red rose, the badge of Lancaster.', look: 'What is the King holding in his hand, and what did it stand for?' },
  whitehall: { title: 'Henry VIII and Henry VII', when: '1536–37', who: 'Hans Holbein the Younger (National Portrait Gallery, London)', text: 'This is part of Holbein\'s full-size drawing for a huge wall painting at Whitehall Palace. Henry VIII stands with his legs wide apart and his hands on his hips, looking straight at us. His father stands behind him.', look: 'How does Henry\'s pose make him look powerful? Try standing like him!' },
  mary: { title: 'Princess Mary', when: '1544', who: 'Master John (National Portrait Gallery, London)', text: 'Mary was the daughter of Henry and Catherine of Aragon. She was 28 when this was painted. She later became Queen Mary I.', look: 'Look carefully at Mary\'s clothes and jewels. What do they tell us about her?' },
  elizabeth: { title: 'Elizabeth I when a Princess', when: 'About 1546', who: 'Attributed to William Scrots (Royal Collection)', text: 'Elizabeth, the daughter of Henry and Anne Boleyn, was about 13 here. She holds a book and has another open beside her, showing that she was clever and well educated.', look: 'Why do you think Elizabeth chose to be painted with books?' },
  edward: { title: 'Edward, Prince of Wales', when: 'About 1538', who: 'Hans Holbein the Younger', text: 'Edward was the son Henry had waited so long for. Holbein painted him as a baby and young child, dressed in rich red and gold like a little king.', look: 'How has Holbein made baby Edward look important, even though he is so young?' },
  francis: { title: 'King Francis I of France', when: 'About 1530', who: 'Jean Clouet (Louvre, Paris)', text: 'Francis I was King of France and Henry\'s great rival. The two kings competed in everything, from palaces and clothes to wars.', look: 'Compare Francis with Henry. What do the two kings have in common?' },
};

// Picture positions along the walls of the Long Gallery: [x, z, rotation].
const GALLERY_SLOTS = [
  [-27.2, 26.55, Math.PI], [-23.3, 26.55, Math.PI], [-19.4, 26.55, Math.PI], [-15.5, 26.55, Math.PI], [-11.6, 26.55, Math.PI], [-7.7, 26.55, Math.PI],
  [-27, 15.45, 0], [-23.3, 15.45, 0], [-13.4, 15.45, 0], [-9.4, 15.45, 0],
];
export function galleryFor(chId) {
  return GALLERY.filter((g) => g.from <= chId).slice(0, GALLERY_SLOTS.length).map((g, i) => {
    const [x, z, rot] = GALLERY_SLOTS[i];
    const h = 1.5, w = Math.min(1.6, h * g.aspect);
    return { img: g.img, pos: [x, 2.3, z], rot, w, h: w / g.aspect, gallery: true };
  });
}
