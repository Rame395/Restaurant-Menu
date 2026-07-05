-- Storage Bucket Setup for Image Uploads

-- Insert the bucket
insert into storage.buckets (id, name, public) 
values ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'menu-images' );

create policy "Admin Insert" 
on storage.objects for insert 
using ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );

create policy "Admin Update" 
on storage.objects for update 
using ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );

create policy "Admin Delete" 
on storage.objects for delete 
using ( auth.role() = 'authenticated' AND bucket_id = 'menu-images' );
