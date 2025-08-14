import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Star,
  HelpCircle,
  FileText,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Users,
  Target,
  UserPlus,
  CheckSquare,
  Settings,
  Zap
} from "lucide-react"

export function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using your CRM",
      articles: [
        { title: "Welcome to BusinessCRM", readTime: "3 min", difficulty: "Beginner" },
        { title: "Setting up your first customer", readTime: "5 min", difficulty: "Beginner" },
        { title: "Creating your first deal", readTime: "4 min", difficulty: "Beginner" },
        { title: "Adding contacts to your CRM", readTime: "3 min", difficulty: "Beginner" }
      ]
    },
    {
      id: "customers",
      title: "Customer Management",
      icon: Users,
      description: "Everything about managing your customers",
      articles: [
        { title: "Adding new customers", readTime: "4 min", difficulty: "Beginner" },
        { title: "Customer segmentation", readTime: "6 min", difficulty: "Intermediate" },
        { title: "Customer lifecycle management", readTime: "8 min", difficulty: "Advanced" },
        { title: "Customer analytics and reporting", readTime: "7 min", difficulty: "Intermediate" }
      ]
    },
    {
      id: "deals",
      title: "Deal Pipeline",
      icon: Target,
      description: "Managing your sales pipeline and deals",
      articles: [
        { title: "Understanding deal stages", readTime: "4 min", difficulty: "Beginner" },
        { title: "Creating and managing deals", readTime: "5 min", difficulty: "Beginner" },
        { title: "Deal forecasting and analytics", readTime: "6 min", difficulty: "Intermediate" },
        { title: "Advanced deal strategies", readTime: "8 min", difficulty: "Advanced" }
      ]
    },
    {
      id: "contacts",
      title: "Contact Management",
      icon: UserPlus,
      description: "Managing your business contacts and leads",
      articles: [
        { title: "Adding and organizing contacts", readTime: "3 min", difficulty: "Beginner" },
        { title: "Lead scoring and qualification", readTime: "5 min", difficulty: "Intermediate" },
        { title: "Contact import and export", readTime: "4 min", difficulty: "Intermediate" },
        { title: "Contact automation workflows", readTime: "7 min", difficulty: "Advanced" }
      ]
    },
    {
      id: "tasks",
      title: "Task Management",
      icon: CheckSquare,
      description: "Organizing and tracking your tasks",
      articles: [
        { title: "Creating and assigning tasks", readTime: "3 min", difficulty: "Beginner" },
        { title: "Task reminders and notifications", readTime: "4 min", difficulty: "Beginner" },
        { title: "Task templates and automation", readTime: "6 min", difficulty: "Intermediate" },
        { title: "Team task collaboration", readTime: "5 min", difficulty: "Intermediate" }
      ]
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Zap,
      description: "Connecting with other tools and services",
      articles: [
        { title: "Email integration setup", readTime: "5 min", difficulty: "Intermediate" },
        { title: "Calendar synchronization", readTime: "4 min", difficulty: "Intermediate" },
        { title: "Payment gateway connections", readTime: "6 min", difficulty: "Advanced" },
        { title: "API and webhook setup", readTime: "8 min", difficulty: "Advanced" }
      ]
    }
  ]

  const videoTutorials = [
    {
      title: "CRM Overview Tour",
      duration: "12:34",
      thumbnail: "/placeholder.jpg",
      description: "Take a complete tour of your CRM dashboard and main features"
    },
    {
      title: "Customer Management Deep Dive",
      duration: "18:45",
      thumbnail: "/placeholder.jpg",
      description: "Learn advanced customer management techniques and best practices"
    },
    {
      title: "Deal Pipeline Optimization",
      duration: "15:22",
      thumbnail: "/placeholder.jpg",
      description: "Optimize your sales pipeline for maximum conversion rates"
    },
    {
      title: "Task Automation Setup",
      duration: "10:18",
      thumbnail: "/placeholder.jpg",
      description: "Set up automated task workflows to save time and improve efficiency"
    }
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by going to Settings > Security and clicking 'Change Password'. You'll receive an email with a reset link."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Go to Settings > Data & Export and click 'Export Data'. You can export in CSV, Excel, or JSON formats."
    },
    {
      question: "How do I add team members?",
      answer: "Team management is available in the Enterprise plan. Contact our sales team to upgrade and add team members to your CRM."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures. Your data is backed up daily and stored in secure, SOC 2 compliant data centers."
    },
    {
      question: "Can I customize the deal pipeline stages?",
      answer: "Yes! Go to Settings > Deal Pipeline to customize your pipeline stages, add new ones, or modify existing ones to match your sales process."
    }
  ]

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedCategoryData = helpCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help Center</h2>
        <p className="text-muted-foreground">Find answers to your questions and learn how to use your CRM effectively.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for help articles, tutorials, or FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Help Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Getting Started Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>
                New to BusinessCRM? Start here to learn the basics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {helpCategories[0].articles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                        <Badge variant="secondary" className="text-xs">{article.difficulty}</Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch step-by-step tutorials to master your CRM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {videoTutorials.map((tutorial, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                      <PlayCircle className="h-12 w-12 text-muted-foreground" />
                      <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                        {tutorial.duration}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">{tutorial.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Watch Tutorial
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Frequently Asked Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions about your CRM.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-sm">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  {index < faqs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Help Categories Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{category.title}</p>
                      <p className="text-xs opacity-80">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need More Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button className="w-full" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <p>Response time: Usually within 2 hours</p>
                <p className="flex items-center justify-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 customer satisfaction</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Download User Manual
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Knowledge Base
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <PlayCircle className="h-4 w-4 mr-2" />
                Training Videos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Category Articles */}
      {selectedCategoryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedCategoryData.icon className="h-5 w-5" />
              {selectedCategoryData.title}
            </CardTitle>
            <CardDescription>
              {selectedCategoryData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedCategoryData.articles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <h4 className="font-medium">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      <Badge variant="secondary" className="text-xs">{article.difficulty}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
