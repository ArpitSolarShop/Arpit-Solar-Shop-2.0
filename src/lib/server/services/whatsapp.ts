
import axios from 'axios';

/**
 * Send a WhatsApp quotation to a customer via DoubleTick API.
 * 
 * Uses the APPROVED template 'quotation_document' (UTILITY category)
 * which has a DOCUMENT header and no body placeholders.
 */
export async function sendWhatsAppMessage(phone: string, pdfUrl: string, customerName?: string) {
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

    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': apiKey
    };

    const safeName = (customerName || 'Customer').replace(/[^a-zA-Z0-9 ]/g, '').trim();
    const filename = `Arpit_Solar_Quotation_${safeName.replace(/\s+/g, '_')}.pdf`;

    console.log('📱 WhatsApp: Sending quotation to', formattedPhone, 'from', senderPhone);
    console.log('📄 PDF URL:', pdfUrl);

    // Use the APPROVED template: "quotation_document" (UTILITY, DOCUMENT header, no body placeholders)
    const templatePayload = {
        messages: [
            {
                to: formattedPhone,
                from: senderPhone,
                content: {
                    templateName: 'quotation_document',
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

    console.log('📱 WhatsApp: Sending template message with template "quotation_document"...');

    const response = await axios.post(
        'https://public.doubletick.io/whatsapp/message/template',
        templatePayload,
        { headers }
    );

    console.log('✅ WhatsApp template message response:', JSON.stringify(response.data));

    const msgStatus = response.data?.messages?.[0]?.status;
    if (msgStatus === 'ENQUEUED' || msgStatus === 'SENT') {
        console.log('✅ WhatsApp message accepted by DoubleTick (status:', msgStatus, ')');
    } else {
        console.warn('⚠️ Unexpected WhatsApp status:', msgStatus);
    }

    return response.data;
}
