// background.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated!');
});

/** Helper to get domain from a URL string */
function getDomainFromURL(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * We'll store priority domains in chrome.storage.
 * The popup doesn't directly call storage APIs; instead it asks background for them.
 */
async function loadPriorityDomains(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get('priorityDomains', (data) => {
      resolve(data.priorityDomains || []);
    });
  });
}

async function savePriorityDomains(domains: string[]): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ priorityDomains: domains }, () => {
      resolve();
    });
  });
}

/**
 * Query the current window's tabs, return them.
 */
async function fetchTabs(): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      resolve(tabs);
    });
  });
}

/**
 * Sort tabs by priority domain order (priority first, others later).
 */
async function sortTabsByDomain() {
  const tabs = await fetchTabs();
  const priorityDomains = await loadPriorityDomains();

  // Get the domain list from the set of all tabs to preserve them
  const uniqueDomains = Array.from(
    new Set(tabs.map((tab) => getDomainFromURL(tab.url ?? ''))),
  );

  const sortedTabs = [...tabs].sort((a, b) => {
    const domainA = getDomainFromURL(a.url || '');
    const domainB = getDomainFromURL(b.url || '');

    const indexA = priorityDomains.indexOf(domainA);
    const indexB = priorityDomains.indexOf(domainB);

    // If domain is priority, index is in [0..(priorityDomains.length-1)], else fallback to end
    return (
      (indexA !== -1 ? indexA : uniqueDomains.length) -
      (indexB !== -1 ? indexB : uniqueDomains.length)
    );
  });

  // Reposition the tabs
  sortedTabs.forEach((tab, index) => {
    if (tab.id !== undefined) {
      chrome.tabs.move(tab.id, { index });
    }
  });

  return sortedTabs;
}

/**
 * Sort non-priority tabs A–Z, keep priority tabs in place.
 */
async function sortNonPriorityTabsAlphabetically() {
  const tabs = await fetchTabs();
  const priorityDomains = await loadPriorityDomains();

  const priorityTabs: chrome.tabs.Tab[] = [];
  const nonPriorityTabs: chrome.tabs.Tab[] = [];

  tabs.forEach((tab) => {
    const domain = getDomainFromURL(tab.url || '');
    if (priorityDomains.includes(domain)) {
      priorityTabs.push(tab);
    } else {
      nonPriorityTabs.push(tab);
    }
  });

  // Sort non-priority by domain A–Z
  nonPriorityTabs.sort((a, b) => {
    const domainA = getDomainFromURL(a.url || '');
    const domainB = getDomainFromURL(b.url || '');
    return domainA.localeCompare(domainB);
  });

  const sortedTabs = [...priorityTabs, ...nonPriorityTabs];

  sortedTabs.forEach((tab, index) => {
    if (tab.id !== undefined) {
      chrome.tabs.move(tab.id, { index });
    }
  });

  return sortedTabs;
}

/** Close a particular tab by ID */
async function closeTab(tabId: number) {
  return new Promise<void>((resolve) => {
    chrome.tabs.remove(tabId, () => resolve());
  });
}

/** Listen for messages from the popup */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    switch (request.type) {
      case 'FETCH_TABS': {
        const tabs = await fetchTabs();
        sendResponse({ success: true, tabs });
        break;
      }
      case 'LOAD_PRIORITY_DOMAINS': {
        const domains = await loadPriorityDomains();
        sendResponse({ success: true, priorityDomains: domains });
        break;
      }
      case 'SAVE_PRIORITY_DOMAINS': {
        await savePriorityDomains(request.payload); // array of domains
        sendResponse({ success: true });
        break;
      }
      case 'SORT_TABS_BY_DOMAIN': {
        const sortedTabs = await sortTabsByDomain();
        sendResponse({ success: true, tabs: sortedTabs });
        break;
      }
      case 'SORT_NON_PRIORITY_TABS_ALPHABETICALLY': {
        const sortedTabs = await sortNonPriorityTabsAlphabetically();
        sendResponse({ success: true, tabs: sortedTabs });
        break;
      }
      case 'CLOSE_TAB': {
        await closeTab(request.payload); // tabId
        sendResponse({ success: true });
        break;
      }
      default:
        console.warn(`Unknown request type: ${request.type}`);
        sendResponse({ success: false, error: 'Unknown request type.' });
    }
  })();

  // Return true to indicate we want to respond asynchronously
  return true;
});
