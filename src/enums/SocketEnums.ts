export enum SocketEvents {
   USER_CONNECTED = 'userConnected',
   USER_DISCONNECTED = 'userDisconnected',
   MESSAGE_IS_CREATED = 'messageIsCreated',
   CHAT_IS_CREATED = 'chatIsCreated',
   MESSAGE_IS_READ = 'messageIsRead',
   MESSAGE_IS_DELETED = 'messageIsDeleted',
   CHAT_IS_DELETED = 'chatIsDeleted',
   TYPING_STARTED = 'typingStarted',
   TYPING_FINISHED = 'typingFinished',
   USER_IS_INVITED = 'userIsInvited',
   SUGGESTATION_IS_CANCELED = 'suggestationIsCanceled',
   INVITATION_IS_REJECTED = 'invitationIsRejected',
   INVITATION_IS_ACCEPTED = 'invitationIsAccepted',
   FRIEND_IS_DELETED = 'friendIsDeleted'
}

export enum SocketEmmits {
    ENTER_USER = 'enterUser',
    CONNECT_CHATS = 'connectChats',
    CANCEL_SUGGESTATION = 'cancelSuggestation',
    DELETE_FRIEND = 'deleteFriend',
    REJECT_INVITATION = 'rejectInvitation',
    ACCEPT_INVITATION = 'acceptInvitation',
    QUIT_USER = 'quitUser',
    NEW_INVITATION = 'newInvitation',
    CREATE_NEW_CHAT = 'createNewChat',
    READ_MESSAGE = 'readMessage',
    DELETE_MESSAGE = 'deleteMessage',
    DELETE_CHAT = 'deleteChat',
    SEND_MESSAGE = 'sendMessage',
    START_TYPING = 'startTyping',
    END_TYPING = 'endTyping',
}



