import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Container,
  Select,
  MenuItem,
  Box,
  Divider,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

  const extractDomains = useCallback(
    (tabs: ChromeTab[]) => {
      const uniqueDomains = Array.from(
        new Set([
          ...tabs.map((tab) => getDomainFromURL(tab.url || '')).filter((domain) => domain !== ''),
          ...priorityDomains, // Ensure priority domains are preserved
        ])
      );
      setDomains(uniqueDomains);
    },
    [getDomainFromURL, priorityDomains]
  );

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

  const sortNonPriorityTabsAlphabetically = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const priorityTabs: ChromeTab[] = [];
      const nonPriorityTabs: ChromeTab[] = [];

      tabs.forEach((tab) => {
        const domain = getDomainFromURL(tab.url || '');
        if (priorityDomains.includes(domain)) {
          priorityTabs.push(tab);
        } else {
          nonPriorityTabs.push(tab);
        }
      });

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

      setTabs(sortedTabs);
    });
  };

  const handleDomainSelection = (selectedDomains: string[]) => {
    setPriorityDomains(selectedDomains);
    savePriorityDomains(selectedDomains);
  };

  const closeTab = (tabId: number | undefined) => {
    if (!tabId) return;
    chrome.tabs.remove(tabId, () => {
      fetchTabs();
    });
  };

  useEffect(() => {
    fetchTabs();
    loadPriorityDomains();
  }, [fetchTabs, loadPriorityDomains]);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4, minWidth: '640px' }}>
      <Container maxWidth="md" sx={{ color: '#000' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Tabs Sorter
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Select Domains to Prioritize
          </Typography>
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

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={sortTabsByDomain} sx={{ fontSize: '0.75rem' }}>
            Sort Priority Tabs
          </Button>
          <Button variant="outlined" onClick={sortNonPriorityTabsAlphabetically} sx={{ fontSize: '0.75rem' }}>
            Sort Non-Priority Tabs (A–Z)
          </Button>
          <Button variant="outlined" onClick={fetchTabs} sx={{ fontSize: '0.75rem' }}>
            Refresh Tabs
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Open Tabs
        </Typography>

        <List sx={{ bgcolor: '#fff', border: '1px solid #ccc', borderRadius: 1 }}>
          {tabs.map((tab) => {
            const domain = getDomainFromURL(tab.url || '');
            return (
              <ListItem
                key={tab.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => closeTab(tab.id)}>
                    <CloseIcon />
                  </IconButton>
                }
                sx={{ borderBottom: '1px solid #ddd' }}
              >
                {tab.favIconUrl && (
                  <ListItemAvatar>
                    <Avatar src={tab.favIconUrl} alt="Tab icon" />
                  </ListItemAvatar>
                )}
                <ListItemText primary={tab.title} secondary={tab.url} />
              </ListItem>
            );
          })}
        </List>
      </Container>
    </Box>
  );
}

export default App;
