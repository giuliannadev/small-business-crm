"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { TaskCard } from "./TaskCard"
import type { Task, Customer, Deal, Contact } from "../../types"

interface TaskListProps {
  tasks: Task[]
  customers: Customer[]
  deals: Deal[]
  contacts: Contact[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onCompleteTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({
  tasks,
  customers,
  deals,
  contacts,
  onAddTask,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
}: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"all" | "today" | "overdue" | "upcoming">("all")

  const isOverdue = (task: Task) => {
    const now = new Date()
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || "23:59"}`)
    return task.status !== "completed" && dueDateTime < now
  }

  const isToday = (task: Task) => {
    const today = new Date().toISOString().split("T")[0]
    return task.dueDate === today
  }

  const isUpcoming = (task: Task) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekFromNow = new Date(now)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    const dueDate = new Date(task.dueDate)
    return dueDate >= tomorrow && dueDate <= weekFromNow && task.status !== "completed"
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    let matchesView = true
    switch (viewMode) {
      case "today":
        matchesView = isToday(task)
        break
      case "overdue":
        matchesView = isOverdue(task)
        break
      case "upcoming":
        matchesView = isUpcoming(task)
        break
      default:
        matchesView = true
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesView
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    // First, sort by overdue status
    const aOverdue = isOverdue(a)
    const bOverdue = isOverdue(b)
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    // Then by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Finally by due date/time
    const aDateTime = new Date(`${a.dueDate}T${a.dueTime || "00:00"}`)
    const bDateTime = new Date(`${b.dueDate}T${b.dueTime || "00:00"}`)
    return aDateTime.getTime() - bDateTime.getTime()
  })

  const getTaskCounts = () => {
    const all = tasks.length
    const today = tasks.filter(isToday).length
    const overdue = tasks.filter(isOverdue).length
    const upcoming = tasks.filter(isUpcoming).length
    const completed = tasks.filter((t) => t.status === "completed").length
    const pending = tasks.filter((t) => t.status === "pending").length

    return { all, today, overdue, upcoming, completed, pending }
  }

  const counts = getTaskCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks & Reminders</h2>
          <p className="text-muted-foreground">
            Manage your tasks and follow-up reminders to stay on top of your sales activities.
          </p>
        </div>
        <Button onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setViewMode("all")}>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{counts.all}</div>
            <div className="text-xs text-gray-600">All Tasks</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setViewMode("today")}>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.today}</div>
            <div className="text-xs text-gray-600">Due Today</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setViewMode("overdue")}>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{counts.overdue}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setViewMode("upcoming")}>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{counts.upcoming}</div>
            <div className="text-xs text-gray-600">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{counts.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.completed}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Priority
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>Urgent</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All Tasks", icon: Calendar },
          { key: "today", label: "Due Today", icon: Clock },
          { key: "overdue", label: "Overdue", icon: AlertTriangle },
          { key: "upcoming", label: "Upcoming", icon: CheckCircle },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={viewMode === key ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(key as any)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            customers={customers}
            deals={deals}
            contacts={contacts}
            onEdit={onEditTask}
            onComplete={onCompleteTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "Create your first task to get started with task management."}
            </p>
            {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
              <Button onClick={onAddTask} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
