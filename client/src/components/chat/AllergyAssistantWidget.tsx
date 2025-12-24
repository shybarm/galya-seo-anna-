import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { aiAssistantQuestions, aiAssistantResponses } from "@/lib/data";
import { trackChatOpen } from "@/lib/analytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  options?: string[];
}

interface AllergyAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AllergyAssistantWidget({ isOpen, onToggle }: AllergyAssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      trackChatOpen();
      startConversation();
    }
  }, [isOpen]);

  const startConversation = () => {
    setMessages([]);
    setCurrentStep(0);
    
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "שלום! אני העוזר הדיגיטלי לעיניים. אעזור לכם להבין האם כדאי לפנות לבדיקה מקצועית. נתחיל?",
      };
      setMessages([welcomeMessage]);

      setTimeout(() => {
        askQuestion(0);
      }, 1000);
    }, 500);
  };

  const askQuestion = (stepIndex: number) => {
    if (stepIndex >= aiAssistantQuestions.length) {
      provideRecommendation();
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const question = aiAssistantQuestions[stepIndex];
      const questionMessage: Message = {
        id: `q-${stepIndex}`,
        role: "assistant",
        content: question.question,
        options: question.options,
      };
      setMessages((prev) => [...prev, questionMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: option,
    };
    setMessages((prev) => [...prev, userMessage]);

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (option.includes("קוצר נשימה חמור") || option.includes("נפיחות בלשון") || option.includes("עילפון")) {
      provideEmergencyResponse();
    } else {
      setTimeout(() => {
        askQuestion(nextStep);
      }, 500);
    }
  };

  const provideEmergencyResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const emergencyMessage: Message = {
        id: "emergency",
        role: "assistant",
        content: aiAssistantResponses.emergency,
      };
      setMessages((prev) => [...prev, emergencyMessage]);
      setIsTyping(false);
    }, 800);
  };

  const provideRecommendation = () => {
    setIsTyping(true);
    setTimeout(() => {
      const recommendationMessage: Message = {
        id: "recommendation",
        role: "assistant",
        content: aiAssistantResponses.routine,
      };
      setMessages((prev) => [...prev, recommendationMessage]);

      setTimeout(() => {
        const ctaMessage: Message = {
          id: "cta",
          role: "assistant",
          content: "רוצים לקבוע תור עם ד״ר אנה ברמלי?",
          options: ["כן, אשמח לקבוע תור", "תודה, אחזור מאוחר יותר"],
        };
        setMessages((prev) => [...prev, ctaMessage]);
        setIsTyping(false);
      }, 1000);
    }, 800);
  };

  const handleCtaOption = (option: string) => {
    const userMessage: Message = {
      id: `u-cta-${Date.now()}`,
      role: "user",
      content: option,
    };
    setMessages((prev) => [...prev, userMessage]);

    if (option.includes("כן")) {
      setTimeout(() => {
        const contactElement = document.querySelector("#contact");
        if (contactElement) {
          onToggle();
          contactElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } else {
      setTimeout(() => {
        const thankYouMessage: Message = {
          id: "thankyou",
          role: "assistant",
          content: "תודה! אם תצטרכו עזרה נוספת, אני כאן. שמרו על עצמכם!",
        };
        setMessages((prev) => [...prev, thankYouMessage]);
      }, 500);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    setIsTyping(true);
    setTimeout(() => {
      const responseMessage: Message = {
        id: `r-${Date.now()}`,
        role: "assistant",
        content: aiAssistantResponses.default,
      };
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentStep(0);
    startConversation();
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onToggle}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            data-testid="button-chat-fab"
            aria-label="פתח עוזר דיגיטלי"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96"
            data-testid="panel-chat"
          >
            <Card className="flex flex-col h-[500px] max-h-[80vh] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heebo font-semibold text-foreground text-sm">
                      העוזר הדיגיטלי לעיניים
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      מענה מיידי
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  data-testid="button-chat-close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-border">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  הכלי אינו תחליף לייעוץ רפואי
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[85%] ${
                        message.role === "user" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-muted"
                            : "bg-primary/10"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-muted text-foreground"
                              : "bg-primary/10 text-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        {message.options && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  if (message.id === "cta") {
                                    handleCtaOption(option);
                                  } else {
                                    handleOptionSelect(option);
                                  }
                                }}
                                className="text-xs px-3 py-2 bg-card border border-border rounded-md hover:bg-muted transition-colors text-right"
                                data-testid={`button-chat-option-${index}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetConversation}
                    className="text-xs"
                    data-testid="button-chat-restart"
                  >
                    <ArrowRight className="w-4 h-4 ml-1" />
                    התחל מחדש
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      placeholder="הקלד הודעה..."
                      className="text-sm"
                      data-testid="input-chat-message"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!userInput.trim()}
                      data-testid="button-chat-send"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
