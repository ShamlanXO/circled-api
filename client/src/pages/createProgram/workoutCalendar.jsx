// @mui

import { useEffect, useState, forwardRef, useCallback, useMemo } from 'react';
import Content from '../../components/Layout/Content';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useConfirmationModalContext } from 'src/utils/Modal';
import WorkoutWeek from 'src/components/instructor/workoutWeek';
import { useOutletContext } from 'react-router-dom';
import { arrayMoveImmutable } from 'array-move';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import Walkthrough from 'src/components/Labs/Walkthrough';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import ObjectID from 'bson-objectid';

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const [destData, setDestData] = useState(null);

  const [Program, updateProgram, mode, saveProgram] = useOutletContext();
  const navigate = useNavigate();
  const { showConfirmationModal } = useConfirmationModalContext();
  const [sourceData, setSourceData] = useState(null);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    ref.current = {};
  }, []);

  const copyExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
    if (sourceWeek === destinationWeek && sourceDay === destinationDay) return;
    let allPrograms = { ...Program.ExercisePlan };

    if (allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length) {
      showConfirmationModal(
        'Are you sure ?',
        `You are going to replace (week ${Number(destinationWeek) + 1} - day ${
          Number(destinationDay) + 1
        }) exercises with (week ${sourceWeek + 1} - day ${sourceDay + 1}). This process is irreversible`,
        'Replace',
        'Cancel',
      ).then((res) => {
        if (res) {
          allPrograms.weeks[destinationWeek].days[destinationDay].Exercise = [
            ...allPrograms.weeks[sourceWeek].days[sourceDay].Exercise,
          ];

          allPrograms.weeks[destinationWeek].days[destinationDay].Title =
            allPrograms.weeks[sourceWeek].days[sourceDay].Title;

          dispatch(updateProgram({ ExercisePlan: allPrograms }));
        } else {
          return;
        }
      });
    } else {
      let initialItem = {
        ...allPrograms.weeks[sourceWeek].days[sourceDay],
      };

      allPrograms.weeks[destinationWeek].days[destinationDay] = initialItem;

      allPrograms.weeks[sourceWeek].days[sourceDay] = { ...initialItem, _id: String(ObjectID()) };

      dispatch(updateProgram({ ExercisePlan: allPrograms }));
    }
  };

  const swapExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
    let allPrograms = cloneDeep(Program.ExercisePlan);
    let temp1 = cloneDeep(allPrograms.weeks[sourceWeek].days);

    let result = arrayMoveImmutable(temp1, sourceDay, destinationDay);
    allPrograms.weeks[sourceWeek].days = result;
    dispatch(updateProgram({ ExercisePlan: allPrograms }));
  };

  const copyWeek = (s, d) => {
    let allPrograms = cloneDeep(Program.ExercisePlan);
    let hasExercise = allPrograms.weeks[d].days.find((i) => i.Exercise.length);

    if (hasExercise) {
      showConfirmationModal(
        'Are you sure ?',
        `You are going to replace (week ${Number(d) + 1}) exercises with (week ${s + 1}). This process is irreversible`,
        'Replace',
        'Cancel',
      ).then((res) => {
        if (res) {
          allPrograms.weeks[d] = allPrograms.weeks[s];
          dispatch(updateProgram({ ExercisePlan: allPrograms }));
        } else {
          return;
        }
      });
    } else {
      allPrograms.weeks[d] = allPrograms.weeks[s];
      dispatch(updateProgram({ ExercisePlan: allPrograms }));
    }
  };

  const onDragUpdate = (result) => {
    const { source, destination, combine, type } = result;

    let destDataC = {};
    if (type == 'Weeks') {
      destDataC = {
        ...destDataC,
        day: null,
        sourceWeek: source.index,
        week: destination?.index,
        type,
      };
      setDestData(destDataC);

      return;
    }
    if (!destination) {
      destDataC = {
        sweek: Number(source.droppableId),
        week: Number(source.droppableId),
        cweek: Number(source.droppableId),
      };
    } else {
      destDataC = {
        ...destDataC,
        week: Number(destination?.droppableId),
        day: destination?.index,
        type,
        sweek: Number(source.droppableId),
      };
    }
    if (combine) {
      let destinationWeek = combine.draggableId.split('-')[0];
      let destinationDay = combine.draggableId.split('-')[1];
      destDataC = {
        ...destDataC,
        cweek: destinationWeek,
        cday: destinationDay,
        type,
        sweek: Number(source.droppableId),
      };
    }

    setDestData(destDataC);
  };

  const onDragEnd = (result) => {
    const { source, destination, combine, type } = result;
    let allPrograms = cloneDeep(Program.ExercisePlan);
    if (type == 'Weeks') {
      if (source?.index !== destination?.index) {
        copyWeek(source.index, destination.index);
      }

      let destDataC = {};
      setDestData(destDataC);

      return;
    }

    setDestData(null);

    if (!destination && !combine) {
      return;
    }

    if (combine) {
      let sourceWeek = Number(source.droppableId);
      let sourceDay = source.index;
      let destinationWeek = (destination || combine).draggableId.split('-')[0];
      let destinationDay = (destination || combine).draggableId.split('-')[1];
      if (
        allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length == 0 &&
        !allPrograms.weeks[destinationWeek].days[destinationDay].Title
      )
        copyExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    } else {
      let sourceWeek = Number(source.droppableId);
      let sourceDay = source.index;
      let destinationWeek = Number(destination.droppableId);
      let destinationDay = destinationWeek > 0 && sourceWeek != destinationWeek ? destination.index : destination.index;
      if (destinationDay < 0) return;
      if (
        allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length == 0 &&
        !allPrograms.weeks[destinationWeek].days[destinationDay].Title &&
        sourceWeek != destinationWeek
      ) {
        copyExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
      } else {
        if (sourceWeek == destinationWeek) swapExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
      }
    }
  };

  const checkIfTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const sensors = useSensors(
    useSensor(checkIfTouchDevice() ? TouchSensor : PointerSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 100,
      },
    }),
  );

  const getWeekandday = useCallback(
    (id) => {
      let week = Program.ExercisePlan.weeks.findIndex((i) => i.days.findIndex((j) => j._id == id) != -1);
      let day = Program.ExercisePlan.weeks[week].days.findIndex((j) => j._id == id);
      return { week, day };
    },
    [Program.ExercisePlan],
  );

  const handleDragStart = (event) => {
    setIsActive(true);
    if (event.active.id) {
      let { week, day } = getWeekandday(event.active.id);
      setSourceData({
        week: week,
        day: day,
      });
    } else {
      setSourceData(null);
    }
  };

  const handleDragEnd = (event) => {
    setIsActive(false);
    if (!destData || !sourceData) {
      setSourceData(null);
      setDestData(null);
      return;
    }

    let allPrograms = cloneDeep(Program.ExercisePlan);
    let sourceWeek = sourceData.week;
    let sourceDay = sourceData.day;
    let destinationWeek = destData.week;
    let destinationDay = destData.day;

    if (
      sourceData.week !== destData.week &&
      Program.ExercisePlan.weeks[destData.week].days[destData.day].Exercise.length == 0
    ) {
      if (
        allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length == 0 &&
        !allPrograms.weeks[destinationWeek].days[destinationDay].Title
      )
        copyExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    } else {
      if (sourceWeek == destinationWeek) swapExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    }

    setSourceData(null);
    setDestData(null);
  };

  const handleDragCancel = (event) => {
    setSourceData(null);
  };

  const handleDragOver = useMemo(
    () =>
      debounce((event) => {
        if (event.over?.id) {
          let { week, day } = getWeekandday(event.over.id);
          setDestData({
            week: week,
            day: day,
          });
        } else {
          setDestData(null);
        }
      }, 50),
    [getWeekandday],
  );

  return (
    <Content
      style={{
        paddingTop: 16,
        paddingLeft: 0,
        paddingRight: 0,
       
      }}
    >
      <Walkthrough Program={Program} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <WorkoutWeek
          Program={Program}
          updateProgram={updateProgram}
          mode={mode}
          destData={destData}
          sourceData={sourceData}
        />
      </DndContext>
    </Content>
  );
});
