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

function Popup() {
  const [tabs, setTabs] = useState<ChromeTab[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [priorityDomains, setPriorityDomains] = useState<string[]>([]);

  const fetchTabs = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'FETCH_TABS' }, (response) => {
      if (!response?.success) return;

      setTabs(response.tabs);
      const uniqueDomains = Array.from(
        new Set(
          response.tabs
            .map((tab: ChromeTab) => {
              try {
                return new URL(tab.url ?? '').hostname;
              } catch {
                return '';
              }
            })
            .filter((d: string) => d !== ''),
        ),
      );

      const mergedDomains = Array.from(
        new Set([...uniqueDomains, ...priorityDomains]),
      ) as string[];

      setDomains(mergedDomains);
    });
  }, [priorityDomains]);

  const loadPriorityDomains = useCallback(() => {
    chrome.runtime.sendMessage(
      { type: 'LOAD_PRIORITY_DOMAINS' },
      (response) => {
        if (!response?.success) return;
        setPriorityDomains(response.priorityDomains);
      },
    );
  }, []);

  const savePriorityDomains = (selected: string[]) => {
    chrome.runtime.sendMessage(
      { type: 'SAVE_PRIORITY_DOMAINS', payload: selected },
      (response) => {
        if (!response?.success) return;
        console.log('Priority domains saved.');
      },
    );
  };

  const sortTabsByDomain = () => {
    chrome.runtime.sendMessage({ type: 'SORT_TABS_BY_DOMAIN' }, (response) => {
      if (!response?.success) return;
      setTabs(response.tabs);
    });
  };

  const sortNonPriorityTabsAlphabetically = () => {
    chrome.runtime.sendMessage(
      { type: 'SORT_NON_PRIORITY_TABS_ALPHABETICALLY' },
      (response) => {
        if (!response?.success) return;
        setTabs(response.tabs);
      },
    );
  };

  const handleDomainSelection = (selectedDomains: string[]) => {
    setPriorityDomains(selectedDomains);
    savePriorityDomains(selectedDomains);
  };

  const closeTab = (tabId: number | undefined) => {
    if (!tabId) return;
    chrome.runtime.sendMessage({ type: 'CLOSE_TAB', payload: tabId }, () => {
      fetchTabs();
    });
  };

  useEffect(() => {
    loadPriorityDomains();
  }, [loadPriorityDomains]);

  useEffect(() => {
    fetchTabs();
  }, [priorityDomains, fetchTabs]);

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        py: 4,
        minWidth: '640px',
      }}
    >
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
          <Button
            variant="outlined"
            onClick={sortTabsByDomain}
            sx={{ fontSize: '0.75rem' }}
          >
            Sort Priority Tabs
          </Button>
          <Button
            variant="outlined"
            onClick={sortNonPriorityTabsAlphabetically}
            sx={{ fontSize: '0.75rem' }}
          >
            Sort Non-Priority Tabs (A–Z)
          </Button>
          <Button
            variant="outlined"
            onClick={fetchTabs}
            sx={{ fontSize: '0.75rem' }}
          >
            Refresh Tabs
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Open Tabs
        </Typography>

        <List
          sx={{ bgcolor: '#fff', border: '1px solid #ccc', borderRadius: 1 }}
        >
          {tabs.map((tab) => {
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

export default Popup;
