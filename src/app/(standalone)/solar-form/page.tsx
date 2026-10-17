import type { Metadata, Viewport } from 'next';
import SolarLeadForm from './SolarLeadForm';

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
    return <SolarLeadForm />;
}
