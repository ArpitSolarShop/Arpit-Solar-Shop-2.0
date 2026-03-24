import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
// Use dynamic imports to support serverless-compatible Chromium in production
import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { generateQuoteHtml } from '@/lib/quoteTemplate';
import { defaultComponents } from '@/lib/companyDetails';
import { GST_RATE } from '@/data/priceList';

export const runtime = 'nodejs';

// Supabase client will be created lazily inside handlers after env validation

export async function POST(request: Request) {
    try {
        const quoteData = await request.json();

        // Basic input validation (minimal schema without external deps)
        if (!quoteData?.customerInfo?.name || !quoteData?.customerInfo?.phone) {
            return NextResponse.json({ message: 'Customer name and phone are required.' }, { status: 400 });
        }
        if (!quoteData?.selectedProduct) {
            return NextResponse.json({ message: 'Selected product is required.' }, { status: 400 });
        }

        // Env validation
        const missingEnv: string[] = [];
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingEnv.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingEnv.push('SUPABASE_KEY');
        // Using a default bucket if not specified, or assume 'quotations'
        const bucketName = process.env.SUPABASE_BUCKET || 'quotations';

        if (missingEnv.length) {
            return NextResponse.json({ message: `Missing environment variables: ${missingEnv.join(', ')}` }, { status: 500 });
        }

        // Server-side pricing recompute for integrity
        const calc = quoteData?.calculations || {};
        const n = (v: any) => (typeof v === 'number' && isFinite(v) ? v : 0);
        const basePrice = n(calc.basePrice);
        const marginPrice = n(calc.marginPrice);
        const wirePrice = n(calc.wirePrice);
        const heightPrice = n(calc.heightPrice);
        const outOfVnsPrice = n(calc.outOfVnsPrice);
        const subtotal = basePrice + marginPrice + wirePrice + heightPrice + outOfVnsPrice;
        const gstAmount = +(subtotal * (typeof quoteData?.taxRate === 'number' ? quoteData.taxRate : GST_RATE)).toFixed(2);
        const total = +(subtotal + gstAmount).toFixed(2);
        const discount = Math.max(0, n(calc.discount));
        const grandTotal = Math.max(0, +(total - discount).toFixed(2));

        // Attach components list to the PDF payload
        // Resolve absolute logo URL from public folder so Chromium can fetch it
        const origin = process.env.APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        let logoUrl = `${origin}/logo.png`;
        try {
            const logoPath = path.join(process.cwd(), 'public', 'logo.png');
            const logoBuffer = await fs.readFile(logoPath);
            logoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } catch (logoError) {
            console.warn('Falling back to origin logo URL', logoError);
        }

        // Load Static Payment QR Code
        let qrCodeUrl = '';
        const upiLink = `upi://pay?pa=${quoteData.companyDetails?.bank?.upiId || '9044555574@okbizaxis'}&pn=${encodeURIComponent(quoteData.companyDetails?.name || 'Arpit Solar Shop')}&am=${grandTotal}&cu=INR`;

        try {
            const qrPath = path.join(process.cwd(), 'public', 'payment.png');
            const qrBuffer = await fs.readFile(qrPath);
            qrCodeUrl = `data:image/png;base64,${qrBuffer.toString('base64')}`;
        } catch (qrError) {
            console.warn('payment.png not found', qrError);
        }

        let signatureUrl = '';
        try {
            const sigPath = path.join(process.cwd(), 'public', 'signature.png');
            const sigBuffer = await fs.readFile(sigPath);
            signatureUrl = `data:image/png;base64,${sigBuffer.toString('base64')}`;
        } catch (sigError) {
            console.warn('Signature image not found', sigError);
        }

        const htmlContent = generateQuoteHtml({
            ...quoteData,
            components: quoteData.components || defaultComponents[quoteData.selectedProduct?.systemType as keyof typeof defaultComponents] || defaultComponents['On-grid'],
            logoUrl,
            signatureUrl,
            panelWarranty: quoteData.selectedProduct?.panelWarranty || "25 Years",
            inverterWarranty: quoteData.selectedProduct?.inverterWarranty || "5 Years",
            // Pass frontend calculations directly, with fallback to computed values
            calculations: {
                ...quoteData.calculations,
                basePrice: quoteData.calculations?.subtotal || quoteData.calculations?.basePrice || subtotal,
                extraCosts: quoteData.calculations?.extraCosts || 0,
                gstAmount: quoteData.calculations?.gstAmount || gstAmount,
                total: quoteData.calculations?.total || quoteData.calculations?.grandTotal || grandTotal,
                grandTotal: quoteData.calculations?.grandTotal || grandTotal,
                centralSubsidy: quoteData.calculations?.centralSubsidy ?? (quoteData.selectedProduct?.systemSizeKw ? require('@/lib/companyDetails').calculateCentralSubsidy(quoteData.selectedProduct.systemSizeKw) : 108000),
                stateSubsidy: quoteData.calculations?.stateSubsidy ?? 0,
                effectiveCost: quoteData.calculations?.effectiveCost || 0
            },
            qrCodeUrl,
            upiLink,
        });

        // Generate PDF using shared service
        // We need to import generatePdfFromHtml from '@/lib/server/services/pdf'
        // And ensure the htmlContent is passed correctly.

        // Note: generatePdfFromHtml writes to disk and returns path, 
        // unlike the previous code which kept it in buffer.
        // We needto adapt: read the file back into buffer to upload to supabase, 
        // OR update upload logic to take a stream/path.

        // Looking at generate-quote/route.ts:
        // const pdfPath = await generatePdfFromHtml({ html });
        // const pdfUrl = await uploadToBucket(pdfPath);

        // Here we are manually uploading to supabase using explicit bucket.
        // Let's use generatePdfFromHtml, then fs.readFile to get buffer (to keep existing upload logic minimal change)

        const { generatePdfFromHtml } = await import('@/lib/server/services/pdf');
        const pdfPath = await generatePdfFromHtml({ html: htmlContent });
        const pdfBuffer = await fs.readFile(pdfPath);

        // Clean up the temp file after reading (optional, as the service handles cleanup on next run, 
        // but explicit cleanup is nice) - actually pdf.ts cleans up DIRECTORY on next run. 
        // We can just leave it or delete it.
        // Let's keep it simple.

        // We want to upload with the CUSTOMER name.
        // So we read the content from pdfPath, and upload it with our params.
        const fileName = `quotation-${quoteData.customerInfo.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;

        // Create Supabase client now that envs are validated
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

        // Ensure the PDF URL is reachable before attempting WhatsApp send
        let pdfUrl = urlData.publicUrl;
        try {
            const fetchWithTimeout = async (url: string, timeoutMs = 8000) => {
                const ctrl = new AbortController();
                const id = setTimeout(() => ctrl.abort(), timeoutMs);
                try {
                    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
                    return res.ok;
                } finally {
                    clearTimeout(id);
                }
            };
            let ok = await fetchWithTimeout(pdfUrl, 8000);
            if (!ok) {
                await new Promise(r => setTimeout(r, 1000));
                ok = await fetchWithTimeout(pdfUrl, 12000);
                if (!ok) {
                    // Fallback to a signed URL if public URL is slow or blocked
                    const { data: signed } = await supabase.storage.from(bucketName).createSignedUrl(fileName, 60 * 60); // 1 hour
                    if (signed?.signedUrl) {
                        pdfUrl = signed.signedUrl;
                    }
                }
            }
        } catch { }

        if (!quoteData.skipWhatsApp) {
            await sendWhatsAppMessage(quoteData.customerInfo.phone, pdfUrl);
        }

        return NextResponse.json({ message: 'Quotation sent successfully!', url: urlData.publicUrl, totals: { subtotal, gstAmount, total, discount, grandTotal } });

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ message: error.message || 'Server error occurred.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const missingEnv: string[] = [];
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingEnv.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingEnv.push('SUPABASE_KEY');
        // Using default bucket if missin
        if (!process.env.DOUBLETICK_API_KEY) missingEnv.push('DOUBLETICK_API_KEY');
        if (!process.env.DOUBLETICK_SENDER_PHONE) missingEnv.push('DOUBLETICK_SENDER_PHONE');
        const ok = missingEnv.length === 0;
        return NextResponse.json({ ok, missingEnv });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e?.message || 'Health check failed' }, { status: 500 });
    }
}
