# GENERATE JSON file

- **TOPIC**: "Present and past simple passive (Be + past participle) - Basic passive voice"
- **LEVEL**: A2
- **EXERCISE_COUNT**: 25

The output must be **VALID JSON ONLY** - no explanations, no markdown, no code fences.

---

## Exercise Types & Distribution

For any EXERCISE_COUNT, distribute as follows:
- **40% multiple_choice** (mc1, mc2, ...)
- **40% short_answer** (sa1, sa2, ...)  
- **20% multiple_gap_filling** (mgf1, mgf2, ...)

**Calculation**: 
- mc = floor(0.4 × EXERCISE_COUNT)
- sa = floor(0.4 × EXERCISE_COUNT)
- mgf = EXERCISE_COUNT - mc - sa

---

## Strict JSON Schema

```json
{
  "id": "<LEVEL>_<WHOLE_TOPIC_WITH_UPPERCASE_WITH_UNDERSCORES>",
  "title": "<Human-readable whole topic title>",
  "items": [
    // MULTIPLE CHOICE ITEMS
    {
      "id": "mc1",
      "type": "multiple_choice", 
      "question": {
        "en": "Choose the correct sentence.", // question of the exercise! Clear and concise.
        "ru": "Выберите правильное предложение.", // exact translation of the en-question in russian
        "uz": "To'g'ri gapni tanlang." // exact translation of the en-question in uzbek
      },
      "options": [
        { "answer": "She have a cat." },
        { "answer": "She has a cat.", "correct": true },
        { "answer": "She are a cat." }
      ],
      "explanation": {
        "en": "Brief explanation of the grammar rule and why this answer is correct",
        "ru": "Краткое объяснение грамматического правила и почему этот ответ правильный",
        "uz": "Grammatika qoidasining qisqa izohи va bu javob nima uchun to'g'ri ekanligi"
      }
    },
    
    // SHORT ANSWER ITEMS (WITH ONLY ONE GAP TO ANSWER) (EX: ... ... ... ___ ... ... ...)
    {
      "id": "sa1", 
      "type": "short_answer",
      "prompt": {
        // NOTE: ONLY ONE GAP: (___)
        "en": "Complete the sentence: She ___ to school every day.", // <en-instruction>: <ENGLISH-only-text> 
        "ru": "Дополните предложение: She ___ to school every day.", // <ru-instruction>: <ENGLISH-only-text>
        "uz": "Gapni to'ldiring: She ___ to school every day." // <uz-instruction>: <ENGLISH-only-text>
      },
      "options": [
        { "answer": "goes/possible_synonim/another_possible_correct_answer_optional", "correct": true }
      ],
      "explanation": {
        "en": "Brief explanation of the grammar rule being tested",
        "ru": "Краткое объяснение проверяемого грамматического правила",
        "uz": "Sinovdan o'tilayotgan grammatika qoidasining qisqa izohi"
      }
    },
    
    // MULTIPLE GAP FILLING ITEMS
    {
      "id": "mgf1",
      "type": "multiple_gap_filling", 
      "prompt": {
        "en": "Fill in the blanks with the correct words",
        "ru": "Заполните пропуски правильными словами", 
        "uz": "Bo'shliqlarni to'g'ri so'zlar bilan to'ldiring"
      },
      "text": "English text with ___1___ multiple ___2___ gaps numbered ___3___ sequentially with minimum 100 words and 10-15 gaps testing the target grammar topic systematically...",
      "answers": [
        { "blank": "1", "answer": "answer1" },
        { "blank": "2", "answer": "answer2" }, 
        { "blank": "3", "answer": "answer3" }
      ],
      "explanation": {
        "en": "Brief explanation of the grammar rules demonstrated in this exercise",
        "ru": "Краткое объяснение грамматических правил, показанных в этом упражнении",
        "uz": "Ushbu mashqda ko'rsatilgan grammatika qoidalarining qisqa izohi"
      }
    }
  ]
}
```

## CRITICAL ENGLISH GRAMMAR AUTHORITY - ABSOLUTE REQUIREMENTS

### Universal Grammar Standards
- **MANDATORY**: Follow prescriptive English grammar as taught in reputable educational institutions
- **REFERENCE AUTHORITY**: Use standard grammar rules from Cambridge, Oxford, Longman, or equivalent authoritative sources
- **EDUCATIONAL CONTEXT**: This is for formal language learning - teach correct, standard usage
- **NO EXCEPTIONS**: Grammar correctness overrides all other considerations

### Universal Grammar Verification Process
**BEFORE MARKING ANY ANSWER AS CORRECT:**
1. **Rule Check**: Does this follow the standard grammar rule for this topic?
2. **Authority Check**: Would this be accepted in formal written English?
3. **Educational Check**: Is this what should be taught to language learners?
4. **Context Check**: Does this fit the grammatical context perfectly?

