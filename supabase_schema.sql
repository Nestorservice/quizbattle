-- ============================================================
-- QuizBattle — Schéma Supabase
-- Colle ce fichier dans : Supabase → SQL Editor → Run
-- ============================================================

-- ─── 1. TABLE PROFILES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  pseudo TEXT NOT NULL,
  age_range TEXT,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'expert')),
  interests TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. TABLE GAME_SESSIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_device_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_count INTEGER NOT NULL,
  elimination_mode TEXT NOT NULL CHECK (elimination_mode IN ('errors', 'last', 'none')),
  played_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER DEFAULT 0,
  player_count INTEGER DEFAULT 1
);

-- ─── 3. TABLE GAME_RESULTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  members TEXT[] DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 1,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  avg_response_time FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. INDEX ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_device_id ON profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_host ON game_sessions(host_device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_played_at ON game_sessions(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_session ON game_results(session_id);

-- ─── 5. TRIGGER updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 6. ROW LEVEL SECURITY ──────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Profiles : chaque utilisateur lit/modifie seulement son profil
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (true);

-- Sessions : lecture publique, écriture libre (auth anonyme)
CREATE POLICY "sessions_select" ON game_sessions
  FOR SELECT USING (true);

CREATE POLICY "sessions_insert" ON game_sessions
  FOR INSERT WITH CHECK (true);

-- Results : lecture publique, écriture libre
CREATE POLICY "results_select" ON game_results
  FOR SELECT USING (true);

CREATE POLICY "results_insert" ON game_results
  FOR INSERT WITH CHECK (true);

-- ─── 7. VUE PRATIQUE : historique par device ────────────────
CREATE OR REPLACE VIEW session_history AS
  SELECT
    s.id,
    s.host_device_id,
    s.subject,
    s.difficulty,
    s.question_count,
    s.elimination_mode,
    s.played_at,
    s.player_count,
    COUNT(r.id) AS team_count,
    MAX(r.score) AS top_score
  FROM game_sessions s
  LEFT JOIN game_results r ON r.session_id = s.id
  GROUP BY s.id
  ORDER BY s.played_at DESC;

-- ─── 8. AUTH ANONYME ────────────────────────────────────────
-- Activer dans : Supabase → Authentication → Providers → Anonymous Sign-ins → Enable
-- (pas de SQL nécessaire, c'est une option du dashboard)

-- ─── FIN ────────────────────────────────────────────────────
-- Vérifie que les tables sont bien créées :
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
