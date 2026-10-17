import type { Metadata, Viewport } from 'next';
import FeedbackForm from './FeedbackForm';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#1B5445',
};

export const metadata: Metadata = {
    title: 'सोलर इंस्टॉलेशन फीडबैक फॉर्म | Arpit Solar Shop',
    description: 'क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड (Arpit Solar Shop) सोलर इंस्टॉलेशन फीडबैक फॉर्म। कृपया अपने 7 चरणों के अनुभव को 1 से 5 स्टार रेटिंग दें।',
    robots: 'index, follow',
    openGraph: {
        title: 'सोलर इंस्टॉलेशन फीडबैक फॉर्म | Arpit Solar Shop',
        description: 'क्रिशननुजा रेन्यूएबल्स (Arpit Solar Shop) के साथ अपने सोलर इंस्टॉलेशन अनुभव का मूल्यांकन करें।',
        type: 'website',
    },
};

export default function FeedbackPage() {
    return <FeedbackForm />;
}
