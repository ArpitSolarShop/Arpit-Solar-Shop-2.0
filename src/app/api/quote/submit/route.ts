import { NextRequest, NextResponse } from 'next/server';

// Server-side only - these are NOT exposed to the client
const KIT19_API = process.env.KIT19_API;
const KIT19_AUTH = process.env.KIT19_AUTH;

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!KIT19_API || !KIT19_AUTH) {
            console.error('Missing Kit19 API credentials');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Parse and validate request body
        const body = await request.json();

        // Basic validation
        if (!body.fullName || !body.whatsappNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Forward request to Kit19 API
        const response = await fetch(KIT19_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': KIT19_AUTH,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Kit19 API error: ${response.status}`);
        }

        const data = await response.json();

        // Return sanitized response
        return NextResponse.json({
            success: true,
            message: 'Quote submitted successfully',
            data,
        });

    } catch (error) {
        console.error('Quote submission error:', error);
        return NextResponse.json(
            {
                error: 'Failed to submit quote',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
