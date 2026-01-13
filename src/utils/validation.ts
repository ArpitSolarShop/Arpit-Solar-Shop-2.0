/**
 * Validation utilities for forms and user input
 */

import { VALIDATION } from '@/config/constants';

/**
 * Validate Indian phone number (10 digits)
 */
export function isValidPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === VALIDATION.PHONE_MIN_LENGTH && /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validate Indian PIN code (6 digits)
 */
export function isValidPincode(pincode: string): boolean {
    const cleaned = pincode.replace(/\D/g, '');
    return cleaned.length === VALIDATION.PINCODE_LENGTH && /^\d{6}$/.test(cleaned);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate name (2-100 characters, letters and spaces only)
 */
export function isValidName(name: string): boolean {
    const trimmed = name.trim();
    return (
        trimmed.length >= VALIDATION.NAME_MIN_LENGTH &&
        trimmed.length <= VALIDATION.NAME_MAX_LENGTH &&
        /^[a-zA-Z\s]+$/.test(trimmed)
    );
}

/**
 * Sanitize user input (remove HTML tags, trim whitespace)
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim();
}

/**
 * Validate WhatsApp number (same as phone, but ensure it starts with 6-9)
 */
export function isValidWhatsAppNumber(number: string): boolean {
    return isValidPhoneNumber(number);
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
}
