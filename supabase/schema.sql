-- =========================================================
-- Painel de estoque Caramellos: estrutura do banco (Supabase)
-- Rode uma vez em: Supabase → SQL Editor → New query → Run
-- =========================================================

-- Quem pode usar o painel. Só e-mails cadastrados aqui entram,
-- mesmo que alguém consiga criar uma conta.
create table if not exists public.equipe (
  email      text primary key,
  nome       text,
  criado_em  timestamptz not null default now()
);

create or replace function public.eh_equipe()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.equipe
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Insumos (ingredientes, embalagens, gás e energia)
create table if not exists public.insumos (
  id               text primary key,
  nome             text not null,
  categoria        text not null default 'ingrediente'
                   check (categoria in ('ingrediente', 'embalagem', 'custo')),
  unidade          text not null default 'g'
                   check (unidade in ('g', 'ml', 'un', 'kWh')),
  embalagem_nome   text not null default '',
  embalagem_qtd    numeric not null default 0 check (embalagem_qtd >= 0),
  preco_embalagem  numeric not null default 0 check (preco_embalagem >= 0),
  estoque          numeric not null default 0,
  minimo           numeric not null default 0,
  controla         boolean not null default true,
  atualizado_em    timestamptz not null default now()
);

-- Receitas (massa base, sabores, embalagem por pedido), num único documento
create table if not exists public.config (
  id             text primary key,
  dados          jsonb not null,
  atualizado_em  timestamptz not null default now()
);

-- Histórico: fornadas, compras e contagens
create table if not exists public.movimentos (
  id         uuid primary key default gen_random_uuid(),
  tipo       text not null check (tipo in ('producao', 'compra', 'ajuste')),
  descricao  text not null,
  itens      jsonb not null default '[]'::jsonb,
  valor      numeric,
  quando     timestamptz not null default now(),
  autor      text default (auth.jwt() ->> 'email')
);
create index if not exists movimentos_quando_idx on public.movimentos (quando desc);

-- ---------- Regras de acesso (RLS) ----------
alter table public.equipe     enable row level security;
alter table public.insumos    enable row level security;
alter table public.config     enable row level security;
alter table public.movimentos enable row level security;

drop policy if exists "equipe le equipe" on public.equipe;
create policy "equipe le equipe" on public.equipe
  for select to authenticated using (public.eh_equipe());

drop policy if exists "equipe usa insumos" on public.insumos;
create policy "equipe usa insumos" on public.insumos
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "equipe usa config" on public.config;
create policy "equipe usa config" on public.config
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "equipe usa movimentos" on public.movimentos;
create policy "equipe usa movimentos" on public.movimentos
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

-- Visitantes sem login não acessam nada
revoke all on public.equipe, public.insumos, public.config, public.movimentos from anon;

-- ---------- Registrar fornada / compra / contagem de uma vez só ----------
-- Soma os "deltas" ao estoque e grava o histórico na mesma transação,
-- assim duas pessoas usando ao mesmo tempo não se atrapalham.
create or replace function public.registrar_movimento(
  p_tipo text, p_descricao text, p_valor numeric, p_deltas jsonb
) returns uuid
language plpgsql security invoker
set search_path = public
as $$
declare
  k text; d numeric; r record;
  v_itens jsonb := '[]'::jsonb;
  v_id uuid;
begin
  if not public.eh_equipe() then
    raise exception 'Sem permissão para alterar o estoque';
  end if;
  for k, d in select key, value::numeric from jsonb_each_text(p_deltas) loop
    update public.insumos
       set estoque = round(estoque + d, 3), atualizado_em = now()
     where id = k and controla
     returning nome, unidade into r;
    if found then
      v_itens := v_itens || jsonb_build_object(
        'insumo', k, 'nome', r.nome, 'unidade', r.unidade, 'delta', round(d, 2));
    end if;
  end loop;
  insert into public.movimentos (tipo, descricao, valor, itens)
  values (p_tipo, p_descricao, p_valor, v_itens)
  returning id into v_id;
  return v_id;
end;
$$;

revoke execute on function public.registrar_movimento(text, text, numeric, jsonb) from anon, public;
grant  execute on function public.registrar_movimento(text, text, numeric, jsonb) to authenticated;
revoke execute on function public.eh_equipe() from anon, public;
grant  execute on function public.eh_equipe() to authenticated;
