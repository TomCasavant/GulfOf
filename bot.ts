import {
  createBot,
  InProcessMessageQueue,
  MemoryKvStore,
  text,
  Image,
  link
} from "@fedify/botkit";

import { DenoKvMessageQueue, DenoKvStore } from "@fedify/fedify/x/denokv";

const kv = await Deno.openKv();

const bot = createBot({
  username: "gulfof",
  name: "Gulf Of",
  summary: text`A bot powered by BotKit. Uses gulfof.mapquest.com to generate gulf of {text} images when tagged.`,
  kv: new DenoKvStore(kv),
  queue: new DenoKvMessageQueue(kv),
  behindProxy: false,
  properties: {
    "Maintainer": link(
      "@tom@tomkahe.com",
      "https://tomkahe.com/@tom",
    ),
    "Source Code": link(
    	"tomcasavant/GulfOf",
    	"https://github.com/TomCasavant/GulfOf",
    ),
    "Powered by": link("BotKit", "https://botkit.fedify.dev/"),
  },
  icon: new URL(
    "https://gulfof.mapquest.com/img/map?theme=dark&name=gulf+of",
  ),
});

bot.onMention = async (session, message) => {
  let sanitizedText = message.text.replace(/^@gulfof\s*/, "");
  let encodedText = encodeURIComponent(sanitizedText || "");
  const imageUrl = `https://gulfof.mapquest.com/img/map?theme=dark&name=${encodedText}`;
  
  await message.reply(
    text``,
    {
      attachments: [
        new Image({
          mediaType: "image/png",
          url: new URL(imageUrl),
          name: `Image showing Gulf of Mexico except the text is replaced with 'Gulf of ${sanitizedText}'`,
          width: 478,
          height: 359,
        }),
      ],
    }
  );
};

bot.federation.startQueue();

export default bot;
