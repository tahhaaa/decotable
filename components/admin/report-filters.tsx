import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReportFilters({
  dateFrom,
  dateTo,
}: {
  dateFrom?: string;
  dateTo?: string;
}) {
  const params = new URLSearchParams();
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  return (
    <div className="surface grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-stone">Du</p>
        <Input name="dateFrom" type="date" defaultValue={dateFrom} />
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-stone">Au</p>
        <Input name="dateTo" type="date" defaultValue={dateTo} />
      </div>
      <Button type="submit">Filtrer</Button>
      <Link href={`/api/admin/report${params.toString() ? `?${params.toString()}` : ""}`} target="_blank">
        <Button variant="ghost">Exporter PDF</Button>
      </Link>
    </div>
  );
}
