-- supabase/migrations/20261116000000_enable_realtime_sync.sql
--
-- Liga o Supabase Realtime nas tabelas do usuário: toda vez que uma linha muda,
-- o banco avisa o site e o app, que se atualizam na hora (celular ⇄ computador).
-- O Row Level Security continua valendo: cada pessoa só recebe avisos dos próprios dados.

alter publication supabase_realtime add table
  public.patient_profiles,
  public.medications,
  public.medication_intakes,
  public.diagnoses,
  public.session_packages,
  public.therapy_sessions,
  public.notebook_pages,
  public.daily_logs;
