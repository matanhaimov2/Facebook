register
	id
	firstname,
	lastname, 
	username, 
	birthday, 
	sex

profile table:
	id, - from register
	firstname, - from register
	lastname, - from register
	username, - from register
	birthday, - from register
	address,
	school,
	biograppy,
	relationshipstatus,
	friends,
	posts,     - related to another table called userposts  
	stories,   - relted to another table called userstories


userposts:
	id - from profile
	





