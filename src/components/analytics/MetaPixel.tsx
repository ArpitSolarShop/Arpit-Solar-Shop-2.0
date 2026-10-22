"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

export const META_PIXEL_ID = "1725191222258757";

export default function MetaPixel() {
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip first render because the initial script execution tracks the first PageView
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Track route changes on client-side SPA navigation
        if (typeof window !== "undefined" && typeof (window as unknown as { fbq?: Function }).fbq === "function") {
            try {
                (window as unknown as { fbq: Function }).fbq("track", "PageView");
            } catch {
                // Ignore tracking errors
            }
        }
    }, [pathname]);

    if (pathname === '/solar-form') {
        return null;
    }

    return (
        <>
            <Script
                id="meta-pixel-base"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        // Safety shim for Meta Event Setup Tool (iwl.js) which calls getBoundingClientRect on non-element nodes
                        if (typeof EventTarget !== 'undefined' && !EventTarget.prototype.getBoundingClientRect) {
                            EventTarget.prototype.getBoundingClientRect = function() {
                                return (this && this.parentElement && typeof this.parentElement.getBoundingClientRect === 'function')
                                    ? this.parentElement.getBoundingClientRect()
                                    : { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
                            };
                        }
                        if (typeof Node !== 'undefined' && !Node.prototype.getBoundingClientRect) {
                            Node.prototype.getBoundingClientRect = function() {
                                return this.parentElement?.getBoundingClientRect() || { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
                            };
                        }
                        if (typeof window !== 'undefined' && !window.getBoundingClientRect) {
                            window.getBoundingClientRect = function() {
                                return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight, x: 0, y: 0 };
                            };
                        }

                        if (!window.__fbq_global_initialized) {
                            window.__fbq_global_initialized = true;
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${META_PIXEL_ID}');
                            fbq('track', 'PageView');
                        }
                    `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}
