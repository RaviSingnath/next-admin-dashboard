import ComponentCard from "@/components/common/cmponent-card";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { PlanList } from "@/components/stripe/plan-list";
import { getPlansService } from "@/features/stripe/service/stripe.services";
import SyncPlansButton from "./_components/sync-plans";

export default async function SyncPlansPage() {
  const plans = await getPlansService();

  if (!plans) return;

  return (
    <PageWrapperBreadcrumb title="Plans">
      <ComponentCard title="Plans List" ActionButton={<SyncPlansButton />}>
        <PlanList plans={plans} />
      </ComponentCard>
    </PageWrapperBreadcrumb>
  );
}
