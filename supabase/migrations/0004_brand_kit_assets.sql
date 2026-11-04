-- The guidelines bucket also holds brand kit files (logos, sample imagery), same per-workspace access.
update storage.buckets
set allowed_mime_types = array['application/pdf','image/png','image/svg+xml','image/jpeg','image/webp'],
    file_size_limit = 52428800
where id = 'guidelines';
