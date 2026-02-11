"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const handleShare = () => {
        const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        if (navigator.share) {
            navigator.share({
                title: title,
                text: text || title,
                url: shareUrl,
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
        >
            <Share2 className="w-4 h-4" />
            Share
        </Button>
    );
}
