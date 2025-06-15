require('dotenv').config();

const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const { getKarma, modifyKarma } = require('./karmaManager');

const duelCooldowns = {};

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const mentioned = message.mentions.users.first();
    const content = message.content;
    if(mentioned && content.includes('++')){
        if(mentioned.id === message.author.id){
            message.reply("You can't give karma to yourself!  👀");
            return;
        }
        const newKarma = modifyKarma(mentioned.id,1);
        message.reply(`${mentioned.username} now has ${newKarma} karma!⚡`);
    }
    else if(mentioned && content.includes('--')){
        if(mentioned.id == message.author.id){
            message.reply("You can't take karma from yourself as well! 🙄"); 
        }
        const newKarma = modifyKarma(mentioned.id,-1);
        message.reply(`${mentioned.username} now has ${newKarma} karma ... 😔`);

    }
    else if(content.startsWith('!karma')){
        const user = mentioned || message.author;
        const karma = getKarma(user.id);
        message.reply(`${user.username} has ${karma} karma! ✨`);
    }
    else if(content.startsWith('!leaderboard')){
        const karmaData = loadKarma();
        const sorted = Object.entries(karmaData)
            .sort((a,b)=> b[1]-a[1])
            .slice(0,5);
        const leaderboard = sorted
            .map(([id, karma], index) => `**${index + 1}.** <@${id}> — ${karma} karma`)
            .join('\n');
        message.channel.send({
            embeds: [{
                title:"🏆 Karma Kombat Leaderboard",
                description: leaderboard,
                color: 0xfacc15
            }]
        })
    }
    else if(content.startsWith('!duel')){
        const opponent = mentioned;
        if(!opponent || opponent.id === message.author.id){
            return message.reply("Tag someone else to duel reee 🤦‍♂️");
        }
        //cooldown logic
        const now = Date.now();
        const cooldown = 60 * 1000;
        const lastDuel = duelCooldowns[challenger.id] || 0;
        if(now - lastDuel < cooldown){
            const secondsLeft = Math.ceil((cooldown - (now - lastDuel)) / 1000);
            return message.reply(`You need to wait ${secondsLeft}s before dueling again! 🕒`);
        }

        const challenger = message.author.id;
        const winner = Math.random() < 0.5 ? challenger : opponent;
        const loser = winner.id === challenger.id ? opponent : challenger;
        modifyKarma(winner.id, 10);
        modifyKarma(loser.id,-10);
        message.channel.send({
            embeds: [{
                title: `⚔️ ${challenger.username} vs ${opponent.username}`,
                description: `**${winner.username}** wins the duel and steals 10 karma from ${loser.username}!`,
                color: 0xff4757
            }]
        });
    }
})


client.login(process.env.DISCORD_TOKEN);
