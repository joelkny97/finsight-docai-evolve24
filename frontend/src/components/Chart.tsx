import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import Title from './Title';

// Generate Sales Data
function createData(
  datetime: Date,
  amount?: number,
): { datetime: Date; amount: number | null } {
  return { datetime, amount: amount ?? null };
}

const data = [
  createData( new Date('2024-01-01T00:00:00.000Z'), 0),
  createData( new Date('2024-02-01T00:00:00.000Z'), 300),
  createData( new Date('2024-03-01T00:00:00.000Z'), 600),
  createData( new Date('2024-04-01T00:00:00.000Z'), 800),
  createData( new Date('2024-05-01T00:00:00.000Z'), 1500),
  createData( new Date('2024-06-01T00:00:00.000Z'), 2000),
  createData( new Date('2024-07-01T00:00:00.000Z'), 2400),
  createData( new Date('2024-08-01T00:00:00.000Z'), 2400),

];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'time',
              dataKey: 'datetime',
              tickNumber: 6,
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              
              
            },
          ]}
          yAxis={[
            {
              label: 'Portfolio Value ($)',
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              max: 2500,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}