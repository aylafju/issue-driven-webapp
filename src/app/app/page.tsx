import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VersionFooter } from "@/components/VersionFooter";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../auth/actions";

// Beispieldaten, um die success-/danger-Tokens für Gewinn/Verlust zu
// demonstrieren (siehe CLAUDE.md, Abschnitt "Design-System").
const SAMPLE_POSITIONS = [
  { symbol: "AAPL", changePercent: 2.34 },
  { symbol: "TSLA", changePercent: -1.12 },
  { symbol: "MSFT", changePercent: 0.58 },
] as const;

// Geschützte App-View – nur für angemeldete User erreichbar. Nicht
// angemeldete User werden zur Login-Seite weitergeleitet.
export default async function AppView() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>App</CardTitle>
          <CardDescription>Angemeldet als {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Veränderung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SAMPLE_POSITIONS.map((position) => (
                <TableRow key={position.symbol}>
                  <TableCell>{position.symbol}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        position.changePercent >= 0
                          ? "tabular-nums border-success/40 text-success"
                          : "tabular-nums border-danger/40 text-danger"
                      }
                    >
                      {position.changePercent >= 0 ? "+" : ""}
                      {position.changePercent.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Abmelden
            </Button>
          </form>
        </CardContent>
      </Card>
      <VersionFooter />
    </main>
  );
}
