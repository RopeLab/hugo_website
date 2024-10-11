import {useEffect, useState} from "react";
import {Chart} from 'primereact/chart';
import {EventUserAction, GetUserActions, UserAction} from "../api/user_action";
import {GetGermanDateTime} from "../api/events";

export const UserActionView = ({user_id}: {user_id: number}) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [userActions, setUserActions] = useState<UserAction[]>([]);

  useEffect(() => {
    GetUserActions(user_id, setUserActions);
  }, [user_id])

  useEffect(() => {
    let sorted_actions = userActions.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else {
        return 1;
      }
    });

    let dayNames: string[] = ["Start"];
    let people: number[] = [0];
    let people_waiting: number[] = [0];
    sorted_actions.forEach((action) => {
      dayNames.push(GetGermanDateTime(new Date(action.date)))

      let amount = action.guests + 1;
      if (action.action === EventUserAction.Unregister) {
        amount = 0;
      }

      if (!action.in_waiting) {
        people.push(amount)
        people_waiting.push(0)
      } else {
        people.push(0)
        people_waiting.push(amount)
      }
    })

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: dayNames,
      datasets: [
        {
          label: 'Angemeldet',
          data: people,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--blue-500')
        },
        {
          label: 'Warten',
          data: people_waiting,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--yellow-500')
        },
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, [userActions]);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  )
}
