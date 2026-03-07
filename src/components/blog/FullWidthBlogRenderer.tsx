"use client";

import { useEffect, useRef, useState } from "react";

interface FullWidthBlogRendererProps {
    htmlContent: string;
}

export default function FullWidthBlogRenderer({ htmlContent }: FullWidthBlogRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(800);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let resizeTimeout: NodeJS.Timeout | null = null;
        let lastHeight = 0;

        const resizeIframe = () => {
            if (resizeTimeout) return; // debounce
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (doc && doc.body) {
                        // Use scrollHeight of the body
                        const newHeight = Math.max(
                            doc.body.scrollHeight,
                            doc.documentElement.scrollHeight,
                            800
                        );
                        // Only update if the height changes meaningfully (avoid loop)
                        if (Math.abs(newHeight - lastHeight) > 10) {
                            lastHeight = newHeight;
                            setIframeHeight(newHeight);
                        }
                    }
                } catch (e) {
                    // Cross-origin error, skip
                }
            }, 200);
        };

        const handleLoad = () => {
            // Initial resize after a brief delay to let content render
            setTimeout(resizeIframe, 500);
            setTimeout(resizeIframe, 1500);
            setTimeout(resizeIframe, 3000);
        };

        iframe.addEventListener('load', handleLoad);

        return () => {
            iframe.removeEventListener('load', handleLoad);
            if (resizeTimeout) clearTimeout(resizeTimeout);
        };
    }, [htmlContent]);

    return (
        <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            className="w-full border-0"
            style={{ height: `${iframeHeight}px`, width: '100%', overflow: 'hidden' }}
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            scrolling="no"
        />
    );
}
