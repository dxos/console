//
// Copyright 2021 DXOS.org
//

import * as d3 from 'd3';
import EventEmitter from 'events';
import React, { useEffect, useRef, useState } from 'react';
import useResizeAware from 'react-resize-aware';
import { useInView } from 'react-intersection-observer';

import { makeStyles } from '@material-ui/core';
import { Public as PublicIcon, } from '@material-ui/icons';

import { Globe } from '@dxos/gem-globe';
import TopologyData from '@dxos/gem-globe/dist/data/110m.json';

const globeStyles = {
  background: {
    fillStyle: '#2a2e2f'
  },

  land: {
    fillStyle: '#111111'
  },

  line: {
    strokeStyle: '#CCC',
    strokeWidth: 0.5
  },

  point: {
    fillStyle: '#CCC',
    strokeStyle: '#CCC',
    strokeWidth: 1,
    radius: 0.25
  }
};

const useStyles = makeStyles(theme => ({
  panel: {
    display: 'flex',
    flex: 1
  }
}));

const startingPoint = [
  -126.41086746853892,
  40.22010998677698,
  -35.05062057458603
];

/**
 * Displays the config panel
 * @constructor
 */
export const NetworkPanel = () => {
  const classes = useStyles();
  const [resizeListener, { width, height }] = useResizeAware();
  const globeEventEmitter = useRef(new EventEmitter());
  const [rotation, setRotation] = useState(startingPoint);
  const { ref: inViewRef, inView } = useInView();

  // TODO(burdon): Convert Globe to use TS.

  const handleDrag = ({ rotation: currentRotation }) => {
    console.log('::::', currentRotation);
    setRotation(currentRotation);
  };

  useEffect(() => {
    if (inView) {
      globeEventEmitter.current.on('update', handleDrag);
    }

    return () => {
      globeEventEmitter.current.removeAllListeners();
    };
  }, [inView]);

  return (
    <div ref={inViewRef} className={classes.panel}>
      {resizeListener}
      <Globe
        drag={true}
        events={globeEventEmitter.current}
        styles={globeStyles}
        topology={TopologyData}
        projection={d3.geoMercator}
        rotation={rotation}
        width={width}
        height={height}
        scale={0.6}
      />
    </div>
  );
};

NetworkPanel.Icon = PublicIcon;
