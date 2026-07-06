-- Storage Bucket Setup for Image Uploads

insert into storage.buckets (id, name, public) 
values ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old incorrectly formatted policies if they exist
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin Insert" on storage.objects;
drop policy if exists "Admin Update" on storage.objects;
drop policy if exists "Admin Delete" on storage.objects;

-- Create correct Storage Policies

create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'menu-images' );

create policy "Admin Insert" 
on storage.objects for insert 
with check ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );

create policy "Admin Update" 
on storage.objects for update 
using ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );

create policy "Admin Delete" 
on storage.objects for delete 
using ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );
