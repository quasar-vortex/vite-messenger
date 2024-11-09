## Vite Messenger

Real time socket chat application built with React, Redux Toolkit, Socket.IO, ExpressJS, and MySQL.

### Back End To Dos

#### Authentication

- [x] Register User - validate request body, hash password, save to the DB and create JWTs
- [x] Login User - verify login credentials, generate access and refresh JWTs
- [x] Refresh User - Verify refresh token and generate new access token
- [x] Log Off User - Clear the refresh token and log off
- Authentication has been configured on the front end for user register, sign in, refresh and sign out

#### Users

- [ ] Get User Profile - get profile by userId
- [ ] Get Signed In Profile - get profile of signed in user
- [ ] User profile update - update signed in user's bio, avatar, password
- [ ] Send Friend Request - send fromUserId and toUserId
- [ ] Respond to Friend Request - accept or reject request
- [ ] Get Friends List - Get signed in user's friends

#### Files

- [ ] File Upload - upload file to linode s3 object storage, create file in DB referencing s3 file
- [ ] Get File - get file by id
- [ ] Update File - update file by id (replace file content)
- [ ] Delete File - delete file by id, must be owner

#### Messaging

- [ ] Send Direct Message or Room Message - Send messages
- [ ] Get conversation history - Get message history with pagination
- [ ] Edit Message Function
- [ ] Delete Message Function

#### Room and Participants

- [ ] Create Room - Public or Private Rooms
- [ ] Participant Join - Join a room
- [ ] Room Participant List - Get users in room
- [ ] Room Message History - Get history of messages in a room
- [ ] Participant Leave - Leave a room
- [ ] Participant Invite - Send invite to join a room
- [ ] Invite Response - Accept or Reject an invite

##### API Design

- Authentication
  - [x] POST /auth/register
  - [x] POST /auth/login
  - [x] POST /auth/refresh
  - [x] POST /auth/logout
- Users
  - GET /users/:id
  - GET /users/me
  - PATCH /users/me - update if notifications enabled, visibility, password, bio
  - GET /users/me/friends
  - PUT /users/me/avatar - upload or update avatar
  - Delete /users/me/avatar
- Friends
  - POST /friends/request - Send a friend request - also send event
  - POST /friends/response - Send a response to a request - also send real time event
  - DELETE /friends/:friendUserId - Remove friend
- Files
  - POST /files/upload
  - GET /files/:id
  - Delete /files/:id
- Messaging
  - Send over socket
  - Edit message over socket
  - Delete message over socket
  - Get /friends/:userId/messages - get message history of friend
  - GET /rooms/:roomId/messages - get message history for a room
- Rooms
  - POST /rooms
  - Join over socket
  - GET /rooms/:id - get room details
  - GET /rooms/:id/participants - get room pariticpants
  - POST /rooms/:id/invite - send an invite to a user -send event
  - POST /invites/:id - Send a response to an invite - send event
- Status
  - typing indicator for start and stop in chats
