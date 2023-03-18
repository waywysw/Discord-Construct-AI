import os, json
import requests, pytz
from discord import app_commands
from discord.ext import commands
from datetime import datetime

class Relationship(commands.Cog, name="relationship"):
    def __init__(self, bot):
        self.bot = bot
        self.endpoint = bot.endpoint
        self.chatlog_dir = bot.chatlog_dir
        self.char_name = bot.char_name
        self.relationship_path = 'CharacterInfo/relationship/words.json'
        with open(self.relationship_path, 'r') as f:
            data = json.load(f)
            self.negative_words = data['negative_words']
            self.positive_words = data['positive_words']
            self.consent_prompt = data['default_prompt']
        print("Relationship Cog Loaded.")
    
    @commands.command(name="consent_detection")
    async def consent_detection(self, message) -> None:
        user = message.author
        path = (f"{self.chatlog_dir}/{user.name} - chatlog.log")
        try:
            with open(f'UserConfig/{user.id}.json', 'r') as f:
                data = json.load(f)
                init_time = data['timestamp']
                time_since = await self.time_calc(init_time)
                if (data['char_name'] != self.char_name):
                    return False
                if (data['consent_setting'] == 'horny'):
                    with open(self.relationship_path, 'r') as f:
                        words = json.load(f)
                        self.consent_prompt = words['horny_prompt']
                elif (data['consent_setting'] == 'ace'):
                    with open(self.relationship_path, 'r') as f:
                        words = json.load(f)
                        self.consent_prompt = words['ace_prompt']
                with open(path, 'r') as f:
                    lines = f.readlines()[-4:]
                    conversation_history = ''.join(lines)
                if(data['pronouns'] == "He/Him"):
                    user_gender = 'male'
                elif(data['pronouns'] == "She/Her"):
                    user_gender = 'female'
                else:
                    user_gender = 'non-binary'
                prompt = {
                'prompt' : self.consent_prompt.replace("{user}", user.name).replace("{char_name}", self.char_name).replace("{char_gender}", data['char_gender'])
                .replace('{user_gender}', user_gender).replace('{relationship_level}', data['relationship_level'])
                .replace('{time_since_setup}', time_since) +'\n'+conversation_history+f"{self.char_name}:"
                }
                response_text = await self.consent_response(prompt)
                if not (response_text == None):
                    contains_negative_word = False
                    for word in self.negative_words:
                        if str(word).lower() in response_text.lower():
                            contains_negative_word = True       
                            break
                    if contains_negative_word:
                        await message.reply(response_text)
                        with open(path, "a", encoding="utf-8") as f:
                            print(f'{self.char_name}: {response_text}\n')
                            f.write(f'{self.char_name}: {response_text}\n')
                        return False
                    # If no negative words are found, check for positive words
                    if not contains_negative_word:
                        contains_positive_word = False
                        for word in self.positive_words:
                            if str(word).lower() in response_text.lower():
                                contains_positive_word = True
                                break
                        if contains_positive_word:
                            await message.reply(response_text)
                            with open(path, "a", encoding="utf-8") as f:
                                print(f'{self.char_name}: {response_text}\n')
                                f.write(f'{self.char_name}: {response_text}\n')
                            return True
                        else:
                            await message.reply(response_text)
                            with open(path, "a", encoding="utf-8") as f:
                                print(f'{self.char_name}: {response_text}\n')
                                f.write(f'{self.char_name}: {response_text}\n')
                            return False
                    else:
                        return False
        except Exception as e: 
            print(e)
            return False
    # Get Consent Response
    async def consent_response(self, prompt):
        response = requests.post(f"{self.endpoint}/api/v1/generate", json=prompt)
        # check if the request was successful
        if response.status_code == 200:
            # Get the results from the response
            results = response.json()["results"]
            text = results[0]["text"]
            response_text = self.parse_text_end(text)[0] if self.parse_text_end(text) else ""
            return response_text
        return
    
    def parse_text_end(self, text):
        return [line.strip() for line in str(text).split("\n")]
    # Time since calculation
    @commands.command(name="time_calc")
    async def time_calc(self, init_time):
        timestamp = datetime.fromisoformat(init_time).replace(tzinfo=pytz.utc)
        end_time = datetime.utcnow().replace(tzinfo=pytz.utc)
        time_difference = end_time - timestamp
        difference_seconds = time_difference.total_seconds()
        if difference_seconds < 60:
            return f"{int(difference_seconds)} seconds"
        elif difference_seconds < 3600:
            difference_minutes = round(difference_seconds / 60)
            return f"{difference_minutes} minutes"
        elif difference_seconds < 86400:
            difference_hours = round(difference_seconds / 3600)
            return f"{difference_hours} hours"
        elif difference_seconds < 2592000:
            difference_days = round(difference_seconds / 86400)
            return f"{difference_days} days"
        elif difference_seconds < 31536000:
            difference_months = round(difference_seconds / 2592000)
            return f"{difference_months} months"
        else:
            difference_years = round(difference_seconds / 31536000)
            return f"{difference_years} years"

async def setup(bot):
    # add chatbot cog to bot
    await bot.add_cog(Relationship(bot))
