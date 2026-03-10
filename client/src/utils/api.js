const api = {
  protocol: `${import.meta.env.VITE_APP_API_PROTOCOL}://`,
  //baseUrl: 'circled.fit/api/',
  baseUrl: `${import.meta.env.VITE_APP_API_URL}/api/`,
  socketurl: `${import.meta.env.VITE_APP_API_URL}/`,

  userLogin: 'user/login',
  userSignup: 'user/signup',
  changePassword: 'user/change-password/',
  changePasswordOTP: 'user/change-password-phone',
  searchUser: 'user/search/', //:qry
  fetchUsers: 'user/all?',
  checkExist: 'user/exists/',
  checkUserExistence: 'user/check?',
  updateAuth: 'user/updateAuth',
  sendOtp: 'otp/send?phone=',
  retryOtp: 'otp/retry?phone=',
  verifyOtp: 'otp/verify?phone=',
  SendOTPUpdate: 'otp/SendOTPUpdate?phone=',
  resetPasswordOtp: 'otp/resetPassword?phone=',
  resetPass: 'user/change-password-mail',
  generatePasswordHash: 'misc/generate-hash?Password=',
  updateUser: 'user/update/',
  updateSensitiveData: 'user/updateSensitiveData',
  generateToken: 'misc/generate-token',

  UploadSingleFile: 'misc/upload-single',
  MultiPartUpload: 'misc/upload-multipart',
  UploadMultipleFile: 'misc/upload-multiple',
  DownloadFile: 'misc/download-file?key=',
  UploadString: 'misc/upload-string',
  getSignedUrl: 'misc/getSignedUrl',
  getMediaUploadSignedUrl: 'misc/getMediaUploadSignedUrl',
  GetSignature: 'misc/upload-image',
  SendVerifyMail: 'misc/send-verify-mail',
  resetUserPass: 'user/reset-password',
  ChangePasswordMail: 'misc/change-password-mail',
  ChangePasswordMail2: 'misc/change-password-mail2',
  verifyMail: 'misc/verify-mail',
  addFeedback: 'misc/addfeedback',
  reportBug: 'misc/reportBug',
  GetUnreadCount: 'notification/count',
  pushNotification: 'notification/new',
  fetchNotification: 'notification/all?',
  updateNotification: 'notification/update/',

  createQA: 'qa/new',
  addAnswer: 'qa/addanswer',
  fetchQA: 'qa/all?',

  //announcement
  addAnnouncement: 'announcement/new',
  updateAnnouncement: 'announcement/update',
  getAnnouncement: 'announcement/all?',
  deleteAnnouncement: 'announcement/delete',
  //program

  allPrograms: 'program/all?',
  duplicateProgram: 'program/duplicate/',
  getAllPrograms: 'program/get', //get
  getProgram: 'program/get/', //get :Id
  createProgram: 'program/create/', //post
  updateProgram: 'program/update', //patch
  deleteProgram: 'program/delete/', //delete :Id
  archiveProgram: 'program/archive/', //patch :Id
  unarchiveProgram: 'program/unarchive/', //patch :Id
  getProgramPublic: 'program/public/',
  sendProgram: 'program/send',

  //figgsLibrary

  createObject: 'library/create', //post
  deleteObject: 'library/delete', //post
  //getRecent: "library/getrecent",
  getObjects: 'library/get/', //parent
  updateObjects: 'library/update', //patch
  fetchVideoLibrary: 'library/getallvideos',
  fetchPublicLibrary: 'library/getpubliclib',
  updateLibraryVideo: 'library/updateVideo',
  addLibraryVideo: 'library/addVideo',
  addLibraryWorkout: 'library/addWorkout',
  deleteLibraryWorkout: 'library/deleteWorkout/',
  updateLibraryWorkout: 'library/updateworkout',
  getLibraryWorkouts: 'library/getWorkouts',
  getLibraryWorkout: 'library/getWorkout',
  saveVideoToLib: 'library/savevideotolib',

  getOrder: 'order/get/',
  allOrder: 'order/client',
  updateOrder: 'order/update', //get,
  updateTodo: 'order/updateTodo', //get,
  switchProgram: 'order/switchProgram',
  //getClients: 'order/getClients',
  allclients: 'order/allclients',
  getSpecificClient: 'order/getSpecificClient/',
  getStats: 'order/getStats/',
  updateStatus: 'order/updateStatus',
  getSentPrograms: 'sentprogram/get/',
  deleteSendProgram: 'sentprogram/delete/',
  addOrder: 'sentprogram/addProgram/',
  getSharedProgram: 'sentprogram/sharedProgramId/',
  getSpecificProgramClient: 'order/getSpecificProgramClient/',

  getChatUsers: 'chat/allLatest',
  getChats: 'chat/getChats?',
  createMessage: 'chat/add',
  updateChat: 'chat/update/',
  getChatCount: 'chat/getCount',

  //Payments
  createSubscription: 'payment/createSubscription',
  approveSubscription: 'payment/approveSubscription',
  createOrder: 'payment/createOrder',
  approveOrder: 'payment/approveOrder',
  addFreeOrder: 'payment/addFreeOrder',
  unsubscribe: 'payment/unsubscribe',
  checkIfOrderExists: 'payment/checkIfOrderExists',

  RequestProgram: 'chat/requestProgram',

  //Body Images
  getBodyImages: 'bodyImages/get',
  createBodyImages: 'bodyImages/create',
  updateBodyImages: 'bodyImages/update',
  deleteBodyImages: 'bodyImages/delete',

  //Recent
  getRecent: 'recent/all/',
  //Progress Logs
  addNewLog: 'progresslog/new',
  fetchLogs: 'progresslog/perticular/',
  getAllLogs: 'progresslog/all/',
  getUnreadLogCount: 'progresslog/getUnreadCount/',
  markLogAsRead: 'progresslog/markasread',
  deleteLogs: 'progresslog/',

  //----------------------------------------------------------------
  //invite clinet
  sendinvitation: 'inviteClient/invite',
  resendinvitation: 'inviteClient/resend',
  fetchInvitations: 'inviteClient/fetchInvitations',
  fetchInvitation: 'inviteClient/fetchInvitation/',
  acceptInvitation: 'inviteClient/accept',
  rejectInvitation: 'inviteClient/reject',
  deleteInvitation: 'inviteClient/delete',
  //----------------------------------------------------------------
  //clients
  getAllClients: 'clients/all',
  getStripeCustomer: 'payment/stripe-customer',
  addPymentMethod: 'payment/add-payment-method',
  removePaymentMethod: 'payment/remove-payment-method',
  setDefaultPaymentMethod: 'payment/set-default-payment-method',
};

export default api;
