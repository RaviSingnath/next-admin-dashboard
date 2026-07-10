create or replace function public.upsert_plan_features(
  p_plan_id  uuid,
  p_features jsonb
  -- Expected shape:
  -- [
  --   { "id": "uuid",  "feature": "text", "display_order": 10 },  -- existing
  --   { "id": null,    "feature": "text", "display_order": 20 },  -- new
  -- ]
)
returns void
language plpgsql
security definer
as $$
declare
  item         jsonb;
  incoming_ids uuid[];
begin
  -- ── Step 1: collect all incoming IDs ───────────────────────────────────────
  -- Use alias "feat" instead of "item" to avoid ambiguity
  -- with the loop variable declared above.
  select array_agg((feat->>'id')::uuid)
  into incoming_ids
  from jsonb_array_elements(p_features) as feat
  where feat->>'id' is not null;

  -- ── Step 2: delete features removed from the form ──────────────────────────
  delete from public.plan_features
  where plan_id = p_plan_id
    and (
      incoming_ids is null
      or id <> all(incoming_ids)
    );

  -- ── Step 3: process each incoming feature ──────────────────────────────────
  for item in select * from jsonb_array_elements(p_features)
  loop
    if item->>'id' is not null then
      update public.plan_features
      set
        feature       = trim(item->>'feature'),
        display_order = (item->>'display_order')::smallint
      where id      = (item->>'id')::uuid
        and plan_id = p_plan_id;
    else
      insert into public.plan_features (plan_id, feature, display_order)
      values (
        p_plan_id,
        trim(item->>'feature'),
        (item->>'display_order')::smallint
      );
    end if;
  end loop;
end;
$$;