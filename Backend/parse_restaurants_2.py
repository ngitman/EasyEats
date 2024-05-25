import requests
import streamlit as st
import pytz
from datetime import datetime
import os
import json

id = 60763
path_file = f"RestaurantData/{id}.json"
if os.path.isfile(path_file) and os.path.exists(path_file):
    exit

url = "https://restaurants222.p.rapidapi.com/search"

payload = {
	"location_id": id,
	"language": "en_US",
	"currency": "USD",
	"offset": "0"
}
headers = {
	"content-type": "application/x-www-form-urlencoded",
	"X-RapidAPI-Key": "080f4ef5cfmsh1bc3dcd3a9de26ap1dd994jsnebba317159df",
	"X-RapidAPI-Host": "restaurants222.p.rapidapi.com"
}

response = requests.post(url, data=payload, headers=headers)
json_response = response.json()

open_restaurants = list()
weekday = datetime.now().weekday()
for restaurant in json_response["results"]["data"]:
    """hours = restaurant["hours"]["week_ranges"]
    day = hours[weekday][0]
    if day is None: 
        continue
    else:
        open_time = int(day["open_time"])
        close_time = int(day["close_time"])
        curr_time = int(datetime.now(pytz.timezone('US/Eastern')).strftime("%H%M"))
        if curr_time < open_time or curr_time > close_time:
            continue"""
    open_restaurants.append({
        "name":restaurant["name"],
        "address":restaurant["address"],
        "price_level":[len(p) for p in restaurant["price_level"].split(" - ")],
        "cuisines":[c["name"] for c in restaurant["cuisine"]],
        "phone":restaurant["phone"],
        "rating":float(restaurant["rating"])
    })

print(open_restaurants)
with open(path_file, "w+") as f:
    json.dump({"data":open_restaurants}, f)