// ============================================================
// Confidence Mode — Content Data
// Real skin normalization + media literacy + anti-filter
// ============================================================

export interface ConfidenceCard {
  id: string;
  category: ConfidenceCategory;
  title: string;
  emoji: string;
  content: string;
}

export type ConfidenceCategory =
  | "filters-vs-reality"
  | "media-literacy"
  | "affirmations"
  | "journal-prompts";

export const CONFIDENCE_CATEGORIES: Record<
  ConfidenceCategory,
  { icon: string; label: string; desc: string; color: string }
> = {
  "filters-vs-reality": {
    icon: "📸",
    label: "Filters vs Reality",
    desc: "What skin actually looks like",
    color: "border-l-[#d44a32]",
  },
  "media-literacy": {
    icon: "🧠",
    label: "Media Literacy",
    desc: "How images are manipulated online",
    color: "border-l-[#e8b86d]",
  },
  affirmations: {
    icon: "💛",
    label: "Affirmations",
    desc: "Reminders that help on tough days",
    color: "border-l-[#7da37d]",
  },
  "journal-prompts": {
    icon: "✏️",
    label: "Journal Prompts",
    desc: "Reflect on how you feel about your skin",
    color: "border-l-[#8b7ec8]",
  },
};

export const CONFIDENCE_CARDS: ConfidenceCard[] = [
  // ---- FILTERS VS REALITY ----
  {
    id: "fvr-pores",
    category: "filters-vs-reality",
    title: "Pores are normal",
    emoji: "🔍",
    content:
      "Every single person has visible pores. They're how your skin breathes and regulates oil. Filters erase them, but in real life, everyone — including models, influencers, and dermatologists — has visible pores. If you can see yours, that means your skin is working.",
  },
  {
    id: "fvr-texture",
    category: "filters-vs-reality",
    title: "Texture is not a flaw",
    emoji: "✋",
    content:
      "Skin has texture. It has tiny bumps, fine lines, and subtle unevenness. That's what skin looks like up close. Smoothed, poreless skin only exists on screens — not on any actual human face. The \"glass skin\" trend is lighting + filters + editing.",
  },
  {
    id: "fvr-redness",
    category: "filters-vs-reality",
    title: "Redness happens to everyone",
    emoji: "🌡️",
    content:
      "Your skin gets red from exercise, emotions, temperature changes, wind, spicy food, and dozens of other normal things. Influencers use green color-correcting filters to remove all redness. In real life, a bit of color in your skin is completely healthy.",
  },
  {
    id: "fvr-uneven",
    category: "filters-vs-reality",
    title: "Uneven skin tone is universal",
    emoji: "🎨",
    content:
      "Nobody has perfectly uniform skin color. Everyone has areas that are slightly darker, lighter, warmer, or cooler than others. Freckles, sun spots, under-eye circles — these are all part of normal human skin. Uniformity is a filter effect, not a realistic standard.",
  },
  {
    id: "fvr-breakouts",
    category: "filters-vs-reality",
    title: "Breakouts don't define you",
    emoji: "🔴",
    content:
      "85% of teens experience acne. It's the most common skin condition in the world. Having breakouts doesn't mean you're doing something wrong — it's mostly hormones and genetics. The people who seem to never break out? They do. They just don't post about it.",
  },

  // ---- MEDIA LITERACY ----
  {
    id: "ml-ring-light",
    category: "media-literacy",
    title: "The ring light trick",
    emoji: "💡",
    content:
      "Ring lights create a flat, even light that minimizes the appearance of texture, shadows, and blemishes. When an influencer's skin looks flawless in a video, the lighting is doing at least half the work. Try turning off overhead lights and using only a ring light — you'll see the difference on your own skin.",
  },
  {
    id: "ml-video-filters",
    category: "media-literacy",
    title: "Real-time video filters exist",
    emoji: "📱",
    content:
      "TikTok, Instagram, and Snapchat all have beauty filters that smooth skin, slim faces, enlarge eyes, and even out tone in real-time video. Many influencers use these while claiming they're filter-free. Some filters are designed to look subtle and undetectable.",
  },
  {
    id: "ml-editing",
    category: "media-literacy",
    title: "Post-editing is everywhere",
    emoji: "🖌️",
    content:
      "Apps like Facetune, VSCO, and Lightroom let anyone smooth skin, remove blemishes, reshape features, and adjust skin tone in photos. Even \"no filter\" posts are often heavily edited. A 2021 study found that over 70% of young women edit their selfies before posting.",
  },
  {
    id: "ml-angles",
    category: "media-literacy",
    title: "Angles change everything",
    emoji: "📐",
    content:
      "The same person can look completely different depending on camera angle, distance, and focal length. Holding a phone at arm's length vs close up literally changes the shape of your face. Influencers take dozens — sometimes hundreds — of photos to get one they post.",
  },
  {
    id: "ml-sponsored",
    category: "media-literacy",
    title: "Skincare content is often ads",
    emoji: "💰",
    content:
      "Many skincare routines you see online are paid promotions. Influencers are paid to say a product changed their skin — even if they've never used it regularly. Not all sponsored content is labeled clearly. Be skeptical of dramatic before/after results, especially when a product link is included.",
  },

  // ---- AFFIRMATIONS ----
  {
    id: "aff-1",
    category: "affirmations",
    title: "Your skin is doing its job",
    emoji: "🌿",
    content:
      "Your skin protects you from the outside world every single day. It heals cuts, fights bacteria, regulates your temperature, and lets you feel the world around you. Breakouts are a temporary thing — your skin's bigger job is keeping you alive, and it's doing great.",
  },
  {
    id: "aff-2",
    category: "affirmations",
    title: "Progress isn't always visible",
    emoji: "📈",
    content:
      "If you're taking care of your skin — gentle cleanser, moisturizer, SPF — you're making progress even when you can't see it yet. Skin cell turnover takes 4–6 weeks. The work you're putting in today shows up a month from now. Be patient with yourself.",
  },
  {
    id: "aff-3",
    category: "affirmations",
    title: "You're more than your skin",
    emoji: "⭐",
    content:
      "Your skin is one small part of who you are. The people who care about you don't see your pores or your breakouts — they see you. Your humor, your kindness, your ideas, your energy. Skin changes. Character is what stays.",
  },
  {
    id: "aff-4",
    category: "affirmations",
    title: "Comparison is a trap",
    emoji: "🪤",
    content:
      "You're comparing your real, unfiltered, up-close skin to someone else's edited, filtered, perfectly-lit highlight reel. That's not a fair comparison — and it never will be. The only fair comparison is you vs. you from last month.",
  },
  {
    id: "aff-5",
    category: "affirmations",
    title: "Asking for help is smart",
    emoji: "🤝",
    content:
      "If your skin is bothering you, talking to a parent, school nurse, or doctor isn't weakness — it's wisdom. Dermatologists exist because skin is complicated. Getting professional help when you need it is one of the smartest things you can do.",
  },

  // ---- JOURNAL PROMPTS ----
  {
    id: "jp-1",
    category: "journal-prompts",
    title: "What does your skin do well?",
    emoji: "✨",
    content:
      "We focus so much on what's \"wrong\" with our skin that we forget what's working. Write down three things your skin does that you appreciate — even small things like healing a cut or keeping you warm.",
  },
  {
    id: "jp-2",
    category: "journal-prompts",
    title: "When did you last feel good about your skin?",
    emoji: "😊",
    content:
      "Think about a moment when your skin felt fine — maybe you weren't thinking about it at all. What were you doing? Who were you with? Sometimes the best skin days are the ones where we simply forget to worry about it.",
  },
  {
    id: "jp-3",
    category: "journal-prompts",
    title: "What would you say to a friend?",
    emoji: "💬",
    content:
      "If your best friend came to you upset about a breakout, what would you tell them? Write it down. Now read it back to yourself — because you deserve the same kindness you'd give to someone you care about.",
  },
  {
    id: "jp-4",
    category: "journal-prompts",
    title: "How much time do you spend thinking about your skin?",
    emoji: "⏰",
    content:
      "Track it honestly for a day. Every time you check a mirror, touch your face, or think about your skin — notice it. Is the amount of mental energy proportional to the actual issue? Often it's not, and just noticing that can help.",
  },
  {
    id: "jp-5",
    category: "journal-prompts",
    title: "What filter are you performing?",
    emoji: "🎭",
    content:
      "Filters aren't just on phones. Sometimes we \"filter\" ourselves in real life — avoiding eye contact, covering our face, skipping events. What's one thing you've avoided because of how your skin looked? Could you try doing it anyway this week?",
  },
];
