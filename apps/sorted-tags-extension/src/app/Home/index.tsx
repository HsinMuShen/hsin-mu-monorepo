import { useEffect, useState, useCallback } from 'react';
import { Button, List, Typography, Container, Select, MenuItem, Box } from '@mui/material';

type ChromeTab = chrome.tabs.Tab;

function App() {
  const [tabs, setTabs] = useState<ChromeTab[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [priorityDomains, setPriorityDomains] = useState<string[]>([]);

  const getDomainFromURL = useCallback((url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }, []);

  const extractDomains = useCallback((tabs: ChromeTab[]) => {
    const uniqueDomains = Array.from(
      new Set(
        tabs
          .map((tab) => getDomainFromURL(tab.url || ''))
          .filter((domain) => domain !== '')
      )
    );
    setDomains(uniqueDomains);
  }, [getDomainFromURL]);

  const fetchTabs = useCallback(() => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      setTabs(tabs);
      extractDomains(tabs);
    });
  }, [extractDomains]);

  const loadPriorityDomains = useCallback(() => {
    chrome.storage.local.get('priorityDomains', (data) => {
      if (data.priorityDomains) {
        setPriorityDomains(data.priorityDomains);
      }
    });
  }, []);

  const savePriorityDomains = (selectedDomains: string[]) => {
    chrome.storage.local.set({ priorityDomains: selectedDomains });
  };

  const sortTabsByDomain = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const sortedTabs = [...tabs].sort((a, b) => {
        const domainA = getDomainFromURL(a.url || '');
        const domainB = getDomainFromURL(b.url || '');

        const indexA = priorityDomains.indexOf(domainA);
        const indexB = priorityDomains.indexOf(domainB);

        return (indexA !== -1 ? indexA : domains.length) - (indexB !== -1 ? indexB : domains.length);
      });

      sortedTabs.forEach((tab, index) => {
        if (tab.id !== undefined) {
          chrome.tabs.move(tab.id, { index });
        }
      });

      setTabs(sortedTabs);
    });
  };

  const handleDomainSelection = (selectedDomains: string[]) => {
    setPriorityDomains(selectedDomains);
    savePriorityDomains(selectedDomains);
  };

  const closeTab = (tabId: number | undefined) => {
    if(!tabId) return;
    chrome.tabs.remove(tabId, () => {
      fetchTabs();
    });
  };

  useEffect(() => {
    fetchTabs();
    loadPriorityDomains();
  }, [fetchTabs, loadPriorityDomains]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tab Sorter by Domain
      </Typography>
      <Box className="mb-4">
        <Typography variant="h6">Select Domains to Prioritize</Typography>
        <Select
          multiple
          value={priorityDomains}
          onChange={(e) => handleDomainSelection(e.target.value as string[])}
          renderValue={(selected) => selected.join(', ')}
          fullWidth
        >
          {domains.map((domain) => (
            <MenuItem key={domain} value={domain}>
              {domain}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button variant="contained" color="primary" onClick={sortTabsByDomain} className="mr-2">
        Sort Tabs by Domain
      </Button>
      <Button variant="outlined" color="secondary" onClick={fetchTabs}>
        Refresh Tabs
      </Button>
      <List>
        {tabs.map((tab) => (
          <li key={tab.id} className="flex items-center justify-between border-b py-2">
            <div>
              <p className="font-medium">{tab.title}</p>
              <p className="text-sm text-gray-500 truncate max-w-md">{tab.url}</p>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => closeTab(tab.id)}
            >
              Close
            </button>
          </li>
        ))}
      </List>
    </Container>
  );
}

export default App;
