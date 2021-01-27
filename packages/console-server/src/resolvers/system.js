//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import moment from 'moment';
import pick from 'lodash.pick';
import os from 'os';
import si from 'systeminformation';
import { spawnSync } from 'child_process';

const num = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

const size = (n, unit) => {
  const units = {
    K: 3,
    M: 6,
    G: 9,
    T: 12
  };

  const power = units[unit] || 0;

  return num.format(Math.round(n / (10 ** power))) + (unit ? ` ${unit}` : '');
};

const getVersionInfo = () => {
  // TODO(telackey): Get from config (or figure out a better way to do this).
  const versionFile = '/opt/kube/VERSION';
  if (fs.existsSync(versionFile)) {
    return fs.readFileSync(versionFile, { encoding: 'UTF8' }).replace(/^\s+|\s+$/g, '');
  }
  return undefined;
};

const getCliVersionInfo = () => {
  const command = 'dx';
  const args = ['version'];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  return child.stdout;
};

/**
 * Get system inforamtion.
 * https://www.npmjs.com/package/systeminformation
 */
const getSystemInfo = async () => {
  const ifaces = os.networkInterfaces();
  const addresses = Object.entries(ifaces).reduce((result, [, values]) => {
    values.forEach(({ family, address }) => {
      address = address.toLowerCase();
      // TODO(telackey): Include link-local IPv6?
      if (!address.startsWith('127.') && !address.startsWith('fe80::') && !address.startsWith('::1')) {
        result.push(address);
      }
    });
    return result;
  }, []);

  const cpu = await si.cpu();
  const memory = await si.mem();
  const device = await si.system();

  return {
    cpu: pick(cpu, 'brand', 'cores', 'manufacturer', 'vendor', 'speed'),

    memory: {
      total: size(memory.total, 'M'),
      free: size(memory.free, 'M'),
      used: size(memory.used, 'M'),
      swaptotal: size(memory.swaptotal, 'M')
    },

    device: pick(device, 'model', 'serial', 'version'),

    network: {
      addresses
    },

    // https://nodejs.org/api/os.html
    os: {
      arch: os.arch(),
      platform: os.platform(),
      version: os.version ? os.version() : undefined // Node > 13
    },

    time: {
      now: moment(),
      up: moment().subtract(os.uptime(), 'seconds')
    },

    nodejs: {
      version: process.version
    },

    dxos: {
      kube: {
        version: getVersionInfo()
      },
      dx: {
        version: getCliVersionInfo()
      }
    }
  };
};

/**
 * Get system inforamtion.
 * https://www.npmjs.com/package/systeminformation
 */
const getServiceInfo = async () => {
  const command = 'dx';
  const args = ['service', '--json'];

  const child = spawnSync(command, args, { encoding: 'utf8' });
  return JSON.parse(child.stdout);
};

export const systemResolvers = {
  Query: {
    system_status: async () => {
      const system = await getSystemInfo();

      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify(system)
      };
    },
    service_status: async () => {
      const serviceInfo = await getServiceInfo();

      return {
        timestamp: new Date().toUTCString(),
        json: JSON.stringify(serviceInfo)
      };
    }
  }
};
