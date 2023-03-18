import io, random, json, os, discord, requests, re
from discord.ext import commands
from datetime import datetime

class ScanMessageCog(commands.Cog, name="scan_message"):
    def __init__(self, bot):
        self.bot = bot
        self.chatlog_dir = bot.chatlog_dir
        self.char_name = bot.char_name
        self.relationship_path = 'CharacterInfo/relationship/words.json'
        with open(self.relationship_path, 'r') as f:
            data = json.load(f)
            self.send_words = data['send_detection']
        
    async def replace_ids(self, content):
        user_ids = re.findall(r'<@(\d+)>', content)
        for user_id in user_ids:
            user = await self.bot.fetch_user(int(user_id))
            if user:
                display_name = user.display_name
                content = content.replace(f"<@{user_id}>", display_name)

        emojis = re.findall(r'<:[^:]+:(\d+)>|<a:[^:]+:(\d+)>', content)
        for emoji_id in emojis:
            if ':' in content:
                emoji_name = content.split(':')[1]
                content = content.replace(f"<:{emoji_name}:{emoji_id}>", f":{emoji_name}:")
        return content
    #World Info
    @commands.command(name="world_info")
    async def world_info(self, message=None) -> None:
        world_info = "["
        json_file = f"CharacterInfo/{str(self.char_name)}_world_info.json"
        if os.path.exists(json_file):
            with open(json_file) as f:
                try:
                    json_data = json.load(f)
                    if json_data is not None:
                        entries = json_data['entries']
                        for value in entries.values():
                            search_criteria = str(f"{message.author.name}: {message.content}").lower().strip()
                            if not (str(value['content']) in world_info):
                                for key in value['key']:
                                    clean = str(key).lower().replace("'","").replace(']','').replace('[','')
                                    if (clean.strip() in search_criteria):
                                        world_info += str(f"{value['content']}") + "\n]"
                        if world_info != "":
                            return world_info
                        else:
                            return 
                except Exception as e:
                    print(f"Error loading world info: {e}")
        else:
            print(f"World info not found for character {str(self.char_name)}.")
    #Gif Scan
    @commands.command(name="gif_scan")
    async def gif_scan(self, message, response_text) -> None:
        # Define a dictionary with keywords and their corresponding gifs
        json_file = f"CharacterInfo/{str(self.char_name)}_gifs.json"
        if (os.path.exists(json_file)):
            with open(json_file) as f:
                keywords = json.load(f)
            # Iterate through the keywords and check if any of them are in the response_text
            for keyword in keywords:
                if keyword in str(response_text).lower():
                    gif_url = keywords[keyword]
                    await message.channel.send(str(gif_url))
                    return 
            # If no keywords are found, return None
            return 
        else:
            return 
    #Send Scan
    @commands.command(name="send_scan")
    async def send_scan(self, message, message_content) -> None:   
        user = message.author
        path = (f"{self.chatlog_dir}/{user.name} - chatlog.log")
        channel = await user.create_dm()
        print(f"{user.name}: {await self.replace_ids(message_content)}")
        if any(word in message_content.lower() for word in self.send_words) and not ("meme" in message_content.lower()):
            with open(path, 'a') as f:
                f.write(f"{user.name}: {await self.replace_ids(message_content)}\n")
            directory = f"Images/{str(self.char_name)}/"
            image_extensions = ('.png', '.jpg', '.jpeg', '.mp4')
            image_files = []
            consent = await self.bot.get_cog("relationship").consent_detection(message)
            if (consent):
                for file in os.listdir(directory):
                    if file.endswith(image_extensions):
                        # Split the number from the filename and store as separate entry in list
                        name, ext = os.path.splitext(file)
                        parts = name.split('_')
                        if len(parts) == 2 and parts[1].isdigit():
                            image_files.append((parts[0], int(parts[1]), os.path.join(directory, file)))
                for filename, number, filepath in image_files:
                    names = filename.split('-')
                    for name in names:
                        if name.lower() in message_content.lower():
                            # Count the number of images with the same keyword
                            count = sum(1 for f, _, _ in image_files if f == filename)
                            # Generate a random number within the range
                            rand_num = random.randint(1, count)
                            # Select a different image file with the same word but a different number
                            for exten in image_extensions:
                                try:
                                    new_filename = f"{filename}_{rand_num}{exten}"
                                    new_filepath = os.path.join(directory, new_filename)
                                    with open(new_filepath, 'rb') as f:
                                        file = discord.File(f)
                                        await channel.send(file=file)
                                        send_text = str(f"[{str(self.char_name)} sends {user.name} a picture of {str(self.char_name)}'s {name.lower()}.]\n")
                                        print(send_text)
                                        with open(path, 'a') as f:
                                            print(f"{str(self.char_name)}: " + send_text)
                                            f.write(f"{str(self.char_name)}: " + send_text)
                                        return True
                                except:
                                    pass
                if not (filename):
                    return True
            else:
                last_message = [message async for message in channel.history(limit=1)][0]
                if(last_message.author != self.bot.user):
                    return False
                elif(last_message.author == self.bot.user):
                    return True
    #Meme Scan
    @commands.command(name="meme_scan")
    async def meme_scan(self, message) -> None:
        if ("send" in message.content.lower()) and ("meme" in message.content.lower()):
            directory = f"Images/memes/"
            image_extensions = ('.png', '.jpg', '.jpeg', '.mp4')
            image_files = []
            user = message.author
            for file in os.listdir(directory):
                if file.endswith(image_extensions):
                    # Split the number from the filename and store as separate entry in list
                    name, ext = os.path.splitext(file)
                    parts = name.split('_')
                    if len(parts) == 2 and parts[1].isdigit():
                        image_files.append((parts[0], int(parts[1]), os.path.join(directory, file)))
            for filename, number, filepath in image_files:
                names = filename.split('-')
                for name in names:
                    if name.lower() in message.content.lower():
                        # Count the number of images with the same keyword
                        count = sum(1 for f, _, _ in image_files if f == filename)
                        # Generate a random number within the range
                        rand_num = random.randint(1, count)
                        # Select a different image file with the same word but a different number
                        for exten in image_extensions:
                            try:
                                new_filename = f"{filename}_{rand_num}{exten}"
                                new_filepath = os.path.join(directory, new_filename)
                                with open(new_filepath, 'rb') as f:
                                    file = discord.File(f)
                                    await message.channel.send("How's this?")
                                    await message.channel.send(file=file)
                                    print(f"[{str(self.char_name)} sends {user.name} a {name} meme.]\n")
                                    return str(f"[{str(self.char_name)} sends {user.name} a {name} meme.]\n")
                            except:
                                pass
                if not (filename):
                    return ""
        return ""
    #DM Scan       
    @commands.command(name="dm_scan")
    async def dm_scan(self,message, message_content)  -> None:
        # Define a dictionary with keywords and their corresponding gifs
        user = message.author
        path = (f"{self.chatlog_dir}/{user.name} - chatlog.log")
        try:
            channel = await user.create_dm()
            if (message.guild is None):
                async for msg in channel.history(limit=1, oldest_first=True):
                    first_message_id = msg.id
                    break
                if (message.id == first_message_id) and message.guild is None:
                    dm_message = f"A direct message? What do you wish to speak with {str(self.char_name)} in private for?"
                    if dm_message:
                        await channel.send(dm_message)
                        with open(path, 'a') as f:
                            f.write(f"{user.name}: {await self.replace_ids(message_content)}\n")
                            print(f"{str(user.name)}: {await self.replace_ids(message_content)}\n")
                            f.write(f"{str(self.char_name)}: {dm_message}\n")
                            print(f"{str(self.char_name)}: {dm_message}\n")
                        return True
            if (self.bot.user in message.mentions):
                dm_message = f"Yes, {user.name}? You wanted to speak privately?\n"
                if ("dm" in str(message_content).lower()) or ("direct message" in str(message_content).lower()):
                    await channel.send(dm_message)
                    with open(path, 'a') as f:
                        print(f"{str(user.name)}: {await self.replace_ids(message_content)}\n")
                        print(f"{str(self.char_name)}: {dm_message}\n")
                        f.write(f"{str(self.char_name)}: {dm_message}\n")
                    return True
                else:
                    return False
            return False
        except discord.errors.HTTPException as e:
            if "Cannot send messages to this user" in str(e):
                print("Error: Cannot send messages to this user")
            else:
                print("Error:", e)
async def setup(bot):
    await bot.add_cog(ScanMessageCog(bot))
