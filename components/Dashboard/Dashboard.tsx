import { MetricsCard } from "./MetricsCard"
import { RevenueChart } from "./RevenueChart"
import { ActivityFeed } from "./ActivityFeed"
import { Users, DollarSign, TrendingUp, Target, UserPlus, Award, CheckSquare, Clock, AlertTriangle } from "lucide-react"
import type { Metrics, Activity } from "../../types"

interface DashboardProps {
  metrics: Metrics
  activities: Activity[]
  revenueData: Array<{ month: string; revenue: number }>
}

export function Dashboard({ metrics, activities, revenueData }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <MetricsCard
          title="Total Customers"
          value={metrics.totalCustomers}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
        />
        <MetricsCard
          title="Active Deals"
          value={metrics.activeDeals}
          change="+8% from last month"
          changeType="positive"
          icon={Target}
        />
        <MetricsCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          change="+15% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricsCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change="+3% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricsCard
          title="Total Contacts"
          value={metrics.totalContacts}
          change="+24% from last month"
          changeType="positive"
          icon={UserPlus}
        />
        <MetricsCard
          title="Qualified Leads"
          value={metrics.qualifiedLeads}
          change="+18% from last month"
          changeType="positive"
          icon={Award}
        />
        <MetricsCard
          title="Pending Tasks"
          value={metrics.pendingTasks}
          change="+2 from yesterday"
          changeType="neutral"
          icon={CheckSquare}
        />
        <MetricsCard
          title="Overdue Tasks"
          value={metrics.overdueTasks}
          change={metrics.overdueTasks > 0 ? "Needs attention" : "All caught up!"}
          changeType={metrics.overdueTasks > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
        />
        <MetricsCard
          title="Completed This Week"
          value={metrics.completedTasksThisWeek}
          change="+25% from last week"
          changeType="positive"
          icon={Clock}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-7">
        <RevenueChart data={revenueData} />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  )
}
