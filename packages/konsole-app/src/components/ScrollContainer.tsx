//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

interface IScrollContainerProps {
  rows?: any[]
}

interface IBounds {
  top: number       // Pixels from top of container.
  height: number    // Height of container.
  visible: number   // TODO(burdon): Rename rendered.
  index: number     // Index of row at the top of the view port.
}

interface IRange {
  above: number
  below: number
  rows: any[]
}

const pad = (num: number, places: number) => String(num).padStart(places, '0')

// TODO(burdon): Rename virtual.
export const ScrollContainer = ({ rows: allRows = [] }: IScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const boundsRef = useRef<IBounds>({ top: 0, height: 0, visible: 0, index: 0 });
  const [{ above, below, rows }, setRange] = useState<IRange>({ above: 0, below: 0, rows: [] });

  // const rowsBefore = 5;
  // const rowsAfter = 5;
  const rowHeight = 42; // TODO(burdon): Dynamic.

  // TODO(burdon): Handle buffer above/below.
  const createRange = (rows: any[], { index, visible }: IBounds) => {
    return {
      above: index,
      below: rows.length - index - visible,
      rows: rows.slice(index, index + visible)
    };
  };

  //
  // Scroll and resize events.
  //
  useEffect(() => {
    const handleResize = () => {
      const top = containerRef.current!.scrollTop;
      const height = containerRef.current!.clientHeight;
      const visible = Math.floor(height / rowHeight) + 1;
      boundsRef.current = { top, height, visible, index: 0 };
    }

    const handleScroll = (event: Event) => {
      const top = containerRef.current!.scrollTop;
      const index = Math.floor(top / rowHeight);
      const changed = index !== boundsRef.current!.index;
      boundsRef.current = { ...boundsRef.current, top, index };
      if (changed) {
        setRange(createRange(allRows, boundsRef.current));
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    containerRef.current!.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current!.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef]);

  useEffect(() => {
    setRange(createRange(allRows, boundsRef.current));
  }, [allRows.length]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          color: 'darkblue',
          fontFamily: 'monospace'
        }}
      >
        DEBUG: {JSON.stringify({ above, below, ...boundsRef.current!, count: allRows.length })}
      </Box>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative', // TODO(burdon): Anchor for absolute positioning below.
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'scroll'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              height: rowHeight * above
            }}
          />
          {rows.map((row, i) => (
            <Box
              key={`row-${i}`}
              sx={{
                position: 'absolute',
                top: (above + i) * rowHeight, // TODO(burdon): Calculate.
                left: 0,
                right: 0,
                padding: 1,
                border: '1px solid lightgrey',
                fontFamily: 'monospace'
              }}
            >
              {`[${pad(i, 3)}]: ${row}`}
            </Box>
          ))}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: (above + rows.length) * rowHeight,
              height: rowHeight * below
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
