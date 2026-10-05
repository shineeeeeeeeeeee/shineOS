/**
 * About Application Content
 *
 * Copy for the About document lives here so layout stays separate from wording.
 *
 * This is a personal document, not a résumé. It says who Shine is outside of
 * jobs, internships, qualifications and portfolio achievements. Nothing here
 * invents a fact: no ratings, collections, favourite characters, brands or
 * quantities that have not actually been given. Where a line stays vague it is
 * because the real thing is private or simply unknown.
 *
 * Voice: warm, honest, a bit quirky, slightly self-aware. Written late at night
 * and not sanded afterwards. No "passionate about", no "journey", no
 * self-improvement language — the ban list lives at the bottom of this file.
 */

export interface AboutRow {
  /** Short label shown in the left column. */
  label: string
  /** Value shown in the right column. May be a sentence or a short phrase. */
  value: string
}

export interface AboutTopic {
  title: string
  note: string
}

export interface AboutContent {
  /** Small kicker above the greeting. */
  eyebrow: string
  /** The opening line of the document. */
  greeting: string
  /** One or two sentences under the greeting. */
  intro: string
  /** Short signature line under the intro rule. */
  signoff: string
  about: {
    label: string
    lead: string
    paragraphs: string[]
  }
  currently: {
    label: string
    lead: string
    rows: AboutRow[]
  }
  interests: {
    label: string
    lead: string
    topics: AboutTopic[]
  }
  /** Quiet personal sentence near the end of the document. */
  closing: {
    label: string
    paragraphs: string[]
  }
  footer: {
    note: string
    rows: AboutRow[]
  }
}

export const aboutContent: AboutContent = {
  eyebrow: 'About this machine',
  greeting: "Hi, I'm Shine.",
  intro:
    'I build things because I genuinely like building things. Most of them never leave my desk, and most of them were made at an hour nobody should really be awake at.',
  signoff: "Not a résumé. This is roughly what I'd tell you if it was late and neither of us was doing anything else.",

  about: {
    label: 'About',
    lead: 'Most days look something like this.',
    paragraphs: [
      'Code for a few hours. Fall asleep halfway through a film. Wake up hungry, make Buldak, and go back to the thing I was building before I remembered I was tired. On a free day it is usually just that on repeat, and I am not going to pretend it is less satisfying than it sounds.',
      "I read things so I can get better at things. I take apart programs until they look like something I could actually hold in my hands, and I do the same to keyboards, mice, cables and other electronics that had no business being as satisfying as they are. I like taking things apart far more than I like writing the list of things I have taken apart.",
      "I'm quiet the first time I meet someone. It isn't a performance, I'm just genuinely still sorting things out. Give me a bit of time and people usually end up a little surprised. I change my mind about small things constantly. I notice much more than I say, and I think about most of it long after it stopped mattering.",
    ],
  },

  currently: {
    label: 'Currently',
    lead: 'The state of things, roughly.',
    rows: [
      {
        label: 'At the desk',
        value: 'Building this machine — windows, a dock, a Files app, and this page.',
      },
      {
        label: 'In the stomach',
        value: 'Buldak, washed down with milk and chocos, because judgement is a tomorrow problem.',
      },
      {
        label: 'Lately',
        value: 'Late nights and short plans. I come alive properly once everyone else has gone to sleep.',
      },
    ],
  },

  interests: {
    label: 'A few things about me',
    lead: 'Not a list, really. Just the things that keep turning up.',
    topics: [
      {
        title: 'Chess',
        note: 'I keep playing on the days when losing tells me more about myself than the game does.',
      },
      {
        title: 'Ramen',
        note: 'Buldak is less a meal and more a personality trait. I make it hotter than is sensible and complain the whole way through.',
      },
      {
        title: 'Harry Potter',
        note: 'I will happily go back to the beginning of the same magical world again instead of choosing something sensible and new.',
      },
      {
        title: 'Keyboards',
        note: 'I do not need another keyboard. I have said this before. It has never once stopped me.',
      },
      {
        title: 'Night hours',
        note: 'The best plans are the ones nobody made, and they only show up after one in the morning.',
      },
      {
        title: 'Small things',
        note: 'LEGO, Hot Wheels, books, skincare, a gadget with no practical purpose. I am drawn to small objects that are simply exactly themselves.',
      },
    ],
  },

  closing: {
    label: 'One more thing',
    paragraphs: [
      "I've honestly started a new life, and I'm hanging in there. It's been hard. But looking back at where I was, I think I can do it.",
    ],
  },

  footer: {
    note: 'End of document.',
    rows: [
      { label: 'Document', value: 'About — Shine OS' },
      { label: 'Version', value: '0.3.0' },
      { label: 'Built with', value: 'React, TypeScript and Vite' },
      { label: 'Libraries', value: 'None — every component written from scratch' },
    ],
  },
}

/**
 * Banned language, kept here so the voice stays auditable.
 *
 * No "I am passionate about", "I am a highly motivated", "my journey",
 * "I aspire to", "I leverage", "I thrive in", no self-improvement advice,
 * no corporate buzzwords, and no résumé terminology anywhere on this page.
 */