// ============================================================
// Learn Hub — Types + Content Data
// Educational content structured for teen audience
// ============================================================

export interface LearnArticle {
  id: string;
  category: LearnCategory;
  title: string;
  emoji: string;
  summary: string;
  content: ArticleSection[];
  tags: string[];
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export type LearnCategory =
  | "conditions"
  | "myths"
  | "ingredients"
  | "patch-testing";

export const CATEGORY_META: Record<
  LearnCategory,
  { icon: string; label: string; desc: string; color: string }
> = {
  conditions: {
    icon: "🔬",
    label: "Condition Guides",
    desc: "Understand common skin concerns",
    color: "border-l-[#7da37d]",
  },
  myths: {
    icon: "🧪",
    label: "MythBusters",
    desc: "Debunking social media skincare trends",
    color: "border-l-[#d44a32]",
  },
  ingredients: {
    icon: "🧴",
    label: "Ingredient Coach",
    desc: "What's in your products and why",
    color: "border-l-[#e8b86d]",
  },
  "patch-testing": {
    icon: "🩹",
    label: "Patch Testing 101",
    desc: "How to safely try new products",
    color: "border-l-[#8b7ec8]",
  },
};

// ============================================================
// ARTICLES
// ============================================================

export const LEARN_ARTICLES: LearnArticle[] = [
  // ---- CONDITIONS ----
  {
    id: "acne-basics",
    category: "conditions",
    title: "Acne: What's Actually Happening",
    emoji: "🔴",
    summary:
      "Breakouts are incredibly common in teens. Here's what causes them and what actually helps.",
    tags: ["acne", "breakouts", "pimples"],
    content: [
      {
        heading: "Why it happens",
        body: "Acne forms when pores get clogged with oil (sebum) and dead skin cells. Hormonal changes during puberty increase oil production, which is why breakouts are so common between ages 12–25. It's not caused by being dirty or eating chocolate — those are myths.",
      },
      {
        heading: "Types you might see",
        body: "Whiteheads and blackheads are non-inflammatory — they're just clogged pores. Red, swollen bumps (papules and pustules) mean there's some inflammation. Deeper, painful bumps under the skin are nodules or cysts — those are worth mentioning to a doctor.",
      },
      {
        heading: "What actually helps",
        body: "A gentle cleanser twice a day, a lightweight moisturizer, and SPF are the foundation. If you want to add a treatment, benzoyl peroxide (2.5%) or salicylic acid (0.5–2%) are good starting points. Introduce one at a time. Most acne treatments take 6–8 weeks to show results, so patience matters more than product stacking.",
      },
      {
        heading: "When to get help",
        body: "If breakouts are painful, leaving scars, affecting your confidence, or not improving after 2–3 months of consistent gentle care — talk to a doctor or dermatologist. There are effective prescription options that can make a big difference.",
      },
    ],
  },
  {
    id: "eczema-basics",
    category: "conditions",
    title: "Eczema & Dry Skin Patches",
    emoji: "🩹",
    summary:
      "Itchy, dry, red patches? Might be eczema. Here's what to know.",
    tags: ["eczema", "dry skin", "dermatitis"],
    content: [
      {
        heading: "What eczema looks like",
        body: "Eczema (atopic dermatitis) shows up as dry, itchy, red or dark patches — often on the insides of elbows, behind knees, or on the face and neck. It can flare up and calm down in cycles. It's very common and not contagious.",
      },
      {
        heading: "Common triggers",
        body: "Fragranced products, harsh soaps, dry weather, sweat, stress, and certain fabrics (like wool) can all trigger flares. Everyone's triggers are different — tracking yours in the journal can help identify patterns.",
      },
      {
        heading: "What helps",
        body: "Moisturize frequently with a thick, fragrance-free cream (not lotion). Apply right after showering to lock in moisture. Avoid hot water — lukewarm is better. A gentle, soap-free cleanser reduces irritation. For active flares, an over-the-counter hydrocortisone cream (1%) can help short-term.",
      },
      {
        heading: "When to get help",
        body: "See a doctor if the itch is keeping you up at night, the skin is cracking or bleeding, it's spreading significantly, or over-the-counter treatments aren't helping after 2 weeks.",
      },
    ],
  },
  {
    id: "contact-dermatitis",
    category: "conditions",
    title: "Skin Reactions & Contact Dermatitis",
    emoji: "⚡",
    summary:
      "When your skin reacts to a product or material — and what to do about it.",
    tags: ["reaction", "allergy", "irritation", "rash"],
    content: [
      {
        heading: "What's going on",
        body: "Contact dermatitis is your skin's reaction to something it touched — a new product, fragrance, metal (like nickel in jewelry), or plant. It can be irritant (direct damage) or allergic (immune response). Either way, the fix starts with identifying and removing the cause.",
      },
      {
        heading: "How to identify the cause",
        body: "Think about what's new: a product, detergent, fabric, jewelry, or even a phone case. The reaction usually shows up where the product touched your skin. This is why we track new products in your journal — it makes detective work easier.",
      },
      {
        heading: "What to do",
        body: "Stop using the suspected product immediately. Wash the area gently with plain water. Apply a fragrance-free moisturizer. A cool compress can help with itching. Avoid scratching — it makes things worse and can cause infection.",
      },
      {
        heading: "Prevention",
        body: "Always patch test new products. Apply a small amount to your inner wrist or behind your ear, wait 24–48 hours. If no reaction, you're likely fine. Introduce only one new product at a time so you know what caused any reaction.",
      },
    ],
  },

  // ---- MYTHS ----
  {
    id: "myth-dirty-skin",
    category: "myths",
    title: "\"Acne Means Your Skin Is Dirty\"",
    emoji: "🚿",
    summary: "One of the biggest myths out there. Let's set the record straight.",
    tags: ["myth", "acne", "cleansing"],
    content: [
      {
        heading: "The myth",
        body: "\"If you just washed your face more, you wouldn't have acne.\" This is one of the most harmful skincare myths because it makes people feel like breakouts are their fault.",
      },
      {
        heading: "The reality",
        body: "Acne is primarily driven by hormones, genetics, and oil production — not hygiene. Over-washing actually strips your skin's protective barrier, which can make breakouts worse. Your skin needs some oil to stay healthy.",
      },
      {
        heading: "What to do instead",
        body: "Wash your face twice a day (morning and night) with a gentle cleanser. That's it. No scrubbing, no washing 5 times a day. If anything, less is more when it comes to cleansing.",
      },
    ],
  },
  {
    id: "myth-toothpaste",
    category: "myths",
    title: "\"Put Toothpaste on Pimples\"",
    emoji: "🪥",
    summary: "A classic internet hack that can actually damage your skin.",
    tags: ["myth", "home remedy", "pimples"],
    content: [
      {
        heading: "The myth",
        body: "\"Dab toothpaste on a pimple overnight and it'll dry it out.\" This has been circulating for decades.",
      },
      {
        heading: "The reality",
        body: "Toothpaste contains ingredients like sodium lauryl sulfate, menthol, and hydrogen peroxide that can severely irritate facial skin. It can cause chemical burns, peeling, and dark spots — especially on darker skin tones. It's not formulated for skin.",
      },
      {
        heading: "What actually works",
        body: "For spot treatment, try a benzoyl peroxide 2.5% gel or a hydrocolloid pimple patch. These are specifically designed for skin and work much better without the irritation risk.",
      },
    ],
  },
  {
    id: "myth-more-products",
    category: "myths",
    title: "\"More Products = Better Skin\"",
    emoji: "📦",
    summary: "The 10-step routine myth that social media won't let go of.",
    tags: ["myth", "routine", "product stacking"],
    content: [
      {
        heading: "The myth",
        body: "\"You need a 10-step routine with serums, essences, toners, masks, and treatments to have good skin.\" Social media influencers often promote elaborate routines with dozens of products.",
      },
      {
        heading: "The reality",
        body: "Most dermatologists recommend 3–4 products for a basic routine: cleanser, moisturizer, sunscreen, and optionally one treatment product. Adding too many products increases the risk of irritation, reactions, and breakouts. Your skin can only absorb so much.",
      },
      {
        heading: "The influencer factor",
        body: "Many skincare influencers are paid to promote products. Their elaborate routines are often marketing, not medicine. The best routine is one that's simple enough that you actually do it consistently.",
      },
    ],
  },
  {
    id: "myth-sun-acne",
    category: "myths",
    title: "\"Sun Clears Up Acne\"",
    emoji: "☀️",
    summary: "Tanning might hide breakouts temporarily, but it makes things worse.",
    tags: ["myth", "sun", "acne", "SPF"],
    content: [
      {
        heading: "The myth",
        body: "\"Getting a tan helps clear acne\" or \"You don't need SPF if you have acne.\"",
      },
      {
        heading: "The reality",
        body: "UV exposure might temporarily reduce redness (the tan masks it), but it actually thickens skin and increases oil production — leading to more clogged pores and breakouts later. It also causes post-inflammatory hyperpigmentation (dark marks from old pimples) to get darker and last longer.",
      },
      {
        heading: "What to do instead",
        body: "Wear SPF 30+ daily, even on cloudy days. Look for lightweight, gel-based, or mineral sunscreens that won't feel heavy. SPF is the single best anti-aging and skin-protecting product you can use.",
      },
    ],
  },

  // ---- INGREDIENTS ----
  {
    id: "ingredient-spf",
    category: "ingredients",
    title: "SPF & Sunscreen Explained",
    emoji: "☀️",
    summary: "The single most important product for skin health — here's why and how.",
    tags: ["SPF", "sunscreen", "UV", "protection"],
    content: [
      {
        heading: "What SPF does",
        body: "SPF (Sun Protection Factor) measures how well a product protects against UVB rays — the ones that cause sunburn. SPF 30 blocks about 97% of UVB rays, SPF 50 blocks about 98%. The difference between 30 and 50 is small, so SPF 30 is perfectly fine for daily use.",
      },
      {
        heading: "Chemical vs mineral",
        body: "Chemical sunscreens (with ingredients like avobenzone) absorb UV rays. Mineral sunscreens (zinc oxide, titanium dioxide) sit on top of skin and reflect rays. Both work. Mineral is often better for sensitive or acne-prone skin. Chemical tends to feel lighter.",
      },
      {
        heading: "How to apply",
        body: "Use about a nickel-sized amount for your face. Apply 15 minutes before sun exposure. Reapply every 2 hours if you're outdoors, or after swimming/sweating. Most people under-apply, which reduces the actual protection significantly.",
      },
    ],
  },
  {
    id: "ingredient-acids",
    category: "ingredients",
    title: "Acids: AHA, BHA, and PHA",
    emoji: "⚗️",
    summary: "Chemical exfoliants are powerful tools — but you need to know how to use them.",
    tags: ["AHA", "BHA", "salicylic acid", "glycolic acid", "exfoliant"],
    content: [
      {
        heading: "BHA (Salicylic Acid)",
        body: "Oil-soluble, so it can get inside pores. Best for acne, blackheads, and oily skin. Start with 0.5–2% concentration. Use once daily or every other day to start.",
      },
      {
        heading: "AHA (Glycolic, Lactic Acid)",
        body: "Water-soluble, works on the skin surface. Good for dullness, texture, and dry skin. Glycolic is stronger; lactic is gentler. Start with a low concentration and use at night — AHAs increase sun sensitivity.",
      },
      {
        heading: "Important rules",
        body: "Never combine multiple acids in the same routine. Don't mix acids with retinoids. Always use SPF when using acids. Start slow (2–3 times per week) and increase gradually. If you see redness or peeling, cut back.",
      },
    ],
  },
  {
    id: "ingredient-retinoids",
    category: "ingredients",
    title: "Retinoids: The Gold Standard",
    emoji: "💎",
    summary: "Powerful for acne and skin renewal — but start low and slow.",
    tags: ["retinol", "retinoid", "vitamin A", "treatment"],
    content: [
      {
        heading: "What they do",
        body: "Retinoids (vitamin A derivatives) speed up skin cell turnover, unclog pores, reduce acne, and improve texture. They're considered the gold standard treatment by dermatologists for both acne and anti-aging.",
      },
      {
        heading: "Starting out",
        body: "Over-the-counter retinol is the mildest form. Start with the lowest concentration you can find. Apply a pea-sized amount at night, 2–3 times per week. Expect a \"purging\" period of 4–6 weeks where breakouts may temporarily increase — this is normal.",
      },
      {
        heading: "Critical rules",
        body: "Always use SPF during the day (retinoids increase sun sensitivity). Never use with AHAs/BHAs in the same routine. Apply to completely dry skin. Moisturize on top to reduce irritation. If you're pregnant or might become pregnant, avoid retinoids entirely.",
      },
    ],
  },

  // ---- PATCH TESTING ----
  {
    id: "patch-test-guide",
    category: "patch-testing",
    title: "How to Patch Test Properly",
    emoji: "🩹",
    summary: "The 5-minute step that can save you from a bad reaction.",
    tags: ["patch test", "new product", "safety"],
    content: [
      {
        heading: "Why patch test",
        body: "Even products labeled \"gentle\" or \"for sensitive skin\" can cause reactions in some people. A patch test lets you find out before applying something to your entire face. It takes 2 minutes to do and 24–48 hours to read the results.",
      },
      {
        heading: "How to do it",
        body: "Apply a small amount of the product to your inner wrist or behind your ear. Leave it for 24 hours. Don't wash the area. After 24 hours, check for redness, itching, burning, or bumps. If nothing happened, you can try it on a small area of your face. Wait another 24 hours before full application.",
      },
      {
        heading: "Red flags during testing",
        body: "Stop immediately if you see: immediate burning or stinging, redness that develops within hours, swelling, hives, or blisters. Wash the area with cool water and a gentle cleanser. If the reaction is severe, tell a parent or guardian.",
      },
      {
        heading: "When to stop a product",
        body: "If a product causes persistent irritation after 2 weeks of use (not just initial adjustment), if breakouts get significantly worse rather than better, or if you develop an allergic reaction at any point — stop using it. Go back to your basic routine (cleanser + moisturizer + SPF) until your skin calms down.",
      },
    ],
  },
];
