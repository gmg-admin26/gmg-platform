/*
  # Chef Cheryl Summer Classes — Reservations Table

  1. New Tables
    - `cc_reservations`
      - `id` (uuid, primary key)
      - `parent_name` (text) — parent/guardian full name
      - `email` (text) — contact email
      - `phone` (text) — contact phone
      - `child_name` (text) — child's first name
      - `child_age` (integer) — child's age
      - `preferred_session` (text) — morning / afternoon / either
      - `weeks_interested` (text[]) — array of week identifiers e.g. ['week1','week3']
      - `num_children` (integer) — number of children
      - `notes` (text) — dietary considerations or other notes
      - `consent` (boolean) — privacy/contact consent
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anon users can INSERT (submit reservation form)
    - No SELECT policy for anon (admin reads via service role)
*/

CREATE TABLE IF NOT EXISTS cc_reservations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name      text NOT NULL,
  email            text NOT NULL,
  phone            text DEFAULT '',
  child_name       text NOT NULL,
  child_age        integer NOT NULL,
  preferred_session text NOT NULL DEFAULT 'either',
  weeks_interested text[] NOT NULL DEFAULT '{}',
  num_children     integer NOT NULL DEFAULT 1,
  notes            text DEFAULT '',
  consent          boolean NOT NULL DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE cc_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a reservation"
  ON cc_reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);
