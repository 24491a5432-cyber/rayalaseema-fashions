-- Create a public storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- RLS policies for the bucket's objects
-- Anyone can read objects from this bucket
create policy if not exists "Public read for product-images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Authenticated users can upload to this bucket
create policy if not exists "Authenticated upload to product-images"
on storage.objects for insert
with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Users can update their own objects
create policy if not exists "Users can update own objects in product-images"
on storage.objects for update
using (bucket_id = 'product-images' and owner = auth.uid());

-- Users can delete their own objects
create policy if not exists "Users can delete own objects in product-images"
on storage.objects for delete
using (bucket_id = 'product-images' and owner = auth.uid());

