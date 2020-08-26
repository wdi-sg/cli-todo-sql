create a cli app to store list of items to be done
user will indicate input function and provide parameters 


CLI 

[] show 
	[] retrieve all the list items from db
	[] log the data in a format string
	[] indicate its completion by marking x in the square brackets

[] add
	[] insert a new item into the db

[] done
	[] mark as complete
	[] display the updated list

[] stats complete-time
	[] log the average completion time of all the items

[] stats add-time
	[] log the average amt of items added per day

[] stats best-worst
	[] log two items
		- item completed the fastest
		- item completed the slowest

[] between date date
	[] log the items added between these dates

[] between complete date date
	[] log the items completed between these dates

[] stats between date date complete-time asc
	[] log all the items between two dates and sort it by the time to complete in asc or desc order

DATABASE

[] structure the item
|id|completed|activity|created_at|updated_at|
serial boolean string timestamp timestamp


TESTING

[] have a script to build dummy data