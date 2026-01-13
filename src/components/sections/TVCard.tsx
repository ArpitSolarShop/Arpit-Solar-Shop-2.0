// import React, { useRef, useState } from "react";
// import { Play, Pause } from "lucide-react";

// import Video1 from "@/assets/TV/Arpit_Solar_Shop_Installation_Video (1).mp4";
// import Video2 from "@/assets/TV/Arpit_Solar_Shop_Installation_Video.mp4";
// import Video3 from "@/assets/TV/Logo_T_Shirt_Video_Enhancement.mp4";

// const TVCard: React.FC = () => {
//   const videos = [Video1, Video2, Video3];
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(true);

//   const handlePlayPause = () => {
//     if (!videoRef.current) return;
//     if (isPlaying) {
//       videoRef.current.pause();
//     } else {
//       videoRef.current.play();
//     }
//   };

//   const handleVideoEnd = () => {
//     const nextIndex = (currentIndex + 1) % videos.length;
//     setCurrentIndex(nextIndex);
//     if (videoRef.current) {
//       videoRef.current.src = videos[nextIndex];
//       videoRef.current.play();
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center p-8">
//       <div className="w-full max-w-7xl">
//         <div
//           className="relative group rounded-lg overflow-hidden border-4 border-gray-300 shadow-md bg-transparent"
//           style={{ aspectRatio: "16/9" }}
//         >
//           <video
//             ref={videoRef}
//             className="w-full h-full block object-cover"
//             onPlay={() => setIsPlaying(true)}
//             onPause={() => setIsPlaying(false)}
//             onEnded={handleVideoEnd}
//             autoPlay
//             muted
//           >
//             <source src={videos[currentIndex]} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>

//           {/* Play/Pause overlay button */}
//           <div
//             className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300
//               ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
//           >
//             <button
//               onClick={handlePlayPause}
//               className="flex items-center justify-center w-20 h-20 bg-black/50 hover:bg-black/75 rounded-full text-white transition-transform transform hover:scale-110 focus:outline-none"
//               aria-label={isPlaying ? "Pause" : "Play"}
//             >
//               {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TVCard;








"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const Video1 = "/assets/TV/Arpit_Solar_Shop_Installation_Video (1).mp4";
const Video2 = "/assets/TV/Arpit_Solar_Shop_Installation_Video.mp4";
const Video3 = "/assets/TV/Logo_T_Shirt_Video_Enhancement.mp4";

const TVCard: React.FC = () => {
  const videos = [Video1, Video2, Video3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVideoEnd = () => {
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
    if (videoRef.current) {
      videoRef.current.src = videos[nextIndex];
      videoRef.current.play();
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-8">
      <div className="w-full max-w-7xl">
        <div
          className="relative group rounded-lg overflow-hidden border-4 border-gray-300 shadow-md bg-transparent"
          style={{ aspectRatio: "16/9" }}
        >
          <video
            ref={videoRef}
            className="w-full h-full block object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideoEnd}
            autoPlay
            muted={isMuted}
          >
            <source src={videos[currentIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause overlay button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300
              ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
          >
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-20 h-20 bg-black/50 hover:bg-black/75 rounded-full text-white transition-transform transform hover:scale-110 focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
            </button>
          </div>

          {/* Sound (Mute/Unmute) button at bottom-right */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleMuteToggle}
              className="flex items-center justify-center w-14 h-14 bg-black/50 hover:bg-black/75 rounded-full text-white transition-transform transform hover:scale-110 focus:outline-none"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVCard;
