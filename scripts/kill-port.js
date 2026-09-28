const { execSync } = require("node:child_process");
const os = require("node:os");

const port = process.argv[2] || "3001";

const getPidsForPort = (targetPort) => {
  if (os.platform() === "win32") {
    const output = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return [...new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(/\s+/).pop())
        .filter((pid) => pid && pid !== "0")
    )];
  }

  const output = execSync(`lsof -ti tcp:${targetPort}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  return [...new Set(output.split(/\r?\n/).map((pid) => pid.trim()).filter(Boolean))];
};

const killPid = (pid) => {
  if (os.platform() === "win32") {
    execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
    return;
  }

  execSync(`kill -9 ${pid}`, { stdio: "ignore" });
};

try {
  const pids = getPidsForPort(port);

  if (pids.length === 0) {
    console.log(`No process found on port ${port}.`);
    process.exit(0);
  }

  pids.forEach(killPid);
  console.log(`Killed ${pids.length} process${pids.length === 1 ? "" : "es"} on port ${port}: ${pids.join(", ")}`);
} catch (error) {
  console.log(`No process found on port ${port}.`);
}