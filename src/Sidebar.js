import React from 'react';
import { Card, Tabs, Tab } from '@blueprintjs/core';
import WingletsOptions from './WingletsOptions';
import DataOptions from './DataOptions';

export default function Sidebar({ scatterplot }) {
  return (
    <Card className="card-sidebar bp3-dark" elevation={4}>
      <Tabs
        id="sidebar-tabs"
      >
        <Tab
          title="Winglets options"
          id="winglets-options-tab"
          panel={<WingletsOptions scatterplot={scatterplot} />}
        />
        <Tab
          title="Data options"
          id="data-options-tab"
          panel={<DataOptions scatterplot={scatterplot} />}
        />
      </Tabs>
      
      <style jsx global>{`
        .card-sidebar {
          width: 300px;
          border-radius: 0;
          overflow-y: scroll;
        }

        .bp3-tab-list {
          justify-content: center;
        }
      `}</style>
    </Card>
  );
}
