"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, DollarSign } from "lucide-react"
import type { Deal } from "../../types"

interface DealPipelineProps {
  deals: Deal[]
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void
  onAddDeal: () => void
}

const stages = [
  { id: "lead", name: "Lead", color: "bg-gray-100" },
  { id: "qualified", name: "Qualified", color: "bg-blue-100" },
  { id: "proposal", name: "Proposal", color: "bg-yellow-100" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-100" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
  { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
]

export function DealPipeline({ deals, onUpdateDeal, onAddDeal }: DealPipelineProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onUpdateDeal(draggedDeal.id, {
        stage: targetStage as Deal["stage"],
        updatedAt: new Date().toISOString(),
      })
    }
    setDraggedDeal(null)
  }

  const getDealsByStage = (stage: string) => {
    return deals.filter((deal) => deal.stage === stage)
  }

  const getStageTotal = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600"
    if (probability >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deal Pipeline</h2>
          <p className="text-muted-foreground">
            Track your deals through the sales process with drag-and-drop functionality.
          </p>
        </div>
        <Button onClick={onAddDeal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageTotal = getStageTotal(stage.id)

          return (
            <div
              key={stage.id}
              className={`${stage.color} rounded-lg p-4 min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <div className="text-sm text-gray-600">
                  {stageDeals.length} deals • ${stageTotal.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm leading-tight">{deal.title}</h4>
                        <p className="text-xs text-gray-600">{deal.company}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <DollarSign className="h-3 w-3 mr-1" />${deal.value.toLocaleString()}
                          </div>
                          <Badge variant="outline" className={`text-xs ${getProbabilityColor(deal.probability)}`}>
                            {deal.probability}%
                          </Badge>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(deal.expectedCloseDate)}
                        </div>

                        {deal.notes && <p className="text-xs text-gray-600 line-clamp-2">{deal.notes}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
