import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VelocityChart from '../VelocityChart';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({
  data: {
    velocity: {
      x: { data: [{ datetime: '2024-07-18T00:00:00Z', max: 1 }] },
      y: { data: [{ datetime: '2024-07-18T00:00:00Z', max: 2 }] },
      z: { data: [{ datetime: '2024-07-18T00:00:00Z', max: 3 }] },
    },
  },
  loading: false,
});

vi.mock('../../../utils/formatChartData', () => ({
  formatChartData: vi.fn((data: { datetime: string; max: number }[]) =>
    data.map((point) => [new Date(point.datetime).getTime(), point.max * 100]),
  ),
}));

vi.mock('../../../utils/commonChartOptions', () => ({
  commonChartOptions: vi.fn((titleText, yAxisText, series) => ({
    title: { text: titleText },
    yAxis: { title: { text: yAxisText } },
    series,
  })),
}));

describe('<VelocityChart />', () => {
  it('should renders loading state correctly', () => {
    const loadingStore = configureMockStore()({
      data: {},
      loading: true,
    });

    render(
      <Provider store={loadingStore}>
        <VelocityChart />
      </Provider>,
    );

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it('should renders the chart correctly when data is available', () => {
    render(
      <Provider store={store}>
        <VelocityChart />
      </Provider>,
    );

    expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });
});