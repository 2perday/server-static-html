const PROMPT = '<span class="user">2perday@homelab</span><span class="sep">:</span><span class="path">~</span><span class="dollar">$ </span>';

const ASCII = `
      _/_/                                        _/                                _/
   _/    _/  _/_/_/      _/_/    _/  _/_/    _/_/_/    _/_/_/  _/    _/        _/_/_/    _/_/    _/      _/
      _/    _/    _/  _/_/_/_/  _/_/      _/    _/  _/    _/  _/    _/      _/    _/  _/_/_/_/  _/      _/
   _/      _/    _/  _/        _/        _/    _/  _/    _/  _/    _/      _/    _/  _/          _/  _/
_/_/_/_/  _/_/_/      _/_/_/  _/          _/_/_/    _/_/_/    _/_/_/  _/    _/_/_/    _/_/_/      _/
         _/                                                      _/
        _/                                                  _/_/`;

const commands = {
  help: () => [
    '',
    '&nbsp;&nbsp;Usage: [command]',
    '',
    '&nbsp;&nbsp;<span class="motd-info">interests</span>    What I work on',
    '&nbsp;&nbsp;<span class="motd-info">hobbies</span>      Life outside of work',
    '',
    '&nbsp;&nbsp;<span class="motd-info">motd</span>         Show welcome message',
    '&nbsp;&nbsp;<span class="motd-info">help</span>         Show this message',
    '&nbsp;&nbsp;<span class="motd-info">clear</span>        Clear terminal',
    '',
  ],
  interests: () => [
    'Infrastructure',
    'Network Engineering',
    'Systems Engineering',
    'DevOps',
  ],
  hobbies: () => [
    'Flim Photography',
    'Amateur Radio',
    'Audio Engineering',
    'Coffee',
  ],
  motd: () => { showMotd(); return []; },
};

const hist = document.getElementById('history');
const input = document.getElementById('input');
const body = document.getElementById('body');
const cmdHistory = [];
let histIdx = -1;

function addLine(html, cls) {
  const div = document.createElement('div');
  div.className = cls || 'output-line';
  div.innerHTML = html;
  hist.appendChild(div);
}

function addPrompt(cmd) {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = PROMPT + '<span class="cmd">' + escapeHtml(cmd) + '</span>';
  hist.appendChild(div);
}

function addAscii() {
  const pre = document.createElement('pre');
  pre.textContent = ASCII;
  hist.appendChild(pre);
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function scrollBottom() {
  body.scrollTop = body.scrollHeight;
}

function exec(raw) {
  const cmd = raw.trim().toLowerCase();
  addPrompt(raw.trim());

  if (!cmd) { scrollBottom(); return; }

  if (cmd === 'clear') {
    hist.innerHTML = '';
    return;
  }

  const fn = commands[cmd];
  if (!fn) {
    addLine('bash: ' + escapeHtml(cmd) + ': command not found', 'output-line error');
    scrollBottom();
    return;
  }

  const lines = fn();
  for (const line of lines) {
    if (line === '__ASCII__') {
      addAscii();
    } else {
      addLine(line);
    }
  }
  scrollBottom();
}

function showMotd() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
  const month = now.toLocaleDateString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = weekday + ' ' + month + ' ' + day + ' ' + timeStr + ' KST ' + year;

  addLine('Welcome to <span class="motd-highlight">2perday.dev</span>', 'motd');
  addLine('', 'motd');
  addLine('&nbsp;* GitHub:  <a href="https://github.com/2perday" target="_blank">https://github.com/2perday</a>', 'motd');
  addLine('', 'motd');
  addLine('&nbsp;System information as of ' + dateStr, 'motd');
  addLine('', 'motd');
  addLine('&nbsp;&nbsp;DNS:           <span class="motd-info">Cloudflare DDNS</span>', 'motd');
  addLine('&nbsp;&nbsp;Reverse Proxy: <span class="motd-info">NPM Plus</span>', 'motd');
  addLine('&nbsp;&nbsp;Security:      <span class="motd-info">CrowdSec</span>', 'motd');
  addLine('&nbsp;&nbsp;Webserver:     <span class="motd-info">Nginx</span>', 'motd');
  addLine('&nbsp;&nbsp;Hardware:      <span class="motd-info">DELL OptiPlex 3050</span>', 'motd');
  addLine('', 'motd');
  addLine('&nbsp;* <span class="motd-highlight">Data Center Operator at NHN Enterprise</span>', 'motd');
  addLine('&nbsp;&nbsp;&nbsp;13th Samsung Software Academy for Youth', 'motd');
  addLine('&nbsp;&nbsp;&nbsp;B.S. in Electrical Engineering', 'motd');
  addLine('', 'motd');
  addLine('<em>"Pour vous"</em>', 'motd');
  addAscii();
  addLine('', 'motd');
  addLine('Type <span class="cmd">help</span> for available commands.', 'motd');
}

showMotd();

input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const val = input.value;
    if (val.trim()) {
      cmdHistory.unshift(val.trim());
    }
    histIdx = -1;
    exec(val);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < cmdHistory.length - 1) {
      histIdx++;
      input.value = cmdHistory[histIdx];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      input.value = cmdHistory[histIdx];
    } else {
      histIdx = -1;
      input.value = '';
    }
  }
});

body.addEventListener('click', function (e) {
  if (e.target.tagName !== 'A') input.focus();
});
