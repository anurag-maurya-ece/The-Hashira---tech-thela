import { useEffect, useRef } from "react";
import { getTargetLanguageName, useLanguage } from "../utilities/i18n";

const MAX_BATCH_SIZE = 80;

function isTranslatableText(text) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/^[\d\W_]+$/.test(trimmed)) return false;
  return trimmed.length > 0;
}

function shouldSkipNode(textNode) {
  const parent = textNode.parentElement;
  if (!parent) return true;
  const tag = parent.tagName;
  if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"].includes(tag)) return true;
  if (parent.closest("[data-no-translate='true']")) return true;
  return false;
}

async function fetchTranslations(texts, targetLanguage, targetLanguageCode) {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, targetLanguage, targetLanguageCode }),
  });

  const data = await response.json();
  if (!response.ok || !Array.isArray(data.translations)) {
    return { translations: texts, translated: false };
  }
  return {
    translations: data.translations,
    translated: Boolean(data.translated),
    reason: data.reason,
  };
}

export default function GlobalAutoTranslator() {
  const { language } = useLanguage();
  const observerRef = useRef(null);
  const isApplyingRef = useRef(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const applyTranslation = async () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (cancelled || shouldSkipNode(node)) continue;
        const original = node.__ttaiOriginalText ?? node.textContent;
        if (!isTranslatableText(original)) continue;
        node.__ttaiOriginalText = original;
        textNodes.push(node);
      }

      const attrTargets = [];
      const attrElements = document.querySelectorAll("[placeholder], [title], [aria-label]");
      attrElements.forEach((element) => {
        ["placeholder", "title", "aria-label"].forEach((attr) => {
          const originalAttr = element.getAttribute(`data-ttai-original-${attr}`) ?? element.getAttribute(attr);
          if (!isTranslatableText(originalAttr)) return;
          if (!element.getAttribute(`data-ttai-original-${attr}`)) {
            element.setAttribute(`data-ttai-original-${attr}`, originalAttr);
          }
          attrTargets.push({ element, attr, value: originalAttr });
        });
      });

      if (language === "en") {
        textNodes.forEach((node) => {
          if (node.__ttaiOriginalText) {
            node.textContent = node.__ttaiOriginalText;
          }
        });
        attrTargets.forEach(({ element, attr }) => {
          const originalValue = element.getAttribute(`data-ttai-original-${attr}`);
          if (originalValue) element.setAttribute(attr, originalValue);
        });
        return;
      }

      const targetLanguage = getTargetLanguageName(language);
      let canApplyAutoTranslation = true;

      for (let i = 0; i < textNodes.length; i += MAX_BATCH_SIZE) {
        const chunk = textNodes.slice(i, i + MAX_BATCH_SIZE);
        const sourceTexts = chunk.map((node) => node.__ttaiOriginalText);
        const result = await fetchTranslations(sourceTexts, targetLanguage, language);
        if (cancelled) return;
        
        // Apply whatever we got (partial success is better than none)
        chunk.forEach((node, idx) => {
          node.textContent = result.translations[idx] || node.__ttaiOriginalText;
        });
      }

      const attrTextValues = attrTargets.map((item) => item.value);
      for (let i = 0; i < attrTextValues.length; i += MAX_BATCH_SIZE) {
        const values = attrTextValues.slice(i, i + MAX_BATCH_SIZE);
        const result = await fetchTranslations(values, targetLanguage, language);
        if (cancelled) return;

        result.translations.forEach((translatedText, idx) => {
          const target = attrTargets[i + idx];
          if (target) {
            target.element.setAttribute(target.attr, translatedText || target.value);
          }
        });
      }
    };

    const schedule = () => {
      if (isApplyingRef.current) {
        pendingRef.current = true;
        return;
      }

      const run = async () => {
        isApplyingRef.current = true;
        try {
          await applyTranslation();
        } finally {
          isApplyingRef.current = false;
          if (pendingRef.current) {
            pendingRef.current = false;
            schedule();
          }
        }
      };

      window.requestIdleCallback?.(() => run()) || setTimeout(run, 50);
    };

    schedule();

    const observer = new MutationObserver(() => schedule());
    observer.observe(document.body, { childList: true, subtree: true });
    observerRef.current = observer;

    return () => {
      cancelled = true;
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [language]);

  return null;
}
