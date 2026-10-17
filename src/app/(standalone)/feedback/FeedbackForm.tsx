'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    CheckCircle2, 
    ExternalLink, 
    Send, 
    ShieldCheck, 
    Award, 
    Sparkles, 
    MessageSquare, 
    User, 
    Phone, 
    Calendar, 
    Zap, 
    MapPin, 
    Check,
    Share2,
    Printer,
    RefreshCw
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface StageItem {
    id: number;
    key: `rating_stage_${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
    titleHindi: string;
    titleEnglish: string;
    desc: string;
}

const STAGES: StageItem[] = [
    {
        id: 1,
        key: 'rating_stage_1',
        titleHindi: 'चरण 1: प्रारंभिक परामर्श और साइट सर्वे',
        titleEnglish: 'Consultation & Site Survey',
        desc: 'सोलर क्षमता का आकलन, साइट निरीक्षण और छत की उपयुक्तता की जांच',
    },
    {
        id: 2,
        key: 'rating_stage_2',
        titleHindi: 'चरण 2: प्रस्ताव, डिजाइन और सिस्टम विवरण',
        titleEnglish: 'Proposal & System Design',
        desc: 'सोलर कोटेशन, पैनल व इन्वर्टर का चयन, और लेआउट डिजाइन की स्पष्टता',
    },
    {
        id: 3,
        key: 'rating_stage_3',
        titleHindi: 'चरण 3: टीम का पेशेवर व्यवहार और समय पर इंस्टॉलेशन',
        titleEnglish: 'Installation Team & Timeliness',
        desc: 'तकनीकी टीम की कुशलता, विनम्रता, सुरक्षा मानक और तय समय पर काम',
    },
    {
        id: 4,
        key: 'rating_stage_4',
        titleHindi: 'चरण 4: नेट मीटरिंग और सरकारी सब्सिडी (PM Surya Ghar Subsidy) प्रक्रिया में सहायता',
        titleEnglish: 'Net Metering & Subsidy Support',
        desc: 'डिस्कॉम कागजी कार्रवाई, नेट मीटर लगवाना और पीएम सूर्य घर पोर्टल पर सहायता',
    },
    {
        id: 5,
        key: 'rating_stage_5',
        titleHindi: 'चरण 5: इंस्टॉलेशन के बाद साइट की सफाई और हैंडओवर',
        titleEnglish: 'Site Cleanup & Handover',
        desc: 'छत व कार्यस्थल की पूरी सफाई, सिस्टम चालू करना और संचालन समझाना',
    },
    {
        id: 6,
        key: 'rating_stage_6',
        titleHindi: 'चरण 6: सिस्टम का प्रदर्शन और बिजली उत्पादन',
        titleEnglish: 'System Performance & Generation',
        desc: 'सोलर पैनल द्वारा बिजली का सुचारू उत्पादन और बिजली बिल में बचत',
    },
    {
        id: 7,
        key: 'rating_stage_7',
        titleHindi: 'चरण 7: क्रिशननुजा रेन्यूएबल्स / अर्पित सोलर शॉप के साथ कुल मिलाकर संतुष्टि',
        titleEnglish: 'Overall Customer Satisfaction',
        desc: 'हमारी कंपनी के साथ आपका संपूर्ण अनुभव और सेवा गुणवत्ता',
    },
    {
        id: 8,
        key: 'rating_stage_8',
        titleHindi: 'चरण 8: आप अपने दोस्तों और परिवार को Arpit Solar Shop की सोलर सेवाएँ recommend करने के लिए कितनी स्टार रेटिंग देंगे?',
        titleEnglish: 'Recommendation to Friends & Family',
        desc: 'क्या आप अपने मित्रों, पड़ोसियों व परिजनों को हमारे सोलर सिस्टम लगवाने की सलाह देंगे?',
    },
];

const RATING_LABELS: Record<number, { hindi: string; english: string; emoji: string; color: string }> = {
    1: { hindi: 'खराब', english: 'Poor', emoji: '😞', color: '#EF4444' },
    2: { hindi: 'ठीक-ठाक', english: 'Fair', emoji: '😐', color: '#F59E0B' },
    3: { hindi: 'अच्छा', english: 'Good', emoji: '🙂', color: '#3B82F6' },
    4: { hindi: 'बहुत अच्छा', english: 'Very Good', emoji: '😊', color: '#10B981' },
    5: { hindi: 'उत्कृष्ट', english: 'Excellent', emoji: '🌟', color: '#16A34A' },
};

const CAPACITY_PRESETS = ['2 kW', '3 kW', '4 kW', '5 kW', '6 kW', '8 kW', '10 kW', '15 kW+'];
const GOOGLE_REVIEW_URL = 'https://g.page/r/CcJZzDtcNJTgEAE/review';

export default function FeedbackForm() {
    const today = new Date().toISOString().split('T')[0];

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [submissionDate, setSubmissionDate] = useState(today);
    const [solarCapacity, setSolarCapacity] = useState('3 kW');
    const [customCapacity, setCustomCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [comments, setComments] = useState('');
    const [customerSignature, setCustomerSignature] = useState('');
    const [verifiedCheck, setVerifiedCheck] = useState(true);

    // Ratings state: default to 0 (unselected so customer can actively rate each stage)
    const [ratings, setRatings] = useState<Record<string, number>>({
        rating_stage_1: 0,
        rating_stage_2: 0,
        rating_stage_3: 0,
        rating_stage_4: 0,
        rating_stage_5: 0,
        rating_stage_6: 0,
        rating_stage_7: 0,
        rating_stage_8: 0,
    });

    const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [submittedData, setSubmittedData] = useState<any>(null);
    const [googleClicked, setGoogleClicked] = useState(false);

    // Sync signature with customer name if empty
    useEffect(() => {
        if (!customerSignature && customerName) {
            setCustomerSignature(customerName);
        }
    }, [customerName, customerSignature]);

    // Average rating calculation
    const ratingValues = Object.values(ratings).filter((r) => r > 0);
    const ratedCount = ratingValues.length;
    const averageRating = ratedCount > 0 
        ? (ratingValues.reduce((a, b) => a + b, 0) / ratedCount).toFixed(1)
        : '—';

    const handleRatingSelect = (stageKey: string, score: number) => {
        setRatings((prev) => ({ ...prev, [stageKey]: score }));
    };

    const handleGoogleReviewClick = async () => {
        setGoogleClicked(true);
        if (submittedData?.id) {
            try {
                await fetch('/api/feedback', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: submittedData.id }),
                });
            } catch (err) {
                console.error(err);
            }
        }
        window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    };

    const handlePresetComment = (preset: string) => {
        if (!comments.includes(preset)) {
            setComments((prev) => (prev ? `${prev} | ${preset}` : preset));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!customerName.trim()) {
            setErrorMsg('कृपया ग्राहक का नाम दर्ज करें।');
            return;
        }

        const cleanMobile = customerMobile.replace(/\D/g, '');
        if (cleanMobile.length !== 10) {
            setErrorMsg('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
            return;
        }

        if (!verifiedCheck) {
            setErrorMsg('कृपया पुष्टि चेकबॉक्स को टिक करें।');
            return;
        }

        const unratedCount = STAGES.filter((s) => !ratings[s.key] || ratings[s.key] === 0).length;
        if (unratedCount > 0) {
            setErrorMsg(`कृपया सभी 8 चरणों को 1 से 5 स्टार रेटिंग दें (${unratedCount} चरण शेष हैं)।`);
            return;
        }

        const finalCapacity = solarCapacity === 'other' ? customCapacity : solarCapacity;

        setStatus('submitting');

        const payload = {
            customer_name: customerName.trim(),
            customer_mobile: cleanMobile,
            submission_date: submissionDate,
            solar_capacity: finalCapacity || '3 kW',
            location: location.trim(),
            rating_stage_1: ratings.rating_stage_1,
            rating_stage_2: ratings.rating_stage_2,
            rating_stage_3: ratings.rating_stage_3,
            rating_stage_4: ratings.rating_stage_4,
            rating_stage_5: ratings.rating_stage_5,
            rating_stage_6: ratings.rating_stage_6,
            rating_stage_7: ratings.rating_stage_7,
            rating_stage_8: ratings.rating_stage_8,
            rating_recommendation: ratings.rating_stage_8,
            comments: comments.trim(),
            customer_signature: customerSignature.trim() || customerName.trim(),
            google_review_clicked: googleClicked,
        };

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSubmittedData({ ...payload, id: data.id, average_rating: data.average_rating || averageRating });
                setStatus('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setErrorMsg(data.message || 'फीडबैक सबमिट करने में समस्या आई। पुनः प्रयास करें।');
                setStatus('error');
            }
        } catch {
            setErrorMsg('इंटरनेट कनेक्शन में समस्या आई। कृपया अपना नेटवर्क जांचें।');
            setStatus('error');
        }
    };

    // ─── Success Screen ─────────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="feedback-container">
                <style>{feedbackStyles}</style>
                <motion.div 
                    className="success-wrapper"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Celebration Header */}
                    <div className="success-header-card">
                        <div className="celebration-badge">
                            <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
                            <span>प्रतिक्रिया सफलतापूर्वक दर्ज हुई</span>
                        </div>

                        <div className="success-icon-ring">
                            <CheckCircle2 className="w-14 h-14 text-emerald-600" />
                        </div>

                        <h1 className="success-title">
                            धन्यवाद, {submittedData?.customer_name}! 🙏
                        </h1>
                        <p className="success-subtitle">
                            <strong>क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड (Arpit Solar Shop)</strong> के साथ आपका फीडबैक हमारे लिए अत्यंत महत्वपूर्ण है।
                        </p>

                        <div className="overall-score-pill">
                            <span className="text-gray-600 text-sm">आपकी दी गई कुल औसत रेटिंग:</span>
                            <div className="score-value">
                                <span className="font-extrabold text-2xl text-emerald-800">{submittedData?.average_rating}</span>
                                <span className="text-gray-400 text-sm">/ 5.0</span>
                                <div className="flex gap-1 ml-2 text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prominent Google Rating Call-to-Action */}
                    <div className="google-review-box primary-glow">
                        <div className="google-header-row">
                            <div className="google-logo-badge">
                                <span className="google-g font-bold text-xl">G</span>
                                <span className="font-semibold text-gray-800 text-sm">Google Review</span>
                            </div>
                            <span className="badge-highlight">⭐ 30 सेकंड का सहयोग</span>
                        </div>

                        <h2 className="google-review-title">
                            कृपया Google पर हमें 5-स्टार रेटिंग देकर अपना अनुभव साझा करें!
                        </h2>
                        <p className="google-review-desc">
                            आपकी एक छोटी सी 5-स्टार समीक्षा अन्य परिवारों को भी स्वच्छ, सस्ती सौर ऊर्जा अपनाने में विश्वास दिलाएगी।
                        </p>

                        <motion.button
                            onClick={handleGoogleReviewClick}
                            className="google-action-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="star-burst">⭐⭐⭐⭐⭐</span>
                            <span className="btn-text">Google पर 5-स्टार रिव्यू दें (Review on Google)</span>
                            <ExternalLink className="w-5 h-5 ml-1" />
                        </motion.button>

                        <div className="google-link-copy">
                            <span className="text-xs text-gray-500">डायरेक्ट लिंक:</span>
                            <a 
                                href={GOOGLE_REVIEW_URL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-700 underline font-mono break-all hover:text-emerald-900"
                            >
                                {GOOGLE_REVIEW_URL}
                            </a>
                        </div>
                    </div>

                    {/* Summary of feedback submitted */}
                    <div className="feedback-receipt-card">
                        <h3 className="receipt-title">
                            <span>📋 दर्ज किए गए विवरण की रसीद</span>
                            <button onClick={() => window.print()} className="print-btn" title="प्रिंट करें">
                                <Printer className="w-4 h-4" />
                                <span>प्रिंट करें</span>
                            </button>
                        </h3>

                        <div className="receipt-grid">
                            <div className="receipt-item">
                                <span className="r-label">ग्राहक का नाम:</span>
                                <span className="r-value">{submittedData?.customer_name}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="r-label">मोबाइल नंबर:</span>
                                <span className="r-value">+91 {submittedData?.customer_mobile}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="r-label">सोलर क्षमता:</span>
                                <span className="r-value">{submittedData?.solar_capacity}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="r-label">स्थान:</span>
                                <span className="r-value">{submittedData?.location || 'वाराणसी'}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="r-label">दिनांक:</span>
                                <span className="r-value">{submittedData?.submission_date}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="r-label">सत्यापन:</span>
                                <span className="r-value text-emerald-700 font-medium">✓ सत्यापित (Verified)</span>
                            </div>
                        </div>

                        <div className="stages-summary-list">
                            <h4 className="stages-summary-title">सभी चरणों की आपकी रेटिंग:</h4>
                            {STAGES.map((s) => {
                                const score = submittedData?.[s.key] || 5;
                                return (
                                    <div key={s.id} className="stage-receipt-row">
                                        <span className="stage-receipt-name">{s.titleHindi}</span>
                                        <span className="stage-receipt-stars">
                                            {'⭐'.repeat(score)} ({score}/5)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {submittedData?.comments && (
                            <div className="receipt-comments">
                                <span className="r-label">आपकी टिप्पणी:</span>
                                <p className="r-comment-text">"{submittedData.comments}"</p>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="success-footer-actions">
                        <button 
                            onClick={() => {
                                setStatus('idle');
                                window.location.reload();
                            }} 
                            className="reload-btn"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>दूसरा फॉर्म भरें</span>
                        </button>
                        <a 
                            href="https://wa.me/919044555572?text=मैंने%20सोलर%20फीडबैक%20फॉर्म%20सबमिट%20कर%20दिया%20है।"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-btn"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>WhatsApp पर साझा करें</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── Main Form View ────────────────────────────────────────────────────────
    return (
        <div className="feedback-container">
            <style>{feedbackStyles}</style>

            <motion.div 
                className="feedback-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Brand Header */}
                <header className="brand-header">
                    <div className="header-top-row">
                        <div className="company-logo-wrap">
                            <img 
                                src="/logo.webp" 
                                alt="Arpit Solar Shop Logo" 
                                className="brand-logo"
                                loading="eager"
                            />
                        </div>
                        <div className="company-badge">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Authorized Solar Partner</span>
                        </div>
                    </div>

                    <div className="title-section">
                        <h1 className="main-title">सोलर इंस्टॉलेशन फीडबैक फॉर्म</h1>
                        <p className="english-title">Solar Installation Customer Feedback & Rating Form</p>
                        <span className="company-sub-badge">
                            क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड • Arpit Solar Shop
                        </span>
                    </div>

                    <div className="welcome-banner">
                        <p>
                            <strong>क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड</strong> को चुनने के लिए धन्यवाद। हम आपकी प्रतिक्रिया को सर्वोच्च प्राथमिकता देते हैं ताकि आपको सर्वोत्तम और निर्बाध सौर ऊर्जा सेवाएँ प्रदान की जा सकें। कृपया नीचे दिए गए चरणों में अपने अनुभव का मूल्यांकन (1 से 5 स्टार) करें।
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="feedback-form" noValidate>
                    {/* SECTION 1: Customer Details */}
                    <div className="form-section">
                        <div className="section-header">
                            <User className="section-icon" />
                            <div>
                                <h2 className="section-title">1. ग्राहक एवं इंस्टॉलेशन विवरण</h2>
                                <p className="section-subtitle">Customer & System Details</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            {/* Customer Name */}
                            <div className="form-group">
                                <label htmlFor="customerName" className="input-label">
                                    ग्राहक का नाम (Customer Name) <span className="req">*</span>
                                </label>
                                <div className="input-wrap">
                                    <User className="input-icon" />
                                    <input
                                        id="customerName"
                                        type="text"
                                        className="text-input"
                                        placeholder="उदा. राजेश कुमार"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="form-group">
                                <label htmlFor="customerMobile" className="input-label">
                                    मोबाइल नंबर (Phone Number) <span className="req">*</span>
                                </label>
                                <div className="input-wrap">
                                    <span className="prefix-tag">🇮🇳 +91</span>
                                    <input
                                        id="customerMobile"
                                        type="tel"
                                        className="text-input pl-14"
                                        placeholder="10 अंकों का मोबाइल नंबर"
                                        value={customerMobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setCustomerMobile(val);
                                        }}
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="form-group">
                                <label htmlFor="submissionDate" className="input-label">
                                    दिनांक (Date)
                                </label>
                                <div className="input-wrap">
                                    <Calendar className="input-icon" />
                                    <input
                                        id="submissionDate"
                                        type="date"
                                        className="text-input"
                                        value={submissionDate}
                                        onChange={(e) => setSubmissionDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="form-group">
                                <label htmlFor="location" className="input-label">
                                    स्थान / पता (Location / Area)
                                </label>
                                <div className="input-wrap">
                                    <MapPin className="input-icon" />
                                    <input
                                        id="location"
                                        type="text"
                                        className="text-input"
                                        placeholder="उदा. शिवपुर, वाराणसी या बलिया"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Solar Capacity selection */}
                        <div className="capacity-group">
                            <label className="input-label">
                                <Zap className="w-4 h-4 inline mr-1 text-amber-500" />
                                सोलर क्षमता (Solar Capacity in kW):
                            </label>
                            <div className="capacity-chips">
                                {CAPACITY_PRESETS.map((cap) => (
                                    <button
                                        key={cap}
                                        type="button"
                                        className={`cap-chip ${solarCapacity === cap ? 'active' : ''}`}
                                        onClick={() => setSolarCapacity(cap)}
                                    >
                                        {cap}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className={`cap-chip ${solarCapacity === 'other' ? 'active' : ''}`}
                                    onClick={() => setSolarCapacity('other')}
                                >
                                    अन्य (Custom)
                                </button>
                            </div>
                            {solarCapacity === 'other' && (
                                <input
                                    type="text"
                                    className="text-input mt-2"
                                    placeholder="अपनी सोलर क्षमता लिखें (उदा. 7.5 kW)"
                                    value={customCapacity}
                                    onChange={(e) => setCustomCapacity(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: Rating Scale Guide */}
                    <div className="scale-guide-card">
                        <div className="scale-guide-header">
                            <Award className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-xs tracking-wider uppercase text-emerald-800">
                                मूल्यांकन पैमाना (Rating Scale):
                            </span>
                        </div>
                        <div className="scale-badges-grid">
                            {[1, 2, 3, 4, 5].map((lvl) => {
                                const info = RATING_LABELS[lvl];
                                return (
                                    <div key={lvl} className="scale-badge-item">
                                        <span className="scale-num">{lvl} ⭐</span>
                                        <span className="scale-text">
                                            {info.emoji} {info.hindi} ({info.english})
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION 3: 7 Installation Stages */}
                    <div className="form-section">
                        <div className="section-header-flex">
                            <div className="flex items-center gap-2">
                                <Award className="section-icon" />
                                <div>
                                    <h2 className="section-title">2. इंस्टॉलेशन के चरण (Installation Stages)</h2>
                                    <p className="section-subtitle">प्रत्येक चरण को 1 से 5 स्टार रेटिंग दें</p>
                                </div>
                            </div>
                            <div className="live-score-pill">
                                <span>प्रगति:</span>
                                <strong className="text-emerald-700">{ratedCount}/8 चरण</strong>
                                {averageRating !== '—' && (
                                    <span className="text-xs text-amber-600 font-bold ml-1">({averageRating} ⭐)</span>
                                )}
                            </div>
                        </div>

                        <div className="stages-list">
                            {STAGES.map((stage) => {
                                const currentRating = ratings[stage.key] || 0;
                                const hoverVal = hoveredStars[stage.key] || 0;
                                const activeVal = hoverVal || currentRating;
                                const labelInfo = activeVal > 0 ? RATING_LABELS[activeVal] : null;

                                return (
                                    <div key={stage.id} className="stage-card">
                                        <div className="stage-card-header">
                                            <div className="stage-num-badge">{stage.id}</div>
                                            <div className="stage-titles">
                                                <h3 className="stage-hindi">{stage.titleHindi}</h3>
                                                <p className="stage-english">{stage.titleEnglish}</p>
                                                <p className="stage-desc">{stage.desc}</p>
                                            </div>
                                        </div>

                                        <div className="stars-interactive-row">
                                            <div className="stars-wrapper" role="radiogroup" aria-label={stage.titleHindi}>
                                                {[1, 2, 3, 4, 5].map((starNum) => {
                                                    const isFilled = starNum <= (hoverVal || currentRating);
                                                    return (
                                                        <button
                                                            key={starNum}
                                                            type="button"
                                                            className={`star-button ${isFilled ? 'filled' : 'empty'}`}
                                                            onClick={() => handleRatingSelect(stage.key, starNum)}
                                                            onMouseEnter={() =>
                                                                setHoveredStars((prev) => ({ ...prev, [stage.key]: starNum }))
                                                            }
                                                            onMouseLeave={() =>
                                                                setHoveredStars((prev) => ({ ...prev, [stage.key]: 0 }))
                                                            }
                                                            aria-label={`${starNum} Star`}
                                                        >
                                                            <Star 
                                                                className={`star-icon ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                                                            />
                                                            <span className="star-num-label">{starNum}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Dynamic Rating Label */}
                                            {labelInfo ? (
                                                <div 
                                                    className="current-rating-badge active"
                                                    style={{ borderColor: labelInfo.color, color: labelInfo.color }}
                                                >
                                                    <span>{labelInfo.emoji}</span>
                                                    <span className="font-semibold">{labelInfo.hindi}</span>
                                                    <span className="text-xs opacity-75">({activeVal}/5)</span>
                                                </div>
                                            ) : (
                                                <div className="current-rating-badge unrated">
                                                    <span>⭐ स्टार चुनें (Tap to Rate)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION 4: Additional Comments / Suggestions */}
                    <div className="form-section">
                        <div className="section-header">
                            <MessageSquare className="section-icon" />
                            <div>
                                <h2 className="section-title">3. अतिरिक्त सुझाव या टिप्पणियां</h2>
                                <p className="section-subtitle">Additional Comments / Suggestions</p>
                            </div>
                        </div>

                        <div className="preset-chips-wrap">
                            <span className="preset-label">त्वरित सुझाव (क्लिक करें):</span>
                            {[
                                'सर्विस बहुत अच्छी लगी',
                                'टीम का काम बहुत तेज और साफ था',
                                'सब्सिडी प्रक्रिया में पूरी मदद मिली',
                                'सोलर से बिजली बिल शून्य हो गया',
                            ].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    className="preset-chip"
                                    onClick={() => handlePresetComment(preset)}
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="comments-textarea"
                            rows={3}
                            placeholder="कृपया यहाँ अपने कोई अन्य विचार, सुझाव या अनुभव साझा करें..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </div>

                    {/* SECTION 5: Customer Verification / Signature */}
                    <div className="form-section signature-section">
                        <div className="verification-box">
                            <label className="checkbox-label" onClick={() => setVerifiedCheck(!verifiedCheck)}>
                                <div className={`custom-checkbox ${verifiedCheck ? 'checked' : ''}`}>
                                    {verifiedCheck && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                                <span className="checkbox-text">
                                    <strong>ग्राहक सत्यापन (Customer Confirmation):</strong> मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई सभी रेटिंग मेरे वास्तविक सोलर इंस्टॉलेशन अनुभव पर आधारित हैं।
                                </span>
                            </label>

                            <div className="signature-input-row">
                                <label htmlFor="customerSig" className="sig-label">
                                    ग्राहक के हस्ताक्षर / नाम (Customer Signature):
                                </label>
                                <input
                                    id="customerSig"
                                    type="text"
                                    className="sig-input"
                                    placeholder="अपना पूरा नाम लिखें"
                                    value={customerSignature}
                                    onChange={(e) => setCustomerSignature(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 6: Google Review Call-To-Action Banner at Last */}
                    <div className="google-review-box form-cta">
                        <div className="google-header-row">
                            <div className="google-logo-badge">
                                <span className="google-g font-bold text-xl">G</span>
                                <span className="font-semibold text-gray-800 text-sm">Google Review</span>
                            </div>
                            <span className="badge-highlight">⭐⭐⭐⭐⭐ 5-स्टार रेटिंग</span>
                        </div>

                        <h3 className="google-review-title">
                            Google पर भी हमें 5-स्टार रेटिंग देकर अपना अनुभव साझा करें!
                        </h3>
                        <p className="google-review-desc">
                            क्रिशननुजा रेन्यूएबल्स (Arpit Solar Shop) के साथ अपने सकारात्मक अनुभव को Google Maps पर रेटिंग देकर अन्य लोगों तक पहुंचाएं:
                        </p>

                        <a
                            href={GOOGLE_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setGoogleClicked(true)}
                            className="google-action-btn"
                        >
                            <span className="star-burst">⭐⭐⭐⭐⭐</span>
                            <span className="btn-text">Google पर 5-स्टार रिव्यू दें (Review on Google)</span>
                            <ExternalLink className="w-5 h-5 ml-1" />
                        </a>
                    </div>

                    {/* Error Notice */}
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div 
                                className="error-alert"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                ⚠️ {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="submit-row">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    फीडबैक सबमिट हो रहा है...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    फीडबैक फॉर्म सबमिट करें (Submit Feedback)
                                </span>
                            )}
                        </button>
                        <p className="privacy-note">
                            🔒 आपकी प्रतिक्रिया पूर्णतः सुरक्षित है और क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड द्वारा गुणवत्ता सुधार हेतु उपयोग की जाएगी।
                        </p>
                    </div>
                </form>

                {/* Footer info */}
                <footer className="form-footer">
                    <p className="footer-company">
                        <strong>Arpit Solar Shop</strong> • क्रिशननुजा रेन्यूएबल्स प्राइवेट लिमिटेड
                    </p>
                    <p className="footer-address">
                        हेड ऑफिस: शिवपुर, वाराणसी 221003 | हेल्पलाइन: +91 9005770466, 9044555572
                    </p>
                </footer>
            </motion.div>
        </div>
    );
}

// ─── Stylesheet ─────────────────────────────────────────────────────────────
const feedbackStyles = `
/* Theme Tokens */
:root {
    --feed-primary: #1B5445;
    --feed-primary-dark: #0E3C30;
    --feed-accent: #A2B92B;
    --feed-gold: #F59E0B;
    --feed-bg: #F4F8F5;
    --feed-card-bg: #FFFFFF;
    --feed-border: #DCE7E1;
}

* {
    box-sizing: border-box;
}

.feedback-container {
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(180deg, #EDF5F0 0%, #FFFFFF 40%, #F4F8F5 100%);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px 14px 60px;
    font-family: 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif;
    color: #0E3C30;
}

.feedback-card, .success-wrapper {
    width: 100%;
    max-width: 760px;
    background: #FFFFFF;
    border-radius: 24px;
    border: 1px solid #D9E6DF;
    box-shadow: 
        0 2px 4px rgba(14, 60, 48, 0.04),
        0 16px 40px -10px rgba(27, 84, 69, 0.12);
    overflow: hidden;
}

/* Header */
.brand-header {
    background: linear-gradient(180deg, #F5FAF7 0%, #FFFFFF 100%);
    border-bottom: 1px solid #E2EDE7;
    padding: 28px 24px 20px;
    text-align: center;
}

.header-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
}

.brand-logo {
    height: 42px;
    width: auto;
    object-fit: contain;
}

.company-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #E8F5ED;
    border: 1px solid #C4E6D2;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    color: #1B5445;
}

.title-section {
    margin-bottom: 16px;
}

.main-title {
    font-size: 24px;
    font-weight: 800;
    color: #0E3C30;
    margin: 0 0 4px;
    line-height: 1.3;
}

.english-title {
    font-size: 13px;
    color: #4A6B60;
    font-weight: 500;
    margin: 0 0 8px;
}

.company-sub-badge {
    display: inline-block;
    background: #F0F7F3;
    color: #1B5445;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid #D6E8DE;
}

.welcome-banner {
    background: #F7FAF8;
    border: 1px solid #D8E8DF;
    border-left: 4px solid #1B5445;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.6;
    color: #2D4C42;
    text-align: left;
}

/* Form Sections */
.feedback-form {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-section {
    background: #FFFFFF;
    border: 1px solid #E5EFE9;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.section-header, .section-header-flex {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #EEF5F1;
}

.section-header-flex {
    justify-content: space-between;
    flex-wrap: wrap;
}

.section-icon {
    width: 22px;
    height: 22px;
    color: #1B5445;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: #0E3C30;
    margin: 0;
}

.section-subtitle {
    font-size: 12px;
    color: #648278;
    margin: 2px 0 0;
}

.live-score-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #EAF7EE;
    border: 1px solid #BFE7CA;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    color: #0E3C30;
}

/* Grid for details */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    .feedback-form {
        padding: 16px 12px;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: #1B5445;
}

.req {
    color: #EF4444;
}

.input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    width: 17px;
    height: 17px;
    color: #688C80;
    pointer-events: none;
}

.prefix-tag {
    position: absolute;
    left: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #1B5445;
    background: #E8F2EC;
    padding: 3px 6px;
    border-radius: 6px;
    pointer-events: none;
}

.text-input {
    width: 100%;
    height: 44px;
    padding: 0 12px 0 38px;
    border: 1.5px solid #CFDFD6;
    border-radius: 10px;
    font-size: 14px;
    color: #0E3C30;
    background: #FAFCFB;
    transition: all 0.2s;
    outline: none;
}

.text-input.pl-14 {
    padding-left: 78px;
}

.text-input:focus {
    border-color: #1B5445;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(27, 84, 69, 0.12);
}

/* Capacity Chips */
.capacity-group {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px dashed #E2EDE7;
}

.capacity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.cap-chip {
    padding: 7px 14px;
    border-radius: 999px;
    border: 1.5px solid #D0E0D7;
    background: #F8FAF9;
    font-size: 12px;
    font-weight: 600;
    color: #254F42;
    cursor: pointer;
    transition: all 0.15s;
}

.cap-chip:hover {
    border-color: #1B5445;
    background: #EDF6F1;
}

.cap-chip.active {
    background: #1B5445;
    border-color: #1B5445;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(27, 84, 69, 0.25);
}

/* Scale Guide Card */
.scale-guide-card {
    background: #F6FAF7;
    border: 1px solid #D4E5DC;
    border-radius: 14px;
    padding: 14px 18px;
}

.scale-guide-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
}

.scale-badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 8px;
}

.scale-badge-item {
    background: #FFFFFF;
    border: 1px solid #DDEBE3;
    padding: 6px 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.scale-num {
    font-size: 11px;
    font-weight: 700;
    color: #B45309;
}

.scale-text {
    font-size: 11px;
    color: #2D4C42;
    margin-top: 2px;
    font-weight: 600;
}

/* Stage Cards */
.stages-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.stage-card {
    background: #FDFEFE;
    border: 1.5px solid #E1EBE5;
    border-radius: 14px;
    padding: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.stage-card:hover {
    border-color: #A2B92B;
    box-shadow: 0 4px 14px rgba(162, 185, 43, 0.08);
}

.stage-card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
}

.stage-num-badge {
    background: #1B5445;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 800;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
}

.stage-titles {
    flex: 1;
}

.stage-hindi {
    font-size: 15px;
    font-weight: 700;
    color: #0E3C30;
    margin: 0;
    line-height: 1.35;
}

.stage-english {
    font-size: 12px;
    font-weight: 600;
    color: #4A6E62;
    margin: 1px 0 3px;
}

.stage-desc {
    font-size: 11px;
    color: #6C8B80;
    margin: 0;
    line-height: 1.4;
}

/* Star Buttons */
.stars-interactive-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px dashed #E5EFE9;
}

.stars-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.star-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.15s ease;
}

.star-button:hover {
    transform: scale(1.22);
}

.star-button:active {
    transform: scale(0.95);
}

.star-icon {
    width: 32px;
    height: 32px;
    transition: all 0.15s ease;
}

.star-num-label {
    font-size: 10px;
    font-weight: 700;
    color: #8CA69C;
    margin-top: 2px;
}

.current-rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1.5px solid;
    padding: 4px 12px;
    border-radius: 999px;
    background: #FFFFFF;
    font-size: 12px;
    animation: fadeIn 0.2s ease;
}

.current-rating-badge.unrated {
    border: 1.5px dashed #CBDDD3;
    color: #55796D;
    background: #F4F8F5;
    font-size: 11px;
    font-weight: 600;
}

/* Comments */
.comments-textarea {
    width: 100%;
    padding: 12px;
    border: 1.5px solid #CFDFD6;
    border-radius: 10px;
    font-size: 13px;
    font-family: inherit;
    color: #0E3C30;
    background: #FAFCFB;
    outline: none;
    resize: vertical;
}

.comments-textarea:focus {
    border-color: #1B5445;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(27, 84, 69, 0.12);
}

.preset-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
}

.preset-label {
    font-size: 11px;
    font-weight: 600;
    color: #648278;
}

.preset-chip {
    background: #EDF5F0;
    border: 1px solid #CCE2D6;
    color: #1B5445;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
}

.preset-chip:hover {
    background: #1B5445;
    color: #FFFFFF;
}

/* Verification */
.verification-box {
    background: #F9FCFA;
    border: 1px solid #D6E8DE;
    padding: 16px;
    border-radius: 12px;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
}

.custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #1B5445;
    border-radius: 5px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.15s;
}

.custom-checkbox.checked {
    background: #1B5445;
}

.checkbox-text {
    font-size: 13px;
    line-height: 1.5;
    color: #1B5445;
}

.signature-input-row {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px dashed #D6E8DE;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.sig-label {
    font-size: 13px;
    font-weight: 700;
    color: #0E3C30;
}

.sig-input {
    flex: 1;
    min-width: 200px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid #C4D9CD;
    border-radius: 8px;
    font-size: 14px;
    font-style: italic;
    background: #FFFFFF;
    outline: none;
}

.sig-input:focus {
    border-color: #1B5445;
}

/* Google Review Card */
.google-review-box {
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFFBEB 100%);
    border: 2px solid #FCD34D;
    border-radius: 18px;
    padding: 22px;
    text-align: center;
    box-shadow: 0 8px 24px -6px rgba(245, 158, 11, 0.2);
    position: relative;
    overflow: hidden;
}

.google-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.google-logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid #E5E7EB;
}

.google-g {
    background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) text;
    -webkit-text-fill-color: transparent;
}

.badge-highlight {
    background: #F59E0B;
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 999px;
}

.google-review-title {
    font-size: 18px;
    font-weight: 800;
    color: #92400E;
    margin: 0 0 6px;
    line-height: 1.35;
}

.google-review-desc {
    font-size: 13px;
    color: #78350F;
    margin: 0 0 16px;
    line-height: 1.5;
}

.google-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #1B5445 0%, #0E3C30 100%);
    color: #FFFFFF;
    text-decoration: none;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(27, 84, 69, 0.35);
    transition: all 0.2s;
    width: 100%;
}

.google-action-btn:hover {
    background: linear-gradient(135deg, #226956 0%, #134B3D 100%);
    box-shadow: 0 8px 24px rgba(27, 84, 69, 0.45);
    transform: translateY(-1px);
}

.google-link-copy {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* Submit row */
.submit-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
}

.submit-button {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #1B5445 0%, #0E3C30 100%);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(27, 84, 69, 0.3);
    transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(27, 84, 69, 0.4);
}

.submit-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.privacy-note {
    font-size: 11px;
    color: #648278;
    text-align: center;
    margin: 0;
}

.error-alert {
    background: #FEF2F2;
    border: 1px solid #FCA5A5;
    color: #B91C1C;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
}

/* Footer */
.form-footer {
    background: #F9FCFA;
    border-top: 1px solid #E2EDE7;
    padding: 18px 24px;
    text-align: center;
}

.footer-company {
    font-size: 13px;
    color: #0E3C30;
    margin: 0 0 4px;
}

.footer-address {
    font-size: 11px;
    color: #648278;
    margin: 0;
}

/* Success View */
.success-wrapper {
    padding: 28px 22px;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.success-header-card {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.celebration-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FEF3C7;
    border: 1px solid #FDE68A;
    color: #92400E;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 12px;
}

.success-icon-ring {
    width: 76px;
    height: 76px;
    background: #EAF7EE;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 0 0 8px #F2FAF5;
}

.success-title {
    font-size: 24px;
    font-weight: 800;
    color: #0E3C30;
    margin: 0 0 6px;
}

.success-subtitle {
    font-size: 14px;
    color: #4A6E62;
    margin: 0 0 16px;
    max-width: 520px;
}

.overall-score-pill {
    background: #F0F9F3;
    border: 1.5px solid #C5E5D1;
    border-radius: 16px;
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.score-value {
    display: flex;
    align-items: baseline;
}

/* Receipt */
.feedback-receipt-card {
    background: #FAFCFB;
    border: 1px solid #DCECE2;
    border-radius: 16px;
    padding: 18px;
}

.receipt-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    color: #1B5445;
    margin: 0 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #E5EFE9;
}

.print-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #FFFFFF;
    border: 1px solid #CDE2D6;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #1B5445;
    cursor: pointer;
}

.receipt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
}

@media (max-width: 500px) {
    .receipt-grid {
        grid-template-columns: 1fr;
    }
}

.receipt-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 6px 10px;
    background: #FFFFFF;
    border: 1px solid #E8F0EB;
    border-radius: 8px;
}

.r-label {
    color: #6C8B80;
}

.r-value {
    font-weight: 700;
    color: #0E3C30;
}

.stages-summary-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-top: 1px dashed #DCECE2;
    padding-top: 12px;
}

.stages-summary-title {
    font-size: 12px;
    font-weight: 700;
    color: #1B5445;
    margin: 0 0 6px;
}

.stage-receipt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 4px 0;
}

.stage-receipt-name {
    color: #2D4C42;
    max-width: 70%;
}

.stage-receipt-stars {
    font-weight: 700;
    color: #B45309;
}

.receipt-comments {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed #DCECE2;
}

.r-comment-text {
    font-size: 12px;
    color: #254F42;
    font-style: italic;
    margin: 4px 0 0;
}

/* Success Footer */
.success-footer-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.reload-btn, .whatsapp-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
}

.reload-btn {
    background: #F1F6F3;
    border: 1px solid #CFE0D7;
    color: #1B5445;
}

.whatsapp-btn {
    background: #25D366;
    border: none;
    color: #FFFFFF;
}

.whatsapp-btn:hover {
    background: #20BD5A;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
`;