**ANSWER ONLY "YES" IF ALL FOUR CHECKS PASS**

### Answer Correctness Standards - UNIVERSAL
- **ONE CORRECT ANSWER ONLY**: Exactly one option must be grammatically perfect according to standard English
- **CLEAR WRONG ANSWERS**: All incorrect options must contain obvious grammatical errors
- **NO ALTERNATIVE CORRECTNESS**: Never create multiple grammatically correct options
- **SYSTEMATIC ERRORS**: Incorrect options should demonstrate common learner mistakes for that grammar topic

---

## FORMATTING AND TECHNICAL RULES

### Localization
- **LOCALIZE**: `question`, `prompt` objects with `en`, `ru`, `uz` keys
- **DO NOT LOCALIZE**: `options[].answer`, `answers[].answer`, `text` field
- Multiple gap filling `text` is **English only**

### Answer Variants
- Use slash notation ONLY for genuinely acceptable alternatives: `"don't/do not"`, `"colour/color"`
- Allowed for `short_answer` and `multiple_gap_filling` answers
- **CAUTION**: Do NOT use variants for different grammar structures
- Case-insensitive matching, punctuation normalized automatically

### Multiple Choice Formatting
- Questions must be judgment-style: "Choose the correct sentence.", "Which sentence is grammatically correct?"
- Do NOT use fill-in-the-blank formats in MC questions
- MC options must be complete sentences or phrases
- **VERIFY**: Each complete option must be either clearly correct or clearly incorrect

### Short Answer Formatting  
- Provide clear context with unambiguous blanks
- Example: "Complete with the correct verb form: She ___ (go) to work every day."
- Ensure only ONE grammatically correct answer fits the context
- Include base forms in parentheses for verb exercises when needed

### Multiple Gap Filling Requirements
- Text must be **minimum 100 words**
- Use **10-15 gaps** per item
- Number gaps sequentially: `___1___`, `___2___`, etc.
- **CONTEXT CLARITY**: Surrounding text must make the correct answer unambiguous
- **SYSTEMATIC TESTING**: Cover the target grammar topic thoroughly throughout the passage
- **COHERENT CONTENT**: Text should be meaningful and engaging, not just grammar practice sentences

### Explanation Requirements
- **MANDATORY**: Include explanations in all three languages (en, ru, uz)
- **NEVER** use null values
- **Content Structure**: 
  - State the grammar rule being tested
  - Explain why the correct answer is right
  - Optionally mention why common wrong answers are incorrect
- **Language Level**: Use simple, clear language appropriate for the specified CEFR level
- **Length**: 1-2 sentences maximum per language

---

## QUALITY ASSURANCE CHECKLIST - UNIVERSAL

**BEFORE FINALIZING ANY ITEM, VERIFY:**

✓ **Grammar Authority**: Is the correct answer perfect according to authoritative English grammar rules?
✓ **Error Clarity**: Do all incorrect options contain clear, identifiable grammar mistakes?
✓ **Uniqueness**: Is there exactly ONE grammatically perfect option?
✓ **Level Appropriateness**: Is vocabulary and complexity suitable for the specified CEFR level?
✓ **Context Clarity**: Is the context unambiguous enough to determine the correct answer?
✓ **Topic Focus**: Does the item test the specified grammar topic effectively?
✓ **Educational Value**: Will this help learners understand the grammar rule?

## CEFR Level Guidelines
- **A1**: Present simple, basic vocabulary, simple sentences, common irregular verbs
- **A2**: Past simple, present continuous, comparatives, basic modals
- **B1**: Present perfect, conditionals, passive voice, complex sentences
- **B2**: Advanced tenses, subjunctive, complex conditionals, formal/informal register
- **C1**: Nuanced grammar, advanced structures, sophisticated vocabulary
- **C2**: Native-level complexity, subtle distinctions, advanced academic language

## VERY CRITICAL - FINAL REMINDERS:
- **GRAMMAR AUTHORITY**: Standard prescriptive English grammar rules are the ultimate authority
- **EDUCATIONAL INTEGRITY**: Teach correct, formal usage as found in authoritative grammar resources
- **ZERO TOLERANCE FOR ERRORS**: If you're unsure about a grammar rule, default to the most conservative, widely-accepted standard
- **SINGLE CORRECTNESS**: Only one answer can be grammatically perfect - others must have clear, demonstrable errors
- **SYSTEMATIC VERIFICATION**: Use the 4-step verification process for every correct answer
- **TOPIC FOCUS**: Ensure every item clearly tests the specified grammar topic without ambiguity