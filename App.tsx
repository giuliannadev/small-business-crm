"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import { AppSidebar } from "./components/Navigation/AppSidebar"
import { Dashboard } from "./components/Dashboard/Dashboard"
import { CustomerTable } from "./components/Customers/CustomerTable"
import { CustomerModal } from "./components/Customers/CustomerModal"
import { DealPipeline } from "./components/Deals/DealPipeline"
import { DealModal } from "./components/Deals/DealModal"
import { ContactTable } from "./components/Contacts/ContactTable"
import { ContactModal } from "./components/Contacts/ContactModal"
import { TaskList } from "./components/Tasks/TaskList"
import { TaskModal } from "./components/Tasks/TaskModal"
import { TaskReminders } from "./components/Tasks/TaskReminders"
import { Settings } from "./components/Settings/Settings"
import { Help } from "./components/Help/Help"

import {
  sampleCustomers,
  sampleDeals,
  sampleContacts,
  sampleActivities,
  sampleMetrics,
  sampleTasks,
  revenueData,
} from "./data/sampleData"

import type { Customer, Deal, Contact, Task } from "./types"

function App() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers)
  const [deals, setDeals] = useState<Deal[]>(sampleDeals)
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)

  // Handle GitHub Pages base path
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/small-business-crm' : ''
    if (basePath && window.location.pathname.startsWith(basePath)) {
      // Update any internal links or routing as needed
      console.log('Running on GitHub Pages with base path:', basePath)
    }
  }, [])

  // Modal states
  const [customerModal, setCustomerModal] = useState<{
    isOpen: boolean
    customer?: Customer | null
  }>({ isOpen: false, customer: null })

  const [dealModal, setDealModal] = useState<{
    isOpen: boolean
    deal?: Deal | null
  }>({ isOpen: false, deal: null })

  const [contactModal, setContactModal] = useState<{
    isOpen: boolean
    contact?: Contact | null
  }>({ isOpen: false, contact: null })

  const [taskModal, setTaskModal] = useState<{
    isOpen: boolean
    task?: Task | null
  }>({ isOpen: false, task: null })

  const { toast } = useToast()

  // Customer handlers
  const handleAddCustomer = () => {
    setCustomerModal({ isOpen: true, customer: null })
  }

  const handleEditCustomer = (customer: Customer) => {
    setCustomerModal({ isOpen: true, customer })
  }

  const handleSaveCustomer = (customerData: Omit<Customer, "id" | "createdAt">) => {
    if (customerModal.customer) {
      // Edit existing customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerModal.customer!.id ? { ...customerData, id: c.id, createdAt: c.createdAt } : c,
        ),
      )
      toast({
        title: "Customer updated",
        description: "Customer information has been successfully updated.",
      })
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setCustomers((prev) => [...prev, newCustomer])
      toast({
        title: "Customer added",
        description: "New customer has been successfully added.",
      })
    }
  }

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
    toast({
      title: "Customer deleted",
      description: "Customer has been successfully deleted.",
      variant: "destructive",
    })
  }

  // Deal handlers
  const handleAddDeal = () => {
    setDealModal({ isOpen: true, deal: null })
  }

  const handleEditDeal = (deal: Deal) => {
    setDealModal({ isOpen: true, deal })
  }

  const handleSaveDeal = (dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">) => {
    if (dealModal.deal) {
      // Edit existing deal
      setDeals((prev) =>
        prev.map((d) =>
          d.id === dealModal.deal!.id
            ? {
                ...dealData,
                id: d.id,
                createdAt: d.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : d,
        ),
      )
      toast({
        title: "Deal updated",
        description: "Deal has been successfully updated.",
      })
    } else {
      // Add new deal
      const newDeal: Deal = {
        ...dealData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDeals((prev) => [...prev, newDeal])
      toast({
        title: "Deal added",
        description: "New deal has been successfully added.",
      })
    }
  }

  const handleUpdateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)),
    )
    toast({
      title: "Deal updated",
      description: "Deal stage has been updated.",
    })
  }

  // Contact handlers
  const handleAddContact = () => {
    setContactModal({ isOpen: true, contact: null })
  }

  const handleEditContact = (contact: Contact) => {
    setContactModal({ isOpen: true, contact })
  }

  const handleSaveContact = (contactData: Omit<Contact, "id" | "createdAt">) => {
    if (contactModal.contact) {
      // Edit existing contact
      setContacts((prev) =>
        prev.map((c) => (c.id === contactModal.contact!.id ? { ...contactData, id: c.id, createdAt: c.createdAt } : c)),
      )
      toast({
        title: "Contact updated",
        description: "Contact information has been successfully updated.",
      })
    } else {
      // Add new contact
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setContacts((prev) => [...prev, newContact])
      toast({
        title: "Contact added",
        description: "New contact has been successfully added.",
      })
    }
  }

  const handleDeleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId))
    toast({
      title: "Contact deleted",
      description: "Contact has been successfully deleted.",
      variant: "destructive",
    })
  }

  // Task handlers
  const handleAddTask = () => {
    setTaskModal({ isOpen: true, task: null })
  }

  const handleEditTask = (task: Task) => {
    setTaskModal({ isOpen: true, task })
  }

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedTo" | "completedAt">,
  ) => {
    if (taskModal.task) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskModal.task!.id
            ? {
                ...taskData,
                id: t.id,
                createdAt: t.createdAt,
                updatedAt: new Date().toISOString(),
                createdBy: t.createdBy,
                assignedTo: t.assignedTo,
                completedAt: taskData.status === "completed" ? new Date().toISOString() : undefined,
              }
            : t,
        ),
      )
      toast({
        title: "Task updated",
        description: "Task has been successfully updated.",
      })
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user",
        assignedTo: "current-user",
        completedAt: taskData.status === "completed" ? new Date().toISOString() : undefined,
      }
      setTasks((prev) => [...prev, newTask])
      toast({
        title: "Task created",
        description: "New task has been successfully created.",
      })
    }
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "completed" as Task["status"],
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    )
    toast({
      title: "Task completed",
      description: "Task has been marked as completed.",
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    toast({
      title: "Task deleted",
      description: "Task has been successfully deleted.",
      variant: "destructive",
    })
  }

  const handleSnoozeReminder = (taskId: string, minutes: number) => {
    // In a real app, this would set a new reminder time
    toast({
      title: "Reminder snoozed",
      description: `Reminder snoozed for ${minutes} minutes.`,
    })
  }

  const handleDismissReminder = (taskId: string) => {
    // In a real app, this would dismiss the reminder
    toast({
      title: "Reminder dismissed",
      description: "Reminder has been dismissed.",
    })
  }

  const getBreadcrumbItems = () => {
    const items = [{ label: "Home", href: "#" }]

    switch (currentView) {
      case "dashboard":
        items.push({ label: "Dashboard", href: "#" })
        break
      case "customers":
        items.push({ label: "Customers", href: "#" })
        break
      case "deals":
        items.push({ label: "Deals", href: "#" })
        break
      case "contacts":
        items.push({ label: "Contacts", href: "#" })
        break
      case "tasks":
        items.push({ label: "Tasks", href: "#" })
        break
      case "settings":
        items.push({ label: "Settings", href: "#" })
        break
      case "help":
        items.push({ label: "Help", href: "#" })
        break
      default:
        items.push({ label: "Dashboard", href: "#" })
    }

    return items
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "customers":
        return (
          <CustomerTable
            customers={customers}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onAddCustomer={handleAddCustomer}
          />
        )
      case "deals":
        return <DealPipeline deals={deals} onUpdateDeal={handleUpdateDeal} onAddDeal={handleAddDeal} />
      case "contacts":
        return (
          <ContactTable
            contacts={contacts}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onAddContact={handleAddContact}
          />
        )
      case "tasks":
        return (
          <TaskList
            tasks={tasks}
            customers={customers}
            deals={deals}
            contacts={contacts}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
          />
        )
      case "settings":
        return <Settings />
      case "help":
        return <Help />
      default:
        return <Dashboard metrics={sampleMetrics} activities={sampleActivities} revenueData={revenueData} />
    }
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className="hidden md:block">
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{renderCurrentView()}</div>
      </SidebarInset>

      {/* Modals */}
      <CustomerModal
        isOpen={customerModal.isOpen}
        onClose={() => setCustomerModal({ isOpen: false, customer: null })}
        onSave={handleSaveCustomer}
        customer={customerModal.customer}
      />

      <DealModal
        isOpen={dealModal.isOpen}
        onClose={() => setDealModal({ isOpen: false, deal: null })}
        onSave={handleSaveDeal}
        deal={dealModal.deal}
        customers={customers}
      />

      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false, contact: null })}
        onSave={handleSaveContact}
        contact={contactModal.contact}
      />

      <TaskModal
        isOpen={taskModal.isOpen}
        onClose={() => setTaskModal({ isOpen: false, task: null })}
        onSave={handleSaveTask}
        task={taskModal.task}
        customers={customers}
        deals={deals}
        contacts={contacts}
      />

      <TaskReminders
        tasks={tasks}
        customers={customers}
        deals={deals}
        contacts={contacts}
        onCompleteTask={handleCompleteTask}
        onSnoozeReminder={handleSnoozeReminder}
        onDismissReminder={handleDismissReminder}
      />
      <Toaster />
    </SidebarProvider>
  )
}

export default App
