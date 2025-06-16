// server wrapper: keeps SSR stable & lazy‑loads the client bundle
import dynamic from "next/dynamic"

const DashboardClient = dynamic(() => import("./dashboard-clients"), {
  ssr: false,
  loading: () => null,
})

export default function UserDashboard() {
  return <DashboardClient />
}

// also export named for legacy imports
export { UserDashboard }
