import {
  getSupervisorStudentCount,
  getSupervisorActiveStudentCount,
  getSupervisorPendingStudentCount,
} from "@/features/students/queries/supervisor-dashboard.queries";
import { createRequestContext } from "@/lib/auth/request-context";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

export async function getSupervisorDashboardService() {
  const ctx = await createRequestContext();

  if (!ctx.user.college_id) {
    throw Errors.collegeNotAssigned();
  }

  const supervisorId = ctx.user.id;

  const [
    { count: allStudents, error: allStudentsError },
    { count: activeStudents, error: activeStudentsError },
    { count: pendingStudents, error: pendingStudentsError },
    // studentsNeedingAttentionResult,
    // recentActivityResult,
  ] = await Promise.all([
    getSupervisorStudentCount(supervisorId),
    getSupervisorActiveStudentCount(supervisorId),
    getSupervisorPendingStudentCount(supervisorId),
    // getStudentsNeedingAttention(supervisorId),
    // getRecentActivity(supervisorId),
  ]);

  if (allStudentsError) {
    throw mapSupabaseError(allStudentsError);
  }

  if (activeStudentsError) {
    throw mapSupabaseError(activeStudentsError);
  }

  if (pendingStudentsError) {
    throw mapSupabaseError(pendingStudentsError);
  }

  return {
    allStudentsCount: allStudents ?? 0,
    activeStudentsCount: activeStudents ?? 0,
    pendingStudentsCount: pendingStudents ?? 0,

    // studentsNeedingAttention: attention.data ?? [],
    // recentActivity: activity.data ?? [],
  };
}

export interface SupervisorDashboardData {
  allStudentsCount: number;
  activeStudentsCount: number;
  pendingStudentsCount: number;

  // studentsNeedingAttention: SupervisorAttentionStudent[];

  // recentActivity: SupervisorActivity[];
}
