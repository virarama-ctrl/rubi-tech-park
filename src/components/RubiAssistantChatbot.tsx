import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Code2,
  ExternalLink,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isEnquiryConfirmation?: boolean;
  enquiryData?: any;
}

export const RubiAssistantChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `Hello! I am **RUBI Assistant**, your digital solutions and compliance consultant for **RUBI TECH PARK**.\n\nHow can I help you today? You can ask me about:\n• **Software Development** (Websites, E-Commerce, Custom CRM, Billing, Apps)\n• **Statutory & Compliance** (GST, ITR, MSME, FSSAI, Trademarks)\n• **Citizen E-Services** (PAN, Voter ID, Passport, Ration Card — ₹236 initial booking deposit)\n\nFeel free to type your question or pick an option below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [activeFormStep, setActiveFormStep] = useState<
    'none' | 'name' | 'phone' | 'email' | 'category' | 'service' | 'requirement' | 'confirm'
  >('none');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Software Development & Digital Solutions',
    service: '',
    requirement: '',
    customerType: 'Business'
  });

  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    whatsappUrl?: string;
    isEService?: boolean;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessageToApi = async (userText: string) => {
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.sender === 'user' || m.sender === 'assistant')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I've noted that. How else may I assist with your software or compliance needs?";

      const botMsg: Message = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `I'm having a brief connection hitch. You can also chat directly with our team on WhatsApp at +91 82205 50829!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const txt = inputMessage.trim();
    setInputMessage('');
    sendMessageToApi(txt);
  };

  const handleQuickOption = (prompt: string) => {
    sendMessageToApi(prompt);
  };

  const startLeadCapture = (categoryPref: string) => {
    setFormData((prev) => ({ ...prev, category: categoryPref }));
    setActiveFormStep('name');
    const promptMsg: Message = {
      id: `step_${Date.now()}`,
      sender: 'assistant',
      text: `Great choice! I will help you register an official enquiry for **${categoryPref}**.\n\nFirst, what is your **Full Name**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, promptMsg]);
  };

  const submitFinalEnquiry = async () => {
    setIsLoading(true);
    try {
      const isEService = formData.category.toLowerCase().includes('e-service');
      const payload = {
        fullName: formData.name,
        phone: formData.phone,
        whatsappNumber: formData.phone,
        email: formData.email,
        customerType: formData.customerType,
        serviceCategory: formData.category,
        selectedService: formData.service || formData.category,
        projectDescription: formData.requirement,
        source: 'Chatbot',
        isEService,
        bookingAmount: isEService ? 236 : undefined,
        bookingPaymentStatus: isEService ? 'Pending' : undefined
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult({
          referenceId: data.referenceId,
          whatsappUrl: data.whatsappNotificationUrl,
          isEService
        });

        const successText = isEService
          ? `Your E-Service booking request has been registered under Reference ID: **${data.referenceId}**!\n\n**Booking Fee Rule:**\n• Base Booking Charge: ₹200\n• 18% GST: ₹36\n• Total Initial Booking Amount: **₹236** (Payment Status: Pending Verification)\n\n*Remaining service charges will be communicated after reviewing requirements and collected after completion of the work.*\n\nClick below to forward your booking directly to our WhatsApp support team!`
          : `Thank you, ${formData.name}! Your enquiry has been officially registered with Reference ID: **${data.referenceId}**.\n\nOur team has received your brief and will connect with you shortly with a personalized quotation and scope breakdown.`;

        setMessages((prev) => [
          ...prev,
          {
            id: `sub_${Date.now()}`,
            sender: 'assistant',
            text: successText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEnquiryConfirmation: true,
            enquiryData: {
              referenceId: data.referenceId,
              whatsappUrl: data.whatsappNotificationUrl
            }
          }
        ]);
        setActiveFormStep('none');
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `Could not save enquiry automatically: ${err.message}. You can reach us directly on WhatsApp at +91 82205 50829.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-24 right-6 z-50 flex items-center group">
        <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-medium border border-purple-500/40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
          Chat with RUBI Assistant (Gemini AI)
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open RUBI AI Assistant"
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-purple-500/30 cursor-pointer"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center animate-pulse" />
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] sm:max-h-[640px] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 px-4 py-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm tracking-wide">RUBI Assistant</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/50 text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-purple-200">Software & Statutory Consultant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="https://wa.me/918220550829"
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp Support"
                className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="bg-purple-50 dark:bg-slate-800/80 px-3 py-2 border-b border-purple-100 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => startLeadCapture('Software Development & Digital Solutions')}
              className="px-2.5 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium whitespace-nowrap shadow-xs transition-colors flex items-center gap-1"
            >
              <Code2 className="w-3 h-3" />
              Software Quote
            </button>
            <button
              onClick={() => startLeadCapture('Statutory & Compliance Services')}
              className="px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium whitespace-nowrap shadow-xs transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              GST / Compliance
            </button>
            <button
              onClick={() => startLeadCapture('E-Services (Citizen Services)')}
              className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium whitespace-nowrap shadow-xs transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              E-Service (₹236)
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{m.text}</p>

                  {m.isEnquiryConfirmation && m.enquiryData?.whatsappUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                      <a
                        href={m.enquiryData.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Send to WhatsApp Support (+91 82205 50829)
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {/* In-chat interactive lead capture wizard if triggered */}
            {activeFormStep !== 'none' && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-800/50 space-y-3 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Quick Enquiry Form
                  </h4>
                  <button
                    onClick={() => setActiveFormStep('none')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit number"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    >
                      <option value="Software Development & Digital Solutions">Software Development & Digital Solutions</option>
                      <option value="Statutory & Compliance Services">Statutory & Compliance Services</option>
                      <option value="E-Services (Citizen Services)">E-Services (Citizen Services — ₹236 booking)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Requirement Details *
                    </label>
                    <textarea
                      rows={2}
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="Describe your project, registration or service requirement..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {formData.category.includes('E-Services') && (
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200">
                      <strong>E-Service Booking Notice:</strong> Booking fee is ₹236 (₹200 + 18% GST ₹36). Remaining service charges communicated upon reviewing scope.
                    </div>
                  )}

                  <button
                    onClick={submitFinalEnquiry}
                    disabled={!formData.name || !formData.phone || !formData.email || isLoading}
                    className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? 'Submitting...' : 'Confirm & Submit Enquiry'}
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">RUBI Assistant is composing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3 py-1.5 bg-slate-100/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600 dark:text-slate-400 no-scrollbar">
            <button
              onClick={() => handleQuickOption('What is the ₹236 booking fee for E-Services?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:text-purple-600 whitespace-nowrap"
            >
              ₹236 E-Service rule?
            </button>
            <button
              onClick={() => handleQuickOption('Do you provide GST Return Filing and FSSAI licences?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:text-purple-600 whitespace-nowrap"
            >
              GST & FSSAI licences?
            </button>
            <button
              onClick={() => handleQuickOption('Can you build a custom CRM and E-commerce website?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:text-purple-600 whitespace-nowrap"
            >
              Custom CRM & Store?
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about software, GST, or e-services..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white shadow-md transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
