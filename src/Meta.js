import React from 'react';

export default function Meta() {
  return (
    <>
      <style jsx global>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        .bp3-collapse-body {
          padding: 10px 0;
        }

        .bp3-form-group {
          margin-bottom: 0px;
        }

        .bp3-form-group.bp3-inline label.bp3-label {
          margin-right: 20px;
          min-width: 70px;
        }

        .circle-picker {
          margin-top: 5px;
        }
      `}</style>
    </>
  );
}
