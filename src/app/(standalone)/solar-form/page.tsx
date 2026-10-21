import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import SolarLeadForm from '@/app/(standalone)/solar-form/SolarLeadForm';

const META_PIXEL_ID = '1725191222258757';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#F4F8F5',
};

export const metadata: Metadata = {
    title: 'मुफ्त सोलर कंसल्टेशन | Arpit Solar Shop',
    description: 'वाराणसी में अपने घर पर सोलर लगवाएं। मुफ्त कंसल्टेशन के लिए अभी फॉर्म भरें। सरकारी सब्सिडी और बिजली बचत की पूरी जानकारी।',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'मुफ्त सोलर कंसल्टेशन | Arpit Solar Shop',
        description: 'वाराणसी में अपने घर पर सोलर लगवाएं। मुफ्त कंसल्टेशन के लिए अभी फॉर्म भरें।',
        type: 'website',
        locale: 'hi_IN',
        url: 'https://www.arpitsolar.com/solar-form',
        siteName: 'Arpit Solar Shop',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Arpit Solar Shop - मुफ्त सोलर कंसल्टेशन',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'मुफ्त सोलर कंसल्टेशन | Arpit Solar Shop',
        description: 'वाराणसी में अपने घर पर सोलर लगवाएं। मुफ्त कंसल्टेशन के लिए अभी फॉर्म भरें।',
        images: ['/og-image.jpg'],
    },
    // Allow Meta crawler to see full referrer URL for better pixel attribution
    referrer: 'no-referrer-when-downgrade',
    other: {
        'fb:app_id': META_PIXEL_ID,
    },
};

export default function SolarFormPage() {
    return (
        <>
            {/* Meta Pixel Code */}
            <Script id="meta-pixel-solar-form" strategy="afterInteractive">
                {`
                    if (!window.__fbq_solar_form_initialized) {
                        window.__fbq_solar_form_initialized = true;
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
                        fbq('track', 'ViewContent', {
                            content_name: 'Solar Lead Form',
                            content_category: 'Solar Consultation',
                            content_type: 'lead_form',
                            value: 0,
                            currency: 'INR'
                        });
                    }
                `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
            {/* End Meta Pixel Code */}

            <SolarLeadForm />
        </>
    );
}
