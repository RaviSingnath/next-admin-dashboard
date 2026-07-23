create or replace function public.upsert_product_features(
  p_product_id uuid,
  p_features jsonb
)
returns void
language plpgsql
security definer
as $$
declare
  item jsonb;
  incoming_ids uuid[];
begin
  -- Collect incoming IDs
  select array_agg((feat->>'id')::uuid)
  into incoming_ids
  from jsonb_array_elements(p_features) as feat
  where feat->>'id' is not null;

  -- Delete removed features
  delete from public.plan_features
  where product_id = p_product_id
    and (
      incoming_ids is null
      or id <> all(incoming_ids)
    );

  -- Upsert features
  for item in
    select *
    from jsonb_array_elements(p_features)
  loop
    if item->>'id' is not null then

      update public.plan_features
      set
        feature = trim(item->>'feature'),
        display_order = (item->>'display_order')::smallint
      where id = (item->>'id')::uuid
        and product_id = p_product_id;

    else

      insert into public.plan_features (
        product_id,
        feature,
        display_order
      )
      values (
        p_product_id,
        trim(item->>'feature'),
        (item->>'display_order')::smallint
      );

    end if;
  end loop;
end;
$$;