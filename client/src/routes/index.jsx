import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import SharedWorkoutLayout from 'src/layouts/SharedWorkoutLayout';
import MainLayout from '../layouts/main';
import OnboardingLayout from '../layouts/onboarding';
import ProgramSendLayout from '../layouts/InstructorSend';
import ProtectedLayout from '../layouts/Protected';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import CreateProgramLayout from '../layouts/CreateWorkout';
import SendWorkoutLayout from '../layouts/SendWorkoutLayout';
import ClientLayout from '../layouts/ClientPagesLayout';
import InstructorClient from '../layouts/InstructorClient';

import { StripeProvider } from 'react-stripe-elements';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import EditProgramLayout from 'src/layouts/EditWorkout';
import LoadingScreen from '../components/LoadingScreen';
import { element } from 'prop-types';
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};
const TrainerPrograms = Loadable(lazy(() => import('src/pages/common/TrainerPrograms')));
const SignInOptions = Loadable(lazy(() => import('../pages/SignupOptions')));
const TrainingLogs = Loadable(lazy(() => import('../pages/client/TrainingLogs')));
const InstructorPage = Loadable(lazy(() => import('src/pages/instructor')));
const CreateProgramPage = Loadable(lazy(() => import('../pages/createProgram/index')));
const EditProgramPage = Loadable(lazy(() => import('../pages/createProgram/editProgram')));
const WorkoutCalendar = Loadable(lazy(() => import('src/pages/createProgram/workoutCalendar')));
const WorkoutDay = Loadable(lazy(() => import('src/pages/createProgram/workoutDay')));
const DietPlan = Loadable(lazy(() => import('src/pages/createProgram/dietPlan')));
const PublishProgram = Loadable(lazy(() => import('src/pages/createProgram/publishProgram')));
const ProgramOverviewPage = Loadable(lazy(() => import('src/pages/instructor/programOverview')));
const UpdateProgram = Loadable(lazy(() => import('src/pages/instructor/updateProgram')));
const Notifications = Loadable(lazy(() => import('src/pages/Notifications')));
const PlanDetail = Loadable(lazy(() => import('src/pages/workout/planDetail')));
const ClientsPage = Loadable(lazy(() => import('src/pages/instructor/clients')));
const ProfilePage = Loadable(lazy(() => import('src/pages/instructor/profile')));
const EditProfilePage = Loadable(lazy(() => import('src/pages/instructor/profileUpdate')));
const EditProfileClientPage = Loadable(lazy(() => import('src/pages/client/editProfile')));
const ClientProfilePage = Loadable(lazy(() => import('src/pages/instructor/client/clientProfile')));
const ClientProfilePhotos = Loadable(lazy(() => import('src/pages/instructor/client/clientProfilePhotos')));
const ClientProfilePhotosSingle = Loadable(lazy(() => import('src/pages/instructor/client/ClientPhoto')));
const ProfilePhotoProgram = Loadable(lazy(() => import('src/pages/instructor/client/profilePhotoProgram')));
const InstructorNotificationsPage = Loadable(lazy(() => import('src/pages/instructor/client/notifications')));
const ClientProfileSupps = Loadable(lazy(() => import('src/pages/instructor/client/clientSups')));
const ClientProfileNotes = Loadable(lazy(() => import('src/pages/instructor/client/clientProfileNotes')));
const ClientProfileBodySystem = Loadable(lazy(() => import('src/pages/instructor/client/clientProfileBodySystem')));
const SendProgramPage = Loadable(lazy(() => import('src/pages/instructor/sendProgram')));
const SendProgramEditWorkouts = Loadable(lazy(() => import('src/pages/instructor/sendProgramEditWorkouts')));
const ClientPage = Loadable(lazy(() => import('src/pages/client')));
const AccountSettingPage = Loadable(lazy(() => import('src/pages/client/accountSettings')));
const ResetPassword = Loadable(lazy(() => import('src/pages/client/resetPassword')));
const DraftsPage = Loadable(lazy(() => import('src/pages/instructor/drafts')));
const ArchivedPage = Loadable(lazy(() => import('src/pages/instructor/archives')));
const MyInstructorPage = Loadable(lazy(() => import('src/pages/client/myInstructor')));
const CurrentProgramPage = Loadable(lazy(() => import('src/pages/client/currentProgram')));
const MyProfilePage = Loadable(lazy(() => import('src/pages/client/myProfile')));
const ClientWorkoutCalendar = Loadable(lazy(() => import('src/pages/client/workoutCalendar')));
const MyWorkoutDayPage = Loadable(lazy(() => import('src/pages/client/workoutDay')));
const MyExerciseView = Loadable(lazy(() => import('src/pages/client/ViewExercise')));
const MyExercisePage = Loadable(lazy(() => import('src/pages/client/exercise')));
const MyProfileBodySystem = Loadable(lazy(() => import('src/pages/client/myProfileBodySystem')));
const MyProfileSupps = Loadable(lazy(() => import('src/pages/client/myProfileSupps')));
const MyProfilePhotos = Loadable(lazy(() => import('src/pages/client/myProfilePhotos')));
const MyProfilePhotoOne = Loadable(lazy(() => import('src/pages/client/myProfilePhotoOne')));
const MyProfilePhotosNew = Loadable(lazy(() => import('src/pages/client/myProfilePhotosNew')));
const ClientCompletePaymentPage = Loadable(lazy(() => import('src/pages/client/payment/completePayment')));
const DietPlanPage = Loadable(lazy(() => import('src/pages/client/dietPlan')));
const MessagesPage = Loadable(lazy(() => import('src/pages/messages')));
const ClientView = Loadable(lazy(() => import('src/pages/instructor/clientsTab')));
const ChatWindowPage = Loadable(lazy(() => import('src/pages/messages/chatWindow')));
const AddEmailRecievers = Loadable(lazy(() => import('src/pages/createProgram/addEmailRecievers')));
const EditMediaPage = Loadable(lazy(() => import('src/pages/editMedia')));
const ForgotPasswordPage = Loadable(lazy(() => import('src/pages/auth/forgotPassword')));
const ViewMedia = Loadable(lazy(() => import('src/pages/viewMedia')));

