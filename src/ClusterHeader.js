import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button } from '@blueprintjs/core';

export default function ClusterHeader({ clusterKey, category, setIsOpen, isOpen }) {
  const categoryColors = useSelector((state) => state.categoryColors, shallowEqual);
  const clickHandler = () => setIsOpen(!isOpen);

  return (
    <Button className="cluster-button" minimal={true} fill={true} active={isOpen} onClick={clickHandler}>
      <div className="cluster-header">
        <div className="cluster-title">
          <b>Cluster: </b> #{clusterKey}
        </div>
        <div className="cluster-category">
          <div style={{ backgroundColor: categoryColors[category] }} className="cluster-category__color-box" />
        </div>

        <style jsx global>{`
          .cluster-button .bp3-button-text {
            width: 100%;
          }
        `}</style>
        <style jsx>{`
          .cluster-header {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .cluster-title {
            flex-grow: 1;
          }

          .cluster-category__color-box {
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
