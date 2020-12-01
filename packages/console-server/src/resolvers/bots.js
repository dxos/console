//
// Copyright 2020 DXOS.org
//

import { spawn } from 'child_process';
import debug from 'debug';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import os from 'os';

const DEFAULT_BOT_FACTORY_CWD = '.wire/bots';
const SERVICE_CONFIG_FILENAME = 'service.yml';

const log = debug('dxos:console:server:resolvers');

const getBotFactoryTopic = (botFactoryCwd) => {
  // TODO(egorgripasov): Get topic from config or registry.
  const serviceFilePath = path.join(os.homedir(), botFactoryCwd || DEFAULT_BOT_FACTORY_CWD, SERVICE_CONFIG_FILENAME);
  if (fs.existsSync(serviceFilePath)) {
    const { topic } = yaml.safeLoad(fs.readFileSync(serviceFilePath));
    return topic;
  }
  return undefined;
};

const topic = getBotFactoryTopic();

const executeCommand = async (command, args, timeout = 10000) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, { encoding: 'utf8' });

    const stdout = [];
    const stderr = [];
    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (err) {
        log(`Can not kill ${command} process: ${err}`);
      }
    }, timeout);

    child.stdout.on('data', (data) => stdout.push(data));

    child.stderr.on('data', (data) => stderr.push(data));

    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stdout: stdout.join(''),
        stderr: stderr.join('')
      });
    });
  });
};

const getRunningBots = async () => {
  const command = 'wire';
  const args = ['bot', 'factory', 'status', '--topic', topic];

  try {
    const { stdout } = await executeCommand(command, args);
    return JSON.parse(stdout).bots || [];
  } catch (err) {
    log(`Can not obtain bot factory status: ${err}`);
    return [];
  }
};

const sendBotCommand = async (botId, botCommand) => {
  const command = 'wire';
  const args = ['bot', botCommand, '--topic', topic, '--bot-id', botId];

  const { code, stdout, stderr } = await executeCommand(command, args);
  return {
    success: !code,
    botId: code ? undefined : botId,
    error: (stderr || !code) ? stderr || stdout : undefined
  };
};

export const botsResolvers = {
  Query: {
    bot_list: async () => {
      const bots = await getRunningBots();
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify(bots)
      };
    }
  },
  Mutation: {
    bot_kill: async (_, { botId }) => {
      const result = await sendBotCommand(botId, 'kill');
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify(result)
      };
    }
  }
};
