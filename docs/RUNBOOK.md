# Operations runbook

Backups (when Postgres is attached): enable provider point-in-time recovery, daily logical dump retained 30 days, quarterly restore drill into a scratch database. Media in R2 with versioning.

Incidents: payment stuck pending -> look up Stripe session, replay the event from the dashboard (handler is idempotent). Oversell suspected -> compare `InventoryMovement` ledger with `Variant.onHand`. Rollback -> Vercel instant rollback; schema changes must be backward compatible for one release.
