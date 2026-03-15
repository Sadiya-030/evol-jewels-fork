import React from "react";

const VideoLayer = ({ src }) => {
  return (
    <div className="w-full h-screen absolute top-0 left-0 z-0">
      <video
        src={src}
        loop
        autoPlay
        muted
        className="w-full h-full object-cover"
      ></video>
      <div className=" bg-blue-950/85 w-full h-full absolute top-0 left-0"></div>
    </div>
  );
};

export default VideoLayer;
