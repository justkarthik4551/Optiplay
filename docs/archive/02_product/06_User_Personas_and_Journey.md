# 06 — User Personas & Journey Map

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 06 of 11 · User Personas & Journey Map
> **Cross-references:** [01 PRD](./01_PRD.md) · [08 Wireframes](./08_Wireframes_and_Screen_Flow.md) · [05 Design System](./05_UI_UX_Design_System.md)

---

## 1. User Personas

### Persona A: "The MBA Student" — Priya
| Attribute | Detail |
|-----------|--------|
| **Age** | 24 |
| **Role** | First-year MBA student (IS/IT specialization) |
| **Context** | Has a course on Operations Research / Decision Sciences. Finds textbook formulations dry and abstract. Wants to *feel* the problem before solving it mathematically. |
| **Tech Comfort** | High. Uses web apps daily. Expects modern, polished UI. |
| **Goal** | Understand why greedy heuristics fail and why DP gives optimal results — through play, not proofs. |
| **Frustration** | Platforms that look like they were built in 2005. Clunky academic tools with no visual feedback. |

### Persona B: "The Professor" — Dr. Mehra
| Attribute | Detail |
|-----------|--------|
| **Age** | 48 |
| **Role** | Faculty teaching Operations Management at a B-school |
| **Context** | Uses the "Pack That Bag!" paper-based game (the original PDF by Prof. Tallys Yunes) in class. Wants a digital version to use during lectures and assign as interactive homework. |
| **Tech Comfort** | Moderate. Comfortable with browsers but won't troubleshoot technical issues. |
| **Goal** | A zero-setup tool he can project in class. Students should be able to open a URL and start playing immediately. |
| **Frustration** | Tools that require logins, installations, or complex setup. |

### Persona C: "The Curious Professional" — Arjun
| Attribute | Detail |
|-----------|--------|
| **Age** | 30 |
| **Role** | Analytics consultant exploring optimization concepts for personal growth |
| **Context** | Heard about the knapsack problem in a podcast. Wants a quick, fun way to explore it without reading a textbook. |
| **Tech Comfort** | Very high. Will judge the product harshly on UX. |
| **Goal** | Play, learn, and move on in under 10 minutes. Wants the "aha moment" fast. |
| **Frustration** | Overly academic framing. Wants something that feels like a game, not a lecture. |

---

## 2. User Journey Map: "Pack That Bag!"

### Stage 1: Discovery & Landing
| Dimension | Detail |
|-----------|--------|
| **Screen** | Hub / Landing Page (`/`) |
| **Action** | User arrives at the platform URL. Sees a dark, premium landing page with a glowing card for "Pack That Bag!" |
| **Thought** | *"This looks polished. Let me try it."* |
| **Emotion** | Curiosity, slight excitement |
| **Design Ref** | [05 Design System](./05_UI_UX_Design_System.md) §2 (Color Palette), [08 Wireframes](./08_Wireframes_and_Screen_Flow.md) §S1 |

### Stage 2: Game Selection
| Dimension | Detail |
|-----------|--------|
| **Screen** | Hub → Game Card Click |
| **Action** | User clicks on the "Pack That Bag!" card. |
| **Thought** | *"What is this game about?"* |
| **Emotion** | Engagement |
| **Design Ref** | Card tagline: *"Can you pack the most valuable bag? A knapsack optimization challenge."* Smooth fade transition to Config screen. |

### Stage 3: Game Configuration
| Dimension | Detail |
|-----------|--------|
| **Screen** | Game Config (`/pack-that-bag/config`) |
| **Action** | User chooses between: (a) **Classic Mode** — the original 12 items, 26 lbs, (b) **Random Mode** — fresh random problem, (c) **Custom Mode** — user-defined items. |
| **Thought** | *"Let me try the classic one first."* |
| **Emotion** | Anticipation |
| **Design Ref** | Three mode cards. Classic is pre-selected (default). [08 Wireframes](./08_Wireframes_and_Screen_Flow.md) §S2 |

### Stage 4: Playing the Game
| Dimension | Detail |
|-----------|--------|
| **Screen** | Main Game (`/pack-that-bag/play`) |
| **Action** | User sees all items laid out as visual blocks (width proportional to weight). A Bag zone shows a capacity bar. User drags items into the bag. |
| **Thought** | *"Okay, I'll pick the most expensive ones first…"* (greedy instinct) |
| **Emotion** | Focus, playfulness |
| **Design Ref** | [05 Design System](./05_UI_UX_Design_System.md) §5 (Micro-Animations), §6 (Item Proportionality). [08 Wireframes](./08_Wireframes_and_Screen_Flow.md) §S3 |

### Stage 5: Getting Stuck → Requesting a Hint
| Dimension | Detail |
|-----------|--------|
| **Screen** | Main Game — "💡 Hint" Button |
| **Action** | User has packed some items but isn't sure if it's optimal. Clicks "💡 Hint." |
| **Thought** | *"I think I'm close, but can I do better?"* |
| **Emotion** | Mild frustration → curiosity |
| **Design Ref** | Hint appears as a glassmorphic toast. Example: *"Swap the Toaster ($110, 3 lbs) for the Projector ($190, 4 lbs). +$80."* Auto-dismisses after 5 seconds. |

### Stage 6: Victory!
| Dimension | Detail |
|-----------|--------|
| **Screen** | Victory Modal (overlay on Main Game) |
| **Action** | User's bag value matches the DP-optimal value ($1,166 in Classic Mode). Celebration modal fires with confetti. |
| **Thought** | *"Yes! I nailed it."* |
| **Emotion** | Satisfaction, accomplishment |
| **Design Ref** | Confetti burst (3s). Modal shows: "🎉 Optimal Solution Found! $1,166 in 26 lbs." Buttons: "Play Again" + "How does this work?" |

### Stage 7: Reflection (Post-Game)
| Dimension | Detail |
|-----------|--------|
| **Screen** | Educational Summary (expandable section in Victory Modal) |
| **Action** | User reads a brief explanation of the 0/1 Knapsack and why greedy heuristics can fail. |
| **Thought** | *"Oh, so picking the best value-to-weight ratio items doesn't always work because of the integer constraint. Interesting."* |
| **Emotion** | Insight, learning |
| **Design Ref** | Clean typography. Under 200 words. Links to "Play Again" (Random Mode) or "← Back to Hub." |

---

## 3. Emotional Arc

```
Curiosity → Engagement → Anticipation → Focus → Frustration → Insight → Satisfaction
   |            |             |            |          |            |           |
 Landing    Game Card      Config       Playing   Hint Used    Victory    Reflection
  (S1)       (S1→S2)        (S2)        (S3)       (S3)        (S4)        (S5)
```

This arc mirrors established game design principles: the platform intentionally allows moments of productive struggle (Stage 5) before the payoff (Stage 6), creating an educational scaffolding loop.
