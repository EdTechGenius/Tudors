# The King's Advisor 👑

**A 3D educational game for Year 6 (KS2 History): serve King Henry VIII at Hampton Court Palace.**

Pupils play four of Henry VIII's chief advisors, one per chapter. They walk around a low-poly 3D Hampton Court, examine sources, talk to people at court, write letters, and try to keep the King happy. Each chapter ends with what *really* happened, a quiz and a printable report.

It runs in **Safari on iPad**, with nothing to install, no logins and no data collected. Progress saves automatically on each iPad.

---

## The four chapters

| # | You play | Years | The King's demand | Wives covered | Key learning |
|---|----------|-------|-------------------|---------------|--------------|
| 1 | **Cardinal Thomas Wolsey** | 1527–29 | Get an annulment from the Pope | Catherine of Aragon, Anne Boleyn | The "King's Great Matter"; why the Pope said no (Charles V, the 1503 dispensation) |
| 2 | **Sir Thomas More** | 1529–32 | Support Henry as Head of the Church | Catherine of Aragon, Anne Boleyn | Conscience vs loyalty; the break with Rome; Act of Supremacy |
| 3 | **Thomas Cromwell** | 1539–40 | Find allies, money and a new wife | Jane Seymour, Anne of Cleves, (Anne Boleyn's fall) | Dissolution of the monasteries; English Bible; portraits as sources |
| 4 | **Archbishop Thomas Cranmer** | 1541–47 | Tell the King terrible news about his Queen | Catherine Howard, Catherine Parr | Weighing evidence and bias; Henry's last years; Edward VI |

Each chapter takes about **25–35 minutes**, roughly one lesson. Chapters unlock in order.

### What pupils do in each chapter
1. **Meet the King** in his Privy Chamber and receive a task.
2. **Explore Hampton Court**: Base Court, Clock Court, the Great Hall, Great Kitchens, Chapel Royal, the King's apartments, the Privy Garden by the Thames, and their own study.
3. **Examine 3 sources** (the Bible, portraits, letters, the Valor Ecclesiasticus, the "HA" initials in the Great Hall…). Each source has a *Source detective* question: *Who made it? Why? Can we trust it?*
4. **Talk to people at court**: Catherine of Aragon, Anne Boleyn, Bishop Fisher, Margaret Roper, Holbein, a former monk, the Duke of Norfolk, Catherine Howard and Catherine Parr. Their choices affect two meters:
   - 👑 **King's Favour**: flattery raises it, but if it reaches zero you are dismissed from court.
   - ⚖️ **Honesty**: telling the truth raises it, even when the King doesn't like it.
5. **Write a letter** at their desk, building it from greetings, evidence and requests. Some options unlock only after finding the right source. Then they seal it with wax.
6. **Report to the King**, then see **"What really happened"**, the updated **six wives tracker**, a 5-question **quiz** and a printable **Royal Report**.

Palace staff (a Yeoman of the Guard, a page, a spit boy, a gardener and a musician) share bonus facts about Tudor life. The Great Kitchens and the toilet that seated 28 tend to be favourites.

### Historical touches built into the palace
- The **Great Hall** has scaffolding in Chapter 2 (it was rebuilt from 1532 to 1535) and Henry and Anne's carved **"HA" initials** from Chapter 3.
- The **astronomical clock** on Anne Boleyn's Gateway appears in Chapter 4 (it was made in 1540).
- Henry gets visibly older and larger chapter by chapter.
- Cranmer really did leave his letter about Catherine Howard **on the King's seat in the Chapel Royal** at Hampton Court (2 November 1541).
- The game separates **legend from history**: the "Haunted Gallery" ghost story is labelled as a story with no evidence.

---

## Putting it on your pupils' iPads

The game is a plain website, so it needs to be hosted somewhere. The easiest free option is **GitHub Pages**:

1. Merge this branch into `main` (or ask whoever manages the repository to).
2. On GitHub, open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select **`main`** and **`/ (root)`**, and press **Save**.
4. After a minute or two, GitHub shows the address, e.g. `https://<username>.github.io/Tudors/`.
5. On each iPad, open that address in **Safari**, tap **Share → Add to Home Screen**. The game then opens full-screen like an app.

> The game will **not** work if you just double-click `index.html` on a computer, because browsers block this kind of game from running from local files. It must be opened from a web address. To try it on your own computer, run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

Everything the game needs (including the 3D library) is in this repository, so it does not depend on any other websites that a school filter might block.

### Tips for the classroom
- **Landscape** works best, though portrait works too.
- **Headphones** are useful if you turn on read-aloud.
- Progress is saved **on each iPad** in Safari. If iPads are shared between classes, ask pupils to remember which iPad they used. Each device holds one pupil's progress at a time.
- If a pupil closes Safari mid-chapter, they can tap **Continue** next time.

---

## Settings and accessibility (⏸️ Menu → ⚙️ Settings)
- 🔊 **Read aloud**: most screens have a 🔊 button, and this setting reads text automatically. It uses the iPad's built-in British English voice.
- 🔤 **Easy-read text**: a clearer font, more spacing and a plainer background. Helpful for many dyslexic readers.
- 🔎 **Bigger text**.
- 👀 **Look speed** for pupils who find turning too fast or too slow.

### For teachers
- **Unlock all chapters:** open Settings → *For teachers*, enter the code **`1509`** (the year Henry became king) and tap *Unlock all chapters*. Useful for demonstrating Chapter 3 on the board without playing 1 and 2 first.
- **Delete all progress on this iPad** is in the same section.
- **Printing reports:** at the end of each chapter pupils can tap **🖨️ Print / Save as PDF**. Each Royal Report includes their scores, the letter they wrote, what really happened and a **reflection question with writing lines** for their books. Completed reports can be reprinted from the chapter menu (**🖨️ My reports**).
- On a computer you can play with **W A S D** or the arrow keys, drag with the mouse to look, and press **E** to interact.

---

## Suggested lesson sequence

| Lesson | Activity | Discussion / follow-up |
|--------|----------|------------------------|
| 1 | Chapter 1: Wolsey | Why couldn't Henry just get divorced? Was it fair to blame Wolsey? |
| 2 | Chapter 2: More | Conscience vs loyalty debate: would *you* have signed the oath? |
| 3 | Chapter 3: Cromwell | Were the monasteries closed for religion or for money? Look at real Holbein portraits: can we trust them? |
| 4 | Chapter 4: Cranmer | Evidence and bias (the Lascelles statement). Legend vs history (the Haunted Gallery). |
| 5 | Review | Use the reports to compare all four advisors. Which advisor was most successful? Who was most honest? Was it possible to be both? |

Curriculum links (KS2 National Curriculum, History): chronological understanding; cause and consequence; continuity and change; similarity and difference; historical significance; using sources and understanding how interpretations are constructed.

---

## A note on historical accuracy
The game simplifies events and the words in sources for 10–11 year olds. It notes this on every source card. Conversations with characters are imagined, but they are based on real events, real people's known views and some famous real quotations (for example More's *"the King's good servant, but God's first"* and Wolsey's *"If I had served God as diligently as I have done the King…"*). Every chapter ends by showing what really happened, whatever choices the pupil made.

Some things were simplified on purpose:
- Chapter 1 covers 1527–29 and Chapter 3 1539–40, so the years between are told through intro cards and timeline entries.
- The palace layout is simplified. The real Hampton Court is much bigger, and some rooms (such as the study) are invented for the game.
- Executions are reported, never shown.

---

## For developers
- Plain HTML, CSS and JavaScript modules with no build step. 3D graphics use [three.js](https://threejs.org) r160 (MIT licence), included in `vendor/`.
- All textures are drawn in code, so there are no image files to load.
- `js/world.js` builds the palace, `js/characters.js` builds the people, and `js/main.js` is the game engine.
- **All historical content is in `js/content/`**: one file per chapter plus `common.js`. You can edit dialogue, sources, letters and quizzes there without touching the engine.
