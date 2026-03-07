"use client";

import { useEffect, useRef, useState } from "react";

interface FullWidthBlogRendererProps {
    htmlContent: string;
}

export default function FullWidthBlogRenderer({ htmlContent }: FullWidthBlogRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(3000);

    // Inject a resize script into the HTML content so the iframe reports its own height
    const contentWithResizer = htmlContent.replace(
        '</body>',
        `<script>
            (function() {
                function reportHeight() {
                    var h = Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight
                    );
                    window.parent.postMessage({ type: '__blog_iframe_height', height: h }, '*');
                }
                // Report on load
                window.addEventListener('load', function() {
                    reportHeight();
                    setTimeout(reportHeight, 500);
                    setTimeout(reportHeight, 1500);
                    setTimeout(reportHeight, 3000);
                    setTimeout(reportHeight, 5000);
                });
                // Report on resize
                window.addEventListener('resize', reportHeight);
                // Report on DOM changes
                if (typeof MutationObserver !== 'undefined') {
                    new MutationObserver(function() {
                        setTimeout(reportHeight, 100);
                    }).observe(document.body, { childList: true, subtree: true, attributes: true });
                }
                // Fallback: report every 2 seconds for 30 seconds
                var count = 0;
                var interval = setInterval(function() {
                    reportHeight();
                    count++;
                    if (count > 15) clearInterval(interval);
                }, 2000);
            })();
        </script></body>`
    );

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === '__blog_iframe_height' && typeof event.data.height === 'number') {
                const newHeight = event.data.height;
                if (newHeight > 100) {
                    setIframeHeight(prev => {
                        // Only grow or make significant changes (avoid shrink oscillation)
                        if (newHeight > prev || Math.abs(newHeight - prev) > 50) {
                            return newHeight + 20; // small buffer
                        }
                        return prev;
                    });
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <iframe
            ref={iframeRef}
            srcDoc={contentWithResizer}
            className="w-full border-0"
            style={{ height: `${iframeHeight}px`, width: '100%' }}
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            scrolling="no"
        />
    );
}
