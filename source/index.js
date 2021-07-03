import { exec } from "child_process";
import { errorHandler } from "./error-handler";
import { green, reset, white } from "kleur";
import { resolvePackage } from "./resolve-pkg";
import { logcons } from "logcons";
import * as readline from "readline";

const bullet = white().bold;
const success = green().bold;

export const depdown = async (deps, { mode } = {}) => {
  const result = {
    installedDependencies: false,
  };

  console.log(reset().cyan("Checking for dependencies..."));

  const pkg = resolvePackage();

  const installed = [];

  checkDeps(pkg.dependencies, deps, installed);

  if (installed.length !== deps.length) {
    checkDeps(pkg.devDependencies, deps, installed);
  }

  const toInstall = deps.reduce((acc, item) => {
    if (installed.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);

  if (!toInstall.length) {
    result.installedDependencies = true;
    console.log(reset().dim("Nothing to install."));
    return result;
  }

  let depFlag = "--save-dev";

  switch (mode) {
    case "dev": {
      depFlag = "--save-dev";
      break;
    }
    case "direct": {
      depFlag = "--save";
      break;
    }
    case "peer": {
      depFlag = "--peer";
      break;
    }
  }

  const cmd = `npm install ${depFlag} ${toInstall.join(" ")}`;

  const allowInstall = await getInstallConfirmation();

  if (!allowInstall) {
    return result;
  }

  console.log(`${bullet("Running:")} ${cmd}`);

  const child = exec(cmd);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on("error", (err) => {
    errorHandler(err);
  });

  await new Promise((resolve) => {
    child.on("exit", () => {
      console.log(`${success(`${logcons.tick()} Done`)}`);
      resolve();
    });
  });

  result.installedDependencies = true;

  return result;
};

function checkDeps(depType = {}, deps = [], source = []) {
  Object.keys(depType).forEach((item) => {
    if (deps.indexOf(item) > -1 && source.indexOf(item) === -1) {
      source.push(item);
    }
  });
}

async function getInstallConfirmation() {
  var lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    lineReader.question(
      bullet("\ndepdown will now install needed dependencies? [Y/n]: "),
      (answer) => {
        if (!answer) {
          answer = "Y";
        }
        switch (answer.toLowerCase()) {
          case "yes":
          case "y": {
            resolve(true);
            break;
          }
          case "no":
          case "n": {
            resolve(false);
            break;
          }
          default: {
            resolve(null);
          }
        }
      }
    );
  });
}

// left for local testing, TODO: move to a test folder
if (require.main === module) {
  (async () => {
    // Install a 25.9kB library to test the module
    // size info from: https://packagephobia.com/result?p=logcons

    const done = await depdown(["logcons"]);

    if (!done.installedDependencies) {
      console.log("Exited with process code: 1");
      process.exit(1);
    }
    console.log("Exited with process code: 0");
    process.exit(0);
  })();
}
