const Discord = require("discord.js");
const databaseController = require("./database");
const config = require("../../config.json");

const emojies = [
    "<:nanab_berry:690047532687949832>",
    "<:nanab_berry:690047532687949832>",
    "<:nanab_berry:690047532687949832>",
    "<:nanab_berry:690047532687949832>",
    "<:nanab_berry:690047532687949832>",
    "<:pinap_berry:690047623729774677>",
    "<:pinap_berry:690047623729774677>",
    "<:pinap_berry:690047623729774677>",
    "<:pinap_berry:690047623729774677>",
    "<:razz_berry:690047698975326234>",
    "<:razz_berry:690047698975326234>",
    "<:razz_berry:690047698975326234>",
    "<:silver_pinap_berry:690047733813608448>",
    "<:silver_pinap_berry:690047733813608448>",
    "<:golden_razz_berry:690047657149857794>"
];

const generateRandomEmoji = function (max) {
    return emojies[Math.floor(Math.random() * max)];
};

const spin = function (msg) {
    if (msg.channel.id !== config.channels.slots) return;

    databaseController.updateBalance(msg.member.id, -1);
    
    let first = generateRandomEmoji(emojies.length);
    let second = generateRandomEmoji(emojies.length);
    let third = generateRandomEmoji(emojies.length);
    let result = first + second + third;
    let win = (first === second && second === third) ? true : false;
    let name = msg.author.displayName;
    let icon = msg.author.displayAvatarURL;
    
    let slotMsg = new Discord.RichEmbed()
        .setFooter("Try again.", icon)
        .addField("Slot Machine Reults", result, true)
        .setColor(0xFFA500);
    
    if (win) {
        let winMsg;
        
        switch(first) {
            case emojies[0]:
                databaseController.updateBalance(msg.member.id, 50);
                winMsg = new Discord.RichEmbed()
                .setFooter("You Won! 50 PokeCoins have been added to your account.", icon)
                .addField("Slot Machine Results <:pokecoin:577641216775028747>", result, true)
                .setColor(0x006600);
                break;
            case emojies[1]:
                databaseController.updateBalance(msg.member.id, 100);
                winMsg = new Discord.RichEmbed()
                .setFooter("You Won! 100 PokeCoins have been added to your account.", icon)
                .addField("Slot Machine Results <:pokecoin:577641216775028747>", result, true)
                .setColor(0x006600);
                break;
            case emojies[2]:
                databaseController.updateBalance(msg.member.id, 500);
                winMsg = new Discord.RichEmbed()
                .setFooter("You Won! 500 PokeCoins have been added to your account.", icon)
                .addField("Slot Machine Results <:pokecoin:577641216775028747>", result, true)
                .setColor(0x006600);
                break;
            case emojies[3]:
                databaseController.updateBalance(msg.member.id, 1000);
                winMsg = new Discord.RichEmbed()
                .setFooter("You Won! 1000 PokeCoins have been added to your account.", icon)
                .addField("Slot Machine Results <:pokecoin:577641216775028747>", result, true)
                .setColor(0x006600);
                break;
            case emojies[4]:
                databaseController.updateBalance(msg.member.id, 5000);
                winMsg = new Discord.RichEmbed()
                .setFooter("You Won! 5000 PokeCoins have been added to your account.", icon)
                .addField("Slot Machine Results <:pokecoin:577641216775028747>", result, true)
                .setColor(0x006600);
                break;
        };
        
        msg.channel.send(winMsg);
    } else {
        msg.channel.send(slotMsg);
    }
};

module.exports = {
    spin
};