const ClientInfo = Loadable(lazy(() => import('src/pages/onboarding/clientInfo')));
const ClientInfo2 = Loadable(lazy(() => import('src/pages/onboarding/clientInfo2')));
const OnboardingInfo = Loadable(lazy(() => import('src/pages/onboarding/betainfo')));
const MainTest = Loadable(lazy(() => import('src/pages/test/videoupload')));
const DietEdit = Loadable(lazy(() => import('src/pages/instructor/client/dietPlan')));
const PublicProgramView = Loadable(lazy(() => import('src/pages/client/viewProgram')));
const WorkoutCalendarClient = Loadable(lazy(() => import('src/pages/createProgram/workoutCalendarClient')));
const Restricted = Loadable(lazy(() => import('src/pages/Restricted')));
const HelpPage = Loadable(lazy(() => import('src/pages/common/guide/Help')));
const Feedback = Loadable(lazy(() => import('src/pages/common/Feedback')));
const BugReport = Loadable(lazy(() => import('src/pages/common/BugReport')));
const InstructorAccountPage = Loadable(lazy(() => import('src/pages/onboarding/instructor/Preview')));
const InstructorAccountPage2 = Loadable(lazy(() => import('src/pages/onboarding/instructor/Profile')));
const ProgressLogs = Loadable(lazy(() => import('src/pages/common/ClientProgress')));
const LibraryLayout = Loadable(lazy(() => import('src/layouts/LibraryLayout')));
const HealthInfo = Loadable(lazy(() => import('src/pages/onboarding/healt-info')));
const HealthInfo2 = Loadable(lazy(() => import('src/pages/onboarding/healt-info2')));
const HomeLibrary = Loadable(lazy(() => import('src/pages/instructor/library/HomeLibrary')));
const MoreMenu = Loadable(lazy(() => import('src/pages/instructor/MoreMenu')));
const ClientMoreMenu = Loadable(lazy(() => import('src/pages/client/MoreMenu')));
const AddWorkoutToLibrary = Loadable(lazy(() => import('src/pages/instructor/library/Addworkout')));
const AddmediaToWorkoutLibrary = Loadable(lazy(() => import('src/pages/instructor/library/AddMedia')));
const EditLibraryVideo = Loadable(lazy(() => import('src/pages/instructor/library/AddEditVideo')));
const SharedWorkout = Loadable(lazy(() => import('src/pages/common/SharedWorkout/main')));
const SharedWorkoutExerciseView = Loadable(lazy(() => import('src/pages/common/SharedWorkout/ExerciseView')));
const LibraryVideoPlayer = Loadable(lazy(() => import('src/pages/instructor/library/VideoPlayer')));
const MyPrograms = Loadable(lazy(() => import('src/pages/client/Myprograms')));
//----------------------------------------------------------------
const AddPaymentMethod = Loadable(lazy(() => import('src/pages/Payment/client/AddPaymentMethod')));

//----------------------------------------------------------------

