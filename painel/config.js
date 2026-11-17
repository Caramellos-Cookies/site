// Conexão do painel com o banco de dados (Supabase).
// São chaves PÚBLICAS, feitas para ficar no navegador: quem protege os dados
// são o login e as regras de acesso do banco (supabase/schema.sql).
// NUNCA coloque aqui a chave "service_role" / "secret".
window.CARAMELLOS_SUPABASE = {
  url: "",    // Project URL, ex.: "https://abcdefgh.supabase.co"
  chave: ""   // anon / publishable key
};
