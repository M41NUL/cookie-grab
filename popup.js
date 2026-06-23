let activeDomain = "instagram.com";
let lastCookiesJSON = "";

document.getElementById("igTab").addEventListener("click", () => setActive("igTab", "fbTab", "instagram.com"));
document.getElementById("fbTab").addEventListener("click", () => setActive("fbTab", "igTab", "facebook.com"));

function setActive(activeId, inactiveId, domain) {
  document.getElementById(activeId).classList.add("active");
  document.getElementById(inactiveId).classList.remove("active");
  activeDomain = domain;
  document.getElementById("resultBox").style.display = "none";
  const status = document.getElementById("status");
  status.className = "";
  status.textContent = "Select a platform and generate";
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.className = "";
  status.textContent = "Generating...";

  const cookies = await chrome.cookies.getAll({ domain: activeDomain });

  // Check for the key cookie that proves an active logged-in session
  const loginCookieName = activeDomain.includes("instagram") ? "sessionid" : "c_user";
  const isLoggedIn = cookies.some(c => c.name === loginCookieName);

  if (!isLoggedIn) {
    document.getElementById("resultBox").style.display = "none";
    status.className = "error";
    status.textContent = `Not logged in - open ${activeDomain} and log in first`;
    return;
  }

  lastCookiesJSON = JSON.stringify(cookies, null, 2);
  document.getElementById("cookieOutput").value = lastCookiesJSON;
  document.getElementById("resultBox").style.display = "block";
  status.className = "success";
  status.textContent = `Generated ${cookies.length} cookies`;
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const status = document.getElementById("status");
  const blob = new Blob([lastCookiesJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const filename = activeDomain.includes("instagram") ? "ig_cookies.json" : "fb_cookies.json";

  chrome.downloads.download({ url, filename, saveAs: false }, () => {
    status.textContent = `Saved: ${filename}`;
  });
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  await navigator.clipboard.writeText(lastCookiesJSON);
  status.textContent = "Copied to clipboard";
});

document.getElementById("copyright").textContent =
  `\u00A9 ${new Date().getFullYear()} CODEX-M41NUL. All Rights Reserved.`;
