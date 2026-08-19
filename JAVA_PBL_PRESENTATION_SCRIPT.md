# DayMind AI (Java Edition) — 4:30 Spoken Presentation Script

**Presenter Target Duration:** 4 minutes 30 seconds  
**OBS Hotkey Mapping:**  
- `[OBS HOTKEY: F1]` — Main Title Slide / Presentation Overview  
- `[OBS HOTKEY: F2]` — VS Code IDE (Core Java OOP Code & Architecture)  
- `[OBS HOTKEY: F3]` — Web Browser (React 18 Live Dashboard Demo on Port 5173)  

---

### [0:00 - 0:45] SECTION 1: PROBLEM STATEMENT & PROJECT OVERVIEW
`[OBS HOTKEY: F1 - Main Title Slide]`

> "Good morning evaluators and professors! Today, I am proud to present **DayMind AI — Java Spring Boot Enterprise Edition**, a production-grade Java Project Based Learning application.
>
> Human beings suffer from a well-documented cognitive bias known as the **Planning Fallacy**. When estimating task duration, humans routinely underestimate task completion times by 25% to 40%. This leads to missed deadlines, poor calendar management, and academic burnout.
>
> DayMind AI solves this problem mathematically by applying **Core Java Object-Oriented Programming (OOP)** concepts, polymorphic duration multiplier adjustments, dynamic flexibility bumping, and multi-day learning roadmap scheduling."

---

### [0:45 - 2:00] SECTION 2: CORE JAVA OOP ARCHITECTURE & DESIGN PATTERNS
`[OBS HOTKEY: F2 - Switch to VS Code Java Code]`

> "Let's inspect the Core Java backend architecture running on OpenJDK 21 LTS and Spring Boot 3.2.
>
> **1. Abstraction & Encapsulation:**  
> Here in `BaseTask.java`, we define an abstract base class with private encapsulated fields and three mandatory abstract methods: `getCategoryMultiplier()`, `getPriorityWeight()`, and `calculateFlexibilityScore()`.
>
> **2. Inheritance & Polymorphism:**  
> We extend `BaseTask` into concrete polymorphic subclasses:  
> - `AcademicTask` overrides the multiplier to **1.25x** (+25% bias correction).  
> - `WorkTask` overrides the multiplier to **1.15x**.  
> - `HealthTask` overrides the multiplier to **1.30x**.  
> - `UrgentTask` overrides priority weight to **1.00** for top priority.
>
> **3. Design Patterns:**  
> - We implement the **Factory Pattern** in `TaskFactory.java` to instantiate concrete subclass objects polymorphically.  
> - We implement the **Strategy Pattern** in `FlexibilityBumpingStrategy.java`. It evaluates flexibility scores using the formula `(1.0 - PriorityWeight) / CompletionProbability`. When an urgent task arrives, it preempts the slot and bumps higher-flexibility tasks automatically.
>
> **4. Custom Exception Handling:**  
> Our exception hierarchy is rooted in `DayMindException`, handled gracefully by `@ControllerAdvice GlobalExceptionHandler` to return clean JSON error payloads."

---

### [2:00 - 3:45] SECTION 3: LIVE REACT 18 DASHBOARD DEMO
`[OBS HOTKEY: F3 - Switch to Web Browser Port 5173]`

> "Now let's experience the live system on Port 5173, connected to our Spring Boot backend on Port 8080.
>
> **1. Polymorphic Duration Prediction:**  
> Watch as I create an Academic Task: *'Prepare Java JPA Lecture Notes'*. I set my user estimate to 60 minutes. As I select 'Academic', the Java polymorphic engine dynamically applies a 1.25x multiplier, predicting **75 minutes**!
>
> **2. Dynamic Slot Preemption & Urgent Bumping:**  
> Notice that this task is scheduled at Monday 9:00 AM. Now, I will click **'Add Urgent (Java Dynamic Replan)'** for an emergency bug fix. Watch the live calendar grid! The Urgent Task takes the 9:00 AM slot, and the Java Strategy Engine instantly bumps the Academic Task to 10:00 AM with a dynamic notification banner!
>
> **3. Multi-Day Learning Roadmap Wizard:**  
> Next, I'll open our **Learning Roadmap Wizard**. I'll enter *'Mastering Java & Spring Boot Microservices'*, set a 5-day budget, and click **'Synthesize Multi-Day Syllabus'**. The Java backend generates a structured 5-day module plan. Clicking **'Batch Schedule'** populates all 5 modules directly into our weekly calendar cells across Mon-Sun!"

---

### [3:45 - 4:30] SECTION 4: CONCLUSION & TECHNICAL RECAP
`[OBS HOTKEY: F1 - Summary Slide]`

> "In summary, **DayMind AI (Java Edition)** successfully bridges theoretical Core Java Object-Oriented principles with real-world enterprise Spring Boot development:
>
> 1. Demonstrated Core Java Abstraction, Encapsulation, Inheritance, and Polymorphism.  
> 2. Applied Factory and Strategy design patterns with dynamic flexibility algorithms.  
> 3. Delivered a modern React 18 glassmorphism interface with zero UI latency and live Spring Boot REST integration.
>
> Thank you for your time, and I am now ready for your questions!"
