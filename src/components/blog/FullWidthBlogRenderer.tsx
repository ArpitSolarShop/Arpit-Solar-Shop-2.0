"use client";

import { useEffect, useRef, useState } from "react";

interface FullWidthBlogRendererProps {
    htmlContent: string;
}

export default function FullWidthBlogRenderer({ htmlContent }: FullWidthBlogRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(4000);

    // Process content: strip viewport-relative classes that cause infinite loops
    // and inject a postMessage-based height reporter
    const processedContent = (() => {
        let content = htmlContent;

        // Remove viewport-relative classes that cause infinite height loops in iframes
        // min-h-screen = min-height: 100vh, h-screen = height: 100vh
        content = content.replace(/\bmin-h-screen\b/g, '');
        content = content.replace(/\bh-screen\b/g, '');

        // Inject height reporter before </body>
        const resizeScript = `<script>
            (function() {
                var lastReported = 0;
                function reportHeight() {
                    var h = Math.max(
                        document.body.scrollHeight || 0,
                        document.body.offsetHeight || 0,
                        document.documentElement.scrollHeight || 0,
                        document.documentElement.offsetHeight || 0
                    );
                    // Only report if height changed meaningfully
                    if (Math.abs(h - lastReported) > 10) {
                        lastReported = h;
                        window.parent.postMessage({ type: '__blog_height', height: h }, '*');
                    }
                }
                // Report after load and Tailwind compilation
                if (document.readyState === 'complete') {
                    reportHeight();
                } else {
                    window.addEventListener('load', function() {
                        reportHeight();
                        setTimeout(reportHeight, 500);
                        setTimeout(reportHeight, 1500);
                        setTimeout(reportHeight, 3000);
                        setTimeout(reportHeight, 5000);
                    });
                }
                // Periodic check for first 20 seconds
                var count = 0;
                var interval = setInterval(function() {
                    reportHeight();
                    if (++count >= 10) clearInterval(interval);
                }, 2000);
            })();
        </script>`;

        if (content.includes('</body>')) {
            content = content.replace('</body>', resizeScript + '</body>');
        } else {
            content += resizeScript;
        }

        return content;
    })();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === '__blog_height' && typeof event.data.height === 'number') {
                const h = event.data.height;
                if (h > 100 && h < 50000) { // sanity check - cap at 50000px
                    setIframeHeight(h + 30); // small buffer for padding
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <iframe
            ref={iframeRef}
            srcDoc={processedContent}
            className="w-full border-0"
            style={{ height: `${iframeHeight}px`, width: '100%' }}
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            scrolling="no"
        />
    );
}
