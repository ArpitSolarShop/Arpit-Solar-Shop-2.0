"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SolarChatWidget from "@/components/chat-widget/SolarChatWidget";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-solar-orange to-solar-gold shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="lg"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>

      <SolarChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}






// // File: FloatingChatButton.tsx
// import React, { useState } from "react";
// import { MessageCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import SolarChatWidget from "@/components/chat-widget/SolarChatWidget";

// export default function FloatingChatButton() {
//   const [isOpen, setIsOpen] = useState(false);
//   const openChat = () => setIsOpen(true);
//   const closeChat = () => setIsOpen(false);

//   return (
//     <>
//       <Button
//         onClick={openChat}
//         size="lg"
//         className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-solar-orange to-solar-gold shadow-lg hover:shadow-xl transition-all duration-300 z-50"
//         aria-label="Open Solar Chat Assistant"
//       >
//         <MessageCircle className="w-6 h-6 text-white" />
//       </Button>

//       <SolarChatWidget isOpen={isOpen} onClose={closeChat} />
//     </>
//   );
// }

