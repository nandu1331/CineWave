import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";

export default function VideoPlayer({
    id,
    isPlaying,
    setIsPlaying,
    videoRef,
    mediaType,
    trailer,
    volume,
    videoProgress,
    setVideoProgress
}) {

    const handleVideoReady = () => {
        if (videoRef.current) {
            videoRef.current.seekTo(videoProgress, "seconds");
        }
    };

    const progressHandler = (progress) => {
        setVideoProgress(progress.playedSeconds);
        if (progress.played >= 0.85) {
            setIsPlaying(false);
            setVideoProgress(0);
        }
    };

    return (
        <div className="h-full w-full relative overflow-hidden">
            {trailer && 
                <div className="absolute inset-0 scale-[1.75] md:scale-[1.45] lg:scale-[1.37]">
                    <ReactPlayer
                        ref={videoRef}
                        url={`https://www.youtube.com/watch?v=${trailer.key}`}
                        playing={isPlaying}
                        controls={false}
                        height="100%"
                        width="100%"
                        onReady={handleVideoReady}
                        onPause={() => setIsPlaying(false)}
                        progressInterval={500}
                        onProgress={progressHandler}
                        volume={volume}
                    />
                </div>
            }
        </div>
    )
}