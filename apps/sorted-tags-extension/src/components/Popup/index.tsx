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
  const [tabOpenTimes, setTabOpenTimes] = useState<Record<number, number>>({});

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

  const fetchTabOpenTimes = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'GET_TAB_OPEN_TIMES' }, (response) => {
      if (!response?.success) return;
      setTabOpenTimes(response.tabOpenTimes);
    });
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

  const sortNonPriorityTabsByOpenTime = () => {
    chrome.runtime.sendMessage(
      { type: 'SORT_NON_PRIORITY_TABS_BY_OPEN_TIME' },
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
    fetchTabOpenTimes();
  }, [loadPriorityDomains, fetchTabOpenTimes]);

  useEffect(() => {
    fetchTabs();
  }, [priorityDomains, fetchTabs]);

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        pt: 4,
        minWidth: '640px',
      }}
    >
      <Container maxWidth="md" sx={{ color: '#000', pb: 4 }}>
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
          onSortByOpenTime={sortNonPriorityTabsByOpenTime}
          onRefreshTabs={fetchTabs}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Open Tabs
        </Typography>

        <TabList
          tabs={tabs}
          tabOpenTimes={tabOpenTimes}
          onCloseTab={closeTab}
        />
      </Container>

      <Box
        sx={{
          textAlign: 'center',
          mt: 2,
          py: 1,
          backgroundColor: '#e0e0e0',
          borderTop: '1px solid #ccc',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          {`Tabs icons created by `}
          <a
            href="https://www.flaticon.com/authors/pixel-perfect"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {'Pixel perfect - Flaticon'}
          </a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Popup;
