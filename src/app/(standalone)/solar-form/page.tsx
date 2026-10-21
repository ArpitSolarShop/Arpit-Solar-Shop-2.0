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
            {/* Meta Pixel ViewContent for Solar Form */}
            <Script id="meta-pixel-solar-form-viewcontent" strategy="afterInteractive">
                {`
                    if (!window.__fbq_solar_form_viewcontent_fired) {
                        window.__fbq_solar_form_viewcontent_fired = true;
                        window.fbq = window.fbq || function(){(window.fbq.q=window.fbq.q||[]).push(arguments)};
                        window.fbq('track', 'ViewContent', {
                            content_name: 'Solar Lead Form',
                            content_category: 'Solar Consultation',
                            content_type: 'lead_form',
                            value: 0,
                            currency: 'INR'
                        });
                    }
                `}
            </Script>
            {/* End Meta Pixel Code */}

            <SolarLeadForm />
        </>
    );
}
