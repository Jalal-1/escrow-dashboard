import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import useEscrowCounter from 'src/hooks/useEscrowCounter';
import useEscrowStatistics from 'src/hooks/useEscrowStatistics';
import useEventDayDatas from 'src/hooks/useEventDayDatas';

import { EscrowBarChart, EscrowStackedBarChart } from './Charts';

export const EscrowView = () => {
  const escrowStatistics = useEscrowStatistics();
  const eventDayDatas = useEventDayDatas();
  const escrowCounter = useEscrowCounter();

  const escrowSeries = useMemo(() => {
    if (eventDayDatas) {
      return eventDayDatas.map((item) => ({
        date: dayjs(Number(item.timestamp) * 1000).format('DD/MM'),
        dailyEscrowAmounts: Number(item.dailyEscrowAmounts),
        dailyPendingEvents: Number(item.dailyPendingEvents),
      }));
    }
    return [];
  }, [eventDayDatas]);

  const bulkTransferEvents = useMemo(() => {
    if (eventDayDatas) {
      return eventDayDatas.map((item) => ({
        date: dayjs(Number(item.timestamp) * 1000).format('DD/MM'),
        value: Number(item.dailyBulkTransferEvents),
      }));
    }
    return [];
  }, [eventDayDatas]);

  const intermediateStorageEvents = useMemo(() => {
    if (eventDayDatas) {
      return eventDayDatas.map((item) => ({
        date: dayjs(Number(item.timestamp) * 1000).format('DD/MM'),
        value: Number(item.dailyIntermediateStorageEvents),
      }));
    }
    return [];
  }, [eventDayDatas]);

  const totalEscrowEvents = useMemo(() => {
    if (eventDayDatas) {
      return eventDayDatas.map((item) => ({
        date: dayjs(Number(item.timestamp) * 1000).format('DD/MM'),
        value:
          Number(item.dailyBulkTransferEvents) +
          Number(item.dailyIntermediateStorageEvents) +
          Number(item.dailyPendingEvents),
      }));
    }
    return [];
  }, [eventDayDatas]);

  return (
    <Grid container spacing={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}>
      <Grid item xs={12}>
        <EscrowStackedBarChart
          series={escrowSeries}
          allEscrowAmount={escrowCounter}
          pendingEventCount={escrowStatistics?.pendingEventCount}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <EscrowBarChart
          title="BulkTransfer Events"
          totalValue={escrowStatistics?.bulkTransferEventCount}
          series={bulkTransferEvents}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <EscrowBarChart
          title="IntermediateStorage Events"
          totalValue={escrowStatistics?.intermediateStorageEventCount}
          series={intermediateStorageEvents}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <EscrowBarChart
          title="Total Number Of Escrows Events"
          totalValue={
            escrowStatistics
              ? Number(escrowStatistics.intermediateStorageEventCount) +
                Number(escrowStatistics.bulkTransferEventCount) +
                Number(escrowStatistics.pendingEventCount)
              : 0
          }
          series={totalEscrowEvents}
        />
      </Grid>
    </Grid>
  );
};
