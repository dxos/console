//
// Copyright 2020 DXOS.org
//

import { spawn } from 'child_process';
import debug from 'debug';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import os from 'os';
import kill from 'tree-kill';

const DEFAULT_BOT_FACTORY_CWD = '.wire/bots';
const SERVICE_CONFIG_FILENAME = 'service.yml';

const log = debug('dxos:console:server:resolvers');

let topic;
const getBotFactoryTopic = (botFactoryCwd) => {
  if (!topic) {
    // TODO(egorgripasov): Get topic from config or registry.
    const serviceFilePath = path.join(os.homedir(), botFactoryCwd || DEFAULT_BOT_FACTORY_CWD, SERVICE_CONFIG_FILENAME);
    if (fs.existsSync(serviceFilePath)) {
      const botFactoryInfo = yaml.safeLoad(fs.readFileSync(serviceFilePath));
      topic = botFactoryInfo.topic;
    }
  }
  return topic;
};

const executeCommand = async (command, args, timeout = 10000) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, { encoding: 'utf8' });

    const stdout = [];
    const stderr = [];
    const timer = setTimeout(() => {
      try {
        kill(child.pid, 'SIGKILL');
      } catch (err) {
        log(`Can not kill ${command} process: ${err}`);
      }
      stderr.push('Timeout.');
    }, timeout);

    child.stdout.on('data', (data) => stdout.push(data));

    child.stderr.on('data', (data) => stderr.push(data));

    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve({
        code: code === null ? 1 : code,
        stdout: stdout.join('').trim(),
        stderr: stderr.join('').trim()
      });
    });
  });
};

const getRunningBots = async () => {
  const command = 'wire';
  const args = ['bot', 'factory', 'status', '--topic', getBotFactoryTopic()];

  const { code, stdout, stderr } = await executeCommand(command, args);
  return {
    success: !code,
    bots: code ? [] : JSON.parse(stdout).bots || [],
    error: (stderr || code) ? stderr || stdout : undefined
  };
};

const sendBotCommand = async (botId, botCommand) => {
  const command = 'wire';
  const args = ['bot', botCommand, '--topic', getBotFactoryTopic(), '--bot-id', botId];

  const { code, stdout, stderr } = await executeCommand(command, args);

  return {
    success: !code,
    botId: code ? undefined : botId,
    error: (stderr || code) ? stderr || stdout : undefined
  };
};

export const botsResolvers = {
  Query: {
    bot_list: async () => {
      const result = await getRunningBots();
      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify(result)
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
