//
// Copyright 2021 DXOS.org
//

import { Box } from '@mui/material';
import faker from 'faker';
import React, { useState } from 'react';

import { FullScreen } from '@dxos/react-components';

export default {
  title: 'DOM'
};

/**
 * Test DOM expansion.
 */
export const TestBox = () => {
  const [lines, setLines] = useState<string[]>([faker.lorem.sentences(1)]);

  const handleToggle = () => {
    if (lines.length === 1) {
      setLines([...lines, ...faker.lorem.sentences(10).split('.').filter(Boolean)]);
    } else {
      setLines(lines.slice(0, 1));
    }
  };

  return (
    <Box
      sx={{
        margin: 2,
        border: '1px solid grey',
        width: 360
      }}
    >
      {/* Row */}
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'scroll',
          height: 42 + (lines.length > 1 ? 8 + (18 * 4) : 0),
          cursor: 'pointer'
        }}
      >
        {/* Main Cell */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
            height: 42,
            backgroundColor: 'gainsboro',
            paddingLeft: 1,
            paddingRight: 1
          }}
        >
          {/* Content should be in a div -- Box only for flex */}
          <div
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {lines[0]}
          </div>
        </Box>
        {/* Expanded Cell */}
        {lines.length > 1 && (
          <Box
            sx={{
              padding: 1,
              overflowY: 'scroll'
            }}
          >
            {lines.slice(1).map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const TestFullscreen = () => {
  return (
    <FullScreen
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed red',
        fontSize: 80,
        fontFamily: 'sans-serif',
        fontWeight: 50
      }}
    >
      FULLSCREEN
    </FullScreen>
  );
};
