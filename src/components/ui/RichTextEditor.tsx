"use client";

import { useEffect, useRef, useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);
    const onChangeRef = useRef(onChange);

    // Keep onChange ref up-to-date without re-triggering effect
    onChangeRef.current = onChange;

    const initQuill = useCallback(() => {
        if (!editorRef.current || quillInstance.current) return;

        const Quill = (window as any).Quill;
        if (!Quill) return;

        quillInstance.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder || 'Write something amazing...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        // Handle content changes
        quillInstance.current.on('text-change', () => {
            const html = quillInstance.current.root.innerHTML;
            if (html && html !== '<p><br></p>') {
                onChangeRef.current(html);
            } else {
                onChangeRef.current('');
            }
        });

        // Set initial value
        if (value) {
            quillInstance.current.root.innerHTML = value;
        }
    }, [placeholder, value]);

    // Load Quill script and initialize
    useEffect(() => {
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="quill.snow.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';
            document.head.appendChild(link);
        }

        // If Quill is already loaded (e.g. tab switch back), init immediately
        if ((window as any).Quill) {
            initQuill();
            return;
        }

        // Load Quill script if not already loaded
        if (!document.querySelector('script[src*="quill.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js';
            script.onload = () => initQuill();
            document.body.appendChild(script);
        } else {
            // Script tag exists but hasn't finished loading yet - poll for it
            const interval = setInterval(() => {
                if ((window as any).Quill) {
                    clearInterval(interval);
                    initQuill();
                }
            }, 100);
            return () => clearInterval(interval);
        }

        // Cleanup on unmount
        return () => {
            if (quillInstance.current) {
                quillInstance.current.off('text-change');
                quillInstance.current = null;
            }
            // Clear the editor container so Quill can reinitialize fresh
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
        };
    }, [initQuill]);

    // Sync external value changes (e.g. draft restore)
    useEffect(() => {
        if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            if (!quillInstance.current.hasFocus()) {
                quillInstance.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <div className="bg-white rounded-md">
            <div ref={editorRef} style={{ height: '300px', marginBottom: '50px' }} />
        </div>
    );
}
