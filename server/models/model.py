from flask import Flask
from flask_pymongo import PyMongo
from datetime import datetime
from config.database import mongo
from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGODB_URL"))
db = client["test"]
users = db["users"]
bailout = db["bailouts"]
license = db["license"]

class Bailout:
    def __init__(self, application_no, jurisdiction, case_details, application, application_text, status="pending", 
                 lawyer=None, judge_license=None, bail_summary=None, previous_case=None, ipc_section=None, criminal_case=None):
        self.application_no = application_no
        self.jurisdiction = jurisdiction
        self.case_details = case_details
        self.application = application
        self.application_text = application_text
        self.status = status
        self.lawyer = lawyer
        self.judge_license = judge_license
        self.bail_summary = bail_summary
        self.previous_case = previous_case
        self.ipc_section = ipc_section
        self.criminal_case = criminal_case
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        bailout_data = self.__dict__
        bailout.insert_one(bailout_data)

    @staticmethod
    def find_by_application_no(application_no):
        return bailout.find_one({"applicationNo": application_no})
    
    @staticmethod
    def find_by_license_no(license_no):
        return bailout.find({"lawyer": license_no})

    def find_by_judge_license_no(license_no):
        return bailout.find({"judgeLicense": license_no})

    def __repr__(self):
        return f"<Bailout {self.application_no} - {self.status}>"



class License:
    def __init__(self, license_no):
        self.license_no = license_no

    def save(self):
        license_data = self.__dict__
        license.insert_one(license_data)

    @staticmethod
    def find_by_license_no(license_no):
        print("-----------",license_no)
        return license.find({"lawyer": license_no})

    def __repr__(self):
        return f"<License {self.license_no}>"

class User:
    def __init__(self, name, license, password, location, gender, email, account_type="Lawyer", token=None):
        self.name = name
        self.license = license
        self.password = password
        self.location = location
        self.gender = gender
        self.email = email
        self.account_type = account_type
        self.token = token
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        user_data = self.__dict__
        users.insert_one(user_data)

    @staticmethod
    def find_one(license=None, **kwargs):
        # print(db, mongo)
        if license is not None:
            return users.find_one({"license": license})
        return users.find_one(kwargs) if kwargs else None

    def __repr__(self):
        return f"<User {self.name} - {self.account_type}>"
