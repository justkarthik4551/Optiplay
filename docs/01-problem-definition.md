# Problem Definition

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee

---

## 1. What is Operations Research?

Operations Research (OR) is the discipline of applying analytical methods to improve decision-making. At its core, it asks: *given limited resources, what is the best possible choice?*

OR problems appear everywhere in management:

- **Supply chain:** Which products to stock in a warehouse of limited space and budget?
- **Logistics:** What is the shortest delivery route that visits all customers?
- **Finance:** How to allocate a portfolio to maximize return under risk constraints?
- **Production:** How to schedule jobs on machines to minimize idle time?

Despite its practical ubiquity, OR is almost universally considered one of the hardest subjects in MBA programmes — not because the mathematics is beyond reach, but because the **gap between abstract formulation and lived intuition** is enormous.

---

## 2. The Education Gap

### 2.1 How OR is Typically Taught

The standard pedagogical approach:

1. Present the formal mathematical model (objective function + constraints)
2. Explain the algorithm (e.g., Dynamic Programming recurrence relation)
3. Solve a textbook example by hand
4. Examine students on similar examples

This approach is effective at producing students who can **execute** a known algorithm on a known problem type. It is far less effective at producing students who can **recognize** optimization problems in real business situations, **formulate** them correctly, or **reason intuitively** about why one approach outperforms another.

### 2.2 The Root Cause: Abstraction Without Experience

When a student reads:

```
max  Σ vᵢxᵢ
s.t. Σ wᵢxᵢ ≤ W
     xᵢ ∈ {0, 1}
```

...they see symbols on a page. They do not feel the *frustration* of a near-full bag, the *temptation* to add one more item that just barely won't fit, or the *insight* that comes when you realize swapping one heavy item for two lighter, higher-value items is your best move.

That experiential gap is what kills long-term retention.

### 2.3 Evidence from Learning Science

Research in educational psychology consistently shows:

- **Active learning** produces 1.5× better retention than passive lecture (Freeman et al., 2014)
- **Immediate feedback** dramatically accelerates skill acquisition (Hattie & Timperley, 2007)
- **Concrete examples before abstract principles** lead to better transfer of learning (Schwartz & Bransford, 1998)

Traditional OR instruction violates all three of these principles. It is:
- **Passive** — students watch the professor solve problems
- **Delayed feedback** — errors surface only on graded exams
- **Abstract-first** — formulas precede intuition

---

## 3. Why Gamification?

### 3.1 Definition

Gamification in education is the application of game design elements (goals, feedback loops, progression, challenge) to learning contexts to increase engagement and retention.

It is distinct from "making learning fun" for its own sake. The research case rests on cognitive and motivational mechanisms:

- **Goal clarity:** Games make the objective unambiguous. In OptiPlay, the goal is explicit: maximize ₹ value without exceeding capacity.
- **Immediate feedback:** Every drag-and-drop triggers an instant state update. Students see consequences immediately.
- **Safe failure:** Mistakes in a game carry no stakes. Students are incentivized to experiment rather than memorize safe answers.
- **Scaffolded difficulty:** Hints provide just-in-time support, preventing frustration without eliminating challenge.

### 3.2 Alignment with OR Problem Structure

OR problems are uniquely well-suited to gamification because their structure already resembles game mechanics:

| Game Element | OR Equivalent |
|-------------|---------------|
| Win condition | Objective function value |
| Rules | Constraints |
| Resources | Items / variables |
| Score | Optimal value |
| Difficulty level | Problem size / number of constraints |

This structural alignment means gamification here is not cosmetic. The game *is* the problem.

---

## 4. The Hypothesis

> **H:** Students who interact with an OR problem through a gamified drag-and-drop interface, with an AI hint engine and access to the optimal solution, will develop stronger intuitive understanding of constraint satisfaction and optimization tradeoffs than students who study the same problem through textbook instruction alone.

Specifically, we predict:

1. Students will be able to identify *why* certain item combinations are infeasible (they feel the constraint, not just read it)
2. Students will recognize the failure of greedy strategies through direct experience (trying "most valuable first" and watching it fail)
3. Students exposed to the hint engine will develop vocabulary for describing improvements (add, swap, multi-swap) that maps directly to neighborhood search in combinatorial optimization

---

## 5. Scope of This Project

This project addresses the **knapsack family** of problems because it is:

1. **Foundational:** The knapsack is a standard benchmark problem covered in every OR and algorithms curriculum
2. **Visual:** The bag/truck metaphor maps immediately to the mathematical structure
3. **Scalable in difficulty:** Adding a second constraint (volume) transforms a familiar problem into a harder one — a natural pedagogical progression
4. **Practically relevant:** Resource allocation under capacity constraints appears in inventory management, capital budgeting, and project selection

The platform is designed as an **extensible shell** — future games can be added by implementing a new solver and context while reusing all shared infrastructure.
