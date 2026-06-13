import type { Scenario } from '../types'
import { QUOTE_BY_ID } from './quotes'

export const OCCASIONS = [
  'Toasts & celebrations',
  'Comfort & consolation',
  'Courage & action',
  'Work & ambition',
  'Love & friendship',
  'Wit & comebacks',
  "Life's rough patches",
  'Wisdom & warnings',
] as const

export type Occasion = (typeof OCCASIONS)[number]

export const SCENARIOS: Scenario[] = [
  // ───────── Toasts & celebrations ─────────
  {
    id: 'sc-wedding-toast',
    prompt: "You're giving the toast at a close friend's wedding and want one undefeated line about lasting love.",
    occasion: 'Toasts & celebrations',
    answers: ['son-116', 'rj-bounty-boundless', 'oth-loved-dangers'],
    why: 'Sonnet 116 is the marriage poem — "an ever-fixed mark" written to be read aloud at exactly this moment.',
  },
  {
    id: 'sc-anniversary',
    prompt: 'A couple is celebrating their 25th anniversary and you want to capture "still fascinating after all these years."',
    occasion: 'Toasts & celebrations',
    answers: ['ac-infinite-variety', 'son-18', 'son-116'],
    why: '"Age cannot wither her, nor custom stale her infinite variety" is the definitive long-haul compliment — time and familiarity both defeated.',
  },
  {
    id: 'sc-birthday-joyful',
    prompt: "It's the birthday of the most relentlessly cheerful person you know, and you want a line about being born happy.",
    occasion: 'Toasts & celebrations',
    answers: ['ma-star-danced'],
    why: 'Beatrice\'s "there was a star danced, and under that was I born" is joy explained by birthright — the perfect birthday inscription.',
  },
  {
    id: 'sc-unexpected-promotion',
    prompt: 'Your friend got promoted into a big role they never sought and feels like an impostor about it.',
    occasion: 'Toasts & celebrations',
    answers: ['tn-greatness-thrust', 'h5-minds-ready'],
    why: '"Some have greatness thrust upon \'em" dignifies the accidental rise — and the prank-letter backstory is your toast\'s twist ending.',
  },
  {
    id: 'sc-comeback-season',
    prompt: 'The team (or family, or business) just snapped a long losing streak — the drought is officially over.',
    occasion: 'Toasts & celebrations',
    answers: ['r3-winter-discontent', 'mac-night-long-day'],
    why: '"Now is the winter of our discontent made glorious summer" — read in full, it\'s a turnaround announcement, which is exactly the misquote-flip worth knowing.',
  },
  {
    id: 'sc-small-team-win',
    prompt: 'Your tiny, understaffed crew just pulled off something the big players said was impossible.',
    occasion: 'Toasts & celebrations',
    answers: ['h5-band-brothers', 'msnd-little-fierce'],
    why: '"We few, we happy few, we band of brothers" converts being outnumbered into being elite — Agincourt logic for startup teams.',
  },
  {
    id: 'sc-humble-hosting',
    prompt: "Friends showed up unannounced and all you have is frozen pizza — you want to bless the meal anyway.",
    occasion: 'Toasts & celebrations',
    answers: ['coe-small-cheer', 'ham-readiness'],
    why: '"Small cheer and great welcome makes a merry feast" — the host\'s warmth, not the menu, is the meal.',
  },

  // ───────── Comfort & consolation ─────────
  {
    id: 'sc-grieving-friend',
    prompt: 'A friend lost a parent and has gone completely quiet, holding it all in.',
    occasion: 'Comfort & consolation',
    answers: ['mac-give-sorrow-words', 'lear-speak-what-we-feel'],
    why: '"Give sorrow words" names exactly the danger — silent grief "whispers the o\'er-fraught heart and bids it break." An invitation, not advice.',
  },
  {
    id: 'sc-funeral-words',
    prompt: 'You need a few lines for a memorial — something consoling that doesn\'t pretend death away.',
    occasion: 'Comfort & consolation',
    answers: ['cym-fear-no-more', 'ham-goodnight-sweet-prince', 'tmp-full-fathom'],
    why: 'The Cymbeline dirge — "Fear no more the heat o\' the sun" — frames death as rest after honest work, comfort with no false notes.',
  },
  {
    id: 'sc-everything-at-once',
    prompt: 'Your friend\'s car died, their basement flooded, and they got a parking ticket — all in one week.',
    occasion: 'Comfort & consolation',
    answers: ['ham-sorrows-battalions', 'lear-flies-wanton-boys', 'mac-come-what-may'],
    why: '"When sorrows come, they come not single spies, but in battalions" — Shakespeare certifying that troubles travel in packs.',
  },
  {
    id: 'sc-comparison-spiral',
    prompt: "A friend is doom-scrolling LinkedIn at midnight, convinced everyone else's career is better.",
    occasion: 'Comfort & consolation',
    answers: ['son-29', 'ham-nothing-good-or-bad'],
    why: 'Sonnet 29 IS the comparison spiral — "desiring this man\'s art and that man\'s scope" — plus the turn: one remembered love beats trading places with kings.',
  },
  {
    id: 'sc-irreversible-mistake',
    prompt: 'They sent the wrong email to the whole company. It cannot be unsent. They keep reliving it.',
    occasion: 'Comfort & consolation',
    answers: ['mac-whats-done', 'wt-past-help-past-grief'],
    why: '"Things without all remedy should be without regard: what\'s done is done" — release valve for anything past fixing.',
  },
  {
    id: 'sc-long-recovery',
    prompt: 'An injured runner is two weeks into a twelve-week recovery plan and already despairing at the pace.',
    occasion: 'Comfort & consolation',
    answers: ['oth-patience-degrees', 'mac-night-long-day', 'msnd-true-love'],
    why: '"What wound did ever heal but by degrees?" — healing has exactly one speed, and impatience isn\'t it.',
  },
  {
    id: 'sc-breakup',
    prompt: 'Your friend got ghosted after three great dates and is composing a forensic timeline of what went wrong.',
    occasion: 'Comfort & consolation',
    answers: ['ma-sigh-no-more', 'tn-adored-once'],
    why: '"Sigh no more… men were deceivers ever" — inconstancy is ancient and documented; convert the sighs to hey-nonny-nonny.',
  },
  {
    id: 'sc-waiting-on-news',
    prompt: "Someone you love is waiting on big test results and there's nothing to do but wait.",
    occasion: 'Comfort & consolation',
    answers: ['mfm-miserable-hope', 'mac-come-what-may', 'ham-readiness'],
    why: '"The miserable have no other medicine but only hope" honors hope as real medicine — without pretending the odds are knowable.',
  },

  // ───────── Courage & action ─────────
  {
    id: 'sc-fear-of-applying',
    prompt: "Your friend won't apply for the dream job: \"I'm probably not qualified anyway.\"",
    occasion: 'Courage & action',
    answers: ['mfm-doubts-traitors', 'aw-remedies-ourselves', 'jc-cowards-die'],
    why: '"Our doubts are traitors, and make us lose the good we oft might win by fearing to attempt" — the application-button quote, full stop.',
  },
  {
    id: 'sc-window-closing',
    prompt: 'The house, the offer, the moment — a real opportunity is open NOW and they keep deliberating.',
    occasion: 'Courage & action',
    answers: ['jc-tide-affairs', 'mac-done-quickly'],
    why: '"There is a tide in the affairs of men, which, taken at the flood, leads on to fortune" — opportunity has tides, and tides go out.',
  },
  {
    id: 'sc-prerace-nerves',
    prompt: "It's the morning of the half marathon. The training is done; only the nerves are left.",
    occasion: 'Courage & action',
    answers: ['h5-minds-ready', 'ham-readiness', 'h5-breach'],
    why: '"All things are ready, if our minds be so" — the calmest pre-battle sentence ever written, sized for race corrals.',
  },
  {
    id: 'sc-one-more-push',
    prompt: 'Mile 11 of 13. Legs are gone. Someone needs five words to keep moving.',
    occasion: 'Courage & action',
    answers: ['h5-breach', 'mac-sticking-place'],
    why: '"Once more unto the breach, dear friends" — the original one-more-rep speech, four centuries of proven efficacy.',
  },
  {
    id: 'sc-scary-commitment',
    prompt: "They're about to hit send on the resignation letter that starts the new life. Finger hovering.",
    occasion: 'Courage & action',
    answers: ['mac-sticking-place', 'mfm-doubts-traitors', 'jc-tide-affairs'],
    why: '"Screw your courage to the sticking-place, and we\'ll not fail" — full commitment as the failure-proofing. (Vet your hype man; this one launched a regicide.)',
  },
  {
    id: 'sc-rehearsing-doom',
    prompt: 'Your friend has imagined the worst-case outcome of their dentist appointment forty times this week.',
    occasion: 'Courage & action',
    answers: ['jc-cowards-die', 'ham-conscience-cowards'],
    why: '"Cowards die many times before their deaths" — pre-living the disaster is paying for it in installments.',
  },
  {
    id: 'sc-quit-with-dignity',
    prompt: 'After being passed over unfairly for the last time, your friend is leaving — head high.',
    occasion: 'Courage & action',
    answers: ['cor-world-elsewhere', 'tmp-charms-oerthrown'],
    why: '"There is a world elsewhere" — five words that turn a door slam into a coronation.',
  },

  // ───────── Work & ambition ─────────
  {
    id: 'sc-meeting-too-long',
    prompt: "Minute 47 of a meeting that should've been an email. You're asked for your thoughts.",
    occasion: 'Work & ambition',
    answers: ['ham-brevity', 'h5-few-words'],
    why: '"Brevity is the soul of wit" — bonus: it\'s spoken by Shakespeare\'s biggest windbag, which your meeting will appreciate on two levels.',
  },
  {
    id: 'sc-flashy-pitch',
    prompt: 'The vendor demo is all sizzle — gorgeous slides, suspicious numbers, no references.',
    occasion: 'Work & ambition',
    answers: ['mov-glisters', 'mac-fair-is-foul'],
    why: '"All that glisters is not gold" was literally written on a scroll inside a flashy gold box that contained a skull. Due diligence, 1597.',
  },
  {
    id: 'sc-credit-taker',
    prompt: 'A coworker presents the team\'s work as his own — again — while management nods along.',
    occasion: 'Work & ambition',
    answers: ['jc-honourable-man', 'ham-smile-villain'],
    why: 'Antony\'s "and Brutus is an honourable man" is the template: repeat the official praise until it curdles.',
  },
  {
    id: 'sc-blame-the-market',
    prompt: 'The quarterly numbers are bad and the postmortem is blaming everything except the decisions made.',
    occasion: 'Work & ambition',
    answers: ['jc-fault-stars', 'aw-remedies-ourselves'],
    why: '"The fault, dear Brutus, is not in our stars, but in ourselves" — the accountability quote, surgical grade.',
  },
  {
    id: 'sc-overpolishing',
    prompt: "The deck was done Tuesday. It's Friday and they're still 'just tightening' slide transitions.",
    occasion: 'Work & ambition',
    answers: ['kj-paint-lily', 'lear-striving-better'],
    why: '"To gild refined gold, to paint the lily… is wasteful and ridiculous excess" — and you get to explain that "gild the lily" is itself a misquote.',
  },
  {
    id: 'sc-boss-cant-sleep',
    prompt: 'Your newly promoted friend says the job is great but they now wake at 3 a.m. thinking about payroll.',
    occasion: 'Work & ambition',
    answers: ['h4-uneasy-head', 'mac-scorpions'],
    why: '"Uneasy lies the head that wears a crown" — responsibility\'s insomnia, diagnosed by an actual king.',
  },
  {
    id: 'sc-rotten-org',
    prompt: "Third executive departure this quarter, and the all-hands answers are getting weirder. Something's off upstream.",
    occasion: 'Work & ambition',
    answers: ['ham-rotten-denmark', 'mac-fair-is-foul'],
    why: '"Something is rotten in the state of Denmark" — systemic decay, named from the sentry post. (Marcellus says it, not Hamlet — your trivia bonus.)',
  },
  {
    id: 'sc-quiet-performer',
    prompt: 'Promotion packets are due, and the loudest self-promoter is up against the quiet one who shipped everything.',
    occasion: 'Work & ambition',
    answers: ['h5-few-words', 'lear-nothing-nothing'],
    why: '"Men of few words are the best men" — the boy in Henry V scouting talent the way good managers should.',
  },
  {
    id: 'sc-finish-line-flat',
    prompt: 'They finally shipped the thing they chased for two years — and feel strangely empty a week later.',
    occasion: 'Work & ambition',
    answers: ['troil-things-won', 'h4-playing-holidays'],
    why: '"Things won are done; joy\'s soul lies in the doing" — the post-victory flatness, diagnosed in 1602.',
  },

  // ───────── Love & friendship ─────────
  {
    id: 'sc-they-walk-in',
    prompt: 'Your person walks into the room and you want six words that say everything.',
    occasion: 'Love & friendship',
    answers: ['rj-but-soft', 'son-18'],
    why: '"But soft, what light through yonder window breaks?" — the standard-issue line for luminous entrances since 1595.',
  },
  {
    id: 'sc-long-distance-reunion',
    prompt: "After eight months long-distance, they're finally at the same airport arrivals gate.",
    occasion: 'Love & friendship',
    answers: ['tn-journeys-end', 'rj-parting-sorrow'],
    why: '"Journeys end in lovers meeting" — Feste\'s song, custom-built for arrivals gates.',
  },
  {
    id: 'sc-anti-valentine',
    prompt: "Your spouse hates sappy cards. You want a valentine that roasts and adores simultaneously.",
    occasion: 'Love & friendship',
    answers: ['son-130', 'ayli-must-speak'],
    why: 'Sonnet 130 mocks every cliché compliment for twelve lines, then lands the realest one — love without false compare.',
  },
  {
    id: 'sc-cant-stop-leaving',
    prompt: 'The dinner party goodbye has now lasted 25 minutes, spanning the kitchen, hallway, and driveway.',
    occasion: 'Love & friendship',
    answers: ['rj-parting-sorrow', 'msnd-shadows-offended'],
    why: '"Parting is such sweet sorrow, that I shall say good night till it be morrow" — the canonical long goodbye, self-aware edition.',
  },
  {
    id: 'sc-confessing-feelings',
    prompt: "Two old friends, years of banter, and one of them finally wants to say it's more than that.",
    occasion: 'Love & friendship',
    answers: ['ma-love-nothing-strange', 'ma-speak-low'],
    why: 'Benedick\'s "I do love nothing in the world so well as you — is not that strange?" was written for exactly this jump.',
  },
  {
    id: 'sc-inexplicable-devotion',
    prompt: "Everyone asks why he's kept that rusted-out truck for twenty years. He just smiles.",
    occasion: 'Love & friendship',
    answers: ['msnd-love-looks-mind', 'son-130'],
    why: '"Love looks not with the eyes, but with the mind" — attraction was never about the Carfax.',
  },
  {
    id: 'sc-old-friend-reunion',
    prompt: 'A friend you lost touch with for a decade calls, and an hour later the years have evaporated.',
    occasion: 'Love & friendship',
    answers: ['son-30', 'jc-noblest-roman'],
    why: 'Sonnet 30: nostalgia\'s sad audit, until "I think on thee, dear friend — all losses are restored and sorrows end."',
  },

  // ───────── Wit & comebacks ─────────
  {
    id: 'sc-betrayal-mock',
    prompt: 'Your best friend — YOUR best friend — just joined the rival fantasy league.',
    occasion: 'Wit & comebacks',
    answers: ['jc-et-tu', 'ham-smile-villain'],
    why: '"Et tu, Brute?" — the only acceptable response to small treason from close friends.',
  },
  {
    id: 'sc-elegant-unfriending',
    prompt: 'The contractor who ghosted you twice wants to "reconnect about your project."',
    occasion: 'Wit & comebacks',
    answers: ['ayli-better-strangers', 'cor-conversation-infect'],
    why: '"I do desire we may be better strangers" — maximum distance, minimum rudeness, perfect grammar.',
  },
  {
    id: 'sc-roast-battle',
    prompt: "Trash-talk night with old friends, and you need ammunition nobody's heard before.",
    occasion: 'Wit & comebacks',
    answers: ['h4-starveling', 'cor-conversation-infect', 'r3-infect-eyes'],
    why: 'Falstaff\'s "you starveling, you elf-skin, you dried neat\'s-tongue" — a 400-year-old combo that still lands clean.',
  },
  {
    id: 'sc-hostile-qa',
    prompt: 'The post-game (or post-mortem) Q&A is getting pointed, and you owe answers — not pleasant ones.',
    occasion: 'Wit & comebacks',
    answers: ['mov-not-bound-please', 'lear-sinned-against'],
    why: '"I am not bound to please thee with my answers" — Shylock\'s courtroom-grade boundary, still load-bearing.',
  },
  {
    id: 'sc-abrupt-exit',
    prompt: 'The karaoke machine has appeared. You are leaving the party in the next ninety seconds.',
    occasion: 'Wit & comebacks',
    answers: ['wt-exit-bear', 'msnd-shadows-offended'],
    why: '"Exit, pursued by a bear" — narrate your departure as Shakespeare\'s most famous stage direction and no one can be mad.',
  },
  {
    id: 'sc-stirring-the-pot',
    prompt: "You're stirring the chili (or the group-chat drama) and the moment demands an incantation.",
    occasion: 'Wit & comebacks',
    answers: ['mac-double-double', 'mac-something-wicked'],
    why: '"Double, double toil and trouble" — and you\'ll know it\'s not "bubble, bubble," which is half the power move.',
  },
  {
    id: 'sc-known-menace-approaches',
    prompt: "The toddler has found the permanent markers and is walking toward the freshly painted wall.",
    occasion: 'Wit & comebacks',
    answers: ['mac-something-wicked', 'jc-cry-havoc'],
    why: '"By the pricking of my thumbs, something wicked this way comes" — the official herald for incoming chaos agents.',
  },
  {
    id: 'sc-midnight-fridge',
    prompt: 'The kitchen at midnight. The refrigerator door opens, casting its holy glow.',
    occasion: 'Wit & comebacks',
    answers: ['rj-but-soft', 'mac-dagger'],
    why: '"But soft, what light through yonder window breaks?" — Romeo\'s line, rededicated to leftover lasagna.',
  },

  // ───────── Life's rough patches ─────────
  {
    id: 'sc-absurd-bad-luck',
    prompt: 'You locked the keys in the car. At the gas station. In the rain. Wearing the new shoes.',
    occasion: "Life's rough patches",
    answers: ['rj-fortunes-fool', 'lear-flies-wanton-boys'],
    why: '"O, I am fortune\'s fool!" — when the universe\'s prank targeting is suspiciously precise.',
  },
  {
    id: 'sc-cant-sleep',
    prompt: "It's 2 a.m. and your brain has decided to replay every awkward thing you've said since 2009.",
    occasion: "Life's rough patches",
    answers: ['mac-murder-sleep', 'mac-scorpions', 'h4-uneasy-head'],
    why: '"Macbeth does murder sleep" — swap in your culprit: the espresso, the group chat, the playoff loss.',
  },
  {
    id: 'sc-ungrateful-kids',
    prompt: "You drove them to practice all season and they just rated your cooking 'mid.'",
    occasion: "Life's rough patches",
    answers: ['lear-serpent-tooth', 'ayli-blow-blow', 'h4-house-home'],
    why: '"How sharper than a serpent\'s tooth it is to have a thankless child!" — Lear\'s full-volume parental sigh.',
  },
  {
    id: 'sc-doomscroll-temptation',
    prompt: "You're about to re-read the old text thread for the fifth time tonight. You can feel the spiral starting.",
    occasion: "Life's rough patches",
    answers: ['lear-way-madness', 'mac-whats-done'],
    why: '"O, that way madness lies; let me shun that" — Lear\'s own swerve away from the thought-spiral, available for rental.',
  },
  {
    id: 'sc-vacation-ending',
    prompt: 'Last night of the beach trip. Tomorrow: inbox. The mood on the porch has gone wistful.',
    occasion: "Life's rough patches",
    answers: ['h4-playing-holidays', 'tmp-such-stuff', 'son-73'],
    why: '"If all the year were playing holidays, to sport would be as tedious as to work" — scarcity is what made the week golden.',
  },
  {
    id: 'sc-time-got-away',
    prompt: 'The training plan said sixteen weeks. You opened it again with five weeks left.',
    occasion: "Life's rough patches",
    answers: ['r2-wasted-time', 'jc-tide-affairs'],
    why: '"I wasted time, and now doth time waste me" — Richard II, patron saint of postponed training plans.',
  },
  {
    id: 'sc-unfair-outcome',
    prompt: 'The office politician got the promotion. The honest grinder got a coffee mug.',
    occasion: "Life's rough patches",
    answers: ['mfm-rise-by-sin', 'oth-robbed-smiles'],
    why: '"Some rise by sin, and some by virtue fall" — the scoreboard has never audited fairly; Escalus noticed in 1604.',
  },
  {
    id: 'sc-chaos-everywhere',
    prompt: 'Airport, day before Thanksgiving. Three gate changes. A man is arguing with a kiosk.',
    occasion: "Life's rough patches",
    answers: ['tmp-hell-empty', 'tn-midsummer-madness', 'msnd-fools-mortals'],
    why: '"Hell is empty, and all the devils are here" — Ariel\'s field report from Terminal B.',
  },

  // ───────── Wisdom & warnings ─────────
  {
    id: 'sc-jealousy-creeping',
    prompt: "Your friend keeps checking their ex's new relationship 'just out of curiosity.'",
    occasion: 'Wisdom & warnings',
    answers: ['oth-green-eyed', 'lear-way-madness'],
    why: '"O, beware, my lord, of jealousy; it is the green-eyed monster which doth mock the meat it feeds on" — it eats the host.',
  },
  {
    id: 'sc-too-good-deal',
    prompt: "The investment 'returns 4% monthly, guaranteed.' Your uncle is already reaching for his checkbook.",
    occasion: 'Wisdom & warnings',
    answers: ['mov-glisters', 'mov-devil-scripture', 'jc-ides-march'],
    why: '"All that glisters is not gold" — found inside the shiny casket, next to a skull, where good marketing usually keeps one.',
  },
  {
    id: 'sc-cherry-picked-stats',
    prompt: 'He\'s quoting one study, loudly, that happens to bless exactly what he already wanted to do.',
    occasion: 'Wisdom & warnings',
    answers: ['mov-devil-scripture', 'jc-honourable-man'],
    why: '"The devil can cite Scripture for his purpose" — citation is not argument; selection is the tell.',
  },
  {
    id: 'sc-overpromiser',
    prompt: "The new vendor has now assured you four times, unprompted, how transparent they are.",
    occasion: 'Wisdom & warnings',
    answers: ['ham-protest-too-much', 'mac-innocent-flower'],
    why: '"The lady doth protest too much, methinks" — over-vowing is the confession. (And "protest" means promise, not deny — you\'ll be quoting it correctly.)',
  },
  {
    id: 'sc-whirlwind-everything',
    prompt: 'They met in March, moved in by April, and are now pricing rings. You love them; you\'re also bracing.',
    occasion: 'Wisdom & warnings',
    answers: ['rj-violent-delights', 'rj-wisely-slow'],
    why: '"These violent delights have violent ends" — the Friar\'s gunpowder physics for things that ignite too hot.',
  },
  {
    id: 'sc-lending-friend-money',
    prompt: 'A good friend wants to borrow a significant amount, and you can feel the friendship doing math.',
    occasion: 'Wisdom & warnings',
    answers: ['ham-borrower-lender', 'lear-fool-advice'],
    why: '"Neither a borrower nor a lender be, for loan oft loses both itself and friend" — Polonius\'s one bulletproof tip.',
  },
  {
    id: 'sc-clear-warning-ignored',
    prompt: "You flagged the risk in writing, twice. Leadership 'appreciates your input' and is proceeding anyway.",
    occasion: 'Wisdom & warnings',
    answers: ['jc-ides-march', 'jc-lean-hungry'],
    why: '"Beware the ides of March" — the canonical clear warning, plainly delivered, fatally dismissed. Document and date your soothsaying.',
  },
  {
    id: 'sc-confident-novice',
    prompt: "Two YouTube videos in, he's explaining to the electrician how he'd wire the panel.",
    occasion: 'Wisdom & warnings',
    answers: ['ayli-fool-wise', 'tn-witty-fool'],
    why: '"The fool doth think he is wise, but the wise man knows himself to be a fool" — Dunning-Kruger, Arden Forest edition.',
  },
  {
    id: 'sc-mentor-sendoff',
    prompt: 'Your mentor is retiring after 30 years and insists on "no fuss" at the farewell lunch.',
    occasion: 'Wisdom & warnings',
    answers: ['tmp-charms-oerthrown', 'jc-noblest-roman', 'ayli-worlds-stage'],
    why: '"Now my charms are all o\'erthrown, and what strength I have\'s mine own" — Prospero\'s retirement speech, possibly Shakespeare\'s too.',
  },
  {
    id: 'sc-new-chapter',
    prompt: "The boxes are unpacked in the new city. Everything before this feels like backstory now.",
    occasion: 'Wisdom & warnings',
    answers: ['tmp-past-prologue', 'ayli-worlds-stage', 'aw-remedies-ourselves'],
    why: '"What\'s past is prologue" — the setup is over and the act begins now. (In the play it pitches a murder; in your kitchen it pitches unpacking.)',
  },
]

if (import.meta.env.DEV) {
  for (const s of SCENARIOS) {
    for (const id of s.answers) {
      if (!QUOTE_BY_ID[id]) console.warn(`[by-heart] scenario ${s.id} references missing quote: ${id}`)
    }
  }
}
