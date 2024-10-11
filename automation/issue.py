#!/usr/bin/env python3
# Script to automation creation of pull requests based when
# issues are created in the mocha.lawyer git repo.
import json
import os
import re

import yaml
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="mocha_lawyer")


def main():
    # get path to github event file
    github_event_path = os.environ.get("GITHUB_EVENT_PATH")
    if github_event_path is None:
        raise Exception("Failed to get GITHUB_EVENT_PATH env var")

    # parse github event file
    github_data: dict = None
    with open(github_event_path, "r") as f:
        github_data = json.load(f)

    # handle trigger
    if github_data.get("issue") is not None:
        handle_issue(github_data)
    else:
        raise Exception("Failed to determine trigger type")


def handle_issue(github_event: dict):
    action = github_event.get("action")
    if action == "opened" or action == "edited":
        issue_data = github_event.get("issue")
        body = issue_data.get("body")

        def findValue(key: str) -> str:
            val_search = re.search(f"(?:{key}:)\s*(.+)", body)
            if val_search:
                return val_search.group(1).strip()
            return None

        # Translates "key" from GitHub issue to yml key
        translationMap = {
            "Coffee Shop": "name",
            "Drink Name": "item",
            "Drink Price": "price",
            "Coffee-to-Choco Ratio \[-0.5, 0.5\]": "coffee-to-choco",
            "Coffee Score \[0, 5\]": "coffee-score",
            "Chocolate Score \[0, 5\]": "chocolate-score",
            "Whip Cream \(None, Crumbly, or Smooth\)": "whip-cream",
            "Notes": "notes",
            "Address": "address",
        }

        # Convert issue -> yaml
        dict_out = {}
        for key, translation in translationMap.items():
            value = findValue(key)
            dict_out[translation] = value

        # Perform geolocation
        g = geolocator.geocode(dict_out["address"])
        lat = g.latitude
        lng = g.longitude
        dict_out["latitude"] = lat
        dict_out["longitude"] = lng

        # Print out URL for automation to include in PR
        print(
            f"[View Lat/Lng in OpenStreetMaps](https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=19/{lat}/{lng})"
        )

        # Add any extra fields
        dict_out["author"] = issue_data.get("user", {}).get("login")

        # Convert some things
        number_fields = ["coffee-to-choco", "coffee-score", "chocolate-score", "price"]
        for field in number_fields:
            dict_out[field] = float(dict_out[field])

        # Write yaml file
        yaml_out = yaml.dump(dict_out, default_flow_style=False, explicit_start=True)
        issue_number = issue_data.get("number")
        yaml_out_path = os.path.join(
            os.getcwd(), "site", "reviews", f"{issue_number}.yml"
        )
        if os.environ.get("DEBUG", None) == None:
            with open(yaml_out_path, "w") as f:
                f.write(yaml_out)
        else:
            # Print stuff out instead of writing to file in debug mode
            # for development
            print("--- Debug File Output ---")
            print(yaml_out_path)
            print(yaml_out)
    else:
        raise Exception(f"Action {action} unsupported")


if __name__ == "__main__":
    main()
