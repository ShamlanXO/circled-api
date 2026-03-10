export const hasExercisesInWeeks = (Program , start , end) => {

    const weeks = Program.ExercisePlan.weeks.slice(start-1, end); // get weeks 3-6
  
    for (let week of weeks) {
      for (let day of week.days) {
        if (day.Exercise.length > 0) {
          return true; // found a day with exercises
        }
      }
    }
  
    return false; // no exercises found in weeks 3-6
  };
  
  // usage:
