'use strict';

var chalk$1 = require('chalk');
var process$1 = require('process');

const chunk = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

let chalk = chalk$1;
const loadChalk = async () => {
  if (typeof chalk.hex !== "function") {
    if (typeof require === "function") {
      return new Promise((resolve) => {
        import('chalk').then((chalk2) => chalk2.default).then((_chalk) => {
          chalk = _chalk;
          resolve();
        });
      });
    } else {
      throw new Error("Chalk is not supported in this runtime");
    }
  }
};
loadChalk();
const console = globalThis.console;
const black = "#000000";
const text = "#CDCDCD";
const yellow = "#F3F99D";
const orange = "#F9CB8F";
const red = "#F09393";
const green = "#7EE081";
const blue = "#7DCFEA";
const gray = "#686868";
const isBrowser = typeof window !== "undefined";
const printColor = (bg, text2) => (...args) => {
  const data = args.map((arg) => {
    if (typeof arg === "object" && arg) {
      const str = arg.toString();
      if (str === "[object Object]") {
        return JSON.stringify(arg, null, 2);
      }
      return str;
    }
    return arg;
  }).join(" ");
  if (bg && text2) return chalk.bgHex(bg).hex(text2)(data);
  if (bg) return chalk.bgHex(bg)(data);
  if (text2) return chalk.hex(text2)(data);
};
const log = printColor(void 0, text);
const warn = printColor(yellow, black);
const warnText = printColor(void 0, yellow);
const debug = printColor(orange, black);
const debugText = printColor(void 0, orange);
const error = printColor(red, black);
const errorText = printColor(void 0, red);
const success = printColor(green, black);
const successText = printColor(void 0, green);
const info = printColor(blue, black);
const infoText = printColor(void 0, blue);
const subLog = printColor(void 0, gray);
function addPrefixToArgs(prefix, ...args) {
  if (typeof prefix === "string") {
    return [log(prefix), ...args];
  }
  if (typeof prefix === "function") {
    return [log(prefix()), ...args];
  }
  return args;
}
const logger = {
  ...console,
  loadChalk,
  allowDebug: () => process.env.ENV === "development",
  log: (...args) => {
    if (isBrowser) return console.log(...addPrefixToArgs(logger.prefix, ...args));
    console.log(log(...addPrefixToArgs(logger.prefix, ...args)));
  },
  debug: (...args) => {
    const allowDebug = process.env.ENV === "development";
    if (allowDebug) {
      if (isBrowser) return console.debug(...addPrefixToArgs(logger.prefix, " DEBUG ", ...args));
      console.debug(...addPrefixToArgs(logger.prefix, debug(" DEBUG "), debugText(...args)));
    }
  },
  warn: (...args) => {
    if (isBrowser) return console.warn(...addPrefixToArgs(logger.prefix, " WARN ", ...args));
    console.warn(...addPrefixToArgs(logger.prefix, warn(" WARN "), warnText(...args)));
  },
  error: (...args) => {
    if (isBrowser) return console.error(...addPrefixToArgs(logger.prefix, " ERROR ", ...args));
    console.error(...addPrefixToArgs(logger.prefix, error(" ERROR "), errorText(...args)));
  },
  trace: (...args) => {
    if (isBrowser) return console.trace(...addPrefixToArgs(logger.prefix, " ERROR ", ...args));
    console.trace(...addPrefixToArgs(logger.prefix, error(" ERROR "), errorText(...args)));
  },
  success: (...args) => {
    if (isBrowser) return console.log(...addPrefixToArgs(logger.prefix, " SUCCESS ", ...args));
    console.log(...addPrefixToArgs(logger.prefix, success(" SUCCESS "), successText(...args)));
  },
  info: (...args) => {
    if (isBrowser) return console.log(...addPrefixToArgs(logger.prefix, " INFO ", ...args));
    console.log(...addPrefixToArgs(logger.prefix, info(" INFO "), infoText(...args)));
  },
  subLog: (...args) => {
    if (isBrowser) return console.log(...addPrefixToArgs(logger.prefix, ...args));
    console.log(...addPrefixToArgs(logger.prefix, subLog(...args)));
  }
};
const loggerExtra = {
  printColor: {
    log,
    warn,
    warnText,
    debug,
    debugText,
    error,
    errorText,
    success,
    successText,
    info,
    infoText,
    subLog
  },
  addPrefixToArgs
};

