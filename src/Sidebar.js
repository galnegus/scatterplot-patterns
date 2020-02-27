import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Tabs, Tab } from '@blueprintjs/core';
import ScatterplotOptions from './ScatterplotOptions';
import DataOptions from './DataOptions';
import PatternsOptions from './PatternsOptions';

export default function Sidebar({ scatterplot }) {
  const isDarkTheme = useSelector((state) => state.isDarkTheme);

  return (
    <Card className={`card-sidebar ${isDarkTheme ? 'bp3-dark' : ''}`} elevation={2}>
      <Tabs
        id="sidebar-tabs"
      >
        <Tab
          title="Scatterplot"
          id="scatterplot-options-tab"
          panel={<ScatterplotOptions scatterplot={scatterplot} />}
        />
        <Tab
          title="Data"
          id="data-options-tab"
          panel={<DataOptions scatterplot={scatterplot} />}
        />
        <Tab
          title="Patterns"
          id="patterns-options-tab"
          panel={<PatternsOptions scatterplot={scatterplot} />}
        />
      </Tabs>
      
      <style jsx global>{`
        .card-sidebar {
          width: 300px;
          border-radius: 0;
          overflow-y: scroll;
          overflow-x: hidden;
        }

        .bp3-tab-list {
          justify-content: center;
        }
      `}</style>
    </Card>
  );
}
