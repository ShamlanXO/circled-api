
import { DEFAULT_MUSCLE_DATA } from '../constants';

/*
 * Utility function for choosing backup value if first value is undefined
 */
export const ensure = (value, backupValue) => {
  return value == null ? backupValue : value;
};

/**
 * Function which determines color of muscle based on how often it has been exercised
 */
export const fillIntensityColor = (
  activityMap,
  highlightedColors,
  muscle,
) => {
  const frequency = activityMap[muscle]?.frequency;

  if (frequency == null || frequency === 0) {
    return undefined;
  }

  return highlightedColors[Math.min(highlightedColors.length - 1, frequency - 1)];
};

/**
 * Function which generates object with muscle data
 */
export const fillMuscleData = (data) => {
  return data.reduce((acc, exercise) => {
    for (const muscle of exercise.muscles) {
      acc[muscle].exercises = [...acc[muscle].exercises, exercise.name];
      acc[muscle].frequency += exercise.frequency || 1;
    }

    return acc;
  }, JSON.parse(JSON.stringify(DEFAULT_MUSCLE_DATA)));
};
