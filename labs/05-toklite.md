# Lab 05 - The toklite reveal: what did all this cost? (15 min, wrap)

You've been running the whole workshop through **toklite** without thinking about
it (`npm run ai` = `toklite run -- aider`). Now see what it did.

## See your savings
```bash
npm run tok:stats        # provider-verified totals for your session
```
You'll see input tokens *without* toklite vs *actually billed*, the percentage
saved, and the dollar figure - all counted by the provider, not estimated.

Prove it independently (free, no inference runs):
```bash
npm run tok:verify       # re-counts your captured requests against the provider
```

> **On the Groq path (Path B in TOKLITE.md):** the token cutting is just as real,
> but Groq/OpenAI has no free count endpoint, so `tok:stats` shows an *estimate*
> (via `js-tiktoken`) rather than a provider-verified number. The exact,
> free-to-prove figures are the Anthropic path. Say which one you ran.

## Why it saved so much *here*
An agent editing tests is almost pure repetition: aider re-reads the same spec,
the same screen object, the same CONVENTIONS.md on turn after turn. toklite's
layers target exactly that:
- **dedupe** - the same file re-sent verbatim later in the conversation is removed
  (20-50% in agent loops).
- **diffReads** - a file you edited and it re-reads is sent as a diff, not whole.
- **compact** - old turns are trimmed to head + tail with an elision marker.
None of them can ever make a payload larger - each measures its own delta and
backs out if it comes up negative.

## Room total
Call out your `saved` percentage. Your facilitator will tally the room - dozens
of agent sessions, one number. That's the tokens (and money) toklite kept off the
bill for work you'd have done anyway.

## Take it home
toklite is open source and drops in front of any AI coding tool - Claude Code,
Cursor, Kiro, your own agent - with zero code changes:
```bash
npm install -g toklite
toklite run -- <your-tool>
toklite stats
```
- npm: https://www.npmjs.com/package/toklite
- GitHub: https://github.com/SrkanpuSrikanthSrinivas/toklite (a star helps)

It pays off on metered API traffic - your own key in CI, SDK apps, and agents -
where a 30-50% cut in input tokens is real money.
