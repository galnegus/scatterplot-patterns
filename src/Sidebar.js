import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Tabs, Tab, Intent, Popover, Position, Menu, MenuDivider, MenuItem, Button } from '@blueprintjs/core';
import ScatterplotOptions from './ScatterplotOptions';
import DataOptions from './DataOptions';
import PatternsOptions from './PatternsOptions';

export default function Sidebar({ scatterplot }) {
  const isDarkTheme = useSelector((state) => state.isDarkTheme);

  const menu = (
    <Menu>
      <MenuDivider title="User Mode" />
      <MenuItem icon="person" text="Simple" />
      <MenuItem icon="learning" text="Expert" />
      <MenuItem icon="predictive-analysis" text="Testing" />
    </Menu>
  );

  return (
    <Card className={`card-sidebar ${isDarkTheme ? 'bp3-dark' : ''}`} elevation={2}>
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={menu}
        className='card-sidebar-settings'
      >
        <Button
          icon="cog"
          intent={Intent.PRIMARY}
          minimal={true}
        />
      </Popover>

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

        .card-sidebar-settings {
          position: absolute;
          top: 5px;
          right: -8px;
          z-index: 1;

          transform: translateX(-100%);
        }

        .bp3-tab-list {
          justify-content: center;
        }
      `}</style>
    </Card>
  );
}
