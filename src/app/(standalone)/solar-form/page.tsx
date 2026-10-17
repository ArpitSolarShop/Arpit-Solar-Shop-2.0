import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import SolarLeadForm from '@/app/(standalone)/solar-form/SolarLeadForm';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#F4F8F5',
};

export const metadata: Metadata = {
    title: 'मुफ्त सोलर कंसल्टेशन | Arpit Solar Shop',
    description: 'वाराणसी में अपने घर पर सोलर लगवाएं। मुफ्त कंसल्टेशन के लिए अभी फॉर्म भरें। सरकारी सब्सिडी और बिजली बचत की पूरी जानकारी।',
    robots: 'index, follow',
    openGraph: {
        title: 'मुफ्त सोलर कंसल्टेशन | Arpit Solar Shop',
        description: 'वाराणसी में अपने घर पर सोलर लगवाएं। मुफ्त कंसल्टेशन के लिए अभी फॉर्म भरें।',
        type: 'website',
    },
};

export default function SolarFormPage() {
    return (
        <>
            {/* Meta Pixel Code */}
            <Script id="meta-pixel-solar-form" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '1725191222258757');
                    fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1725191222258757&ev=PageView&noscript=1"
                    alt=""
                />
            </noscript>
            {/* End Meta Pixel Code */}

            <SolarLeadForm />
        </>
    );
}
