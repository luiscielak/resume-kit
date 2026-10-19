# Sync the resume into the HTML layout

Copy `resume/base.html` into the application folder and update only the visible text so it matches the tailored markdown. Keep the layout.

## What to attach

- `resume/base.html`
- the tailored file, for example `applications/business-systems-analyst/resume.md`

## Rules

- Copy `resume/base.html` to the same folder as the tailored markdown, named `resume.html`.
- Replace the text content section by section to match the tailored markdown.
- Keep the structure, class names, and CSS from `base.html`.
- Do not change the styles or the layout.
- Keep it to one page.

## Output

Write `applications/<job>/resume.html`. Do not change `resume/base.html`.
