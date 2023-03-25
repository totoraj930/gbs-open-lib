// src/config.ts
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
var zConfig = z.object({
  OAUTH_CALLBACK: z.string().url(),
  // CLIENT_ID: z.string(),
  // CLIENT_SECRET: z.string(),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  PORT: z.string(),
  CACHE_PORT: z.string(),
  STREAM_PORT: z.string(),
  GBS_LIST: z.string().url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASS: z.string()
});
var env = zConfig.parse(process.env);

// src/redis/index.ts
import Redis from "ioredis";

// src/redis/schema.ts
import { z as z2 } from "zod";
var zRawRaidTweetMini = z2.object({
  n: z2.string(),
  // name
  sn: z2.string(),
  // screen_name
  en: z2.string(),
  // enemy_name
  ui: z2.string(),
  // user_id
  ti: z2.string(),
  // tweet_id
  bi: z2.string(),
  // battle_id
  lv: z2.string(),
  // level
  l: z2.enum(["en", "ja"]),
  // language
  t: z2.number(),
  // time
  et: z2.number(),
  // elapsed_time
  c: z2.string().optional()
  // comment
});
function minifyRawRaidTweet(tweet) {
  return {
    n: tweet.name,
    sn: tweet.screen_name,
    en: tweet.enemy_name,
    ui: tweet.user_id,
    ti: tweet.tweet_id,
    bi: tweet.battle_id,
    lv: tweet.level,
    l: tweet.language,
    t: tweet.time,
    et: tweet.elapsed_time,
    c: tweet.comment
  };
}
function unpackRawRaidTweetMini(mini) {
  return {
    name: mini.n,
    screen_name: mini.sn,
    enemy_name: mini.en,
    user_id: mini.ui,
    tweet_id: mini.ti,
    battle_id: mini.bi,
    level: mini.lv,
    language: mini.l,
    time: mini.t,
    comment: mini.c,
    elapsed_time: mini.et
  };
}
var zRaidTweetMini = z2.object({
  n: z2.string(),
  // name
  sn: z2.string(),
  // screen_name
  ui: z2.string(),
  // user_id
  ti: z2.string(),
  // tweet_id
  bi: z2.string(),
  // battle_id
  ei: z2.number(),
  // enemy_id(-1はリスト外)
  lv: z2.string().optional(),
  // level
  en: z2.string().optional(),
  // enemy_name
  l: z2.enum(["en", "ja"]),
  // language
  t: z2.number(),
  // time
  et: z2.number(),
  // elapsed_time
  ft: z2.number(),
  // first time(初回投稿時間)
  c: z2.string().optional()
  // comment
});

