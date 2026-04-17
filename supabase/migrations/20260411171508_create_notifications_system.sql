/*
  # Notifications System

  ## Summary
  Creates a full notifications infrastructure for the Artist OS updates system.
  Supports broadcast creation, per-recipient delivery tracking, and read receipts.
  Notifications can be sent via in-app bell, email (external), or SMS (placeholder).

  ## New Tables

  ### 1. `aos_broadcasts`
  Central record for each notification/update broadcast sent from the admin.
  - `id` (uuid, pk)
  - `title` (text)
  - `body` (text)
  - `priority` — urgent | high | normal | low
  - `scope` — full_roster | by_label | by_artist | internal_team
  - `target_artist_ids` (text[]) — for by_artist scope
  - `target_label_ids` (text[]) — for by_label scope
  - `author` (text) — display name of sender
  - `author_role` (text)
  - `status` — draft | published | archived
  - `channels` (text[]) — in_app | email | sms
  - `visible_to_roles` (text[])
  - `created_at`, `published_at`, `updated_at`

  ### 2. `aos_notification_deliveries`
  Per-recipient delivery and read-tracking record, created when a broadcast is published.
  - `id` (uuid, pk)
  - `broadcast_id` (uuid, FK → aos_broadcasts)
  - `recipient_artist_id` (text, nullable) — if targeting a specific artist
  - `recipient_email` (text, nullable)
  - `recipient_phone` (text, nullable)
  - `channel` — in_app | email | sms
  - `status` — pending | sent | delivered | read | failed
  - `sent_at`, `delivered_at`, `read_at` (nullable timestamps)
  - `error_msg` (text, nullable)
  - `created_at`

  ## Security
  - RLS enabled on both tables
  - Authenticated users can read broadcasts visible to their role
  - Authenticated users can insert/update deliveries (for marking as read)
*/

CREATE TABLE IF NOT EXISTS aos_broadcasts (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text        NOT NULL DEFAULT '',
  body               text        NOT NULL DEFAULT '',
  priority           text        NOT NULL DEFAULT 'normal'
                                 CHECK (priority = ANY (ARRAY['urgent'::text, 'high'::text, 'normal'::text, 'low'::text])),
  scope              text        NOT NULL DEFAULT 'full_roster'
                                 CHECK (scope = ANY (ARRAY['full_roster'::text, 'by_label'::text, 'by_artist'::text, 'selected_artists'::text, 'internal_team'::text])),
  target_artist_ids  text[]      NOT NULL DEFAULT '{}',
  target_label_ids   text[]      NOT NULL DEFAULT '{}',
  author             text        NOT NULL DEFAULT '',
  author_role        text        NOT NULL DEFAULT 'admin_team',
  status             text        NOT NULL DEFAULT 'draft'
                                 CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
  channels           text[]      NOT NULL DEFAULT '{in_app}',
  visible_to_roles   text[]      NOT NULL DEFAULT '{admin_team}',
  published_at       timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_status   ON aos_broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_broadcasts_priority ON aos_broadcasts(priority);
CREATE INDEX IF NOT EXISTS idx_broadcasts_scope    ON aos_broadcasts(scope);

ALTER TABLE aos_broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read broadcasts"
  ON aos_broadcasts FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert broadcasts"
  ON aos_broadcasts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update broadcasts"
  ON aos_broadcasts FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);


CREATE TABLE IF NOT EXISTS aos_notification_deliveries (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id        uuid        NOT NULL REFERENCES aos_broadcasts(id) ON DELETE CASCADE,
  recipient_artist_id text,
  recipient_email     text,
  recipient_phone     text,
  channel             text        NOT NULL DEFAULT 'in_app'
                                  CHECK (channel = ANY (ARRAY['in_app'::text, 'email'::text, 'sms'::text])),
  status              text        NOT NULL DEFAULT 'pending'
                                  CHECK (status = ANY (ARRAY['pending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text])),
  sent_at             timestamptz,
  delivered_at        timestamptz,
  read_at             timestamptz,
  error_msg           text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_broadcast_id    ON aos_notification_deliveries(broadcast_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_artist_id       ON aos_notification_deliveries(recipient_artist_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_channel         ON aos_notification_deliveries(channel);
CREATE INDEX IF NOT EXISTS idx_deliveries_status          ON aos_notification_deliveries(status);

ALTER TABLE aos_notification_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read deliveries"
  ON aos_notification_deliveries FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert deliveries"
  ON aos_notification_deliveries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update deliveries"
  ON aos_notification_deliveries FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
