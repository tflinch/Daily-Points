SEI SEBPT220 Project 2: Daily Points

An online rewards program review digital products and earn points.

HOW IT WORKS

Registered users of Daily Points can log in everyday to claim their points once per day by reviewing digital products.

User Story:
Create an account,
Claim points Daily,
Redeem points for Prizes
View Seasonal Leaderboards
![Overview-1](assets/img/Overview-1.png)
![Controller Mock Ip](assets/img/Controller-Mock-Up.png)
![Views Mock Ip](assets/img/Views-Mock-Up.png)

https://excalidraw.com/#json=vmVDnChu3kJT34AJRSpbp,d2nAkflCj85Uhd7vuxLkKA

MODELS
User:

- name
- id
- email
- phone
- password
- points

Reviews:

- id
- customer_id
- product_id
- rating
- content
- date

Points:

- id
- date
- customer_id
- amount
- product_id

Season:

- id
- number

Products:

- id
- image
- description
- points
- season_id

![ERD Mock Ip](assets/img/ERD-Mock-Up.png)

Inspiration:

https://twicedaily.com/rewards/
https://www.inboxdollars.com/
