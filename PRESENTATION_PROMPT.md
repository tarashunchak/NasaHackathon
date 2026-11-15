# Presentation Generation Prompt

Create a polished English-language presentation for a lunar mission-planning project. The deck must contain **exactly seven slides total**, including the title slide. Do not add an appendix or extra intro slide.

## Project and Team

- Project: **Lunar Site Check**
- Team name: **[INSERT TEAM NAME]**
- Team members: **[INSERT ALL MEMBER NAMES]**
- Selected challenge: rapidly comparing lunar landing sites and dates by visualizing local Sun illumination and Earth communication visibility, especially near the lunar south pole.

Keep the team and project details editable where shown in brackets. Do not invent team names, measurements, mission outcomes, or NASA endorsements.

## Visual Direction

Match the project's existing website: a calm scientific field-operations console, not a generic AI or startup pitch deck.

- Use **Space Grotesk** for headings and explanatory text; use **DM Mono** for coordinates, dates, measurements, and compact technical labels.
- Light palette: canvas `#edf2ee`, surface `#f9fbf8`, ink `#1b3026`, muted text `#62736a`, rules `#cbd6ce`, forest green `#245a42`, deep green `#183f2d`, terracotta accent `#c85a36`.
- Dark palette may use charcoal/forest tones from the app: `#202a22`, `#2a362c`, `#e7eee7`, with muted green and terracotta accents.
- Use a very faint fixed grid texture if supported. Keep diagrams and screenshots high contrast and uncluttered.
- Avoid purple, electric blue, neon, glossy gradients, generic space stock art, decorative orbs, and crowded cards.
- Use large readable type, strong contrast, generous whitespace, and no more than about 30 words of body copy on any slide. Use brief labels instead of paragraphs.
- Use one consistent grid, margins, footer/page number system, and restrained transitions.

## Visual Assets

Use actual screenshots from the running Lunar Site Check app for the product slides. Do not fabricate interface screenshots. Prefer captures that show:

1. Two side-by-side candidate scenarios, the 2D horizon chart, and comparison results.
2. The timeline, mission constraints, and operational windows.
3. The 3D Moon view, if WebGL is available in the capture environment.

If screenshots are not provided to the slide-generation tool, reserve a clearly labeled image placeholder and state which app screen should be captured. Add a simple vector diagram for the workflow only when a real app screenshot is not the right visual.

## Slide-by-Slide Content

### 1. Title

- Title: **Lunar Site Check**
- Subtitle: **Comparing sunlight and Earth visibility at candidate landing sites**
- Team name and member names: use the editable placeholders above.
- Visual: a real app screenshot or a clean crop of the 2D horizon visualization with the protractor-and-rocket logo. Keep the title legible and avoid a separate title-only slide.

### 2. The Planning Challenge

Explain the decision problem in one short sentence: small changes in lunar site or landing date can change solar power windows and direct-to-Earth communication opportunities.

- Highlight the lunar south pole's low Sun angles, crater-rim shadows, and Earth near the horizon.
- Visual: a simple annotated horizon diagram showing Sun, Earth, local horizon, and terrain; label it as a conceptual diagram, not a to-scale view.

### 3. The Tool and User Flow

Show the actual workflow in three steps:

1. Choose two sites or enter lunar coordinates.
2. Set the UTC start date and move through the 30-day timeline.
3. Compare sunlight, Earth visibility, and mission thresholds.

- Mention the light/dark theme and UA/EN interface only as small supporting details.
- Visual: screenshot of the scenario forms and fixed playback control, with concise numbered callouts.

### 4. Data Behind the View

Explain what makes the tool possible without overstating data coverage:

- `astronomy-engine` computes Sun/Moon geometry; the app transforms vectors into a lunar body-fixed frame and calculates topocentric azimuth/elevation, parallax, and the Sun's apparent disk radius.
- The JPL Horizons API was used for spot checks at two locations across three UTC dates; observed Sun/Earth azimuth/elevation differences were no greater than about **0.005 degrees** in those checks. This is a limited spot check, not a full certification.
- NASA LOLA altimetry can supply local horizon masks. The app supports those masks and custom JSON profiles, but the submitted repository currently ships no precomputed LOLA masks; without a mask it explicitly uses a flat 0-degree horizon.
- Cite sources on-slide in small readable type: NASA NSSDC landing coordinates, JPL Horizons, NASA/GSFC LOLA or PDS data, and the `astronomy-engine` library as applicable. Distinguish data currently bundled from data supported by the workflow.

Visual: a compact pipeline diagram: open ephemeris + lunar coordinates + optional LOLA horizon profile -> local sky angles -> operational windows.

### 5. Compare Scenarios

Present one real comparison from the app. Use actual values visible in the screenshot; do not make up power estimates.

- Show side-by-side Scenario A and Scenario B.
- Point out Sun-up percentage, Earth-up percentage, longest outages, and peak Sun elevation.
- Explain that the comparison is intended for rapid screening, not mission certification.

Visual: screenshot of the comparison table and horizon charts. Use short annotations, not a recreated fake UI.

### 6. Time, Thresholds, and Operations

Show how the planner supports a date change or a revised mission constraint:

- A draggable 30-day timeline shows changing Sun/Earth elevation.
- A mission profile lets users set minimum Sun elevation, minimum usable sunlight hours, and maximum Earth outage.
- Operational-window lists show usable sunlight, Earth contact, and simultaneous windows, estimated from hourly samples.
- State that the power screen is a threshold-based screening metric, not a detailed solar-array or thermal model; window boundaries have up to one-hour sampling resolution.

Visual: screenshot of the playback dock, mission-profile controls, and operational-window output.

### 7. Value, Limits, and Next Step

Close with the practical value: quickly compare alternate sites and dates when mission schedules or constraints change.

- Value: one interface for scenario comparison, horizon context, communication windows, and export/share.
- Current limit: no bundled LOLA horizon masks and no mission-grade power-system model.
- Next validation step: add sourced LOLA masks for priority candidate sites and expand repeatable Horizons checks across more dates and locations.
- End with a clear demo invitation or project URL: **[INSERT DEMO URL]**.

Visual: a final real app screenshot with three compact labels: **Compare**, **Inspect**, **Adapt**.

## Output Requirements

- Return exactly seven slides, numbered 1–7.
- Write all slide content in English.
- Include concise speaker notes with one or two sentences per slide; do not put long prose on the slides.
- Make every chart label, legend, and source citation readable at presentation size.
- Preserve the distinction between verified calculations, optional user-provided terrain profiles, flat-horizon fallback, and future work.
