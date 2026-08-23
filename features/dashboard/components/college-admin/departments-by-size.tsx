import AppCard from "@/components/ui/app/app-card";

const departments = [
  { name: "Computer Science", students: 612 },
  { name: "Business Administration", students: 498 },
  { name: "Mechanical Engineering", students: 445 },
  { name: "Commerce", students: 390 },
  { name: "Arts & Humanities", students: 302 },
];
const maxDept = Math.max(...departments.map((d) => d.students));
export default function DepartmentsBySize() {
  return (
    <AppCard>
      <h2 className="font-display mb-4 text-base font-semibold">
        Departments by size
      </h2>
      <div className="space-y-3">
        {departments.map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{d.name}</span>
              <span className="text-[#5B6478]">{d.students}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F2F7]">
              <div
                className="h-full rounded-full bg-[#2F5FA8]"
                style={{ width: `${(d.students / maxDept) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
