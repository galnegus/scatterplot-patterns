import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button } from '@blueprintjs/core';

export default function PatternHeader({ patternKey, category, setIsOpen, isOpen }) {
  const categoryColors = useSelector((state) => state.categoryColors, shallowEqual);
  const clickHandler = () => setIsOpen(!isOpen);

  return (
    <Button className="pattern-button" minimal={true} fill={true} active={isOpen} onClick={clickHandler}>
      <div className="pattern-header">
        <div className="pattern-title">
          <b>Pattern: </b> #{patternKey}
        </div>
        <div className="pattern-category">
          <div style={{ backgroundColor: categoryColors[category] }} className="pattern-category__color-box" />
        </div>

        <style jsx global>{`
          .pattern-button .bp3-button-text {
            width: 100%;
          }
        `}</style>
        <style jsx>{`
          .pattern-header {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .pattern-title {
            flex-grow: 1;
          }

          .pattern-category__color-box {
            float: left;
            width: 20px;
            height: 20px;
            margin: 5px;
            border: 1px solid rgba(0, 0, 0, .2);
          }
        `}</style>
      </div>
    </Button>
  );  
}