const EditSendProgram = Loadable(lazy(() => import('src/pages/createProgram/EditSendProgram')));
const EditSendDiet = Loadable(lazy(() => import('src/pages/createProgram/EditSendDiet')));
const InstructorProfile = Loadable(lazy(() => import('src/pages/common/InstructorProfile')));
const AddtrainingLog = Loadable(lazy(() => import('src/pages/client/AddtrainingLog')));
//------library
const PublicLibrary = Loadable(lazy(() => import('src/pages/instructor/library/Public')));
const WorkoutsPage = Loadable(lazy(() => import('src/pages/instructor/library/Workouts')));
const UploadsPage = Loadable(lazy(() => import('src/pages/instructor/library/Uploads')));

//------- invite client
const SendInvite = Loadable(lazy(() => import('src/pages/instructor/inviteClient/invite')));
const AcceptInvite = Loadable(lazy(() => import('src/pages/instructor/inviteClient/acceptInvite')));

export default function Router() {
  const Profile = useSelector((s) => s.Profile);

  const instructorRoutes = [
    // Main Routes
    {
      path: '*',

      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },

        {
          path: 'invite',
          element: <Restricted title={'Invite a friend'} />,
        },
        {
          path: 'help',
          element: <HelpPage title={'Help and support'} />,
        },
        {
          path: 'feedback',
          element: <Feedback title={'Feedback'} />,
        },
        {
          path: 'bugreport',
          element: <BugReport title={'Bug report'} />,
        },
        { path: 'payment', element: <Restricted title={'Payment'} /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        {
          path: '*',
          element: (
            <Navigate
              to="/404"
              replace
            />
          ),
        },
      ],
    },
    {
      path: '/onboarding',
      element: <OnboardingLayout mode="instructor" />,
      children: [
        { element: <MainOnboarding />, index: true },
        { path: 'mobileSignup', element: <MobileSignup /> },
        { path: 'verification', element: <Verification /> },
        { path: 'preview', element: <Preview /> },
        { path: 'info', element: <PersonalInfo /> },
        { path: 'profile-pic', element: <ProfilePic /> },
        { path: 'platform-info', element: <OnboardingInfo /> },
      ],
    },
    {
      path: '/onboarding/client',
      element: <OnboardingLayout mode={'client'} />,
      children: [
        { element: <MainOnboarding mode={'client'} />, index: true },
        {
          path: 'verification',
          element: <Verification mode={'client'} />,
        },
        // { path: "preview", element: <Preview mode={"client"}/> },
        { path: 'info', element: <PersonalInfo mode={'client'} /> },
        {
          path: 'platform-info',
          element: <OnboardingInfo mode={'client'} />,
        },
        {
          path: 'profile-pic',
          element: <ProfilePic mode={'client'} />,
        },
        {
          path: 'client-info',
          element: <ClientInfo mode={'client'} />,
        },

        {
          path: 'client-info2',
          element: <ClientInfo2 mode={'client'} />,
        },
        {
          path: 'health-info',
          element: <HealthInfo mode={'client'} />,
        },
        {
          path: 'health-info2',
          element: <HealthInfo2 mode={'client'} />,
        },
      ],
    },

    {
      path: '/instructor',
      element: <ProtectedLayout />,
      children: [
        { element: <InstructorPage />, index: true },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'editProfile', element: <EditProfilePage /> },
      ],
    },
    {
      path: '/instructor-account',

      children: [
        { element: <InstructorAccountPage />, index: true },
        { path: 'profile', element: <InstructorAccountPage2 /> },
      ],
    },
    {
      path: '/media',
      children: [
        { element: <AddtrainingLog mode={'newMedia'} />, path: 'add' },
        { element: <AddtrainingLog mode={'view'} />, path: 'view' },
      ],
    },

    {
      path: '/createProgram',
      element: <CreateProgramLayout />,
      children: [
        { element: <CreateProgramPage />, index: true },
        { path: 'workoutCalendar', element: <WorkoutCalendar /> },
        { path: 'workoutDay', element: <WorkoutDay /> },

        { path: 'createDietPlan', element: <DietPlan /> },
        { path: 'publishProgram', element: <PublishProgram /> },
        {
          path: 'addEmailRecievers',
          element: <AddEmailRecievers />,
        },
        {
          path: 'workoutDay/editExercise',
          element: <EditMediaPage mode={'newMedia'} />,
        },
        { path: 'workoutDay/viewExercise', element: <EditMediaPage /> },
        {
          path: 'programOverview',
          element: <ProgramOverviewPage />,
          index: true,
        },
      ],
    },
    {
      path: '/invite/accept-invite/:token',
      element: <AcceptInvite />,
    },
    {
      path: '/invite',
      element: <ProtectedLayout />,
      children: [
        {
          element: <SendInvite />,
          index: true,
        },
        {
          path: 'accept-invite/:token',
          element: <AcceptInvite />,
        },
      ],
    },
    {
      path: '/moreMenu',
      element: <ProtectedLayout />,
      children: [{ element: <MoreMenu />, index: true }],
    },
    {
      path: '/library',
      element: <LibraryLayout />,
      children: [
        { element: <HomeLibrary />, index: true },
        {path:"public",element:<PublicLibrary/>},
        {path:"workouts",element:<WorkoutsPage/>},
        {path:"uploads",element:<UploadsPage/>},

        {
          path: 'videoPlayer',
          element: <LibraryVideoPlayer />,
        },

        {
          path: 'addworkout',
          element: <AddWorkoutToLibrary />,
        },
        {
          path: 'editVideo',
          element: <EditLibraryVideo />,
        },
        {
          path: 'addmedia',
          element: <AddmediaToWorkoutLibrary />,
        },
      ],
    },

    {
      path: '/editProgram/:id',
      element: <EditProgramLayout />,
      children: [
        { element: <EditProgramPage />, index: true },
        { path: 'workoutCalendar', element: <EditProgramPage /> },
        { path: 'workoutDay', element: <WorkoutDay /> },

        { path: 'createDietPlan', element: <EditProgramPage /> },
        { path: 'publishProgram', element: <EditProgramPage /> },
        {
          path: 'addEmailRecievers',
          element: <AddEmailRecievers />,
        },
        {
          path: 'workoutDay/editExercise',
          element: <EditMediaPage mode={'newMedia'} />,
        },
        { path: 'workoutDay/viewExercise', element: <EditMediaPage /> },
        {
          path: 'programOverview',
          element: <ProgramOverviewPage />,
          index: true,
        },
      ],
    },
    {
      path: '/shared/workout/:id',
      element: <SharedWorkoutLayout />,
      children: [
        {
          element: <SharedWorkout />,
          index: true,
        },
        {
          path: 'viewExercise',
          element: <SharedWorkoutExerciseView />,
        },
      ],
    },
    {
      path: '/program/instructorSend/:id/:email/',
      element: <ProgramSendLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }, ,],
    },

    {
      path: '/program/instructorSend/:id/:email/:token',
      element: <ProgramSendLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }, ,],
    },
    {
      path: '/sendProgram/:id',
      element: <SendWorkoutLayout />,
      children: [
        { element: <SendProgramPage />, index: true },
        { path: 'workoutCalendar', element: <EditSendProgram /> },
        { path: 'workoutDay', element: <WorkoutDay /> },
        { path: 'createDietPlan', element: <EditSendDiet /> },
        {
          path: 'workoutDay/editExercise',
          element: <EditMediaPage mode={'newMedia'} />,
        },
        { path: 'workoutDay/viewExercise', element: <EditMediaPage /> },
      ],
    },

    {
      path: '/workoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutCalendar />, index: true }],
    },
    {
      path: '/workoutDay',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutDay />, index: true }],
    },
    {
      path: '/workoutDay/editExercise',
      element: <ProtectedLayout />,
      children: [{ element: <EditMediaPage />, index: true }],
    },
    {
      path: '/createDietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlan />, index: true }],
    },
    {
      path: '/publishProgram',
      element: <ProtectedLayout />,
      children: [{ element: <PublishProgram />, index: true }],
    },
    {
      path: '/addEmailRecievers',
      element: <ProtectedLayout />,
      children: [{ element: <AddEmailRecievers />, index: true }],
    },
    {
      path: '/programOverview/:id',
      element: <ProtectedLayout />,
      children: [{ element: <ProgramOverviewPage />, index: true }],
    },
    {
      path: '/updateProgram',
      element: <ProtectedLayout />,
      children: [{ element: <UpdateProgram />, index: true }],
    },
    {
      path: '/notifications',
      element: <ProtectedLayout />,
      children: [{ element: <Notifications />, index: true }],
    },
    {
      path: '/iNotifications',
      element: <ProtectedLayout />,
      children: [{ element: <InstructorNotificationsPage />, index: true }],
    },
    {
      path: '/clientView',
      element: <ProtectedLayout />,
      children: [{ element: <ClientView />, index: true }],
    },
    {
      path: '/messages',
      element: <ProtectedLayout />,
      children: [{ element: <MessagesPage />, index: true }],
    },
    {
      path: '/messages/chatWindow/:id',
      element: <ProtectedLayout />,
      children: [{ element: <ChatWindowPage />, index: true }],
    },
    {
      path: '/clients',
      element: <ProtectedLayout />,
      children: [{ element: <ClientsPage />, index: true }],
    },
    {
      path: '/clientProfile/:id',
      element: <InstructorClient />,
      children: [
        { element: <ClientProfilePage />, index: true },
        { path: 'dietPlan', element: <DietEdit /> },
        { path: 'bodySystem', element: <ClientProfileBodySystem /> },
        { path: 'notes', element: <ClientProfileNotes /> },
        { path: 'supps', element: <ClientProfileSupps /> },
        { path: 'trainingLog', element: <TrainingLogs /> },
        { path: 'progressLog', element: <ProgressLogs /> },
        { path: 'workoutCalendar', element: <WorkoutCalendarClient /> },
        { path: 'workoutDay', element: <WorkoutDay /> },
        { path: 'createDietPlan', element: <DietPlan /> },
        {
          path: 'workoutDay/editExercise',
          element: (
            <EditMediaPage
              mode={'newMedia'}
              clientInstructorView
            />
          ),
        },
        {
          path: 'workoutDay/viewExercise',
          element: <EditMediaPage clientInstructorView />,
        },
        { path: 'photos', element: <ClientProfilePhotos /> },
        { path: 'clientPhoto', element: <ClientProfilePhotosSingle /> },
        { path: 'program', element: <ProfilePhotoProgram /> },
        { path: 'program/planDetail', element: <PlanDetail /> },
        { path: 'program/notes', element: <ClientProfileNotes /> },
        {
          path: 'program/bodySystem',
          element: <ClientProfileBodySystem />,
        },
      ],
    },

    {
      path: '/clientProfile/workoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutCalendar />, index: true }],
    },
    {
      path: '/clientProfile/dietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlanPage />, index: true }],
    },
    {
      path: '/clientProfile/photos',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfilePhotos />, index: true }],
    },
    {
      path: '/clientProfile/program',
      element: <ProtectedLayout />,
      children: [{ element: <ProfilePhotoProgram />, index: true }],
    },
    {
      path: '/clientProfile/program/planDetail',
      element: <ProtectedLayout />,
      children: [{ element: <PlanDetail />, index: true }],
    },
    {
      path: '/clientProfile/notes',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfileNotes />, index: true }],
    },
    {
      path: '/clientProfile/bodySystem',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfileBodySystem />, index: true }],
    },
    {
      path: '/sendProgram',
      element: <ProtectedLayout />,
      children: [{ element: <SendProgramPage />, index: true }],
    },
    {
      path: '/sendProgram/editWorkouts',
      element: <ProtectedLayout />,
      children: [{ element: <SendProgramEditWorkouts />, index: true }],
    },
    {
      path: '/profile',
      element: <ProtectedLayout />,
      children: [{ element: <ProfilePage />, index: true }],
    },
    {
      path: '/editProfile',
      element: <ProtectedLayout />,
      children: [{ element: <EditProfilePage />, index: true }],
    },
    {
      path: '/client',
      element: <ClientLayout />,
      children: [
        { element: <ClientPage />, index: true },
        {
          path: 'diet-plan',
          element: <DietPlanPage />,
        },
        {
          path: 'workout calneder',
          element: <DietPlanPage />,
        },
        {
          path: 'my-program',
          element: <CurrentProgramPage />,
        },
        {
          path: 'my-instructor',
          element: <MyInstructorPage />,
        },
      ],
    },
    {
      path: '/dietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlanPage />, index: true }],
    },
    {
      path: '/accountSettings',
      element: <ProtectedLayout />,
      children: [{ element: <AccountSettingPage />, index: true }],
    },
    {
      path: '/resetPassword',
      element: <ProtectedLayout />,
      children: [{ element: <ResetPassword />, index: true }],
    },

    {
      path: '/drafts',
      element: <ProtectedLayout />,
      children: [{ element: <DraftsPage />, index: true }],
    },
    {
      path: '/archives',
      element: <ProtectedLayout />,
      children: [{ element: <ArchivedPage />, index: true }],
    },
    {
      path: '/myInstructor',
      element: <ProtectedLayout />,
      children: [{ element: <MyInstructorPage />, index: true }],
    },
    {
      path: '/currentProgram',
      element: <ProtectedLayout />,
      children: [{ element: <CurrentProgramPage />, index: true }],
    },
    {
      path: '/myProfile',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePage />, index: true }],
    },
    {
      path: '/myProfile/bodySystem',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfileBodySystem />, index: true }],
    },
    {
      path: '/myProfile/photos',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotos />, index: true }],
    },
    {
      path: '/myProfile/photos/uploadNew',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotosNew />, index: true }],
    },
    {
      path: '/myProfile/photos/photoId',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotoOne />, index: true }],
    },
    {
      path: '/myWorkoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <ClientWorkoutCalendar />, index: true }],
    },
    {
      path: '/completePayment',
      element: <ProtectedLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }],
    },
    {
      path: '/myWorkoutCalendar/workoutDay',
      element: <ProtectedLayout />,
      children: [{ element: <MyWorkoutDayPage />, index: true }],
    },
    {
      path: '/myWorkoutCalendar/workoutDay/exercise',
      element: <ProtectedLayout />,
      children: [{ element: <MyExercisePage />, index: true }],
    },
    {
      path: '/forgotPassword',
      element: <OnboardingLayout />,
      children: [{ element: <ForgotPasswordPage />, index: true }],
    },
    {
      path: '/viewMedia',
      element: <ProtectedLayout />,
      children: [{ element: <ViewMedia />, index: true }],
    },
    {
      path: '/editMedia',
      element: <ProtectedLayout />,
      children: [{ element: <EditMediaPage />, index: true }],
    },
    {
      path: '/public',
      // element: <ProtectedLayout />,
      children: [
        {
          path: 'workout-program/:id',
          element: <PublicProgramView />,
          index: true,
        },
        {
          path: 'instructor-profile/:id',
          element: <InstructorProfile />,
          index: true,
        },
        {
          path: 'trainer-programs/:id',
          element: <TrainerPrograms />,
        },
      ],
    },

    {
      path: '/',
      element: <OnboardingLayout mode={'instructor'} />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'signupoptions', element: <SignupOptions /> },
        { path: 'mobileSignup', element: <MobileSignup /> },
        {
          path: 'sign-up-options',
          element: <SignInOptions mode="instructor" />,
        },
        { path: 'login', element: <Login /> },
        { path: 'contact-us', element: <Contact /> },
      ],
    },

    {
      path: '*',
      element: (
        <Navigate
          to="/404"
          replace
        />
      ),
    },
  ];

  const clientRoutes = [
    // Main Routes
    {
      path: '*',

      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },

        {
          path: 'invite-trainer',
          element: <Restricted title={'Invite a friend'} />,
        },
        {
          path: 'help',
          element: <HelpPage title={'Help and support'} />,
        },
        {
          path: 'feedback',
          element: <Feedback />,
        },
        {
          path: 'bugreport',
          element: <BugReport title={'Bug report'} />,
        },
        {},
        {
          path: 'payment',
          element: <AddPaymentMethod title={'Payment And Billing'} />,
        },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        {
          path: '*',
          element: (
            <Navigate
              to="/404"
              replace
            />
          ),
        },
      ],
    },
    {
      path:"/myprograms",
      element: <ProtectedLayout />,
      children: [{ element: <MyPrograms />, index: true }],
    },
    {
      path: '/moreMenu',
      element: <ProtectedLayout />,
      children: [{ element: <ClientMoreMenu />, index: true }],
    },
    {
      path: '/invite',
      children: [
        {
          path: 'accept-invite/:token',
          element: <AcceptInvite />,
        },
      ],
    },
    {
      path: '/shared/workout/:id',
      element: <SharedWorkoutLayout />,
      children: [
        {
          element: <SharedWorkout />,
          index: true,
        },
        {
          path: 'viewExercise',
          element: <SharedWorkoutExerciseView />,
        },
      ],
    },
    {
      path: '/onboarding',
      element: <OnboardingLayout mode={'instructor'} />,
      children: [
        { element: <MainOnboarding />, index: true },
        { path: 'verification', element: <Verification /> },
        { path: 'preview', element: <Preview /> },
        { path: 'info', element: <PersonalInfo /> },
        { path: 'profile-pic', element: <ProfilePic /> },
        { path: 'platform-info', element: <OnboardingInfo /> },
      ],
    },
    {
      path: '/onboarding/client',
      element: <OnboardingLayout mode={'client'} />,
      children: [
        { element: <MainOnboarding mode={'client'} />, index: true },
        {
          path: 'verification',
          element: <Verification mode={'client'} />,
        },
        // { path: "preview", element: <Preview mode={"client"}/> },
        { path: 'info', element: <PersonalInfo mode={'client'} /> },
        {
          path: 'platform-info',
          element: <OnboardingInfo mode={'client'} />,
        },
        {
          path: 'profile-pic',
          element: <ProfilePic mode={'client'} />,
        },
        {
          path: 'client-info',
          element: <ClientInfo mode={'client'} />,
        },
        {
          path: 'client-info2',
          element: <ClientInfo2 mode={'client'} />,
        },
        {
          path: 'health-info',
          element: <HealthInfo mode={'client'} />,
        },
        {
          path: 'health-info2',
          element: <HealthInfo2 mode={'client'} />,
        },
      ],
    },

    {
      path: '/program/instructorSend/:id/:email',
      element: <ProgramSendLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }, ,],
    },

    {
      path: '/program/instructorSend/:id/:email/:token',
      element: <ProgramSendLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }, ,],
    },
    {
      path: '/workoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutCalendar />, index: true }],
    },
    {
      path: '/workoutDay',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutDay />, index: true }],
    },
    {
      path: '/workoutDay/editExercise',
      element: <ProtectedLayout />,
      children: [{ element: <EditMediaPage />, index: true }],
    },
    {
      path: '/createDietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlan />, index: true }],
    },

    {
      path: '/programOverview/:id',
      element: <ProtectedLayout />,
      children: [{ element: <ProgramOverviewPage />, index: true }],
    },

    {
      path: '/notifications',
      element: <ProtectedLayout />,
      children: [{ element: <Notifications />, index: true }],
    },
    {
      path: '/iNotifications',
      element: <ProtectedLayout />,
      children: [{ element: <InstructorNotificationsPage />, index: true }],
    },
    {
      path: '/clientView',
      element: <ProtectedLayout />,
      children: [{ element: <ClientView />, index: true }],
    },
    {
      path: '/messages',
      element: <ProtectedLayout />,
      children: [{ element: <MessagesPage />, index: true }],
    },
    {
      path: '/messages/chatWindow',
      element: <ProtectedLayout />,
      children: [{ element: <ChatWindowPage />, index: true }],
    },
    {
      path: '/clients',
      element: <ProtectedLayout />,
      children: [{ element: <ClientsPage />, index: true }],
    },
    {
      path: '/clientProfile/:id',
      element: <InstructorClient />,
      children: [
        { element: <ClientProfilePage />, index: true },
        { path: 'dietPlan', element: <DietPlanPage /> },
        { path: 'bodySystem', element: <ClientProfileBodySystem /> },
        { path: 'photos', element: <ClientProfilePhotos /> },
        { path: 'supps', element: <ClientProfileSupps /> },
        { path: 'program', element: <ProfilePhotoProgram /> },
        { path: 'program/planDetail', element: <PlanDetail /> },
        { path: 'program/notes', element: <ClientProfileNotes /> },
        {
          path: 'program/bodySystem',
          element: <ClientProfileBodySystem />,
        },
      ],
    },

    {
      path: '/clientProfile/workoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <WorkoutCalendar />, index: true }],
    },
    {
      path: '/clientProfile/dietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlanPage />, index: true }],
    },
    {
      path: '/clientProfile/photos',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfilePhotos />, index: true }],
    },
    {
      path: '/clientProfile/program',
      element: <ProtectedLayout />,
      children: [{ element: <ProfilePhotoProgram />, index: true }],
    },
    {
      path: '/clientProfile/program/planDetail',
      element: <ProtectedLayout />,
      children: [{ element: <PlanDetail />, index: true }],
    },
    {
      path: '/clientProfile/notes',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfileNotes />, index: true }],
    },
    {
      path: '/clientProfile/bodySystem',
      element: <ProtectedLayout />,
      children: [{ element: <ClientProfileBodySystem />, index: true }],
    },
    {
      path: '/sendProgram',
      element: <ProtectedLayout />,
      children: [{ element: <SendProgramPage />, index: true }],
    },
    {
      path: '/sendProgram/editWorkouts',
      element: <ProtectedLayout />,
      children: [{ element: <SendProgramEditWorkouts />, index: true }],
    },
    {
      path: '/profile',
      element: <ProtectedLayout />,
      children: [{ element: <ProfilePage />, index: true }],
    },
    {
      path: '/editProfile',
      element: <ProtectedLayout />,
      children: [
        {
          element: <EditProfileClientPage mode={'client'} />,
          index: true,
        },
      ],
    },
    {
      path: '/media',
      children: [
        { element: <AddtrainingLog mode={'newMedia'} />, path: 'add' },
        { element: <AddtrainingLog mode={'view'} />, path: 'view' },
      ],
    },
    {
      path: '/client',
      element: <ClientLayout />,
      children: [
        { element: <ClientPage />, index: true },
        {
          path: 'diet-plan',
          element: <DietPlanPage />,
        },
        {
          path: 'workout calneder',
          element: <DietPlanPage />,
        },
        {
          path: 'trainingLog',
          element: <TrainingLogs />,
        },
        {
          path: 'addtraininglog',
          element: <AddtrainingLog mode={'newMedia'} />,
        },
        {
          path: 'my-program',
          element: <CurrentProgramPage />,
        },
        {
          path: 'my-instructor',
          element: <MyInstructorPage />,
        },
        {
          path: 'myWorkoutCalendar',
          element: <ClientWorkoutCalendar />,
        },
        {
          path: 'myWorkoutCalendar/workoutDay',
          element: <MyWorkoutDayPage />,
        },
        {
          path: 'myWorkoutCalendar/workoutDay/exercise',
          element: <MyExercisePage />,
        },
        {
          path: 'myWorkoutCalendar/workoutDay/exerciseView',
          element: <MyExerciseView />,
        },
      ],
    },
    {
      path: '/dietPlan',
      element: <ProtectedLayout />,
      children: [{ element: <DietPlanPage />, index: true }],
    },
    {
      path: '/accountSettings',
      element: <ProtectedLayout />,
      children: [{ element: <AccountSettingPage />, index: true }],
    },
    {
      path: '/resetPassword',
      element: <ProtectedLayout />,
      children: [{ element: <ResetPassword />, index: true }],
    },
    {
      path: '/drafts',
      element: <ProtectedLayout />,
      children: [{ element: <DraftsPage />, index: true }],
    },
    {
      path: '/archives',
      element: <ProtectedLayout />,
      children: [{ element: <ArchivedPage />, index: true }],
    },
    {
      path: '/myInstructor',
      element: <ProtectedLayout />,
      children: [{ element: <MyInstructorPage />, index: true }],
    },
    {
      path: '/currentProgram',
      element: <ProtectedLayout />,
      children: [{ element: <CurrentProgramPage />, index: true }],
    },
    {
      path: '/myProfile',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePage />, index: true }],
    },
    {
      path: '/myProfile/bodySystem',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfileBodySystem />, index: true }],
    },
    {
      path: '/myProfile/supps',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfileSupps />, index: true }],
    },
    {
      path: '/myProfile/photos',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotos />, index: true }],
    },
    {
      path: '/myProfile/photos/uploadNew',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotosNew />, index: true }],
    },
    {
      path: '/myProfile/photos/photoId',
      element: <ProtectedLayout />,
      children: [{ element: <MyProfilePhotoOne />, index: true }],
    },
    {
      path: '/myWorkoutCalendar',
      element: <ProtectedLayout />,
      children: [{ element: <ClientWorkoutCalendar />, index: true }],
    },
    {
      path: '/completePayment',
      element: <ProtectedLayout />,
      children: [{ element: <ClientCompletePaymentPage />, index: true }],
    },
    {
      path: '/myWorkoutCalendar/workoutDay',
      element: <ProtectedLayout />,
      children: [{ element: <MyWorkoutDayPage />, index: true }],
    },
    {
      path: '/myWorkoutCalendar/workoutDay/exercise',
      element: <ProtectedLayout />,
      children: [{ element: <MyExercisePage />, index: true }],
    },
    {
      path: '/forgotPassword',
      element: <OnboardingLayout />,
      children: [{ element: <ForgotPasswordPage />, index: true }],
    },
    {
      path: '/viewMedia',
      element: <ProtectedLayout />,
      children: [{ element: <ViewMedia />, index: true }],
    },
    {
      path: '/editMedia',
      element: <ProtectedLayout />,
      children: [{ element: <EditMediaPage />, index: true }],
    },

    {
      path: '/public',
      element: <ProtectedLayout />,
      children: [
        {
          path: 'workout-program/:id',
          element: <PublicProgramView />,
          index: true,
        },
        {
          path: 'instructor-profile/:id',
          element: <InstructorProfile />,
          index: true,
        },
        {
          path: 'trainer-programs/:id',
          element: <TrainerPrograms />,
        },
      ],
    },
    {
      path: '/',
      element: <OnboardingLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'signupoptions', element: <SignupOptions /> },
        { path: 'login', element: <Login /> },
        { path: 'contact-us', element: <Contact /> },
      ],
    },
    {
      path: '*',
      element: (
        <Navigate
          to="/404"
          replace
        />
      ),
    },
  ];

  return useRoutes(Profile.type == 'Athlete' ? clientRoutes : instructorRoutes);
}

// IMPORT COMPONENTS

//Onboarding

const MainOnboarding = Loadable(lazy(() => import('../pages/onboarding/index')));
const PersonalInfo = Loadable(lazy(() => import('../pages/onboarding/personalinfo')));
const ProfilePic = Loadable(lazy(() => import('../pages/onboarding/profilepic')));
const Verification = Loadable(lazy(() => import('../pages/onboarding/verification')));
const Preview = Loadable(lazy(() => import('../pages/onboarding/preview')));

// Authentication
const Login = Loadable(lazy(() => import('../pages/Login')));

const HomePage = Loadable(lazy(() => import('../pages/main')));
const SignupOptions = Loadable(lazy(() => import('../pages/SignupOptions')));

const Contact = Loadable(lazy(() => import('../pages/Contact')));

const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const MobileSignup = Loadable(lazy(() => import('../pages/onboarding/mobile')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Components
