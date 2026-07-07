"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type Plan = {
  plan: SubscriptionPlan;
};

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1">
            <span className="text-xl uppercase self-end">{plan.currency}</span>
            <span className="text-3xl font-semibold">{plan.amount}</span>
          </div>

          <span>per {plan.interval}</span>
        </CardDescription>
      </CardHeader>
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
    </Card>
  );
}
