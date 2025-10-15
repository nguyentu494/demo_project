export const InformationServerLog = (port: number, hostname: string) => {
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const red = '\x1b[31m';
  const yellow = '\x1b[33m';
  const gray = '\x1b[90m';

  const labelWidth = 20;

  const title = `${bold}${green}📢 Server Information${reset}`;

  const lines: [string, string, string][] = [
    ['✅', `Server is`, `${green}${bold}running${reset}`],
    ['🌍', `Hostname:`, `${cyan}${hostname}${reset}`],
    ['🟢', `Port:`, `${cyan}${port}${reset}`],
    ['📄', `Swagger:`, `${cyan}http://${hostname}:${port}/api${reset}`],
  ];

  const stripAnsi = (str: string) => str.replace(/\u001b\[[0-9;]*m/g, '');
  const contentWidth = Math.max(
    ...lines.map(
      ([icon, label, value]) =>
        stripAnsi(`${icon} ${label.padEnd(labelWidth)} ${value}`).length,
    ),
    stripAnsi(title).length,
  );
  const boxWidth = contentWidth + 4;

  const drawLine = (left: string, mid: string, right: string) =>
    `${green}${left}${mid.repeat(boxWidth - 2)}${right}${reset}`;

  const printCenter = (text: string) => {
    const stripped = stripAnsi(text);
    const padding = contentWidth - stripped.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = Math.ceil(padding / 2);
    return ` ${' '.repeat(leftPad)}${text}${' '.repeat(rightPad)} `;
  };

  console.log(drawLine('╭', '─', '╮'));
  console.log(printCenter(title));
  console.log(drawLine('├', '─', '┤'));

  lines.forEach(([icon, label, value]) => {
    const rawLine = `${icon} ${label.padEnd(labelWidth)} ${value}`;
    const visibleLength = stripAnsi(rawLine).length;
    const padding = ' '.repeat(contentWidth - visibleLength);
    console.log(` ${rawLine}${padding} `);
  });

  console.log(drawLine('╰', '─', '╯'));
};
