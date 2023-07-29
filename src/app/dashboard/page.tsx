import { useViewer } from "@/lib/auth";

export default async function Dashboard() {
  const viewer = await useViewer();
  console.log(viewer);
  return <div>Dashboard</div>;
}
