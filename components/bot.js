import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../utilities/i18n";

function CustomChatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: t("bot.welcome") },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: t("bot.welcome") }]);
  }, [language, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const history = useMemo(
    () => messages.slice(-8).map((msg) => ({ role: msg.role, content: msg.content })),
    [messages]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language, history }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: t("bot.error") }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      {isOpen && (
        <div className="mb-3 w-[280px] sm:w-[320px] rounded-2xl border border-[#16A34A]/20 bg-white shadow-2xl overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-[#16A34A] to-[#15803d] px-4 py-3 text-white font-semibold text-sm flex justify-between items-center">
            <span>{t("bot.title")}</span>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="h-[320px] overflow-y-auto bg-[#F7FFF9] p-3 space-y-2">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-[#16A34A] text-white"
                    : "bg-white text-[#1F2937] border border-gray-100"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-white text-[#1F2937] border border-gray-100">
                ...
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder={t("bot.placeholder")}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="rounded-lg bg-[#16A34A] text-white px-3 py-2 text-sm font-semibold hover:bg-[#15803d] disabled:opacity-70"
            >
              {t("bot.send")}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803d] text-white shadow-xl text-xl"
        aria-label="Open chatbot"
      >
        {isOpen ? "-" : "AI"}
      </button>
    </div>
  );
}

export default CustomChatbot;