// src/redis/index.ts
import mitt from "mitt";
var redisOps = {
  host: env.REDIS_HOST,
  password: env.REDIS_PASS,
  port: Number.parseInt(env.REDIS_PORT)
};
function getRawChClient() {
  const receiver = mitt();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe("gbs-open-raw");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch {
    }
  });
  return receiver;
}
function getRaidTweetChClient() {
  const receiver = mitt();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe("gbs-open-tweet");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch {
    }
  });
  return receiver;
}
var pubRedis = new Redis(redisOps);
function sendRawRaidTweet(tweet) {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish("gbs-open-raw", json);
}
function sendRaidTweet(tweet) {
  const json = JSON.stringify(tweet);
  pubRedis.publish("gbs-open-tweet", json);
}
export {
  env,
  getRaidTweetChClient,
  getRawChClient,
  minifyRawRaidTweet,
  redisOps,
  sendRaidTweet,
  sendRawRaidTweet,
  unpackRawRaidTweetMini,
  zConfig,
  zRaidTweetMini,
  zRawRaidTweetMini
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZ2JzLW9wZW4vc3JjL2NvbmZpZy50cyIsICIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvaW5kZXgudHMiLCAiLi4vZ2JzLW9wZW4vc3JjL3JlZGlzL3NjaGVtYS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGNvbnN0IHpDb25maWcgPSB6Lm9iamVjdCh7XG4gIE9BVVRIX0NBTExCQUNLOiB6LnN0cmluZygpLnVybCgpLFxuICAvLyBDTElFTlRfSUQ6IHouc3RyaW5nKCksXG4gIC8vIENMSUVOVF9TRUNSRVQ6IHouc3RyaW5nKCksXG4gIENPTlNVTUVSX0tFWTogei5zdHJpbmcoKSxcbiAgQ09OU1VNRVJfU0VDUkVUOiB6LnN0cmluZygpLFxuICBQT1JUOiB6LnN0cmluZygpLFxuXG4gIENBQ0hFX1BPUlQ6IHouc3RyaW5nKCksXG4gIFNUUkVBTV9QT1JUOiB6LnN0cmluZygpLFxuXG4gIEdCU19MSVNUOiB6LnN0cmluZygpLnVybCgpLFxuXG4gIFJFRElTX0hPU1Q6IHouc3RyaW5nKCksXG4gIFJFRElTX1BPUlQ6IHouc3RyaW5nKCksXG4gIFJFRElTX1BBU1M6IHouc3RyaW5nKCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGVudiA9IHpDb25maWcucGFyc2UocHJvY2Vzcy5lbnYpO1xuIiwgImltcG9ydCB7IGVudiB9IGZyb20gJ0AvY29uZmlnJztcbmltcG9ydCB7IFJhd1JhaWRUd2VldCB9IGZyb20gJ0AvdHdlZXQvcmVjZWl2ZXInO1xuaW1wb3J0IFJlZGlzIGZyb20gJ2lvcmVkaXMnO1xuaW1wb3J0IHtcbiAgbWluaWZ5UmF3UmFpZFR3ZWV0LFxuICBSYWlkVHdlZXRNaW5pLFxuICBSYXdSYWlkVHdlZXRNaW5pLFxuICB6UmFpZFR3ZWV0TWluaSxcbiAgelJhd1JhaWRUd2VldE1pbmksXG59IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCBtaXR0IGZyb20gJ21pdHQnO1xuXG5leHBvcnQgY29uc3QgcmVkaXNPcHMgPSB7XG4gIGhvc3Q6IGVudi5SRURJU19IT1NULFxuICBwYXNzd29yZDogZW52LlJFRElTX1BBU1MsXG4gIHBvcnQ6IE51bWJlci5wYXJzZUludChlbnYuUkVESVNfUE9SVCksXG59O1xuXG50eXBlIFJhd0NoRXZlbnRzID0ge1xuICB0d2VldDogUmF3UmFpZFR3ZWV0TWluaTtcbn07XG4vKipcbiAqIFx1NzUxRlx1MzA2RVx1MzBDNFx1MzBBNFx1MzBGQ1x1MzBDOFx1NTNEN1x1NEZFMVx1NkE1RlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmF3Q2hDbGllbnQoKSB7XG4gIGNvbnN0IHJlY2VpdmVyID0gbWl0dDxSYXdDaEV2ZW50cz4oKTtcbiAgY29uc3Qgc3ViUmVkaXMgPSBuZXcgUmVkaXMocmVkaXNPcHMpO1xuICBzdWJSZWRpcy5zdWJzY3JpYmUoJ2dicy1vcGVuLXJhdycpO1xuICBzdWJSZWRpcy5vbignbWVzc2FnZScsIChjaCwganNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5pID0gelJhd1JhaWRUd2VldE1pbmkucGFyc2UoSlNPTi5wYXJzZShqc29uKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpIC0gbWluaS50LCBtaW5pLmJpLCBgTHYuJHttaW5pLmx2fWAsIG1pbmkuZW4pO1xuICAgICAgcmVjZWl2ZXIuZW1pdCgndHdlZXQnLCBtaW5pKTtcbiAgICB9IGNhdGNoIHt9XG4gIH0pO1xuICByZXR1cm4gcmVjZWl2ZXI7XG59XG5cbnR5cGUgUmFpZFR3ZWV0Q2hFdmVudHMgPSB7XG4gIHR3ZWV0OiBSYWlkVHdlZXRNaW5pO1xufTtcbi8qKlxuICogXHU1QjhDXHU2MjEwXHU2RTA4XHUzMDdGXHUzMDZFXHUzMEM0XHUzMEE0XHUzMEZDXHUzMEM4XHU1M0Q3XHU0RkUxXHU2QTVGXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYWlkVHdlZXRDaENsaWVudCgpIHtcbiAgY29uc3QgcmVjZWl2ZXIgPSBtaXR0PFJhaWRUd2VldENoRXZlbnRzPigpO1xuICBjb25zdCBzdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG4gIHN1YlJlZGlzLnN1YnNjcmliZSgnZ2JzLW9wZW4tdHdlZXQnKTtcbiAgc3ViUmVkaXMub24oJ21lc3NhZ2UnLCAoY2gsIGpzb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWluaSA9IHpSYWlkVHdlZXRNaW5pLnBhcnNlKEpTT04ucGFyc2UoanNvbikpO1xuICAgICAgcmVjZWl2ZXIuZW1pdCgndHdlZXQnLCBtaW5pKTtcbiAgICB9IGNhdGNoIHt9XG4gIH0pO1xuICByZXR1cm4gcmVjZWl2ZXI7XG59XG5cbi8qKlxuICogXHU5MDAxXHU0RkUxXHU3NTI4UmVkaXNcdTMwQUZcdTMwRTlcdTMwQTRcdTMwQTJcdTMwRjNcdTMwQzhcbiAqL1xuY29uc3QgcHViUmVkaXMgPSBuZXcgUmVkaXMocmVkaXNPcHMpO1xuXG4vKipcbiAqIFx1NzUxRlx1MzA2RVx1MzBDNFx1MzBBNFx1MzBGQ1x1MzBDOFx1MzBDN1x1MzBGQ1x1MzBCRlx1MzA5Mlx1OTAwMVx1NEZFMVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZFJhd1JhaWRUd2VldCh0d2VldDogUmF3UmFpZFR3ZWV0KSB7XG4gIGNvbnN0IG1pbmkgPSBtaW5pZnlSYXdSYWlkVHdlZXQodHdlZXQpO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkobWluaSk7XG4gIHB1YlJlZGlzLnB1Ymxpc2goJ2dicy1vcGVuLXJhdycsIGpzb24pO1xufVxuXG4vKipcbiAqIFx1NTJBMFx1NURFNVx1NkUwOFx1MzA3Rlx1MzA2RVx1MzBDNFx1MzBBNFx1MzBGQ1x1MzBDOFx1MzBDN1x1MzBGQ1x1MzBCRlx1MzA5Mlx1OTAwMVx1NEZFMVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZFJhaWRUd2VldCh0d2VldDogUmFpZFR3ZWV0TWluaSkge1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodHdlZXQpO1xuICBwdWJSZWRpcy5wdWJsaXNoKCdnYnMtb3Blbi10d2VldCcsIGpzb24pO1xufVxuIiwgImltcG9ydCB7IFJhd1JhaWRUd2VldCB9IGZyb20gJ0AvdHdlZXQvcmVjZWl2ZXInO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbi8qKlxuICogUmVkaXNcdTkwMDFcdTRGRTFcdTc1MjhcdTMwNkVcdTY1ODdcdTVCNTdcdTY1NzBcdTMwOTJcdTYyOTFcdTMwNDhcdTMwNUZSYWlkVHdlZXRcbiAqL1xuZXhwb3J0IGNvbnN0IHpSYXdSYWlkVHdlZXRNaW5pID0gei5vYmplY3Qoe1xuICBuOiB6LnN0cmluZygpLCAvLyBuYW1lXG4gIHNuOiB6LnN0cmluZygpLCAvLyBzY3JlZW5fbmFtZVxuICBlbjogei5zdHJpbmcoKSwgLy8gZW5lbXlfbmFtZVxuICB1aTogei5zdHJpbmcoKSwgLy8gdXNlcl9pZFxuICB0aTogei5zdHJpbmcoKSwgLy8gdHdlZXRfaWRcbiAgYmk6IHouc3RyaW5nKCksIC8vIGJhdHRsZV9pZFxuICBsdjogei5zdHJpbmcoKSwgLy8gbGV2ZWxcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXG4gIHQ6IHoubnVtYmVyKCksIC8vIHRpbWVcbiAgZXQ6IHoubnVtYmVyKCksIC8vIGVsYXBzZWRfdGltZVxuICBjOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGNvbW1lbnRcbn0pO1xuXG4vKipcbiAqIFx1NUJGRVx1NUZEQ1xcXG4gKiBuOiBuYW1lXFxcbiAqIHNuOiBzY3JlZV9uYW1lXFxcbiAqIGVuOiBlbmVteV9uYW1lXFxcbiAqIHVpOiB1c2VyX2lkXFxcbiAqIHRpOiB0d2VldF9pZFxcXG4gKiBiaTogYmF0dGxlX2lkXFxcbiAqIGx2OiBsZXZlbFxcXG4gKiBsOiBsYW5ndWFnZVxcXG4gKiB0OiB0aW1lXFxcbiAqIGV0OiBlbGFwc2VkX3RpbWVcXFxuICogYzogY29tbWVudFxuICovXG5leHBvcnQgdHlwZSBSYXdSYWlkVHdlZXRNaW5pID0gei5pbmZlcjx0eXBlb2YgelJhd1JhaWRUd2VldE1pbmk+O1xuXG5leHBvcnQgZnVuY3Rpb24gbWluaWZ5UmF3UmFpZFR3ZWV0KHR3ZWV0OiBSYXdSYWlkVHdlZXQpOiBSYXdSYWlkVHdlZXRNaW5pIHtcbiAgcmV0dXJuIHtcbiAgICBuOiB0d2VldC5uYW1lLFxuICAgIHNuOiB0d2VldC5zY3JlZW5fbmFtZSxcbiAgICBlbjogdHdlZXQuZW5lbXlfbmFtZSxcbiAgICB1aTogdHdlZXQudXNlcl9pZCxcbiAgICB0aTogdHdlZXQudHdlZXRfaWQsXG4gICAgYmk6IHR3ZWV0LmJhdHRsZV9pZCxcbiAgICBsdjogdHdlZXQubGV2ZWwsXG4gICAgbDogdHdlZXQubGFuZ3VhZ2UsXG4gICAgdDogdHdlZXQudGltZSxcbiAgICBldDogdHdlZXQuZWxhcHNlZF90aW1lLFxuICAgIGM6IHR3ZWV0LmNvbW1lbnQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnBhY2tSYXdSYWlkVHdlZXRNaW5pKG1pbmk6IFJhd1JhaWRUd2VldE1pbmkpOiBSYXdSYWlkVHdlZXQge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IG1pbmkubixcbiAgICBzY3JlZW5fbmFtZTogbWluaS5zbixcbiAgICBlbmVteV9uYW1lOiBtaW5pLmVuLFxuICAgIHVzZXJfaWQ6IG1pbmkudWksXG4gICAgdHdlZXRfaWQ6IG1pbmkudGksXG4gICAgYmF0dGxlX2lkOiBtaW5pLmJpLFxuICAgIGxldmVsOiBtaW5pLmx2LFxuICAgIGxhbmd1YWdlOiBtaW5pLmwsXG4gICAgdGltZTogbWluaS50LFxuICAgIGNvbW1lbnQ6IG1pbmkuYyxcbiAgICBlbGFwc2VkX3RpbWU6IG1pbmkuZXQsXG4gIH07XG59XG5cbi8qKlxuICogXHU1QjlGXHU5NjlCXHUzMDZCXHU5MTREXHU0RkUxXHUzMDU1XHUzMDhDXHUzMDhCXHUzMEM0XHUzMEE0XHUzMEZDXHUzMEM4XHUzMEM3XHUzMEZDXHUzMEJGXG4gKi9cbmV4cG9ydCBjb25zdCB6UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgdWk6IHouc3RyaW5nKCksIC8vIHVzZXJfaWRcbiAgdGk6IHouc3RyaW5nKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgZWk6IHoubnVtYmVyKCksIC8vIGVuZW15X2lkKC0xXHUzMDZGXHUzMEVBXHUzMEI5XHUzMEM4XHU1OTE2KVxuICBsdjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBsZXZlbFxuICBlbjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBlbmVteV9uYW1lXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGV0OiB6Lm51bWJlcigpLCAvLyBlbGFwc2VkX3RpbWVcbiAgZnQ6IHoubnVtYmVyKCksIC8vIGZpcnN0IHRpbWUoXHU1MjFEXHU1NkRFXHU2Mjk1XHU3QTNGXHU2NjQyXHU5NTkzKVxuICBjOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGNvbW1lbnRcbn0pO1xuXG4vKipcbiAqIFx1NUJGRVx1NUZEQ1xcXG4gKiBuOiBuYW1lXFxcbiAqIHNuOiBzY3JlZV9uYW1lXFxcbiAqIHVpOiB1c2VyX2lkXFxcbiAqIHRpOiB0d2VldF9pZFxcXG4gKiBiaTogYmF0dGxlX2lkXFxcbiAqIGVpOiBlbmVteV9pZCgtMVx1MzA2Rlx1MzBFQVx1MzBCOVx1MzBDOFx1NTkxNilcXFxuICogbDogbGFuZ3VhZ2VcXFxuICogdDogdGltZVxcXG4gKiBmdDogZmlyc3RfdGltZShcdTUyMURcdTU2REVcdTYyOTVcdTdBM0ZcdTY2NDJcdTk1OTNcXFxuICogYzogY29tbWVudFxcXG4gKiBcdTMwRUFcdTMwQjlcdTMwQzhcdTU5MTZcdTMwNkVcdTMwN0ZcdThGRkRcdTUyQTBcXFxuICogZW4/OiBlbmVteV9uYW1lXFxcbiAqIGx2PzogbGV2ZWxcbiAqL1xuZXhwb3J0IHR5cGUgUmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYWlkVHdlZXRNaW5pPjtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLFVBQVUsRUFBRSxPQUFPO0FBQUEsRUFDOUIsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQTtBQUFBO0FBQUEsRUFHL0IsY0FBYyxFQUFFLE9BQU87QUFBQSxFQUN2QixpQkFBaUIsRUFBRSxPQUFPO0FBQUEsRUFDMUIsTUFBTSxFQUFFLE9BQU87QUFBQSxFQUVmLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsYUFBYSxFQUFFLE9BQU87QUFBQSxFQUV0QixVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQSxFQUV6QixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsWUFBWSxFQUFFLE9BQU87QUFDdkIsQ0FBQztBQUVNLElBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxHQUFHOzs7QUNwQjVDLE9BQU8sV0FBVzs7O0FDRGxCLFNBQVMsS0FBQUEsVUFBUztBQUtYLElBQU0sb0JBQW9CQSxHQUFFLE9BQU87QUFBQSxFQUN4QyxHQUFHQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUdBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQ3pCLENBQUM7QUFrQk0sU0FBUyxtQkFBbUIsT0FBdUM7QUFDeEUsU0FBTztBQUFBLElBQ0wsR0FBRyxNQUFNO0FBQUEsSUFDVCxJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVixJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVixHQUFHLE1BQU07QUFBQSxJQUNULEdBQUcsTUFBTTtBQUFBLElBQ1QsSUFBSSxNQUFNO0FBQUEsSUFDVixHQUFHLE1BQU07QUFBQSxFQUNYO0FBQ0Y7QUFFTyxTQUFTLHVCQUF1QixNQUFzQztBQUMzRSxTQUFPO0FBQUEsSUFDTCxNQUFNLEtBQUs7QUFBQSxJQUNYLGFBQWEsS0FBSztBQUFBLElBQ2xCLFlBQVksS0FBSztBQUFBLElBQ2pCLFNBQVMsS0FBSztBQUFBLElBQ2QsVUFBVSxLQUFLO0FBQUEsSUFDZixXQUFXLEtBQUs7QUFBQSxJQUNoQixPQUFPLEtBQUs7QUFBQSxJQUNaLFVBQVUsS0FBSztBQUFBLElBQ2YsTUFBTSxLQUFLO0FBQUEsSUFDWCxTQUFTLEtBQUs7QUFBQSxJQUNkLGNBQWMsS0FBSztBQUFBLEVBQ3JCO0FBQ0Y7QUFLTyxJQUFNLGlCQUFpQkEsR0FBRSxPQUFPO0FBQUEsRUFDckMsR0FBR0EsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQUEsRUFDeEIsSUFBSUEsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQUEsRUFDeEIsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUdBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUdBLEdBQUUsT0FBTyxFQUFFLFNBQVM7QUFBQTtBQUN6QixDQUFDOzs7QUQzRUQsT0FBTyxVQUFVO0FBRVYsSUFBTSxXQUFXO0FBQUEsRUFDdEIsTUFBTSxJQUFJO0FBQUEsRUFDVixVQUFVLElBQUk7QUFBQSxFQUNkLE1BQU0sT0FBTyxTQUFTLElBQUksVUFBVTtBQUN0QztBQVFPLFNBQVMsaUJBQWlCO0FBQy9CLFFBQU0sV0FBVyxLQUFrQjtBQUNuQyxRQUFNLFdBQVcsSUFBSSxNQUFNLFFBQVE7QUFDbkMsV0FBUyxVQUFVLGNBQWM7QUFDakMsV0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLFNBQVM7QUFDbkMsUUFBSTtBQUNGLFlBQU0sT0FBTyxrQkFBa0IsTUFBTSxLQUFLLE1BQU0sSUFBSSxDQUFDO0FBRXJELGVBQVMsS0FBSyxTQUFTLElBQUk7QUFBQSxJQUM3QixRQUFFO0FBQUEsSUFBTztBQUFBLEVBQ1gsQ0FBQztBQUNELFNBQU87QUFDVDtBQVFPLFNBQVMsdUJBQXVCO0FBQ3JDLFFBQU0sV0FBVyxLQUF3QjtBQUN6QyxRQUFNLFdBQVcsSUFBSSxNQUFNLFFBQVE7QUFDbkMsV0FBUyxVQUFVLGdCQUFnQjtBQUNuQyxXQUFTLEdBQUcsV0FBVyxDQUFDLElBQUksU0FBUztBQUNuQyxRQUFJO0FBQ0YsWUFBTSxPQUFPLGVBQWUsTUFBTSxLQUFLLE1BQU0sSUFBSSxDQUFDO0FBQ2xELGVBQVMsS0FBSyxTQUFTLElBQUk7QUFBQSxJQUM3QixRQUFFO0FBQUEsSUFBTztBQUFBLEVBQ1gsQ0FBQztBQUNELFNBQU87QUFDVDtBQUtBLElBQU0sV0FBVyxJQUFJLE1BQU0sUUFBUTtBQUs1QixTQUFTLGlCQUFpQixPQUFxQjtBQUNwRCxRQUFNLE9BQU8sbUJBQW1CLEtBQUs7QUFDckMsUUFBTSxPQUFPLEtBQUssVUFBVSxJQUFJO0FBQ2hDLFdBQVMsUUFBUSxnQkFBZ0IsSUFBSTtBQUN2QztBQUtPLFNBQVMsY0FBYyxPQUFzQjtBQUNsRCxRQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUs7QUFDakMsV0FBUyxRQUFRLGtCQUFrQixJQUFJO0FBQ3pDOyIsCiAgIm5hbWVzIjogWyJ6Il0KfQo=