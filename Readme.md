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

<<<<<<< HEAD
- An Creator can create new project
- An Creator can update their project detail information (Description, Team member, Social Link, Roadmap, Milestone archive)
- An Creator can confirm the amount of money user donated is recieved or not
- An Creator can see the amount and users who donated to their project
=======
- A Creator can create new project
- A Creator can update their project detail information (Description, Team member, Upload Logo, Banner, pitch video,..)
- A Creator can confirm the amount of money user donated received
- A Creator can see the amount and users who donated to their project
- A Creator can see the list of donations
- A Creator can edit/delete their projects
- A Creator can update their profile Avatar, Password, Bio
- A Creator can see their revenue raised and revenue chart by total in montly and by each projects
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058

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
<<<<<<< HEAD
/**
@route POST auth/register
@description Register with email and password
@body { email, password, role }
=======
@route POST auth/login
@description Login with email and password
@body { email, password }
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
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


```
<<<<<<< HEAD
/**
@route POST auth/login
@description Login with email and password
@body { email, password }
@access public
*/
```


## Users APIs

```
/**
=======
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
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
<<<<<<< HEAD
/**
@route GET /users/donation/:userId
=======
@route GET /users/donations
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@description Get donated project
@body 
@access Login required
```

## Creator APIs


```
<<<<<<< HEAD
/**
@route POST /creator/project
=======
@route POST /creators/:creatorId/create
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@description create a new project
@body { name, description, logo, banner, website, team, video, bankDetail }
@access Login required
```

```
<<<<<<< HEAD
/**
@route PUT /creator/project/:projectId
@description update detail of the project
=======
@route PUT /creators/projects/:projectId
@description edit detail of the project
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@body { description, social link, team, roadmap, }
@access Login required
```

```
<<<<<<< HEAD
/**
@route PUT /creator/donation/:donationId
=======
@route DELETE /creators/projects/:projectId
@description delete single project
@body 
@access Login required
```

```
@route PUT /creators/donations/:donationId
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@description confirm money received from user
@body { status: "isConfirm": true/false }
@access Login required
```

```
<<<<<<< HEAD
/**
@route GET /creator/donation
@description get a list of donation
=======
@route GET /creators/donations
@description get a list of donations
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@body 
@access Login required
```

```
<<<<<<< HEAD
/**
@route GET /creator/donations/pending
@description get a list of pending donation
=======
@route GET /creators/projects
@description get a list of projects
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
@body 
@access Login required
```

```
<<<<<<< HEAD
/**
@route GET /creator/donations/received
@description get a list of received donation
=======
@route GET /creators/me
@description get creator information
>>>>>>> 840e50176df7a77e663f5a91e0f7957af0177058
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
