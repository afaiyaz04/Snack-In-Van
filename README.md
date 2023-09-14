## Table of contents

-   [Team Members](#team-members)
-   [General Info](#general-info)
-   [Technologies](#technologies)
-   [Code Implementation](#code-implementation)
-   [Adding Images](#adding-images)

## Team Members

| Name
| Ahbab
| Daniel
| Sam
| Thomas

## General info
This is project for Snack-In-Van, customer and vendor side will be accessed via a central authentication hub.


The React frontend for the web application is in the views folder 
All the other folders are for the backend server 


## Dummy log 
Customer:
bingbong@email.com
password2

## Database Credential info

In addition to a database a local redis server must be running when testing locally.
Install can be found here https://redis.io/download

IP whitelist has been set to all, so you should have no issues connecting

Username: test_user
Password: test_user
Connection String:
mongodb+srv://test_user:test_user@cluster0.ofef0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

## Postman Requests for Deliverable 2

Customer:

1. View menu of snacks (including pictures and prices)
   postman request: getMenu

    - returns a json file with all items back, tagline and description are not included as they are not mentioned by the
      deliverable 2 spec. Photos are stored as the tail of an Unsplash url string.

2. View details of a snack
   postman request: getItem

    - takes item_id as a url paramater
    - server sends a json file of a single item's details

3. Customer starts a new order by requesting a snack
   postman request: createOrder
    - takes a json body element that carries a customer_id, van_id, item_id and quantity.
    - creates a new Order document and starts an array of lineItemSchema, with only one element which is created from item and quantity
    - returns the newly created order for manual validation purposes during development

Vendor:

1. Setting van status (vendor sends location, marks van as ready-for-orders)
   postman request: postVanLocation
    - takes van_id as a url paramater, location and description as json body elements, which are strings
    - sets new location and description and changes van status to open
    - returns the updated van information for manual validation purposes during development
2. Show list of all outstanding orders
   postman request: currentOutstanding

    - returns a json file with all orders currently at status outstanding

3. Mark an order as "fulfilled" (ready to be picked up by customer)
   postman request: setFulfilled
    - takes order_id as a url paramater
    - sets order status field to fulfilled
    - returns the updated order information for manual validation purposes during development


