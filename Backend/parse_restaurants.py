import requests
import streamlit as st

zipcode = 10014
url = f"https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/{zipcode}/0"

headers = {
	"X-RapidAPI-Key": "080f4ef5cfmsh1bc3dcd3a9de26ap1dd994jsnebba317159df",
	"X-RapidAPI-Host": "restaurants-near-me-usa.p.rapidapi.com"
}

response = requests.get(url, headers=headers)
json_response = response.json()

open_restaurants = list()

for restaurant in json_response["restaurants"]:
    cuisines = restaurant["cuisineType"].split(",")
    open_restaurants.append({
        "name":restaurant["restaurantName"],
        "address":restaurant["address"],
        "phone":restaurant["phone"],
        "state":restaurant["stateName"],
        "city":restaurant["cityName"],
        "cuisines":cuisines
    })

print(open_restaurants)