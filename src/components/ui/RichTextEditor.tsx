"use client";

import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    const onChangeRef = useRef(onChange);
    const initialValueRef = useRef(value);

    // Keep refs current
    onChangeRef.current = onChange;

    // Load CSS once
    useEffect(() => {
        if (!document.querySelector('link[href*="quill.snow.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';
            document.head.appendChild(link);
        }
    }, []);

    // Load script & initialize editor
    useEffect(() => {
        let cancelled = false;

        function createEditor() {
            if (cancelled || !containerRef.current || quillRef.current) return;

            const Quill = (window as any).Quill;
            if (!Quill) return;

            const editorDiv = document.createElement('div');
            containerRef.current.appendChild(editorDiv);

            const q = new Quill(editorDiv, {
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

            // Set initial content
            if (initialValueRef.current) {
                q.root.innerHTML = initialValueRef.current;
            }

            // Listen for changes
            q.on('text-change', () => {
                const html = q.root.innerHTML;
                if (html && html !== '<p><br></p>') {
                    onChangeRef.current(html);
                } else {
                    onChangeRef.current('');
                }
            });

            quillRef.current = q;
        }

        // If Quill JS is already available, create editor immediately
        if ((window as any).Quill) {
            createEditor();
        } else if (!document.querySelector('script[src*="quill.js"]')) {
            // Load script for first time
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js';
            script.onload = () => createEditor();
            document.body.appendChild(script);
        } else {
            // Script exists but still loading — poll
            const interval = setInterval(() => {
                if ((window as any).Quill) {
                    clearInterval(interval);
                    createEditor();
                }
            }, 100);
            return () => clearInterval(interval);
        }

        // ALWAYS clean up on unmount
        return () => {
            cancelled = true;
            if (quillRef.current) {
                quillRef.current.off('text-change');
                quillRef.current = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync external value changes (e.g. draft restore, edit mode load)
    useEffect(() => {
        if (quillRef.current) {
            const currentHtml = quillRef.current.root.innerHTML;
            if (value !== currentHtml && !quillRef.current.hasFocus()) {
                quillRef.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <div className="bg-white rounded-md">
            <div ref={containerRef} style={{ minHeight: '350px', marginBottom: '50px' }} />
        </div>
    );
}
