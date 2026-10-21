'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────────────
interface FormData {
    name: string;
    phone: string;
    area: string;
    property_type: string;
    monthly_bill: string;
    installation_timeline: string;
    consent_given: boolean;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Dropdown Options ───────────────────────────────────────────────────────
const PROPERTY_TYPE_OPTIONS = [
    'आवासीय (अपना मकान / घर)',
    'दुकान या कमर्शियल',
    'फैक्ट्री या इंडस्ट्रियल',
    'अपार्टमेंट / फ्लैट',
    'अन्य',
];

const MONTHLY_BILL_OPTIONS = [
    '₹2,000 से कम',
    '₹2,000 – ₹5,000',
    '₹5,000 – ₹10,000',
    '₹10,000 से ज़्यादा',
];

const TIMELINE_OPTIONS = [
    'जल्द से जल्द',
    'अगले 1 महीने में',
    'अगले 1–3 महीने में',
    'अभी सिर्फ जानकारी चाहिए',
];

export default function SolarLeadForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        area: '',
        property_type: '',
        monthly_bill: '',
        installation_timeline: '',
        consent_given: true,
    });

    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [utmParams, setUtmParams] = useState<Record<string, string>>({});

    // Capture UTM params on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const utm: Record<string, string> = {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
                const val = params.get(key);
                if (val) utm[key] = val;
            });
            setUtmParams(utm);
        }
    }, []);

    const updateField = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Client-side validation
        if (!formData.name.trim()) {
            setErrorMsg('कृपया अपना पूरा नाम भरें।');
            return;
        }
        if (!/^\d{10}$/.test(formData.phone.trim())) {
            setErrorMsg('कृपया सही 10 अंकों का मोबाइल नंबर भरें।');
            return;
        }
        if (!formData.area.trim()) {
            setErrorMsg('कृपया अपना क्षेत्र या पिन कोड भरें।');
            return;
        }
        if (!formData.property_type) {
            setErrorMsg('कृपया प्रॉपर्टी का प्रकार चुनें।');
            return;
        }
        if (!formData.monthly_bill) {
            setErrorMsg('कृपया अपना मासिक बिजली बिल चुनें।');
            return;
        }
        if (!formData.installation_timeline) {
            setErrorMsg('कृपया चुनें कि आप कब सोलर लगवाना चाहते हैं।');
            return;
        }

        setStatus('submitting');

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    area: formData.area.trim(),
                    property_type: formData.property_type,
                    monthly_bill: formData.monthly_bill,
                    installation_timeline: formData.installation_timeline,
                    consent_given: formData.consent_given,
                    ...utmParams,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (typeof window !== 'undefined' && typeof (window as unknown as { fbq?: Function }).fbq === 'function') {
                    try {
                        (window as unknown as { fbq: Function }).fbq('track', 'Lead', {
                            content_name: 'Solar Consultation Lead',
                            content_category: formData.property_type || 'Solar',
                            value: 0,
                            currency: 'INR',
                        });
                    } catch {
                        // ignore tracking errors
                    }
                }
                setStatus('success');
            } else {
                setErrorMsg(data.message || 'कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।');
                setStatus('error');
            }
        } catch {
            setErrorMsg('नेटवर्क एरर। कृपया अपना इंटरनेट कनेक्शन चेक करें।');
            setStatus('error');
        }
    };

    // ─── Success Screen (Light Theme) ─────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="solar-form-wrapper">
                <style>{lightStyles}</style>
                <motion.div
                    className="solar-form-card success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <div className="success-icon-wrapper">
                        <motion.div
                            className="success-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </motion.div>
                    </div>

                    <motion.h2
                        className="success-title"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        आपकी जानकारी मिल गई है!
                    </motion.h2>

                    <motion.div
                        className="success-body"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <p className="success-lead">
                            <strong>Arpit Solar Shop</strong> की टीम जल्द ही आपसे संपर्क करेगी।
                        </p>
                        <p className="success-note">
                            हम आपको आपके बिजली बिल के हिसाब से सही सोलर सिस्टम, संभावित बचत और लागू सरकारी सब्सिडी की पूरी जानकारी देंगे।
                        </p>

                        <div className="cta-box">
                            <p className="cta-label">तुरंत जानकारी के लिए संपर्क करें:</p>
                            <div className="cta-buttons">
                                <a href="tel:+919044555572" className="cta-btn cta-call">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    कॉल करें
                                </a>
                                <a
                                    href="https://wa.me/919044555572?text=नमस्ते%2C%20मैंने%20सोलर%20कंसल्टेशन%20फॉर्म%20भरा%20है।%20कृपया%20जानकारी%20दें।"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta-btn cta-whatsapp"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp करें
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ─── Form Screen (Light Theme) ───────────────────────────────────────────
    return (
        <div className="solar-form-wrapper">
            <style>{lightStyles}</style>

            <motion.div
                className="solar-form-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                {/* Header */}
                <div className="form-header">
                    <div className="brand-badge">
                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                            <circle cx="12" cy="12" r="5" fill="#829622" />
                            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#1B5445" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                        <span>Arpit Solar Shop</span>
                    </div>

                    <h1 className="form-title">मुफ्त सोलर कंसल्टेशन</h1>
                    <p className="form-subtitle">वाराणसी में सरकारी सब्सिडी व सही सोलर सिस्टम की जानकारी पाएं</p>

                    <div className="trust-pills">
                        <span className="trust-pill">⚡ 100% मुफ्त सलाह</span>
                        <span className="trust-pill">🏛️ सब्सिडी सहायता</span>
                        <span className="trust-pill">🛡️ 25 वर्ष वारंटी</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="solar-form" noValidate>

                    {/* 1. Name */}
                    <div className="form-group">
                        <label htmlFor="field-name" className="form-label">
                            आपका पूरा नाम <span className="required">*</span>
                        </label>
                        <input
                            id="field-name"
                            type="text"
                            className="form-input"
                            placeholder="अपना पूरा नाम लिखें"
                            value={formData.name}
                            onChange={e => updateField('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

                    {/* 2. Phone */}
                    <div className="form-group">
                        <label htmlFor="field-phone" className="form-label">
                            मोबाइल नंबर <span className="required">*</span>
                        </label>
                        <div className="phone-input-wrap">
                            <span className="phone-prefix">🇮🇳 +91</span>
                            <input
                                id="field-phone"
                                type="tel"
                                className="form-input phone-input"
                                placeholder="10 अंकों का मोबाइल नंबर"
                                value={formData.phone}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    updateField('phone', val);
                                }}
                                required
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    {/* 3. Area / Pincode */}
                    <div className="form-group">
                        <label htmlFor="field-area" className="form-label">
                            आपका क्षेत्र / पिन कोड <span className="required">*</span>
                        </label>
                        <input
                            id="field-area"
                            type="text"
                            className="form-input"
                            placeholder="उदा. सिगरा, लंका, भेलुपुर या 221005"
                            value={formData.area}
                            onChange={e => updateField('area', e.target.value)}
                            required
                            autoComplete="address-level2"
                        />
                    </div>

                    {/* 4. Property Type (Dropdown) */}
                    <div className="form-group">
                        <label htmlFor="field-property-type" className="form-label">
                            प्रॉपर्टी का प्रकार <span className="required">*</span>
                        </label>
                        <div className="select-wrap">
                            <select
                                id="field-property-type"
                                className={`form-select ${!formData.property_type ? 'placeholder' : ''}`}
                                value={formData.property_type}
                                onChange={e => updateField('property_type', e.target.value)}
                                required
                            >
                                <option value="" disabled>प्रॉपर्टी का प्रकार चुनें</option>
                                {PROPERTY_TYPE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <span className="select-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* 5. Monthly Electricity Bill (Dropdown) */}
                    <div className="form-group">
                        <label htmlFor="field-monthly-bill" className="form-label">
                            आपका मासिक बिजली बिल कितना है? <span className="required">*</span>
                        </label>
                        <div className="select-wrap">
                            <select
                                id="field-monthly-bill"
                                className={`form-select ${!formData.monthly_bill ? 'placeholder' : ''}`}
                                value={formData.monthly_bill}
                                onChange={e => updateField('monthly_bill', e.target.value)}
                                required
                            >
                                <option value="" disabled>मासिक बिजली बिल चुनें</option>
                                {MONTHLY_BILL_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <span className="select-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* 6. Installation Timeline (Dropdown) */}
                    <div className="form-group">
                        <label htmlFor="field-timeline" className="form-label">
                            आप सोलर कब लगवाना चाहते हैं? <span className="required">*</span>
                        </label>
                        <div className="select-wrap">
                            <select
                                id="field-timeline"
                                className={`form-select ${!formData.installation_timeline ? 'placeholder' : ''}`}
                                value={formData.installation_timeline}
                                onChange={e => updateField('installation_timeline', e.target.value)}
                                required
                            >
                                <option value="" disabled>समय चुनें</option>
                                {TIMELINE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <span className="select-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Consent checkbox */}
                    <div className="consent-group">
                        <label className="consent-label" onClick={() => updateField('consent_given', !formData.consent_given)}>
                            <div className={`consent-checkbox ${formData.consent_given ? 'checked' : ''}`}>
                                {formData.consent_given && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                            </div>
                            <span className="consent-text">
                                मैं Arpit Solar Shop को सोलर जानकारी के लिए कॉल / WhatsApp करने की अनुमति देता/देती हूँ।
                            </span>
                        </label>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {(errorMsg || status === 'error') && (
                            <motion.div
                                className="error-msg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                ⚠️ {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? (
                            <span className="btn-loading">
                                <span className="spinner"></span>
                                कृपया प्रतीक्षा करें...
                            </span>
                        ) : (
                            <span className="btn-content">
                                <span>मुफ्त सोलर कंसल्टेशन बुक करें</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="form-footer">
                    <p>🔒 आपकी जानकारी 100% सुरक्षित और गोपनीय है</p>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Light Theme Styles ───────────────────────────────────────────────────────
const lightStyles = `
/* ═══════════════════════════════════════════════════════════════════════
   Arpit Solar Shop — Lead Capture Form (Light Theme)
   Palette:
     Dark Emerald Green: #1B5445
     Deep Forest Green: #0E3C30
     Teal Green:         #327261
     Lime / Olive Green: #A2B92B
     Olive Gold:         #829622
     Soft Background:    #F4F8F5
   ═══════════════════════════════════════════════════════════════════════ */
* {
    box-sizing: border-box;
}

.solar-form-wrapper {
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(180deg, #F0F6F2 0%, #FFFFFF 50%, #F4F8F5 100%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 14px 40px;
    font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #0E3C30;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
}

/* Subtle ambient decorative glow */
.solar-form-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 350px;
    background: radial-gradient(circle, rgba(162, 185, 43, 0.12) 0%, rgba(27, 84, 69, 0.06) 50%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

.solar-form-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: #FFFFFF;
    border: 1px solid #DCE7E1;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
        0 1px 3px rgba(14, 60, 48, 0.04),
        0 12px 36px -8px rgba(27, 84, 69, 0.12),
        0 30px 60px -20px rgba(162, 185, 43, 0.08);
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.form-header {
    padding: 28px 24px 20px;
    text-align: center;
    background: linear-gradient(180deg, #F8FBF9 0%, #FFFFFF 100%);
    border-bottom: 1px solid #EAF0EC;
}

.brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px;
    background: #EDF5F0;
    border: 1px solid #D3E5DC;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    color: #1B5445;
    margin-bottom: 14px;
    letter-spacing: 0.02em;
}

.form-title {
    font-size: 24px;
    font-weight: 700;
    color: #0E3C30;
    margin: 0 0 6px;
    line-height: 1.25;
}

.form-subtitle {
    font-size: 13.5px;
    color: #3E6157;
    margin: 0 0 16px;
    line-height: 1.5;
}

.trust-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}

.trust-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: #F3F8F5;
    border: 1px solid #DBE8E1;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 600;
    color: #1B5445;
}

/* ─── Form Body ──────────────────────────────────────────────────────── */
.solar-form {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.form-label {
    font-size: 14px;
    font-weight: 600;
    color: #0E3C30;
    line-height: 1.35;
}

.required {
    color: #D32F2F;
    font-weight: 600;
    margin-left: 2px;
}

/* Input Fields */
.form-input {
    width: 100%;
    padding: 12px 14px;
    background: #FFFFFF;
    border: 1.5px solid #CFDFD6;
    border-radius: 10px;
    color: #0E3C30;
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
}

.form-input::placeholder {
    color: #8CA397;
    font-size: 13.5px;
}

.form-input:focus {
    border-color: #1B5445;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(162, 185, 43, 0.22);
}

/* Phone input with +91 */
.phone-input-wrap {
    display: flex;
    align-items: stretch;
    border: 1.5px solid #CFDFD6;
    border-radius: 10px;
    overflow: hidden;
    background: #FFFFFF;
    transition: all 0.2s ease;
}

.phone-input-wrap:focus-within {
    border-color: #1B5445;
    box-shadow: 0 0 0 3px rgba(162, 185, 43, 0.22);
}

.phone-prefix {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: #F4F8F5;
    border-right: 1.5px solid #CFDFD6;
    font-size: 13.5px;
    font-weight: 600;
    color: #1B5445;
    white-space: nowrap;
    user-select: none;
}

.phone-input-wrap .phone-input {
    border: none;
    border-radius: 0;
    padding-left: 12px;
}

.phone-input-wrap .phone-input:focus {
    box-shadow: none;
}

/* Select / Dropdown styling */
.select-wrap {
    position: relative;
    width: 100%;
}

.form-select {
    width: 100%;
    padding: 12px 38px 12px 14px;
    background: #FFFFFF;
    border: 1.5px solid #CFDFD6;
    border-radius: 10px;
    color: #0E3C30;
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.form-select.placeholder {
    color: #8CA397;
}

.form-select option {
    color: #0E3C30;
    background: #FFFFFF;
    padding: 10px;
}

.form-select:focus {
    border-color: #1B5445;
    box-shadow: 0 0 0 3px rgba(162, 185, 43, 0.22);
}

.select-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #1B5445;
    display: flex;
    align-items: center;
}

/* Consent Checkbox */
.consent-group {
    padding-top: 4px;
}

.consent-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

.consent-checkbox {
    width: 20px;
    height: 20px;
    min-width: 20px;
    margin-top: 2px;
    border: 1.5px solid #A2B92B;
    background: #FFFFFF;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #FFFFFF;
}

.consent-checkbox.checked {
    background: #1B5445;
    border-color: #1B5445;
}

.consent-text {
    font-size: 12.5px;
    color: #4A695F;
    line-height: 1.45;
}

/* Error message */
.error-msg {
    padding: 10px 14px;
    background: #FDF2F2;
    border: 1px solid #F8B4B4;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #C81E1E;
}

/* Submit Button */
.submit-btn {
    width: 100%;
    padding: 15px 20px;
    background: linear-gradient(135deg, #1B5445 0%, #0E3C30 100%);
    border: none;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 8px 24px -4px rgba(27, 84, 69, 0.35);
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #226755 0%, #124A3B 100%);
    box-shadow: 0 10px 28px -4px rgba(27, 84, 69, 0.45);
    transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 4px 12px rgba(27, 84, 69, 0.3);
}

.submit-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
}

.btn-content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-loading {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Footer */
.form-footer {
    padding: 12px 24px 18px;
    text-align: center;
    border-top: 1px solid #EAF0EC;
    background: #FAFDFB;
}

.form-footer p {
    margin: 0;
    font-size: 12px;
    color: #6C877D;
}

/* ─── Success Screen (Light Theme) ───────────────────────────────────── */
.success-card {
    text-align: center;
    padding: 36px 24px 28px;
}

.success-icon-wrapper {
    margin-bottom: 20px;
}

.success-icon {
    width: 68px;
    height: 68px;
    margin: 0 auto;
    border-radius: 50%;
    background: linear-gradient(135deg, #1B5445 0%, #327261 100%);
    box-shadow: 0 8px 24px rgba(27, 84, 69, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-title {
    font-size: 22px;
    font-weight: 700;
    color: #0E3C30;
    margin: 0 0 12px;
}

.success-lead {
    font-size: 15px;
    color: #1B5445;
    margin: 0 0 10px;
    font-weight: 600;
}

.success-note {
    font-size: 13.5px;
    color: #4A695F;
    line-height: 1.6;
    margin: 0 0 24px;
}

.cta-box {
    background: #F4F8F5;
    border: 1px solid #DCE7E1;
    border-radius: 14px;
    padding: 18px 16px;
}

.cta-label {
    font-size: 13px;
    font-weight: 600;
    color: #0E3C30;
    margin: 0 0 12px;
}

.cta-buttons {
    display: flex;
    gap: 10px;
}

.cta-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
}

.cta-call {
    background: #EDF5F0;
    border: 1.5px solid #1B5445;
    color: #1B5445;
}

.cta-call:hover {
    background: #1B5445;
    color: #FFFFFF;
}

.cta-whatsapp {
    background: #25D366;
    border: 1.5px solid #25D366;
    color: #FFFFFF;
}

.cta-whatsapp:hover {
    background: #20BA5A;
}

/* ─── Mobile Adjustments ─────────────────────────────────────────────── */
@media (max-width: 480px) {
    .solar-form-wrapper {
        padding: 10px 8px 30px;
    }
    .solar-form-card {
        border-radius: 16px;
    }
    .form-header {
        padding: 22px 16px 16px;
    }
    .solar-form {
        padding: 18px 16px;
        gap: 16px;
    }
    .form-title {
        font-size: 21px;
    }
    .cta-buttons {
        flex-direction: column;
    }
}
`;

export { SolarLeadForm };

