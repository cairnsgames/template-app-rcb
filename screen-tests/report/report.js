const app = document.getElementById("app");

const statusLabel = (result) => {
  if (result.status === "passed") return { text: "Correct", className: "status-passed" };
  if (result.status === "new") return { text: "New Baseline", className: "status-new" };
  return { text: "Changed", className: "status-failed" };
};

const groupByScreen = (results) => {
  const groups = new Map();
  for (const result of results) {
    if (!groups.has(result.screen)) groups.set(result.screen, []);
    groups.get(result.screen).push(result);
  }
  return groups;
};

const renderSummary = (report) => {
  const { total, passed, failed, new: newCount } = report.summary;
  const el = document.createElement("div");
  el.className = "summary";

  if (failed === 0 && newCount === 0) {
    el.innerHTML = `
      <h1>Screen Check</h1>
      <div class="headline all-passed">&#10003; All ${total} screens are correct</div>
    `;
    return el;
  }

  el.innerHTML = `
    <h1>Screen Check</h1>
    <div class="headline">${total} Screens Checked</div>
    <div class="counts">${passed} Passed &middot; ${failed} Changed &middot; ${newCount} New Baseline</div>
  `;
  return el;
};

const renderTriptych = (result) => {
  const wrap = document.createElement("div");
  wrap.className = "triptych";

  const figure = (label, src) => {
    const fig = document.createElement("figure");
    if (src) {
      fig.innerHTML = `<img src="/screens/${src}" alt="${label}" /><figcaption>${label}</figcaption>`;
    } else {
      fig.innerHTML = `<figcaption>${label} (different dimensions)</figcaption>`;
    }
    return fig;
  };

  wrap.appendChild(figure("Baseline", result.baselineImage));
  wrap.appendChild(figure("Current", result.currentImage));
  wrap.appendChild(figure("Difference", result.diffImage));
  return wrap;
};

const renderScreenGroup = (screenName, results) => {
  const group = document.createElement("div");
  group.className = "screen-group";

  const heading = document.createElement("h2");
  heading.textContent = screenName;
  group.appendChild(heading);

  for (const result of results) {
    const row = document.createElement("div");
    row.className = "viewport-row";
    const { text, className } = statusLabel(result);
    const diffText =
      result.status === "failed" && !result.dimensionMismatch
        ? `<span class="diff-percent">${result.differencePercent.toFixed(2)}% difference</span>`
        : "";
    row.innerHTML = `
      <span class="name">${result.viewport.name}</span>
      <span class="${className}">${text}</span>
      ${diffText}
    `;
    group.appendChild(row);

    if (result.status === "failed") {
      group.appendChild(renderTriptych(result));

      const button = document.createElement("button");
      button.className = "accept-btn";
      button.textContent = "Accept Current as Baseline";
      button.addEventListener("click", () => acceptBaseline(result, button, row));
      group.appendChild(button);
    }
  }

  return group;
};

const acceptBaseline = async (result, button, row) => {
  button.disabled = true;
  button.textContent = "Accepting…";
  try {
    const res = await fetch("/baseline/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screen: result.screen, viewport: result.viewport.name }),
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    row.innerHTML = `<span class="name">${result.viewport.name}</span><span class="status-passed">&#10003; Baseline Updated</span>`;
    button.previousElementSibling?.remove();
    button.remove();
  } catch (err) {
    button.disabled = false;
    button.textContent = "Accept Current as Baseline (failed, retry)";
    console.error("Failed to accept baseline", err);
  }
};

const render = (report) => {
  app.innerHTML = "";
  app.appendChild(renderSummary(report));

  const groups = groupByScreen(report.results);
  for (const [screenName, results] of groups) {
    app.appendChild(renderScreenGroup(screenName, results));
  }
};

const load = async () => {
  const res = await fetch("/report.json");
  const report = await res.json();
  render(report);
};

load().catch((err) => {
  app.textContent = `Failed to load report: ${err.message}`;
});
