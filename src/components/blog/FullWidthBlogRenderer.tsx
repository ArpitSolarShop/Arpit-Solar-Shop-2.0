"use client";

import { useEffect, useRef } from "react";

interface FullWidthBlogRendererProps {
    htmlContent: string;
}

export default function FullWidthBlogRenderer({ htmlContent }: FullWidthBlogRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const resizeIframe = () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    const height = doc.documentElement.scrollHeight || doc.body.scrollHeight;
                    iframe.style.height = height + 'px';
                }
            } catch (e) {
                // Cross-origin error, skip
            }
        };

        iframe.addEventListener('load', () => {
            resizeIframe();
            // Observe for dynamic content changes (e.g. tab switches, animations)
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    const observer = new MutationObserver(resizeIframe);
                    observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
                    // Also listen for window resize inside iframe
                    iframe.contentWindow?.addEventListener('resize', resizeIframe);
                }
            } catch (e) { /* ignore */ }
        });

        // Fallback: poll for height changes
        const interval = setInterval(resizeIframe, 1000);

        return () => clearInterval(interval);
    }, [htmlContent]);

    return (
        <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            className="w-full border-0"
            style={{ minHeight: '100vh', width: '100%' }}
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
    );
}
