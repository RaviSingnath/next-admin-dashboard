ALTER TABLE colleges 
DROP COLUMN address, 
ADD COLUMN country text,
ADD COLUMN state text,
ADD COLUMN city text,
ADD COLUMN postal_code text;