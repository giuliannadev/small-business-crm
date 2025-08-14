"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Task, Customer, Deal, Contact } from "../../types"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedTo" | "completedAt">) => void
  task?: Task | null
  customers: Customer[]
  deals: Deal[]
  contacts: Contact[]
}

export function TaskModal({ isOpen, onClose, onSave, task, customers, deals, contacts }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "call" as Task["type"],
    priority: "medium" as Task["priority"],
    status: "pending" as Task["status"],
    dueDate: "",
    dueTime: "",
    customerId: "",
    dealId: "",
    contactId: "",
    notes: "",
    reminderMinutes: 30,
    hasReminder: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        dueTime: task.dueTime || "",
        customerId: task.customerId || "",
        dealId: task.dealId || "",
        contactId: task.contactId || "",
        notes: task.notes || "",
        reminderMinutes: task.reminderMinutes || 30,
        hasReminder: !!task.reminderMinutes,
      })
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      setFormData({
        title: "",
        description: "",
        type: "call",
        priority: "medium",
        status: "pending",
        dueDate: tomorrow.toISOString().split("T")[0],
        dueTime: "09:00",
        customerId: "",
        dealId: "",
        contactId: "",
        notes: "",
        reminderMinutes: 30,
        hasReminder: true,
      })
    }
    setErrors({})
  }, [task, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"

    // Ensure only one related entity is selected
    const relatedEntities = [formData.customerId, formData.dealId, formData.contactId].filter(Boolean)
    if (relatedEntities.length > 1) {
      newErrors.relatedEntity = "Please select only one related entity (customer, deal, or contact)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const taskData = {
        ...formData,
        customerId: formData.customerId || undefined,
        dealId: formData.dealId || undefined,
        contactId: formData.contactId || undefined,
        dueTime: formData.dueTime || undefined,
        notes: formData.notes || undefined,
        reminderMinutes: formData.hasReminder ? formData.reminderMinutes : undefined,
      }
      onSave(taskData)
      onClose()
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const clearRelatedEntities = (except: string) => {
    const updates: any = {}
    if (except !== "customerId") updates.customerId = ""
    if (except !== "dealId") updates.dealId = ""
    if (except !== "contactId") updates.contactId = ""
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const reminderOptions = [
    { value: 15, label: "15 minutes before" },
    { value: 30, label: "30 minutes before" },
    { value: 60, label: "1 hour before" },
    { value: 120, label: "2 hours before" },
    { value: 1440, label: "1 day before" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
              placeholder="e.g., Follow up with client about proposal"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Add more details about this task..."
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Task Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time (Optional)</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleInputChange("dueTime", e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Related Entities */}
          <div className="space-y-4">
            <div>
              <Label>Related To (Optional)</Label>
              <p className="text-xs text-gray-500 mb-2">Select a customer, deal, or contact this task relates to</p>
              {errors.relatedEntity && <p className="text-sm text-red-500 mb-2">{errors.relatedEntity}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select
                  value={formData.customerId || "none"}
                  onValueChange={(value) => {
                    handleInputChange("customerId", value)
                    if (value !== "none") clearRelatedEntities("customerId")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealId">Deal</Label>
                <Select
                  value={formData.dealId || "none"}
                  onValueChange={(value) => {
                    handleInputChange("dealId", value)
                    if (value !== "none") clearRelatedEntities("dealId")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {deals.map((deal) => (
                      <SelectItem key={deal.id} value={deal.id}>
                        {deal.title} - {deal.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactId">Contact</Label>
                <Select
                  value={formData.contactId || "none"}
                  onValueChange={(value) => {
                    handleInputChange("contactId", value)
                    if (value !== "none") clearRelatedEntities("contactId")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} - {contact.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasReminder"
                checked={formData.hasReminder}
                onCheckedChange={(checked) => handleInputChange("hasReminder", checked)}
              />
              <Label htmlFor="hasReminder">Set reminder</Label>
            </div>

            {formData.hasReminder && (
              <div className="space-y-2">
                <Label htmlFor="reminderMinutes">Reminder Time</Label>
                <Select
                  value={formData.reminderMinutes.toString()}
                  onValueChange={(value) => handleInputChange("reminderMinutes", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"} Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
