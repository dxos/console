//
// Copyright 2021 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

interface IScrollContainerProps {
  rows?: any[]
}

interface IBounds {
  top: number
  height: number
  visible: number
  index: number
}

interface IRange {
  above: number
  below: number
  rows: any[]
}

const pad = (num: number, places: number) => String(num).padStart(places, '0')

export const ScrollContainer = ({ rows: allRows = [] }: IScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const boundsRef = useRef<IBounds>({ top: 0, height: 0, visible: 0, index: 0 });
  const [{ above, below, rows }, setRange] = useState<IRange>({ above: 0, below: 0, rows: [] });

  const rowHeight = 42; // TODO(burdon): Dynamic.

  //
  // Scroll and resize events.
  //
  useEffect(() => {
    const handleResize = () => {
      const top = containerRef.current!.scrollTop;
      const height = containerRef.current!.clientHeight;
      const visible = Math.floor(height / rowHeight) + 2;
      boundsRef.current = { top, height, visible, index: 0 };
    }

    const handleScroll = (event: Event) => {
      const top = containerRef.current!.scrollTop;
      const index = Math.floor(top / rowHeight);

      const changed = index !== boundsRef.current!.index;
      if (changed) {
        setRange({
          above: index,
          below: allRows.length - (index + boundsRef.current!.visible),
          rows: allRows.slice(index, (index + boundsRef.current!.visible))
        });
      }

      boundsRef.current = { ...boundsRef.current, top, index };
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
    const { index, visible } = boundsRef.current!;

    setRange({
      above: index,
      below: allRows.length - index - visible,
      rows: allRows.slice(index, index + visible)
    });
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
