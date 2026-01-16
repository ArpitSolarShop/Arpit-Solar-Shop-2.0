
import axios from 'axios';

export async function sendWhatsAppMessage(phone: string, pdfUrl: string) {
    try {
        // Validate environment variables
        const apiKey = process.env.DOUBLETICK_API_KEY;
        const senderPhone = process.env.DOUBLETICK_SENDER_PHONE;

        if (!apiKey) {
            throw new Error('DOUBLETICK_API_KEY is not set in .env');
        }
        if (!senderPhone) {
            throw new Error('DOUBLETICK_SENDER_PHONE is not set in .env');
        }

        // Format phone number with +91
        const cleanedPhone = phone.replace(/[^0-9]/g, '');
        if (cleanedPhone.length !== 10) {
            throw new Error(`Phone number must be 10 digits: ${phone}`);
        }
        const formattedPhone = `+91${cleanedPhone}`;

        console.log('Sending WhatsApp message to:', formattedPhone, 'from:', senderPhone);
        // console.log('Using API key:', apiKey.substring(0, 10) + '...'); 

        // const templateName = 'arpit_solar_shop_quotation_document';
        const templateName = 'quotation_document';
        const filename = pdfUrl.split('/').pop();

        const payload = {
            messages: [
                {
                    to: formattedPhone,
                    from: senderPhone,
                    content: {
                        templateName: templateName,
                        language: 'en',
                        templateData: {
                            header: {
                                type: 'DOCUMENT',
                                mediaUrl: pdfUrl,
                                filename: filename
                            },
                            body: {
                                placeholders: []
                            }
                        }
                    }
                }
            ]
        };

        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': apiKey // Remove extra 'key_' prefix if passed fully
        };

        const url = 'https://public.doubletick.io/whatsapp/message/template';

        const response = await axios.post(url, payload, { headers });
        console.log('WhatsApp message sent successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Doubletick API error:', error.response ? error.response.data : error.message);
        throw error;
    }
}
