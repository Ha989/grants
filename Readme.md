# Grants
Grants is a platform to help startup to build their community grant.

## Authentication

- A User can sign in with email and password
- A User can register for a new account with email, password and roles
- A User can verify their email through their email confirmation
- A User can stay signed in after refeshing the page


## Users

- A User can update their profile Avatar, Password, Bio
- A User can see the project which they bookmarked
- A User can see the project which they donated

## Creators

- A Creator can create new project
- A Creator can update their project detail information (Description, Team member, Upload Logo, Banner, pitch video,..)
- A Creator can confirm the amount of money user donated received
- A Creator can see the amount and users who donated to their project
- A Creator can see the list of donations
- A Creator can edit/delete their projects
- A Creator can update their profile Avatar, Password, Bio
- A Creator can see their revenue raised and revenue chart by total in montly and by each projects

## Projects

- A User can see a list of the project
- A User can see a specific detail of a project given a projectID
- A User can donate fund to the porject they like


## Comments

- A User can see a list of comments on a project
- A User can write a comment on a project
- A User can update their comment
- A User can delete their comment

## Bookmark
- A User can add bookmark project which they like
- A User can remove a bookmark project

## Notifications

- A User/Creator can see their history of notifications
- A User/Creator can see alert the new notifications 

# API Endpoints

## Auth APIs


```
@route POST auth/login
@description Login with email and password
@body { email, password }
@access public
```

```
@route POST auth/register
@description Register new user
@body { email, password, user role }
@access public
```

```
@route POST auth/verifyemail
@description Verify with verificationCode in Email
@body { email, verificationCode }
@access private
```


## Users APIs

```
@route PUT /users/settings/:userId
@description Update user profile
@body { name, avatar, password }
@access Login required
```

```
@route GET /users/me
@description get user informations
@body 
@access Login required
```

```
@route GET /users/bookmarks
@description Get bookmark project
@body 
@access Login required
```

```
@route GET /users/donations
@description Get donated project
@body 
@access Login required
```

## Creator APIs


```
@route POST /creators/:creatorId/create
@description create a new project
@body { name, description, logo, banner, website, team, video, bankDetail }
@access Login required
```

```
@route PUT /creators/projects/:projectId
@description edit detail of the project
@body { description, social link, team, roadmap, }
@access Login required
```

```
@route DELETE /creators/projects/:projectId
@description delete single project
@body 
@access Login required
```

```
@route PUT /creators/donations/:donationId
@description confirm money received from user
@body { status: "isConfirm": true/false }
@access Login required
```

```
@route GET /creators/donations
@description get a list of donations
@body 
@access Login required
```

```
@route GET /creators/projects
@description get a list of projects
@body 
@access Login required
```

```
@route GET /creators/me
@description get creator information
@body 
@access Login required
```


### Project APIs

```
@route GET /projects
@description get a list of projects
@body 
@access public
```

```
@route GET /projects/:projectId
@description get detail of single project
@body 
@access public
```

```
@route POST /projects/:projectId/donation/:userId
@description donate project which user like
@body { amount, projectId, userId }
@access Login required
```


## Comments APIs

```
@route POST /comments
@description create/reply a new comment
@body { content, image, projectId, userId }
@access Login required
```

```
@route PUT /comments/:commentId
@description edit a comment
@body 
@access Login required
```

```
@route DELETE /comments/:commentId
@description delete a comment
@body 
@access Login required
```
## Bookmarked

```
@route POST /:projectId/bookmark/:userId
@description bookmark/remove bookmark project which user like
@body { projectId, userId }
@access Login required
```

## Notifications


```
@route GET /:userId
@description get all the notification with current user
@body
@access Login required
```

```
@route PUT /:notificationId 
@description update notification as read
@body
@access Login required
```

```
@route GET /new
@description update notification as read
@body
@access Login required
```



## Summary

- Start with functional specification 
- List down user stories
- Design endpoint APIs
- Entinity Relationship Diagram
- Backend target 2 weeks
- Frontend target 3 weeks
