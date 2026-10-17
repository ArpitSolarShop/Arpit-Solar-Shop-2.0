import type { Metadata, Viewport } from 'next';
import FeedbackForm from '../feedback/FeedbackForm';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#1B5445',
};

export const metadata: Metadata = {
    title: 'सोलर इंस्टॉलेशन फीडबैक फॉर्म | Arpit Solar Shop',
    description: 'क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड (Arpit Solar Shop) सोलर इंस्टॉलेशन फीडबैक फॉर्म।',
};

export default function SolarFeedbackPage() {
    return <FeedbackForm />;
}
