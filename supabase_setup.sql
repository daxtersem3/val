-- =========================================================
-- LP IMPORTADOS — CONFIGURAÇÃO DO BANCO DE DADOS (SUPABASE)
-- =========================================================
-- Execute este script no SQL Editor do seu projeto no Supabase (https://supabase.com)

-- 1. Criar Tabela de Produtos
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  discount_percent numeric,
  images text[] default '{}',
  image text,
  description text,
  sizes text[] default '{}',
  badge text,
  featured boolean default false,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar segurança em nível de linha (RLS)
alter table public.products enable row level security;

create policy "Permitir leitura pública de produtos" on public.products
  for select using (true);

create policy "Permitir inserção e atualização de produtos" on public.products
  for all using (true);

-- 3. Criar Bucket de Armazenamento para Fotos dos Produtos (product-images)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Permitir acesso público às imagens" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Permitir upload de imagens" on storage.objects
  for insert with check (bucket_id = 'product-images');

create policy "Permitir atualizar imagens" on storage.objects
  for update using (bucket_id = 'product-images');

create policy "Permitir deletar imagens" on storage.objects
  for delete using (bucket_id = 'product-images');
