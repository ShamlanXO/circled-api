const checkIsDraft = (Program) => {
  let checkList = {
    Title: false,
    Exercise: false,
  };

  if (Program.Title) checkList.Title = true;
  let EmptyWeeks = Program?.ExercisePlan.weeks.find(
    (week) => week.days.find((day) => day.Exercise.length > 0) == null
  );
  let HasNoTitle= Program?.ExercisePlan.weeks.find(
    (week) => week.days.find((day) => day.Title.length > 0) == null
  );

  if (checkList.Title && (!EmptyWeeks||!HasNoTitle) ) return false;
  else return true;
};


const getEmptyWeekNumber = (Program) => {
  let EmptyWeekIndex = Program?.ExercisePlan.weeks.findIndex(
    (week) => week.days.find((day) => day.Title.length > 0 ||day.Exercise.length > 0) == null
  );
  return EmptyWeekIndex+1;
};

export { checkIsDraft, getEmptyWeekNumber };


