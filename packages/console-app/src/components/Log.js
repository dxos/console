//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },

  log: {
    width: '100%',
    display: 'flex',
    // Pin to bottom (render in time order).
    flexDirection: 'column-reverse',
    overflow: 'scroll',
    padding: theme.spacing(1),

    '& div': {
      fontSize: 14,
      fontFamily: 'monospace',
      whiteSpace: 'nowrap'
    }
  },

  level: {
    display: 'inline-block',
    width: 60,
    marginRight: 8,
    color: theme.palette.grey[500]
  },
  level_warn: {
    color: theme.palette.warning.main
  },
  level_error: {
    color: theme.palette.error.main
  },

  ts: {
    marginRight: 8,
    color: theme.palette.primary[500]
  }
}));

const Log = ({ log = [] }) => {
  const classes = useStyles();

  const levels = {
    I: { label: 'INFO', className: classes.level_info },
    W: { label: 'WARN', className: classes.level_warn },
    E: { label: 'ERROR', className: classes.level_error }
  };

  // TODO(burdon): Parse in backend and normalize numbers.
  const Line = ({ message }) => {
    // https://regex101.com/
    const patterns = [
      {
        // 2020-03-30T18:02:43.189Z bot-factory
        pattern: /()(.+Z)\s+(.+)/,
        transform: ([datetime]) => moment(datetime)
      },
      {
        // I[2020-03-30|15:29:05.436] Executed block module=state height=11533 validTxs=0 invalidTxs=0
        pattern: /(.)\[(.+)\|(.+)]\s+(.+)/,
        transform: ([date, time]) => moment(`${date} ${time}`)
      },
      {
        // [cors] 2020/03/30 15:28:53 Handler: Actual request
        pattern: /\[(\w+)] (\S+) (\S+)\s+(.+)/,
        transform: ([date, time]) => moment(`${date.replace(/\//g, '-')} ${time}`)
      }
    ];

    patterns.some(({ pattern, transform }) => {
      const match = message.match(pattern);
      if (match) {
        const [, level = 'I', ...rest] = match;
        const datetime = transform(rest).format('YYYY-MM-DD HH:mm:ss');
        const text = match[match.length - 1];

        const { label, className } = levels[level] || levels.I;
        const pkg = levels[level] ? '' : `[${level}]: `;

        message = (
          <>
            <span className={classes.ts}>{datetime}</span>
            <span className={clsx(classes.level, className)}>{label || level}</span>
            <span>{pkg}{text}</span>
          </>
        );

        return true;
      }

      return false;
    });

    return (
      <div>{message}</div>
    );
  };

  // TODO(telackey): Why do these display in reverse?
  log.reverse();

  return (
    <div className={classes.root}>
      <div className={classes.log}>
        {log.map((line, i) => <Line key={i} message={line} />)}
      </div>
    </div>
  );
};

export default Log;
