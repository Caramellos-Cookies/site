-- =========================================================
-- Painel Caramellos: vendas e relatórios (rode depois do schema.sql)
-- Supabase → SQL Editor → New query → colar → Run
-- Pode rodar de novo sem problema.
-- =========================================================

create table if not exists public.vendas (
  id          uuid primary key default gen_random_uuid(),
  data        date not null default current_date,
  cliente     text not null default '',
  canal       text not null default 'WhatsApp',
  itens       jsonb not null default '[]'::jsonb,  -- [{produto, nome, qtd, preco, custo}]
  subtotal    numeric not null default 0,
  desconto    numeric not null default 0,
  total       numeric not null default 0,
  custo       numeric not null default 0,           -- custo estimado no dia da venda
  pagamento   text not null default '',
  status      text not null default 'pago' check (status in ('pago', 'a receber')),
  obs         text not null default '',
  criado_em   timestamptz not null default now(),
  autor       text default (auth.jwt() ->> 'email')
);
create index if not exists vendas_data_idx on public.vendas (data desc);

alter table public.vendas enable row level security;
drop policy if exists "equipe usa vendas" on public.vendas;
create policy "equipe usa vendas" on public.vendas
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

revoke all on public.vendas from anon;
grant select, insert, update, delete on public.vendas to authenticated;

-- O histórico de estoque passa a aceitar o tipo "venda" (embalagem do pedido)
alter table public.movimentos drop constraint if exists movimentos_tipo_check;
alter table public.movimentos add constraint movimentos_tipo_check
  check (tipo in ('producao', 'compra', 'ajuste', 'venda'));
