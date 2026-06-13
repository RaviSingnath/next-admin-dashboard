ALTER TABLE public.addresses
  ALTER COLUMN address_line_1 DROP NOT NULL,
  ALTER COLUMN country_code TYPE varchar(2);