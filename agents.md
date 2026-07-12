# Kilo Code System Instructions: Workspace Rules integration

This guide outlines how to create a permanent "System Memory" inside your workspace so that Kilo Code automatically understands your database schemas, file structures, and game rules without manual prompt reminders.

---

## 1. How It Works (The Auto-Discovery Engine)

Kilo Code looks for specific filenames at your project's root directory. When found, it automatically parses their contents and injects them directly into the background system prompt alongside your active task.

The primary supported filenames are:
*   **`AGENTS.md`** (Primary Kilo Code instruction file)
*   **`CONTEXT.md`** (Project-wide context file)

---

## 2. Step-by-Step Implementation

1. Open your project in your text editor (VS Code or JetBrains).
2. Create a new file in the **very root folder** of your project (next to `package.json`) named exactly:
   **`AGENTS.md`**
3. Paste the entire **Workspace Context Template** below into that file and save it.

---

## 3. Workspace Context Template (Paste into AGENTS.md)

Copy and paste this exact template into your newly created `AGENTS.md` file:

```markdown
# Bruxo's Crusade: Master Reference & System Rules

This file serves as the official, permanent system prompt, context guide, and database schema directory for Bruxo's Crusade.

## 1. Core Architectural Guidelines
*   **Target Audience:** Grade 5 students in Ontario. 
*   **Visual Theme:** Modern Pixel / Glassmorphic Gothic Fantasy (Castlevania & Dark Souls inspired).
*   **Privacy & Anonymity:** Student grades are completely de-identified. standings on the Leaderboard (Scholar and Comeback) are obfuscated using "Points" and vague "In-Game Performance" descriptions to prevent classmates from reverse-calculating grades.
*   **Strict Pacing:** Progression is strictly balanced around a 9-month school year (252 active days). Reaching Level 50 represents "Beating the Game" in early June (requiring 49,000 total XP).
*   **Reward Economy:** Absolute maximum guaranteed out-of-pocket budget is $150 per student in STC (Scarborough Town Centre) Gift Cards. The lowest card value permitted is $10.

## 2. Global Database & Storage Schemas

### Table: profiles (Student Statistics)
*   **Columns:**
    *   `id` (UUID, Primary Key)
    *   `hero_name` (TEXT)
    *   `hero_class` (TEXT)
    *   `xp` (INT)
    *   `gold` (INT)
    *   `login_streak` (INT) - *Note: Re-purposed under the hood to track cumulative unique login days, never resets!*
    *   `last_login_date` (DATE)
    *   `void_grasp_count` (INT) - *Tracks total Void Grasps cast (cap of 10)*
    *   `spell_oath_count` (INT) - *Tracks total Oath spells cast (cap of 10)*
    *   `spell_ember_count` (INT) - *Tracks total Ember spells cast (cap of 10)*

### Table: submissions (Student Uploads & Quizzes)
*   **Columns:**
    *   `id` (BIGINT, Primary Key)
    *   `quest_id` (INT)
    *   `student_id` (UUID)
    *   `student_name` (TEXT)
    *   `status` (TEXT) - ('pending', 'approved', 'rejected')
    *   `type` (TEXT) - ('upload', 'journal', 'quiz', 'blitz', 'gauntlet', 'scout-arts', 'scout-sports')
    *   `proof_content` (TEXT) - *Holds the permanent Supabase Storage URL or raw journal text.*

### Table: pending_prizes (Raffle Wins & Level Goals)
*   **Columns:**
    *   `id` (UUID, Primary Key)
    *   `student_id` (UUID)
    *   `student_name` (TEXT)
    *   `prize` (TEXT) - *e.g., "$10 STC Gift Card"*
    *   `reason` (TEXT)
    *   `status` (TEXT) - ('pending', 'delivered')

### Table: prize_claims (Achievement Claims)
*   **Columns:**
    *   `id` (UUID, Primary Key)
    *   `student_id` (UUID)
    *   `achievement_id` (TEXT)
    *   `status` (TEXT) - ('pending', 'fulfilled')

### Table: global_effects (PvP Snares & Locks)
*   **Columns:**
    *   `id` (UUID, Primary Key)
    *   `type` (TEXT) - ('void_grasp', 'mimic_hex')
    *   `target_id` (UUID)
    *   `creator_id` (UUID)

### Table: game_settings (Global Variables)
*   **Columns:**
    *   `key` (TEXT, Primary Key)
    *   `value` (TEXT) - *Stores global variables like 'current_raffle_prize'*

## 3. Directory File Mapping
All specialized static question banks live in their own dedicated files:
*   `src/data/mathBank.js` (500 Math Speed questions)
*   `src/data/historyBank.js` (200 History speed questions)
*   `src/data/scienceBank.js` (200 Multiple-Choice Science questions)
*   `src/data/incantationBank.js` (100 Typing phrases)
*   `src/data/multistepBank.js` (100 Multi-step Hydra questions)
*   `src/data/gauntletBank.js` (100 Sudden-death Gauntlet questions)