import React from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from '@blueprintjs/core';

export default function LoadingOverlay() {
  const isLoading = useSelector((state) => state.isLoading);

  return (
    <div className="overlay" style={{ display: isLoading ? 'block' : 'none' }}>
      <div className="container">
        <Spinner
          size={200}
        />
        <span className="text bp3-text-muted">
          Loading
        </span>
      </div>
      
      <style jsx>
      {`
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-color: rgba(255, 255, 255, .2);
          backdrop-filter: blur(3px);
        }

        .container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: 200px;
          height: 200px;
          padding: 0px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, .05);
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
        }

        .text {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 2em;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          text-shadow: 0px 0px 8px rgba(0,0,0,0.8);
        }
      `}
      </style>
    </div>
  );
}
