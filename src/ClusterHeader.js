import React from 'react';

export default function ClusterHeader({ clusterKey, category }) {
  return (
    <div className="cluster-header">
      <div className="cluster-title">
        <b>Key: </b> 
      </div>
      <div className="cluster-category">
        <div className="cluster-category__color-box" />
      </div>

      <style jsx>{`
        .cluster-header {
          display: flex;
          align-items: center;
          padding: 10px;
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
  );  
}
