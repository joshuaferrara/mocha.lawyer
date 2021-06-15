#!/usr/bin/env python3
# Script to automation creation of pull requests based when
# issues are created in the mocha.lawyer git repo.
import os
import json

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
    pass

if __name__ == "__main__":
    main()
