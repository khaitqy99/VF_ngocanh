-- Remove customer review data from vehicle CMS JSON content.
-- Stored as content.detail.reviews and optional content.admin_patches review keys.

-- 1) Drop nested review objects
UPDATE public.vehicles
SET
  content = (content #- '{detail,reviews}') #- '{reviews}',
  updated_at = now()
WHERE content ? 'reviews'
   OR COALESCE(content->'detail', '{}'::jsonb) ? 'reviews';

-- 2) Strip review-related keys from admin_patches
UPDATE public.vehicles
SET
  content = jsonb_set(
    content,
    '{admin_patches}',
    COALESCE(
      (
        SELECT jsonb_object_agg(k, content->'admin_patches'->k)
        FROM jsonb_object_keys(content->'admin_patches') AS k
        WHERE k NOT LIKE 'reviews%'
          AND k NOT LIKE '_section.reviews%'
      ),
      '{}'::jsonb
    ),
    true
  ),
  updated_at = now()
WHERE content ? 'admin_patches'
  AND EXISTS (
    SELECT 1
    FROM jsonb_object_keys(content->'admin_patches') AS k
    WHERE k LIKE 'reviews%'
       OR k LIKE '_section.reviews%'
  );

-- 3) Remove "danh-gia" from hidden section lists if present
UPDATE public.vehicles
SET
  content = jsonb_set(
    content,
    '{admin_patches,_hiddenSections}',
    COALESCE(
      (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(content->'admin_patches'->'_hiddenSections') AS elem
        WHERE elem #>> '{}' <> 'danh-gia'
      ),
      '[]'::jsonb
    ),
    true
  ),
  updated_at = now()
WHERE jsonb_typeof(content->'admin_patches'->'_hiddenSections') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(content->'admin_patches'->'_hiddenSections') AS elem
    WHERE elem = 'danh-gia'
  );
