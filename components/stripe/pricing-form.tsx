"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";

type Plan = {
  plan: SubscriptionPlan;
};

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { TPlan, zPlan } from "@/features/stripe/stripe.schema";
import { createCheckoutSession } from "@/features/stripe/stripe.action";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";

export function PlanPricingForm({ plan }: Plan) {
  const form = useForm<TPlan>({
    resolver: zodResolver(zPlan),
    defaultValues: {
      planId: plan.id,
    },
  });

  async function onSubmit(data: TPlan) {
    const { url } = await createCheckoutSession(data);
    redirect(url);
  }

  return (
    <>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}></form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-demo">
            Subscribe
          </Button>
        </Field>
      </CardFooter>
    </>
  );
}
