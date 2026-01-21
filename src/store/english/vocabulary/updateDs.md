
we had this structure for all difficulty levels from A1 to C2: [A1, A2, B1, B2, C1, C2]: 
```
"quiz": {
    "correct_answer": "...",
    "distractors": [ // what we need are here
        "...",
        "...",
        "..."
    ]
}
```

But now we have updated A1, A2, B1 (only 3 of them) to this structure

```
"quiz": {
    "correct_answer": "...",
    "distractors": {
        "en": [ // current existing distractors
            "...",
            "...",
            "..."
        ],
        "uz": [ // their translations in uzbek (BE CAREFUL WHEN TRANSLATING)
            "...",
            "...",
            "..."
        ],
        "ru": [ // their translations in russian (BE CAREFUL WHEN TRANSLATING)
            "...",
            "...",
            "..."
        ]
    }
}
```
