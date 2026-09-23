
    window.addEventListener('pageshow', function (event) {
    // Modern API check for Back/Forward navigation
    var entries = performance.getEntriesByType("navigation");
    var isBackNavigation = entries.length > 0 && entries[0].type === "back_forward";

    // Triggers if page was restored from bfcache OR navigated via Back/Forward
    if (event.persisted || isBackNavigation) {
    window.location.reload();
}
});

    // Push a dummy state into history so Back button always triggers page re-evaluation
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', function () {
    window.location.reload();
});
