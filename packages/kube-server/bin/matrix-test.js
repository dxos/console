const [command, script, ...rest] = process.argv;

console.log(`{ "options": ${JSON.stringify(rest)} }`);
