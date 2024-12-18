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
        new Set(
          tabs
            .map((tab) => getDomainFromURL(tab.url || ''))
            .filter((domain) => domain !== '')
        )
      );
      setDomains(uniqueDomains);
    },
    [getDomainFromURL]
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

        return (
          (indexA !== -1 ? indexA : domains.length) -
          (indexB !== -1 ? indexB : domains.length)
        );
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
      // Separate tabs into priority and non-priority
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

      // Sort priority tabs in the order of priority domains
      priorityTabs.sort((a, b) => {
        const domainA = getDomainFromURL(a.url || '');
        const domainB = getDomainFromURL(b.url || '');
        const indexA = priorityDomains.indexOf(domainA);
        const indexB = priorityDomains.indexOf(domainB);
        return indexA - indexB;
      });

      // Sort non-priority tabs alphabetically by their domain
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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md" sx={{ color: '#000' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Tab Sorter by Domain
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
            sx={{
              borderColor: '#aaa',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#aaa',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#777',
              },
            }}
          >
            {domains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#aaa' }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={sortTabsByDomain}
            sx={{
              borderColor: '#aaa',
              color: '#000',
              ':hover': {
                backgroundColor: '#eee',
                borderColor: '#777',
              },
            }}
          >
            Sort Priority Tabs
          </Button>
          <Button
            variant="outlined"
            onClick={sortNonPriorityTabsAlphabetically}
            sx={{
              borderColor: '#aaa',
              color: '#000',
              ':hover': {
                backgroundColor: '#eee',
                borderColor: '#777',
              },
            }}
          >
            Sort Non-Priority Tabs (A–Z)
          </Button>
          <Button
            variant="outlined"
            onClick={fetchTabs}
            sx={{
              borderColor: '#aaa',
              color: '#000',
              ':hover': {
                backgroundColor: '#eee',
                borderColor: '#777',
              },
            }}
          >
            Refresh Tabs
          </Button>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#aaa' }} />

        <Typography variant="h6" gutterBottom>
          Open Tabs
        </Typography>

        <List
          sx={{
            bgcolor: '#fff',
            border: '1px solid #aaa',
            borderRadius: 1,
          }}
        >
          {tabs.map((tab) => {
            const domain = getDomainFromURL(tab.url || '');
            return (
              <ListItem
                key={tab.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => closeTab(tab.id)}
                    sx={{
                      color: '#000',
                      ':hover': { backgroundColor: '#f0f0f0' },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                sx={{
                  '&:not(:last-child)': {
                    borderBottom: '1px solid #aaa',
                  },
                }}
              >
                {tab.favIconUrl && (
                  <ListItemAvatar>
                    <Avatar
                      src={tab.favIconUrl}
                      alt="Tab icon"
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: '#fff',
                      }}
                    />
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={tab.title}
                  secondary={tab.url}
                  primaryTypographyProps={{
                    variant: 'subtitle1',
                    noWrap: true,
                    sx: { color: '#000' },
                  }}
                  secondaryTypographyProps={{
                    variant: 'body2',
                    noWrap: true,
                    sx: { color: '#555' },
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 4 }}>
          <Typography variant="caption" sx={{ color: '#555' }} component="div">
            <a
              href="https://www.flaticon.com/free-icons/tabs"
              title="tabs icons"
              style={{ color: '#555', textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tabs icons created by Pixel perfect - Flaticon
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
