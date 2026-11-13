# GateBench-Mobile: Contract-Aware Gate (CAG) artifact

Replication package for "Contract-Aware Validation of AI-Generated Mobile UI Tests:
An AI-CLI Architecture, Field Study, and Mutation Evaluation" (IEEE TSE submission).

## Contents
- `cag/cag.js` - the Contract-Aware Gate (rules R0-R6), JavaScript and TypeScript.
- `subject/` - S1 GymBench: JavaScript replica of the field framework (app source, 7 screen objects, 6 specs, 19 unit tests).
- `replay/` - S1 plus the transcribed field specification `test/specs/signin.test.js` (Fig. 3b).
- `experiment/mutate.js` - mutation harness (operators M1-M7, B1-B3, C1-C3, E1-E4) and gate comparison.
- `s2-config/` - gate configuration for S2 (`gate.config.initial.json` = first run, `gate.config.json` = with declared identifiers).
- `results/` - raw per-mutant results (`mutants.csv`, `mutants.json`), per-operator `summary.json`, run times, replay and initial-run findings.

## Requirements
Node.js 22, npm.

## Reproduce
```bash
npm install                       # acorn-walk, minimatch, @typescript-eslint/typescript-estree, typescript
node cag/cag.js subject           # 0 errors on the unmodified S1
node cag/cag.js replay            # 5 errors, 8 warnings on the field specification
node experiment/mutate.js subject results/js js test/specs test/screenobjects

# S2: public WebdriverIO projects at the evaluated commits
git clone https://github.com/webdriverio/appium-boilerplate.git ext-boilerplate
git -C ext-boilerplate checkout a451249
git clone https://github.com/webdriverio/native-demo-app.git ext-demoapp
git -C ext-demoapp checkout cbb9346
(cd ext-boilerplate && npm install --ignore-scripts)
cp s2-config/gate.config.json ext-boilerplate/
node cag/cag.js ext-boilerplate   # 0 errors (2 warnings for existing TODO comments)
node experiment/mutate.js ext-boilerplate results/ts ts 'tests/specs:^app\.' tests/screenobjects
```
All gates are deterministic; results should match `results/` exactly for the same commits and tool versions
(typescript and @typescript-eslint versions are pinned in package-lock.json).
