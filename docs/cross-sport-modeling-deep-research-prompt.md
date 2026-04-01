# Cross-sport modeling (Soccer, NFL, F1, NBA): Deep-research prompt + data blueprint

## Deep-research prompt (copy/paste)

**Title:** Cross-sport predictive modeling: generalizing from one sport to soccer, American football, Formula 1, and the NBA

**Research objective:** Produce a citation-backed report on how to reuse or adapt modeling approaches (features, labels, evaluation, leakage controls) across association football (soccer), American football (NFL), Formula 1, and NBA basketball, including what data to collect, minimum viable schemas, and which open vs commercial sources are standard in practice.

**Scope (include):**
- Prediction tasks per sport (e.g., match/race outcome, margin, player performance, season standings; avoid prescriptive gambling execution).
- Granularity: event-level vs player-level vs team-level; temporal structure (seasons, playoffs, sessions).
- Data categories: static (venues, rules era), transactional (plays/events/laps/shots), tracking if applicable, officiating, injuries/availability, weather where relevant.
- Methodology transfer: what transfers (e.g., train/validation by time, hierarchical models) vs what does not (continuous clock vs discrete possessions; team vs individual emphasis).
- Evaluation: appropriate metrics per task; calibration; handling class imbalance and rare events.
- Limitations: data rights, sampling bias (broadcast vs full tracking), rule changes, COVID-era anomalies, small sample sizes (F1 grids).

**Out of scope:** Real-time betting execution, circumventing paywalls, or scraping in ways that violate terms of service.

**Deliverables:** Executive summary; per-sport sections (soccer, NFL, F1, NBA) with required fields and recommended public/commercial sources; cross-sport synthesis; limitations; bibliography with 10+ independent sources triangulating major claims.

**Assumptions unless contradicted by sources:** Technical audience; interest in reproducible pipelines and licensed or open data where possible.

---

## What data you need (practical blueprint)

### Per-sport data matrix

| Sport | Core labels (examples) | Core features (examples) | Often-used open / accessible layers | Typical commercial / league layers |
|------:|-------------------------|---------------------------|--------------------------------------|------------------------------------|
| Soccer | Goals, xG-based outcomes, match result, score difference | Events (passes, shots, carries), lineups, minutes, home/away, competition tier | StatsBomb Open Data (events; sometimes limited 360 samples), aggregated public stats | Opta, Wyscout, StatsBomb full feeds/APIs, club tracking |
| NFL | Drive/play success, EPA/WP-derived targets, points, win | Down/distance, field position, personnel, game script, weather | nflfastR / derived play-by-play; open samples where available | NFL Next Gen Stats tracking; official feeds |
| Formula 1 | Finish position, points, lap time deltas, quali vs race | Session type, track, weather, tyres, pit stops, grid position, retirements | FastF1 (timing) + Jolpica-F1 (Ergast-compatible successor) for historical results | Licensed telemetry / high-resolution car data |
| NBA | Win/loss, margin, player box, advanced on/off | Possessions, shots (location/type), lineups, pace, rest, travel | Community wrappers over stats.nba.com endpoints; historical open datasets | Second Spectrum/SportVU-class tracking (restricted) |

### Cross-sport “must-have” tables (minimum viable schema)

- `seasons`: season_id, sport, league, start_date, end_date, ruleset/era
- `teams`: team_id, name, league, home_venue_id
- `players` (where applicable): player_id, name, team_id_history, position
- `venues`: venue_id, name, location, altitude (important for some sports), surface/track metadata
- `games` / `matches` / `races`: event_id, season_id, datetime_utc, venue_id, home_id/away_id or participants, status
- `events` (play-by-play / event stream): event_id, parent_event_id, timestamp/sequence, actor_id(s), location (if any), type, outcome
- `availability`: event_id, team_id/player_id, injury/availability status, minutes restriction if known
- `context`: weather, travel/rest, scheduling density, officiating metadata where applicable
- `labels` (derived targets): event_id, target_name, target_value, horizon, created_at, provenance

### Modeling hygiene (applies to all sports)

- **Time-based splits**: train on past seasons; validate forward. Avoid random splits for time-dependent tasks.
- **Stable IDs**: enforce stable player/team IDs across joins; track team relocations/renames.
- **Leakage controls**: exclude post-outcome info; define feature cutoff times.
- **Rule/era controls**: encode regulation changes (NFL rules, F1 technical regs, NBA pace eras).
- **Calibration**: report calibration curves / Brier score for probabilistic outputs when relevant.

