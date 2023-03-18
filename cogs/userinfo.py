import discord
import os
import json, asyncio, pytz
from discord import app_commands
from discord.ext import commands
from datetime import datetime

from cogs.devcommands import embedder

relationship_options = ["Friend", "Romantic Partner", "Best Friend"]
consent_options = ["Default", "Horny", "Ace"]
pronoun_options = ["He/Him", "She/Her", "They/Them"]
gender_options = ["Female", "Male", "Non-binary"]

class CharGenderMenu(discord.ui.Select):
    def __init__(self, data, user_path):
        options = [discord.SelectOption(label=option) for option in gender_options]
        self.data = data
        self.user_path = user_path
        super().__init__(placeholder="Select your character's gender", options=options)
    
    async def callback(self, interaction: discord.Interaction):
            await interaction.response.defer()
            # Save the user's pronouns
            char_gender = self.values[0]
            self.data['char_gender'] = char_gender.lower()
            with open(self.user_path, 'w') as f:
                json.dump(self.data, f)
            # Disable the select menu
            self.disabled = True
            # Update the message to reflect the disabled state
            await interaction.message.edit(view=self.view)

class CharGenderView(discord.ui.View):
    def __init__(self,data, user_path):
        super().__init__()
        self.add_item(CharGenderMenu(data, user_path))

class ConsentMenu(discord.ui.Select):
    def __init__(self, data, user_path):
        options = [discord.SelectOption(label=option) for option in consent_options]
        self.data = data
        self.user_path = user_path
        super().__init__(placeholder="Select the character's consent setting", options=options)
    
    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer()
        # Save the user's pronouns
        consent_setting = self.values[0]
        self.data['consent_setting'] = consent_setting.lower()
        with open(self.user_path, 'w') as f:
            json.dump(self.data, f)
        # Disable the select menu
        self.disabled = True
        # Update the message to reflect the disabled state
        await interaction.message.edit(view=self.view)
        view = CharGenderView(self.data, self.user_path)
        await interaction.followup.send("Please select the character's gender:", view=view)

class ConsentView(discord.ui.View):
    def __init__(self,data, user_path):
        super().__init__()
        self.add_item(ConsentMenu(data, user_path))

# Ask for relationship level
class RelationshipMenu(discord.ui.Select):
    def __init__(self, data, user_path):
        options = [discord.SelectOption(label=option) for option in relationship_options]
        self.data = data
        self.user_path = user_path
        super().__init__(placeholder="Select your relationship level with the character", options=options)
    
    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer()
        # Save the user's pronouns
        user_relationship = self.values[0]
        self.data['relationship_level'] = user_relationship.lower()
        with open(self.user_path, 'w') as f:
            json.dump(self.data, f)
        # Disable the select menu
        self.disabled = True
        # Update the message to reflect the disabled state
        await interaction.message.edit(view=self.view)
        view = ConsentView(self.data, self.user_path)
        await interaction.followup.send("Please select your character's consent setting:", view=view)

class RelationshipView(discord.ui.View):
    def __init__(self,data, user_path):
        super().__init__()
        self.add_item(RelationshipMenu(data, user_path))

# Ask for pronouns
class PronounMenu(discord.ui.Select):
    def __init__(self, data, user_path):
        self.data = data
        self.user_path = user_path
        options = [discord.SelectOption(label=option) for option in pronoun_options]
        super().__init__(placeholder="Select your pronouns", options=options)
    
    async def callback(self, interaction: discord.Interaction):
            await interaction.response.defer()
            # Save the user's pronouns
            user_pronouns = self.values[0]
            self.data['pronouns'] = user_pronouns
            with open(self.user_path, 'w') as f:
                json.dump(self.data, f)
            # Disable the select menu
            self.disabled = True
            # Update the message to reflect the disabled state
            await interaction.message.edit(view=self.view)
            relationship_view = RelationshipView(self.data, self.user_path)
            await interaction.followup.send("Please select your relationship level with the character:", view=relationship_view)

class PronounView(discord.ui.View):
    def __init__(self,data, user_path):
        super().__init__()
        self.add_item(PronounMenu(data, user_path))

class UserInfoCog(commands.Cog, name="user_info_cog"):
    def __init__(self, bot):
        self.bot = bot
        self.guilds = self.bot.guild_ids
        self.char_name = self.bot.char_name
        print("Userinfo Cog Loaded.")
    @commands.command(
        name="usersettings",
        description="Initialize a user setting for the AI Bot.",
    )
    async def usersettings(self, ctx):
        user_id = ctx.author.id
        current_time = datetime.utcnow().replace(tzinfo=pytz.utc).isoformat()
        user_path = f"UserConfig/{ctx.author.id}.json"
        user_data = {"name": ctx.author.name, "pronouns": "He/Him", "relationship_level": "friend", "user_id": user_id, "timestamp": current_time, "char_gender": "female", "char_name": self.char_name, "consent_setting": "default"}

        # Save the data to a JSON file
        try:
            with open(user_path, "r") as f:
                data = json.load(f)
        except FileNotFoundError:
            with open(user_path, "w") as f:
                json.dump(user_data, f)
            data = user_data
        await ctx.send("Please select your pronouns:", view=PronounView(data, user_path))

    def humanize_date(self, dt):
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(dt.day if dt.day < 20 else dt.day % 10, 'th')
        return dt.strftime(f'%B {dt.day}{suffix}, %Y. at %H:%M')

    @commands.command(name="get_userinfo")
    async def get_userinfo(self, message):
        current_time = self.humanize_date(datetime.now())
        userid = message.author.id
        user_path = f"UserConfig/{userid}.json"
        try:
            with open(user_path, "r") as f:
                data = json.load(f)
        except FileNotFoundError:
            
            return f"\n[The current date is {current_time}.\n]"
        if(data['pronouns'] == "He/Him"):
            user_gender = 'male'
        elif(data['pronouns'] == "She/Her"):
            user_gender = 'female'
        else:
            user_gender = 'non-binary'
        init_time = data['timestamp']
        time_since = await self.bot.get_cog("relationship").time_calc(init_time)
        relationship_string = f"\n[{self.char_name} is talking to {data['name']}. {data['name']} is {self.char_name}'s {user_gender} {data['relationship_level']}. {self.char_name} has known {data['name']} for {time_since}. The current time is {current_time}.\n]"
        return relationship_string
    @commands.command()
    async def bothelp(self, ctx):
        await ctx.send(embed=embedder(f"First time?\nHere are the basics of setting up the {self.char_name} discord interface:\n- Set yourself as either blacklisted from (blocked) or prioritized to (always) receiving random messages from {self.char_name} by running '/blacklist' or '/priority' respectively.\n- Configure your personal settings with the bot by using '/usersettings'. This will change how often the bot will comply with special image requests, set your relationship with the bot, and establish more about you."))
# Register Cog
async def setup(bot):
    await bot.add_cog(UserInfoCog(bot))
