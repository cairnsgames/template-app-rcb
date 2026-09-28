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

const renderSingleImage = (result) => {
  const wrap = document.createElement("div");
  wrap.className = "triptych single";
  const fig = document.createElement("figure");
  fig.innerHTML = `<img loading="lazy" src="/screens/${result.currentImage}" alt="Current" /><figcaption>Current</figcaption>`;
  wrap.appendChild(fig);
  return wrap;
};

const renderScreenGroup = (screenName, results) => {
  const group = document.createElement("div");
  group.className = "screen-group";

  const collapsible = results.filter((r) => r.status !== "failed");

  const header = document.createElement("div");
  header.className = "screen-header";
  const heading = document.createElement("h2");
  heading.textContent = screenName;
  header.appendChild(heading);

  let imagesPanel = null;
  if (collapsible.length > 0) {
    imagesPanel = document.createElement("div");
    imagesPanel.className = "images-panel";
    imagesPanel.hidden = true;

    const toggle = document.createElement("button");
    toggle.className = "images-toggle";
    toggle.textContent = "Show images";
    toggle.addEventListener("click", () => {
      const open = imagesPanel.hidden;
      imagesPanel.hidden = !open;
      toggle.textContent = open ? "Hide images" : "Show images";
      toggle.classList.toggle("open", open);
    });
    header.appendChild(toggle);
  }

  group.appendChild(header);

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

  if (imagesPanel) {
    for (const result of collapsible) {
      const item = document.createElement("div");
      item.className = "images-panel-item";
      item.innerHTML = `<span class="name">${result.viewport.name}</span>`;
      item.appendChild(renderSingleImage(result));
      imagesPanel.appendChild(item);
    }
    group.appendChild(imagesPanel);
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
