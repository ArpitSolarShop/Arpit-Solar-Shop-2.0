import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, quotationData } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email address is required" }, { status: 400 });
    }

    // For now, we'll return instructions to configure email
    // Email sending requires SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      // Fallback: Open default email client with mailto link
      const { customerName, systemSize, panelBrand, panelWattage, panelType, inverterModel, totalAmount, effectiveCost, centralSubsidy, stateSubsidy } = quotationData || {};

      const emailBody = `Dear ${customerName || "Customer"},

Thank you for your interest in solar power! Here's your quotation from Arpit Solar Shop.

SYSTEM DETAILS
- System Size: ${systemSize} KW
- Solar Panels: ${panelBrand} ${panelWattage}Wp (${panelType})
- Inverter: ${inverterModel}

INVESTMENT SUMMARY
- Total Amount: ₹${new Intl.NumberFormat("en-IN").format(totalAmount || 0)}

PM SURYA GHAR SUBSIDY
- Central Subsidy: ₹${new Intl.NumberFormat("en-IN").format(centralSubsidy || 0)}
- State Subsidy: ₹${new Intl.NumberFormat("en-IN").format(stateSubsidy || 0)}

EFFECTIVE COST: ₹${new Intl.NumberFormat("en-IN").format(effectiveCost || 0)}

---
ARPIT SOLAR SHOP
GSTIN: 09APKPM6299L1ZW
Contact: +91 9005770466
Email: arpitsolarshop@gmail.com

This quotation is valid for 7 days.`;

      const mailtoSubject = encodeURIComponent(subject || `Solar Quotation - ${customerName || "Customer"}`);
      const mailtoBody = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;

      return NextResponse.json({
        success: true,
        useMailto: true,
        mailtoLink,
        message: "Email client link generated. SMTP not configured for direct sending."
      });
    }

    // If SMTP is configured, send email directly
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const { customerName, systemSize, panelBrand, panelWattage, panelType, inverterModel, totalAmount, effectiveCost, centralSubsidy, stateSubsidy, companyDetails } = quotationData || {};

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .header { background: #1e3a5f; color: white; padding: 25px; display: flex; justify-content: space-between; align-items: center; }
    .header-content { text-align: left; }
    .company-name { font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-top: 5px; }
    .content { padding: 30px; background: #fff; }
    .greeting { font-size: 16px; color: #1e3a5f; font-weight: bold; margin-bottom: 20px; }
    .section-title { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; font-weight: 700; }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
    
    .info-box { background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .label { color: #64748b; }
    .value { font-weight: 600; color: #1e293b; }
    
    .price-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; }
    .price-title { color: #166534; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; }
    .price-amount { font-size: 32px; font-weight: 900; color: #15803d; letter-spacing: -1px; }
    .subsidy-info { font-size: 12px; color: #166534; margin-top: 5px; }
    
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer strong { color: #1e3a5f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1 class="company-name">ARPIT SOLAR SHOP</h1>
        <div class="tagline">Illuminating Your Future</div>
      </div>
    </div>
    
    <div class="content">
      <div class="greeting">Hello ${customerName || "Customer"},</div>
      <p>Thank you for choosing Arpit Solar Shop. Here is the summary of your solar system quotation.</p>
      
      <div class="section-title">System Configuration</div>
      <div class="grid">
        <div class="info-box">
          <div class="row"><span class="label">System Size</span><span class="value">${systemSize} KW</span></div>
          <div class="row"><span class="label">Solar Panels</span><span class="value">${panelWattage}Wp (${panelType})</span></div>
          <div class="row"><span class="label">Brand</span><span class="value">${panelBrand}</span></div>
        </div>
        <div class="info-box">
          <div class="row"><span class="label">Inverter</span><span class="value">${inverterModel}</span></div>
          <div class="row"><span class="label">Warranty (Panels)</span><span class="value">25 Years</span></div>
          <div class="row"><span class="label">Warranty (Inverter)</span><span class="value">5 Years</span></div>
        </div>
      </div>
      
      <div class="price-box">
        <div class="price-title">Effective Cost (After Subsidy)</div>
        <div class="price-amount">₹${new Intl.NumberFormat("en-IN").format(effectiveCost || 0)}</div>
        ${(centralSubsidy + stateSubsidy) > 0 ? `<div class="subsidy-info">Includes PM Surya Ghar Subsidy of ₹${new Intl.NumberFormat("en-IN").format((centralSubsidy || 0) + (stateSubsidy || 0))}</div>` : ''}
      </div>
      
      <div class="info-box" style="margin-top: 20px; text-align: center;">
         <div class="row" style="justify-content: center; gap: 20px;">
            <span>Total Amount: <strong>₹${new Intl.NumberFormat("en-IN").format(totalAmount || 0)}</strong></span>
            <span>|</span>
            <span>GST Included</span>
         </div>
      </div>
      
      <p style="text-align: center; margin-top: 25px; font-size: 12px; color: #94a3b8;">* This quotation is valid for 7 days from the date of issue.</p>
    </div>
    
    <div class="footer">
      <p><strong>ARPIT SOLAR SHOP</strong> | GSTIN: 09APKPM6299L1ZW</p>
      <p>Registered Office: Ballia, UP | Head Office: Varanasi, UP</p>
      <p>Contact: +91 9005770466 | Email: arpitsolarshop@gmail.com</p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Arpit Solar Shop" <${smtpUser}>`,
      to: email,
      subject: subject || `Solar Quotation - ${customerName || "Customer"}`,
      html: htmlContent
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error: any) {
    console.error("Email API error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to send email"
    }, { status: 500 });
  }
}