let gOra = null;
const getOra = async () => {
  if (gOra) return gOra;
  const ora = await import('ora').then((m) => m.default);
  gOra = ora;
  return ora;
};
const clearLastLines = (count) => {
  for (let i = 0; i < count; i++) {
    process$1.stderr.moveCursor?.(0, -1);
    process$1.stderr.clearLine?.(0);
  }
};
const windowLog = (maxLines, opts) => {
  const lines = [];
  let numberOfLines = 0;
  let hasPrintedTopPrefix = false;
  let prefixValue = "";
  const handleLine = (line) => {
    const rows = process.stdout.rows;
    maxLines = Math.min(maxLines, rows - 1 - (opts?.topPrefix ? 1 : 0));
    const toClear = Math.min(numberOfLines, maxLines);
    clearLastLines(toClear);
    const columns = process.stdout.columns;
    if (line) {
      lines.push(line);
      const lineLength = Math.ceil(line.length / columns);
      numberOfLines += lineLength;
    }
    if (numberOfLines > maxLines) {
      const removedLine = lines.shift();
      if (removedLine) {
        const removedLineLength = Math.ceil(removedLine.length / columns);
        numberOfLines -= removedLineLength;
      }
    }
    const printable = lines.map((l) => {
      const value = loggerExtra.printColor.log(...loggerExtra.addPrefixToArgs(logger.prefix, l));
      return value;
    });
    if (!opts?.noPrint) {
      if (opts?.topPrefix) {
        if (hasPrintedTopPrefix) {
          clearLastLines(1);
        }
        if (line === null) {
          prefixValue = opts.topPrefix();
        }
        process$1.stderr.write(prefixValue + "\n");
        hasPrintedTopPrefix = true;
      }
      printable.forEach((l) => {
        process$1.stderr.write(l);
      });
    }
    return printable;
  };
  const print = (line) => {
    handleLine(line);
  };
  let interval = null;
  if (opts) {
    handleLine(null);
    const { topInterval, topPrefix } = opts;
    if (topInterval && topPrefix)
      interval = setInterval(() => {
        handleLine(null);
      }, topInterval);
  }
  const stop = (successMessage, noClear) => {
    if (interval) {
      clearInterval(interval);
    }
    if (!noClear) {
      const toClear = Math.min(numberOfLines, maxLines) + 1;
      clearLastLines(toClear);
    }
    if (successMessage) {
      logger.success(successMessage);
    }
  };
  return { print, stop };
};
async function startTask(options) {
  const { maxLines = 10, name, successMessage } = options;
  const ora = await getOra();
  const spinner = ora({
    text: name,
    isSilent: true,
    isEnabled: false
  }).start();
  const window = windowLog(maxLines, {
    topPrefix: () => spinner.frame(),
    topInterval: 100
  });
  const rows = process.stdout.rows;
  const curMax = Math.min(maxLines, rows - 2);
  return {
    print: (data) => {
      const lines = data.toString().split("\n").filter((l) => l.length > 0).slice(-curMax - 1);
      lines.forEach((line) => {
        window.print(line + "\n");
      });
    },
    stop: (message) => {
      window.stop(message ?? successMessage, options.noClear);
    }
  };
}
function stopTask(window, message) {
  window.stop(message);
}

exports.chunk = chunk;
exports.logger = logger;
exports.startTask = startTask;
exports.stopTask = stopTask;
exports.windowLog = windowLog;
