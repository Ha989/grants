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

## Admins

- An Admin can create new project
- An Admin can update their project detail information (Description, Team member, Social Link, Roadmap, Milestone archive)
- An Admin can confirm the amount of money user donated is recieved or not
- An Admin can see the amount and users who donated to their project

## Projects

- A User can see a list of the project
- A User can see a specific detail of a project given a projectID
- A User can donate fund to the porject they like


## Comments

- A User can see a list of comments on a project
- A User can write a comment on a project
- A User can update their comment
- A User can delete their comment

## Reactions

- A User can react like(bookmarked) to a project

# API Endpoints

## Auth APIs


```
/**
@route POST auth/login
@description Login with email and password
@body { email, password }
@access public
*/
```

```
/**
@route POST auth/verifyemail
@description Verify with verificationCode in Email
@body { email, verificationCode }
@access private
*/
```


## Users APIs

```
/**
@route POST /register
@description Register new user
@body { email, password, user role }
@access public
*/
```

```
/**
@route PUT /users/settings/:userId
@description Update user profile
@body { name, avatar, password }
@access Login required
*/
```
```
/**
@route GET /users/bookmarked/:userId
@description Get bookmark project
@body 
@access Login required
*/
```
```
/**
@route GET /users/donated/:userId
@description Get donated project
@body 
@access Login required
*/
```

## Admin APIs

```
/**
@route POST /admin/project
@description create a new project
@body { name, description, social link, website, team, roadmap, }
@access Login required
*/
```

```
/**
@route PUT /admin/project/:projectId
@description update detail of the project
@body { description, social link, team, roadmap, }
@access Login required
*/
```

```
/**
@route POST /admin/donation/:donationId
@description confirm money received from user
@body { status: pending or received }
@access Login required
*/
```

```
/**
@route GET /admin/donation
@description get a list of donation
@body 
@access Login required
*/
```

```
/**
@route GET /admin/donations/pending
@description get a list of pending donation
@body 
@access Login required
*/
```

```
/**
@route GET /admin/donations/received
@description get a list of received donation
@body 
@access Login required
*/
```

### Project APIs

```
/**
@route GET /projects
@description get a list of projects
@body 
@access public
*/
```

```
/**
@route GET /projects/:projectId
@description get detail of single project
@body 
@access public
*/
```

```
/**
@route POST /projects/:projectId/donation/:userId
@description donate project which user like
@body { amount, projectId, userId }
@access Login required
*/
```

## Reactions

## Comments APIs

```
/**
@route POST /comments
@description create a new comment
@body { content, projectId }
@access Login required
*/
```

```
/**
@route PUT /comments/:commentId
@description update a comment
@body 
@access Login required
*/
```

```
/**
@route GET /comments/:projectId
@description get detail of comments
@body 
@access Login required
*/
```
```
/**
@route DELETE /comments/:commentId
@description delete a comment
@body 
@access Login required
*/
```
## Bookmarked

```
/**
@route POST /bookmarked
@description bookmarked a project user like
@body { projectId }
@access Login required
*/
```


## Summary

- Start with functional specification 
- List down user stories
- Design endpoint APIs
- Entinity Relationship Diagram
- Backend target 2 weeks
- Frontend target 1 weeks
