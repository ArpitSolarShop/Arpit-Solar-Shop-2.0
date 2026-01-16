import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('✅ Test endpoint received data:', body);

        // Simple response without PDF generation
        return NextResponse.json({
            success: true,
            message: 'Test endpoint working!',
            receivedData: body
        });
    } catch (err: any) {
        console.error('❌ Test endpoint error:', err);
        return NextResponse.json({
            error: err.message || 'Test endpoint error'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'Test endpoint is alive',
        timestamp: new Date().toISOString()
    });
}
