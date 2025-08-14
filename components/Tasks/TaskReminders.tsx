"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, X, CheckCircle, AlarmClockIcon as Snooze } from "lucide-react"
import type { Task, Customer, Deal, Contact } from "../../types"

interface TaskRemindersProps {
  tasks: Task[]
  customers: Customer[]
  deals: Deal[]
  contacts: Contact[]
  onCompleteTask: (taskId: string) => void
  onSnoozeReminder: (taskId: string, minutes: number) => void
  onDismissReminder: (taskId: string) => void
}

interface ReminderNotification {
  task: Task
  type: "due" | "overdue" | "reminder"
  minutesUntilDue?: number
}

export function TaskReminders({
  tasks,
  customers,
  deals,
  contacts,
  onCompleteTask,
  onSnoozeReminder,
  onDismissReminder,
}: TaskRemindersProps) {
  const [activeReminders, setActiveReminders] = useState<ReminderNotification[]>([])
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set())

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const reminders: ReminderNotification[] = []

      tasks.forEach((task) => {
        if (task.status === "completed" || task.status === "cancelled") return
        if (dismissedReminders.has(task.id)) return

        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || "23:59"}`)
        const timeDiff = dueDateTime.getTime() - now.getTime()
        const minutesUntilDue = Math.floor(timeDiff / (1000 * 60))

        // Check if task is overdue
        if (timeDiff < 0) {
          reminders.push({
            task,
            type: "overdue",
          })
        }
        // Check if task is due within reminder window
        else if (task.reminderMinutes && minutesUntilDue <= task.reminderMinutes && minutesUntilDue > 0) {
          reminders.push({
            task,
            type: "reminder",
            minutesUntilDue,
          })
        }
        // Check if task is due within next 15 minutes
        else if (minutesUntilDue <= 15 && minutesUntilDue > 0) {
          reminders.push({
            task,
            type: "due",
            minutesUntilDue,
          })
        }
      })

      setActiveReminders(reminders)
    }

    // Check immediately and then every minute
    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [tasks, dismissedReminders])

  const getRelatedEntity = (task: Task) => {
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

  const handleDismiss = (taskId: string) => {
    setDismissedReminders((prev) => new Set([...prev, taskId]))
    onDismissReminder(taskId)
  }

  const handleSnooze = (taskId: string, minutes: number) => {
    setDismissedReminders((prev) => new Set([...prev, taskId]))
    onSnoozeReminder(taskId, minutes)
  }

  const getReminderColor = (type: string) => {
    switch (type) {
      case "overdue":
        return "border-red-500 bg-red-50"
      case "due":
        return "border-orange-500 bg-orange-50"
      case "reminder":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-gray-200"
    }
  }

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "due":
      case "reminder":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTimeUntilDue = (minutes?: number) => {
    if (!minutes) return ""
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (activeReminders.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {activeReminders.slice(0, 3).map((reminder) => {
        const relatedEntity = getRelatedEntity(reminder.task)

        return (
          <Card key={reminder.task.id} className={`shadow-lg ${getReminderColor(reminder.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getReminderIcon(reminder.type)}
                  <Badge variant="outline" className="text-xs">
                    {reminder.type === "overdue" ? "Overdue" : reminder.type === "due" ? "Due Soon" : "Reminder"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDismiss(reminder.task.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm leading-tight">{reminder.task.title}</h4>

                {relatedEntity && (
                  <p className="text-xs text-gray-600">
                    {relatedEntity.type}: {relatedEntity.name}
                    {relatedEntity.company && ` (${relatedEntity.company})`}
                  </p>
                )}

                {reminder.minutesUntilDue !== undefined && (
                  <p className="text-xs text-gray-500">Due in {formatTimeUntilDue(reminder.minutesUntilDue)}</p>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-transparent"
                    onClick={() => onCompleteTask(reminder.task.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Button>

                  {reminder.type !== "overdue" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs bg-transparent"
                      onClick={() => handleSnooze(reminder.task.id, 30)}
                    >
                      <Snooze className="h-3 w-3 mr-1" />
                      Snooze
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {activeReminders.length > 3 && (
        <Card className="shadow-lg">
          <CardContent className="p-3 text-center">
            <p className="text-sm text-gray-600">
              +{activeReminders.length - 3} more reminder{activeReminders.length - 3 > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
