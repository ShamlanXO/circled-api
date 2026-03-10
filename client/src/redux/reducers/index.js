import { combineReducers } from "redux";
import NewProgram from "./NewProgram";
import Onboarding from "./Onboard";
import Feedback from "./Feedback";
import Common from "./Common";
import Profile from "./Profile";
import Library from "./FiggsLibrary";
import ProgramList from "./ProgramList";
import AtheletePlan from "./ClientExercise";
import Notifications from "./Notifications";
import Chat from "./Chat";
import Sync from "./Sync";
import BodyImages from "./BodyImages";
import ProgressLogs from "./ProgressLogs"
export default combineReducers({
  NewProgram,
  Onboarding,
  Feedback,
  Profile,
  Library,
  Notifications,
  ProgramList,
  AtheletePlan,
  Chat,
  Common,
  BodyImages,
  Sync,
  ProgressLogs
});
