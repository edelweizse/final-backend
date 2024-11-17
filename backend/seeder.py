import pymongo
from pymongo import MongoClient
from faker import Faker
import random

fake = Faker()

client = MongoClient('mongodb://localhost:27017')
db = client['final-project']

users_collection = db['users']
portfolios_collection = db['portfolios']

web_skills = [
    'Node.js', 'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SASS', 'Vue.js',
    'Angular', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL', 'Docker',
    'Kubernetes', 'Git', 'GitHub', 'AWS', 'Azure', 'Firebase', 'Next.js', 'Jest',
    'Mocha', 'Chai', 'Redux', 'Tailwind CSS', 'Webpack', 'Babel', 'Nginx', 'PHP', 'Ruby on Rails',
    'Django', 'Flask', 'Laravel', 'Swift', 'Kotlin', 'Flutter', 'Java', 'C#', 'Python'
]

def seed_users_and_portfolios(num_users=10):
    for _ in range(num_users):
        user_data = {
            "username": fake.user_name(),
            "password": "password123",
            "email": fake.email(),
            "firstName": fake.first_name(),
            "lastName": fake.last_name(),
            "age": random.randint(18, 65),
            "gender": random.choice(['male', 'female', 'other']),
            "role": "user",
            "isMFAEnabled": False,
            "MFASecret": None,
            "OTPUrl": None
        }
        
        user_result = users_collection.insert_one(user_data)
        user_id = user_result.inserted_id
        
        print(f"User {user_data['username']} created!")

        portfolio_data = {
            "title": fake.word().capitalize(),
            "description": fake.sentence(),
            "images": [
                "https://via.placeholder.com/600x400.png?text=Image+1", 
                "https://via.placeholder.com/600x400.png?text=Image+2",
                "https://via.placeholder.com/600x400.png?text=Image+3"
            ],
            "skills": random.sample(web_skills, random.randint(3, 7)),
            "links": {
                "github": fake.url(),
                "linkedin": fake.url()
            },
            "createdBy": user_id
        }
                portfolios_collection.insert_one(portfolio_data)
        print(f"Portfolio '{portfolio_data['title']}' created for user {user_data['username']}!")

def main():
    seed_users_and_portfolios(20)

if __name__ == '__main__':
    main()
