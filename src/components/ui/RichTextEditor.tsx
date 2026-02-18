"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize Quill once script is loaded
    useEffect(() => {
        if (isLoaded && editorRef.current && !quillInstance.current && (window as any).Quill) {
            const Quill = (window as any).Quill;

            // Initialize Quill
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

            // Handle Change
            quillInstance.current.on('text-change', () => {
                const html = quillInstance.current.root.innerHTML;
                if (html && html !== '<p><br></p>') {
                    onChange(html);
                } else {
                    onChange('');
                }
            });

            // Set initial value
            if (value) {
                quillInstance.current.root.innerHTML = value;
            }
        }
    }, [isLoaded, placeholder]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update content if value changes externally (and not focused)
    useEffect(() => {
        if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            // Only update if significantly different to avoid cursor jumping
            // primitive check, but usually sufficient for "initial load" or "reset"
            if (!quillInstance.current.hasFocus()) {
                quillInstance.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
            <Script
                src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"
                strategy="afterInteractive"
                onLoad={() => setIsLoaded(true)}
            />

            <div className="bg-white rounded-md">
                <div ref={editorRef} style={{ height: '300px', marginBottom: '50px' }} />
            </div>
        </>
    );
}
