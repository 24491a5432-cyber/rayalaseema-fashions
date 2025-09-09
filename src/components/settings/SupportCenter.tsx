import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HeadphonesIcon, MessageCircle, HelpCircle, Search, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response?: string;
  created_at: string;
}

const SupportCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "medium" as const
  });

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data || []) as SupportTicket[]);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Generate ticket number
      const ticketNumber = `TKT-${Date.now()}`;
      
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          ticket_number: ticketNumber,
          subject: newTicket.subject,
          message: newTicket.message,
          priority: newTicket.priority
        });

      if (error) throw error;

      toast({
        title: "Ticket Created",
        description: `Your support ticket ${ticketNumber} has been created. We'll respond within 24 hours.`
      });

      setNewTicket({ subject: "", message: "", priority: "medium" });
      fetchTickets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const faqData = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by visiting the 'Orders' section in your account settings. There you'll find real-time updates on your order status, shipping information, and estimated delivery dates."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all items. Products must be unused, in original packaging, and with all tags attached. To initiate a return, contact our support team or use the return option in your order history."
    },
    {
      question: "How do I change my shipping address?",
      answer: "You can update your shipping address in the 'Addresses' section of your account settings. For orders already placed, contact support immediately to modify the shipping address if the order hasn't been processed yet."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, net banking, and UPI payments through our secure Razorpay integration. All transactions are encrypted and secure."
    },
    {
      question: "How is GST calculated on my orders?",
      answer: "GST is calculated based on your shipping address. For Andhra Pradesh addresses, we apply local GST rates. For other Indian states, IGST is applied. International orders may have different tax calculations."
    },
    {
      question: "How can I cancel my order?",
      answer: "Orders can be cancelled within 1 hour of placing them if they haven't entered the processing stage. You can cancel orders from your order history or by contacting our support team immediately."
    }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <HeadphonesIcon className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-medium mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mon-Fri, 9 AM - 6 PM IST
            </p>
            <p className="font-semibold">+91 12345 67890</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant help from our team
            </p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <HelpCircle className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-medium mb-2">Help Center</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find answers to common questions
            </p>
            <Button variant="outline" className="w-full">
              Browse FAQs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create New Ticket */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Support Ticket
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Submit a support ticket and we'll help you out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as any })}
                >
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

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Please provide details about your issue..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating Ticket..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>My Support Tickets</CardTitle>
          <CardDescription>
            Track the status of your support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <HeadphonesIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No support tickets yet</p>
                <p className="text-sm text-muted-foreground">Create your first ticket above if you need help</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{ticket.ticket_number}</h4>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h5 className="font-medium mb-2">{ticket.subject}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{ticket.message}</p>
                  
                  {ticket.admin_response && (
                    <div className="p-3 bg-muted/50 rounded border-l-4 border-primary">
                      <h6 className="font-medium text-sm mb-1">Support Response:</h6>
                      <p className="text-sm">{ticket.admin_response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFAQs.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No FAQs found matching your search</p>
              <p className="text-sm text-muted-foreground">Try a different search term or create a support ticket</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportCenter;