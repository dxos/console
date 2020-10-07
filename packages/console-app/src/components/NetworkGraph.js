import React, { useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import { forceLink, forceSimulation, forceCenter, forceCollide, forceManyBody, forceRadial } from 'd3-force';

import { Graph } from '@visx/network';
import { Tooltip, useTooltip, defaultStyles } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';

import * as colors from '@material-ui/core/colors';

const kNodes = Symbol('nodes');
const kLinks = Symbol('links');
const kUpdate = Symbol('update');

const background = '#101020';

const nodeStyle = {
  default: {
    fill: colors.pink[400],
    r: 20
  },
  root: {
    fill: colors.blue[400],
    r: 25
  },
  adjacent: {
    fill: colors.red[400],
    r: 20
  },
  detach: {
    fill: colors.grey[400],
    r: 15
  }
};

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'rgba(53,71,125,0.9)',
  color: 'white',
  padding: 12,
  zIndex: 1000
};

const useForceUpdate = () => useReducer(x => !x, false)[1];

const useForce = ({ width, height, graph }) => {
  const forceUpdate = useForceUpdate();
  const d3force = useRef(null);

  if (d3force.current) {
    const oldNodes = d3force.current[kNodes];
    const newNodes = graph.nodes.map(n => n.id);
    let update = newNodes.filter(id => !oldNodes.includes(id)).length !== oldNodes.filter(id => !newNodes.includes(id)).length;
    if (!update) {
      const oldLinks = d3force.current[kLinks];
      const newLinks = graph.links.map(l => l.id);
      update = newLinks.filter(id => !oldLinks.includes(id)).length !== oldLinks.filter(id => !newLinks.includes(id)).length;
    }
    if (update) {
      d3force.current[kUpdate] = true;
    }
  }

  useEffect(() => {
    let restart = true;

    if (!d3force.current) {
      restart = false;

      d3force.current = forceSimulation(graph.nodes)
        .force('link', forceLink().id(d => d.id).links(graph.links))
        .force('charge', forceManyBody().strength(-2000))
        .force('collision', forceCollide().strength(1));

      d3force.current.on('tick', () => {
        forceUpdate();
      });
    }

    d3force.current
      .force('center', forceCenter(width / 2, height / 2).strength(0))
      .force('r', forceRadial(200).strength(1));

    d3force.current[kNodes] = graph.nodes.map(n => n.id);
    d3force.current[kLinks] = graph.links.map(l => l.id);

    if (!restart) {
      return;
    }

    d3force.current.nodes(graph.nodes);
    d3force.current.force('link').links(graph.links);
    if (d3force.current[kUpdate]) {
      d3force.current[kUpdate] = false;
      d3force.current.alpha(1).restart();
    } else {
      d3force.current.restart();
    }
  }, [width, height, graph]);
};

const useNode = (handlers) => useMemo(() => function Node ({ node }) {
  const { label, type = 'default', ...positions } = node;
  const style = nodeStyle[type] || {};

  const handleMouseEnter = useCallback((e) => handlers.onMouseEnter(node, e), [node]);
  const handleMouseLeave = useCallback((e) => handlers.onMouseLeave(node, e), [node]);

  return (
    <g>
      <circle r={style.r} fill={style.fill} {...positions} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
      {label &&
        <text dy={style.r} dx={style.r + 2} fill='white' fontFamily='arial'>
          {label}
        </text>}
    </g>
  );
}, []);

export default function NetworkGraph ({ width, height, graph, onTooltip = () => {} }) {
  useForce({ width, height, graph });

  const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft = 0, tooltipTop = 0 } = useTooltip();

  const Node = useNode({
    onMouseEnter: (node, e) => {
      showTooltip({
        tooltipTop: e.clientY,
        tooltipLeft: e.clientX,
        tooltipData: node
      });
    },
    onMouseLeave: () => {
      hideTooltip();
    }
  });

  return (width <= 0 || height <= 0 || !graph) ? null : (
    <div style={{ width, height }}>
      {tooltipData && tooltipData.data && tooltipOpen &&
        <Tooltip key={Math.random()} left={tooltipLeft} top={tooltipTop} style={tooltipStyles}>
          {onTooltip(tooltipData.data)}
        </Tooltip>}
      <Zoom
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
      >
        {zoom => (
          <svg width={width} height={height}>
            <rect
              width={width}
              height={height}
              fill={background}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
              onTouchStart={zoom.dragStart} // eslint-disable-line
              onTouchMove={zoom.dragMove} // eslint-disable-line
              onTouchEnd={zoom.dragEnd} // eslint-disable-line
              onMouseDown={zoom.dragStart} // eslint-disable-line
              onMouseMove={zoom.dragMove} // eslint-disable-line
              onMouseUp={zoom.dragEnd} // eslint-disable-line
            />
            <g transform={zoom.toString()}>
              <Graph graph={graph} top={height / 2} left={width / 2} nodeComponent={Node} />
            </g>
          </svg>
        )}
      </Zoom>
    </div>
  );
}
