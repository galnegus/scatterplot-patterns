import React from 'react';
import { Button } from '@blueprintjs/core';

export default function Settings() {
  const clickHandler = () => console.log("HEJ");

  return (
    <div className="settings">
      <Button
        large={true}
        icon="cog"
        onClick={clickHandler}
      >
        Settings
      </Button>

      <style jsx>{`
        .settings {
          position: absolute;
          top: 0;
          right: 0;
          margin: 20px;
        }
      `}</style>
    </div>
  );
}
