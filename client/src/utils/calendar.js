import { forEach } from 'lodash';

export const getWeekProgress = (week, stats, weekIndex) => {
  let totalDays = 0;
  let completedDays = 0;
  forEach(week.days, (i, index) => {
    if (!i.IsRest) {
      totalDays = totalDays + 1;
    }
    if (stats?.[`${weekIndex}-${index}`]) {
      completedDays = completedDays + 1;
    }
  });

  return totalDays ? completedDays / totalDays : 0;
};

export const getCurrentInProgressWeekNumber = (weeks, stats) => {
  let pogressWeek = 0;
  forEach(weeks, (w, windex) => {
    forEach(w.days, (i, index) => {
      if (stats?.[`${windex}-${index}`]) {
        pogressWeek = windex;
      }
    });
  });

  return pogressWeek;
};
