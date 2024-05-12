import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface DashboardData {
  totalUserSignUp: number;
  totalUserActiveToday: number;
  totalUserActiveOneWeek: number;
}

export default function Chart({ headerJwt }: { headerJwt?: string }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: DashboardData }>('http://localhost:3001/dashboard/custom', {
          headers: {
            Authorization: 'Bearer ' + headerJwt
          }
        });
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (headerJwt) {
      fetchData();
    }
  }, [headerJwt]);
  // Calculate the average over the past 7 days
  const averageTotalActiveOneWeek = dashboardData
    ? Math.floor(dashboardData.totalUserActiveOneWeek / 7)
    : 0;
  return (
    <BarChart
      series={[{
        data: [
          // if not null
          dashboardData?.totalUserSignUp ?? 0,
          dashboardData?.totalUserActiveToday ?? 0,
          averageTotalActiveOneWeek
        ]
      }]}
      xAxis={[{
        scaleType: 'band',
        data: ['Total User Sign Up', 'Total Active User Today', 'Average Total User Active 7 Days Ago']
      }]}
      height={350}
      width={750}
      leftAxis={null}
    />
  );
}
