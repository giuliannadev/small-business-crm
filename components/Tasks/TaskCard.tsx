"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  CheckCircle,
  Phone,
  Mail,
  Users,
  Target,
  AlertTriangle,
} from "lucide-react"
import type { Task, Customer, Deal, Contact } from "../../types"

interface TaskCardProps {
  task: Task
  customers: Customer[]
  deals: Deal[]
  contacts: Contact[]
  onEdit: (task: Task) => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
}

const taskTypeIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  "follow-up": Target,
  demo: Users,
  proposal: Mail,
  other: AlertTriangle,
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
}

export function TaskCard({ task, customers, deals, contacts, onEdit, onComplete, onDelete }: TaskCardProps) {
  const Icon = taskTypeIcons[task.type]

  const getRelatedEntity = () => {
    if (task.customerId) {
      const customer = customers.find((c) => c.id === task.customerId)
      return customer ? { type: "Customer", name: customer.name, company: customer.company } : null
    }
    if (task.dealId) {
      const deal = deals.find((d) => d.id === task.dealId)
      return deal ? { type: "Deal", name: deal.title, company: deal.company } : null
    }
    if (task.contactId) {
      const contact = contacts.find((c) => c.id === task.contactId)
      return contact ? { type: "Contact", name: contact.name, company: contact.company } : null
    }
    return null
  }

  const isOverdue = () => {
    const now = new Date()
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || "23:59"}`)
    return task.status !== "completed" && dueDateTime < now
  }

  const formatDateTime = () => {
    const date = new Date(task.dueDate)
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })

    if (task.dueTime) {
      const time = new Date(`${task.dueDate}T${task.dueTime}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      return `${dateStr} at ${time}`
    }
    return dateStr
  }

  const relatedEntity = getRelatedEntity()
  const overdue = isOverdue()

  return (
    <Card className={`transition-shadow hover:shadow-md ${overdue ? "border-red-200 bg-red-50" : ""}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <div className={`p-1.5 rounded-full ${priorityColors[task.priority]}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                {task.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
                {task.status !== "completed" && (
                  <DropdownMenuItem onClick={() => onComplete(task.id)}>Mark Complete</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={`text-xs ${statusColors[task.status]}`}>
              {task.status.replace("-", " ")}
            </Badge>
            {overdue && task.status !== "completed" && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>

          {/* Due date and time */}
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDateTime()}
            </div>
            {task.reminderMinutes && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {task.reminderMinutes >= 60
                  ? `${Math.floor(task.reminderMinutes / 60)}h reminder`
                  : `${task.reminderMinutes}m reminder`}
              </div>
            )}
          </div>

          {/* Related entity */}
          {relatedEntity && (
            <div className="flex items-center text-xs text-gray-600">
              <User className="h-3 w-3 mr-1" />
              <span className="font-medium">{relatedEntity.type}:</span>
              <span className="ml-1">{relatedEntity.name}</span>
              {relatedEntity.company && <span className="text-gray-500 ml-1">({relatedEntity.company})</span>}
            </div>
          )}

          {/* Quick complete button for pending tasks */}
          {task.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2 bg-transparent"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
