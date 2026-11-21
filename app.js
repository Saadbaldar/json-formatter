(function () {
  "use strict";

  var inputEl = document.getElementById("input");
  var outputEl = document.getElementById("output");
  var statusEl = document.getElementById("status");
  var statsEl = document.getElementById("stats");
  var statTypeEl = document.getElementById("stat-type");
  var statKeysEl = document.getElementById("stat-keys");
  var statSizesEl = document.getElementById("stat-sizes");

  var SAMPLE = {
    id: 101,
    name: "Saad Baldar",
    email: "saadbaldar@example.com",
    age: 24,
    isActive: true,
    address: {
      street: "Shanti Chowk, Bhadravathi Peth",
      city: "Solapur",
      state: "Maharashtra",
      pincode: "413005",
      country: "India"
    },
    tags: ["developer", "freelancer", "pet-shop-owner"],
    skills: [
      { name: "JavaScript", level: "advanced" },
      { name: "HTML", level: "advanced" },
      { name: "CSS", level: "intermediate" }
    ],
    social: {
      github: "github.com/saadbaldar",
      linkedin: "linkedin.com/in/saad-baldar",
      website: "saadbaldar.live"
    },
    joinedAt: "2024-03-15T10:30:00Z",
    balance: null
  };

  function showStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.className = "status " + kind;
    statusEl.hidden = false;
  }

  function hideStatus() {
    statusEl.hidden = true;
    statusEl.textContent = "";
  }

  function clearErrorState() {
    inputEl.classList.remove("invalid");
  }

  function describeType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  // Extract "position N" from a JSON.parse error message and turn it
  // into a line/column (1-based) within the raw input text.
  // Newer V8 messages also embed "(line L column C)" directly; prefer
  // that when present, otherwise compute line/column from the position.
  // Some error shapes carry no position at all — then this returns null
  // and the caller just shows the raw message.
  function locateError(raw, message) {
    var lc = /\(line (\d+) column (\d+)\)/.exec(message);
    if (lc) {
      var posMatch = /position (\d+)/.exec(message);
      return {
        position: posMatch ? parseInt(posMatch[1], 10) : null,
        line: parseInt(lc[1], 10),
        column: parseInt(lc[2], 10)
      };
    }
    var match = /position (\d+)/.exec(message);
    if (!match) return null;
    var pos = parseInt(match[1], 10);
    var before = raw.slice(0, pos);
    var lines = before.split("\n");
    return {
      position: pos,
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }

  function parseInput() {
    var raw = inputEl.value;
    if (!raw.trim()) {
      showStatus("Input is empty. Paste some JSON first.", "error");
      inputEl.classList.add("invalid");
      return null;
    }
    try {
      var value = JSON.parse(raw);
      clearErrorState();
      return { value: value, raw: raw };
    } catch (err) {
      inputEl.classList.add("invalid");
      var loc = locateError(raw, err.message);
      var detail = "Invalid JSON: " + err.message;
      if (loc) {
        detail += "\nAt line " + loc.line + ", column " + loc.column +
          (loc.position !== null ? " (character position " + loc.position + ")." : ".");
      }
      showStatus(detail, "error");
      statsEl.hidden = true;
      return null;
    }
  }

  function updateStats(value, raw, out) {
    var type = describeType(value);
    statTypeEl.innerHTML = "Type: <strong>" + type + "</strong>";
    if (type === "object") {
      statKeysEl.innerHTML = "Top-level keys: <strong>" +
        Object.keys(value).length + "</strong>";
      statKeysEl.hidden = false;
    } else if (type === "array") {
      statKeysEl.innerHTML = "Items: <strong>" + value.length + "</strong>";
      statKeysEl.hidden = false;
    } else {
      statKeysEl.hidden = true;
    }
    statSizesEl.innerHTML = "Input: <strong>" + raw.length +
      " chars</strong> &nbsp; Output: <strong>" + out.length + " chars</strong>";
    statsEl.hidden = false;
  }

  function format(indent) {
    var parsed = parseInput();
    if (!parsed) return;
    var out = JSON.stringify(parsed.value, null, indent);
    outputEl.value = out;
    showStatus("Valid JSON — formatted with " + indent + "-space indent.", "success");
    updateStats(parsed.value, parsed.raw, out);
  }

  function minify() {
    var parsed = parseInput();
    if (!parsed) return;
    var out = JSON.stringify(parsed.value);
    outputEl.value = out;
    showStatus("Valid JSON — minified.", "success");
    updateStats(parsed.value, parsed.raw, out);
  }

  function validate() {
    var parsed = parseInput();
    if (!parsed) return;
    outputEl.value = JSON.stringify(parsed.value, null, 2);
    showStatus("Valid JSON.", "success");
    updateStats(parsed.value, parsed.raw, outputEl.value);
  }

  function copyResult() {
    var text = outputEl.value;
    if (!text) {
      showStatus("Nothing to copy — format or validate some JSON first.", "info");
      return;
    }
    function done() {
      showStatus("Copied!", "success");
      setTimeout(function () {
        if (statusEl.textContent === "Copied!") hideStatus();
      }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  // Fallback for older browsers without navigator.clipboard.
  function fallbackCopy(text, done) {
    outputEl.select();
    try {
      var ok = document.execCommand("copy");
      if (ok) { done(); return; }
    } catch (e) { /* fall through */ }
    showStatus("Copy failed — select the result and copy it manually (Ctrl+C).", "error");
  }

  function loadSample() {
    inputEl.value = JSON.stringify(SAMPLE, null, 2);
    outputEl.value = "";
    clearErrorState();
    hideStatus();
    statsEl.hidden = true;
    inputEl.focus();
  }

  function clearAll() {
    inputEl.value = "";
    outputEl.value = "";
    clearErrorState();
    hideStatus();
    statsEl.hidden = true;
    inputEl.focus();
  }

  document.getElementById("btn-format-2").addEventListener("click", function () { format(2); });
  document.getElementById("btn-format-4").addEventListener("click", function () { format(4); });
  document.getElementById("btn-minify").addEventListener("click", minify);
  document.getElementById("btn-validate").addEventListener("click", validate);
  document.getElementById("btn-copy").addEventListener("click", copyResult);
  document.getElementById("btn-sample").addEventListener("click", loadSample);
  document.getElementById("btn-clear").addEventListener("click", clearAll);

  // Ctrl/Cmd + Enter formats with 2-space indent.
  inputEl.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      format(2);
    }
  });

  // Typing fresh input clears the stale invalid highlight.
  inputEl.addEventListener("input", clearErrorState);
})();
