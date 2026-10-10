self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; }
  catch { payload = { body: event.data?.text() || "A new Savitri Kolkata edit is ready." }; }
  const options = {
    body: payload.body || "A new Savitri Kolkata edit is ready.",
    icon: payload.icon || "/savitri-kolkata-icon.svg",
    badge: "/savitri-kolkata-icon.svg",
    image: payload.image,
    tag: payload.tag || "savitri-kolkata-update",
    data: { url: payload.url || "/", trackUrl: payload.trackUrl || "", endpoint: payload.endpoint || "", appId: payload.appId || "app_savitri_kolkata", campaignId: payload.campaignId || "" },
  };
  event.waitUntil(self.registration.showNotification(payload.title || "Savitri Livings Kolkata", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const track = data.trackUrl ? fetch(data.trackUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: data.endpoint, appId: data.appId, campaignId: data.campaignId }) }).catch(() => {}) : Promise.resolve();
  const destination = new URL(data.url || "/", self.location.origin).href;
  event.waitUntil(track.then(async () => {
    const windows = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) if (client.url.startsWith(self.location.origin) && "focus" in client) { await client.navigate(destination); return client.focus(); }
    return clients.openWindow(destination);
  }));
});
