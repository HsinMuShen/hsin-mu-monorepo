import { useEffect, useState, useCallback } from 'react';
import { Typography, Container, Box, Divider } from '@mui/material';
import type { ChromeTab } from '@/type';

import { DomainSelector } from './components/DomainSelector';
import { SortingButtons } from './components/SortingButtons';
import { TabList } from './components/TabList';

export function Popup() {
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

        <DomainSelector
          domains={domains}
          priorityDomains={priorityDomains}
          onDomainSelection={handleDomainSelection}
        />

        <Divider sx={{ my: 2 }} />

        <SortingButtons
          onSortPriority={sortTabsByDomain}
          onSortNonPriority={sortNonPriorityTabsAlphabetically}
          onRefreshTabs={fetchTabs}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Open Tabs
        </Typography>

        <TabList tabs={tabs} onCloseTab={closeTab} />
      </Container>
    </Box>
  );
}

export default Popup;
