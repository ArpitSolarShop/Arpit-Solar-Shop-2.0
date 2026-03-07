"use client";

import { useEffect, useRef, useState } from "react";

interface FullWidthBlogRendererProps {
    htmlContent: string;
}

export default function FullWidthBlogRenderer({ htmlContent }: FullWidthBlogRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(2000);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let lastHeight = 0;
        let resizing = false;

        const resizeIframe = () => {
            if (resizing) return;
            resizing = true;

            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc && doc.body) {
                    // Get the true content height
                    const bodyHeight = doc.body.scrollHeight;
                    const docHeight = doc.documentElement.scrollHeight;
                    const newHeight = Math.max(bodyHeight, docHeight, 800);

                    // Only update if the height actually changed meaningfully
                    if (Math.abs(newHeight - lastHeight) > 20) {
                        lastHeight = newHeight;
                        setIframeHeight(newHeight);
                    }
                }
            } catch (e) {
                // Cross-origin error, skip
            }

            // Release lock after a delay to prevent rapid-fire
            setTimeout(() => {
                resizing = false;
            }, 500);
        };

        const handleLoad = () => {
            // After load, wait for Tailwind CDN to compile and render
            setTimeout(resizeIframe, 300);
            setTimeout(resizeIframe, 1000);
            setTimeout(resizeIframe, 2000);
            setTimeout(resizeIframe, 4000);
        };

        iframe.addEventListener('load', handleLoad);

        return () => {
            iframe.removeEventListener('load', handleLoad);
        };
    }, [htmlContent]);

    return (
        <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            className="w-full border-0"
            style={{ height: `${iframeHeight}px`, width: '100%' }}
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            scrolling="no"
        />
    );
}
