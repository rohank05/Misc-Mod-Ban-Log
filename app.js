const fs = require('fs');
const {Webhook_ID, Webhook_Token, Banlist_Path} = require('./config.json')
const { WebhookClient, MessageEmbed } = require('discord.js');
const web = new WebhookClient(Webhook_ID,Webhook_Token)

var options = {
    logFile: Banlist_Path,
    endOfLineChar: require('os').EOL
  };
  // Obtain the initial size of the log file before we begin watching it.
  var fileSize = fs.statSync(options.logFile).size;
  fs.watchFile(options.logFile, function (current, previous) {
    // Check if file modified time is less than last time.
    // If so, nothing changed so don't bother parsing.
    if (current.mtime <= previous.mtime) { return; }
  
    // We're only going to read the portion of the file that
    // we have not read so far. Obtain new file size.
    var newFileSize = fs.statSync(options.logFile).size;
    // Calculate size difference.
    var sizeDiff = newFileSize - fileSize;
    var oldsize = newFileSize - fileSize;
    // If less than zero then Hearthstone truncated its log file
    // since we last read it in order to save space.
    // Set fileSize to zero and set the size difference to the current
    // size of the file.
    if (sizeDiff < 0) {
      fileSize = 0;
      sizeDiff = newFileSize;
    }
    // Create a buffer to hold only the data we intend to read.
    var buffer = new Buffer(sizeDiff);
    // Obtain reference to the file's descriptor.
    var fileDescriptor = fs.openSync(options.logFile, 'r');
    // Synchronously read from the file starting from where we read
    // to last time and store data in our buffer.
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDescriptor); // close the file
    // Set old file size to the new size for next read.
    fileSize = newFileSize;
    //On unban it will return this can be changed if u wanna save the content of old file and get the change.
    if(oldsize<0) return;
    // Parse the line(s) in the buffer.
    parseBuffer(buffer);
  });
  
  function stop () {
    fs.unwatchFile(options.logFile);
  };
  
  function parseBuffer (buffer) {
    // Iterate over each line in the buffer.
    
    buffer.toString().split(options.endOfLineChar).forEach(function (line,i) {
      // Do stuff with the line :)
    //   console.log(line)
    if(i!=0) return;
        const banargs = line.split('%');
        console.log(banargs)
        const ban = new MessageEmbed().setTitle('BAN-LOG').addField('IP:',`\`\`${banargs[0]}\`\``, true).addField('Player',`\`\`${banargs[1]}\`\``,true).addField('Reason',`\`\`${banargs[2]}\`\``,true).addField('Admin',`\`\`${banargs[3]}\`\``).setColor('RED')
        web.send(ban);
    });
  };