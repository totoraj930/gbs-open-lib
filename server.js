"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/config.ts
var _zod = require('zod');
var _dotenv = require('dotenv'); var dotenv = _interopRequireWildcard(_dotenv);
dotenv.config();
var zConfig = _zod.z.object({
  OAUTH_CALLBACK: _zod.z.string().url(),
  // CLIENT_ID: z.string(),
  // CLIENT_SECRET: z.string(),
  CONSUMER_KEY: _zod.z.string(),
  CONSUMER_SECRET: _zod.z.string(),
  PORT: _zod.z.string(),
  CACHE_PORT: _zod.z.string(),
  STREAM_PORT: _zod.z.string(),
  GBS_LIST: _zod.z.string().url(),
  REDIS_HOST: _zod.z.string(),
  REDIS_PORT: _zod.z.string(),
  REDIS_PASS: _zod.z.string()
});
var env = zConfig.parse(process.env);

// src/redis/index.ts
var _ioredis = require('ioredis'); var _ioredis2 = _interopRequireDefault(_ioredis);

// src/redis/schema.ts

var zRawRaidTweetMini = _zod.z.object({
  n: _zod.z.string(),
  // name
  sn: _zod.z.string(),
  // screen_name
  en: _zod.z.string(),
  // enemy_name
  ui: _zod.z.string(),
  // user_id
  ti: _zod.z.string(),
  // tweet_id
  bi: _zod.z.string(),
  // battle_id
  lv: _zod.z.string(),
  // level
  l: _zod.z.enum(["en", "ja"]),
  // language
  t: _zod.z.number(),
  // time
  et: _zod.z.number(),
  // elapsed_time
  c: _zod.z.string().optional()
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
var zRaidTweetMini = _zod.z.object({
  n: _zod.z.string(),
  // name
  sn: _zod.z.string(),
  // screen_name
  ui: _zod.z.string(),
  // user_id
  ti: _zod.z.string(),
  // tweet_id
  bi: _zod.z.string(),
  // battle_id
  ei: _zod.z.number(),
  // enemy_id(-1はリスト外)
  lv: _zod.z.string().optional(),
  // level
  en: _zod.z.string().optional(),
  // enemy_name
  l: _zod.z.enum(["en", "ja"]),
  // language
  t: _zod.z.number(),
  // time
  et: _zod.z.number(),
  // elapsed_time
  ft: _zod.z.number(),
  // first time(初回投稿時間)
  c: _zod.z.string().optional()
  // comment
});

// src/redis/index.ts
var _mitt = require('mitt'); var _mitt2 = _interopRequireDefault(_mitt);
var redisOps = {
  host: env.REDIS_HOST,
  password: env.REDIS_PASS,
  port: Number.parseInt(env.REDIS_PORT)
};
function getRawChClient() {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe("gbs-open-raw");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch (e) {
    }
  });
  return receiver;
}
function getRaidTweetChClient() {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe("gbs-open-tweet");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch (e2) {
    }
  });
  return receiver;
}
var pubRedis = new (0, _ioredis2.default)(redisOps);
function sendRawRaidTweet(tweet) {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish("gbs-open-raw", json);
}
function sendRaidTweet(tweet) {
  const json = JSON.stringify(tweet);
  pubRedis.publish("gbs-open-tweet", json);
}












exports.env = env; exports.getRaidTweetChClient = getRaidTweetChClient; exports.getRawChClient = getRawChClient; exports.minifyRawRaidTweet = minifyRawRaidTweet; exports.redisOps = redisOps; exports.sendRaidTweet = sendRaidTweet; exports.sendRawRaidTweet = sendRawRaidTweet; exports.unpackRawRaidTweetMini = unpackRawRaidTweetMini; exports.zConfig = zConfig; exports.zRaidTweetMini = zRaidTweetMini; exports.zRawRaidTweetMini = zRawRaidTweetMini;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2dicy1vcGVuL3NyYy9jb25maWcudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvaW5kZXgudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbInoiXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLFVBQVUsRUFBRSxPQUFPO0FBQUEsRUFDOUIsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQTtBQUFBO0FBQUEsRUFHL0IsY0FBYyxFQUFFLE9BQU87QUFBQSxFQUN2QixpQkFBaUIsRUFBRSxPQUFPO0FBQUEsRUFDMUIsTUFBTSxFQUFFLE9BQU87QUFBQSxFQUVmLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsYUFBYSxFQUFFLE9BQU87QUFBQSxFQUV0QixVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQSxFQUV6QixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsWUFBWSxFQUFFLE9BQU87QUFDdkIsQ0FBQztBQUVNLElBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxHQUFHOzs7QUNwQjVDLE9BQU8sV0FBVzs7O0FDRGxCLFNBQVMsS0FBQUEsVUFBUztBQUtYLElBQU0sb0JBQW9CQSxHQUFFLE9BQU87QUFBQSxFQUN4QyxHQUFHQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVB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LElBQU0sV0FBVyxJQUFJLE1BQU0sUUFBUTtBQUs1QixTQUFTLGlCQUFpQixPQUFxQjtBQUNwRCxRQUFNLE9BQU8sbUJBQW1CLEtBQUs7QUFDckMsUUFBTSxPQUFPLEtBQUssVUFBVSxJQUFJO0FBQ2hDLFdBQVMsUUFBUSxnQkFBZ0IsSUFBSTtBQUN2QztBQUtPLFNBQVMsY0FBYyxPQUFzQjtBQUNsRCxRQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUs7QUFDakMsV0FBUyxRQUFRLGtCQUFrQixJQUFJO0FBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGNvbnN0IHpDb25maWcgPSB6Lm9iamVjdCh7XG4gIE9BVVRIX0NBTExCQUNLOiB6LnN0cmluZygpLnVybCgpLFxuICAvLyBDTElFTlRfSUQ6IHouc3RyaW5nKCksXG4gIC8vIENMSUVOVF9TRUNSRVQ6IHouc3RyaW5nKCksXG4gIENPTlNVTUVSX0tFWTogei5zdHJpbmcoKSxcbiAgQ09OU1VNRVJfU0VDUkVUOiB6LnN0cmluZygpLFxuICBQT1JUOiB6LnN0cmluZygpLFxuXG4gIENBQ0hFX1BPUlQ6IHouc3RyaW5nKCksXG4gIFNUUkVBTV9QT1JUOiB6LnN0cmluZygpLFxuXG4gIEdCU19MSVNUOiB6LnN0cmluZygpLnVybCgpLFxuXG4gIFJFRElTX0hPU1Q6IHouc3RyaW5nKCksXG4gIFJFRElTX1BPUlQ6IHouc3RyaW5nKCksXG4gIFJFRElTX1BBU1M6IHouc3RyaW5nKCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGVudiA9IHpDb25maWcucGFyc2UocHJvY2Vzcy5lbnYpO1xuIiwiaW1wb3J0IHsgZW52IH0gZnJvbSAnQC9jb25maWcnO1xuaW1wb3J0IHsgUmF3UmFpZFR3ZWV0IH0gZnJvbSAnQC90d2VldC9yZWNlaXZlcic7XG5pbXBvcnQgUmVkaXMgZnJvbSAnaW9yZWRpcyc7XG5pbXBvcnQge1xuICBtaW5pZnlSYXdSYWlkVHdlZXQsXG4gIFJhaWRUd2VldE1pbmksXG4gIFJhd1JhaWRUd2VldE1pbmksXG4gIHpSYWlkVHdlZXRNaW5pLFxuICB6UmF3UmFpZFR3ZWV0TWluaSxcbn0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IG1pdHQgZnJvbSAnbWl0dCc7XG5cbmV4cG9ydCBjb25zdCByZWRpc09wcyA9IHtcbiAgaG9zdDogZW52LlJFRElTX0hPU1QsXG4gIHBhc3N3b3JkOiBlbnYuUkVESVNfUEFTUyxcbiAgcG9ydDogTnVtYmVyLnBhcnNlSW50KGVudi5SRURJU19QT1JUKSxcbn07XG5cbnR5cGUgUmF3Q2hFdmVudHMgPSB7XG4gIHR3ZWV0OiBSYXdSYWlkVHdlZXRNaW5pO1xufTtcbi8qKlxuICog55Sf44Gu44OE44Kk44O844OI5Y+X5L+h5qmfXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdDaENsaWVudCgpIHtcbiAgY29uc3QgcmVjZWl2ZXIgPSBtaXR0PFJhd0NoRXZlbnRzPigpO1xuICBjb25zdCBzdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG4gIHN1YlJlZGlzLnN1YnNjcmliZSgnZ2JzLW9wZW4tcmF3Jyk7XG4gIHN1YlJlZGlzLm9uKCdtZXNzYWdlJywgKGNoLCBqc29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1pbmkgPSB6UmF3UmFpZFR3ZWV0TWluaS5wYXJzZShKU09OLnBhcnNlKGpzb24pKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKERhdGUubm93KCkgLSBtaW5pLnQsIG1pbmkuYmksIGBMdi4ke21pbmkubHZ9YCwgbWluaS5lbik7XG4gICAgICByZWNlaXZlci5lbWl0KCd0d2VldCcsIG1pbmkpO1xuICAgIH0gY2F0Y2gge31cbiAgfSk7XG4gIHJldHVybiByZWNlaXZlcjtcbn1cblxudHlwZSBSYWlkVHdlZXRDaEV2ZW50cyA9IHtcbiAgdHdlZXQ6IFJhaWRUd2VldE1pbmk7XG59O1xuLyoqXG4gKiDlrozmiJDmuIjjgb/jga7jg4TjgqTjg7zjg4jlj5fkv6HmqZ9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhaWRUd2VldENoQ2xpZW50KCkge1xuICBjb25zdCByZWNlaXZlciA9IG1pdHQ8UmFpZFR3ZWV0Q2hFdmVudHM+KCk7XG4gIGNvbnN0IHN1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcbiAgc3ViUmVkaXMuc3Vic2NyaWJlKCdnYnMtb3Blbi10d2VldCcpO1xuICBzdWJSZWRpcy5vbignbWVzc2FnZScsIChjaCwganNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5pID0gelJhaWRUd2VldE1pbmkucGFyc2UoSlNPTi5wYXJzZShqc29uKSk7XG4gICAgICByZWNlaXZlci5lbWl0KCd0d2VldCcsIG1pbmkpO1xuICAgIH0gY2F0Y2gge31cbiAgfSk7XG4gIHJldHVybiByZWNlaXZlcjtcbn1cblxuLyoqXG4gKiDpgIHkv6HnlKhSZWRpc+OCr+ODqeOCpOOCouODs+ODiFxuICovXG5jb25zdCBwdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG5cbi8qKlxuICog55Sf44Gu44OE44Kk44O844OI44OH44O844K/44KS6YCB5L+hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kUmF3UmFpZFR3ZWV0KHR3ZWV0OiBSYXdSYWlkVHdlZXQpIHtcbiAgY29uc3QgbWluaSA9IG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldCk7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShtaW5pKTtcbiAgcHViUmVkaXMucHVibGlzaCgnZ2JzLW9wZW4tcmF3JywganNvbik7XG59XG5cbi8qKlxuICog5Yqg5bel5riI44G/44Gu44OE44Kk44O844OI44OH44O844K/44KS6YCB5L+hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kUmFpZFR3ZWV0KHR3ZWV0OiBSYWlkVHdlZXRNaW5pKSB7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh0d2VldCk7XG4gIHB1YlJlZGlzLnB1Ymxpc2goJ2dicy1vcGVuLXR3ZWV0JywganNvbik7XG59XG4iLCJpbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFJlZGlz6YCB5L+h55So44Gu5paH5a2X5pWw44KS5oqR44GI44GfUmFpZFR3ZWV0XG4gKi9cbmV4cG9ydCBjb25zdCB6UmF3UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgZW46IHouc3RyaW5nKCksIC8vIGVuZW15X25hbWVcbiAgdWk6IHouc3RyaW5nKCksIC8vIHVzZXJfaWRcbiAgdGk6IHouc3RyaW5nKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGV0OiB6Lm51bWJlcigpLCAvLyBlbGFwc2VkX3RpbWVcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiBlbjogZW5lbXlfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBsdjogbGV2ZWxcXFxuICogbDogbGFuZ3VhZ2VcXFxuICogdDogdGltZVxcXG4gKiBldDogZWxhcHNlZF90aW1lXFxcbiAqIGM6IGNvbW1lbnRcbiAqL1xuZXhwb3J0IHR5cGUgUmF3UmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYXdSYWlkVHdlZXRNaW5pPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldDogUmF3UmFpZFR3ZWV0KTogUmF3UmFpZFR3ZWV0TWluaSB7XG4gIHJldHVybiB7XG4gICAgbjogdHdlZXQubmFtZSxcbiAgICBzbjogdHdlZXQuc2NyZWVuX25hbWUsXG4gICAgZW46IHR3ZWV0LmVuZW15X25hbWUsXG4gICAgdWk6IHR3ZWV0LnVzZXJfaWQsXG4gICAgdGk6IHR3ZWV0LnR3ZWV0X2lkLFxuICAgIGJpOiB0d2VldC5iYXR0bGVfaWQsXG4gICAgbHY6IHR3ZWV0LmxldmVsLFxuICAgIGw6IHR3ZWV0Lmxhbmd1YWdlLFxuICAgIHQ6IHR3ZWV0LnRpbWUsXG4gICAgZXQ6IHR3ZWV0LmVsYXBzZWRfdGltZSxcbiAgICBjOiB0d2VldC5jb21tZW50LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmF3UmFpZFR3ZWV0TWluaShtaW5pOiBSYXdSYWlkVHdlZXRNaW5pKTogUmF3UmFpZFR3ZWV0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBtaW5pLm4sXG4gICAgc2NyZWVuX25hbWU6IG1pbmkuc24sXG4gICAgZW5lbXlfbmFtZTogbWluaS5lbixcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxuICAgIHR3ZWV0X2lkOiBtaW5pLnRpLFxuICAgIGJhdHRsZV9pZDogbWluaS5iaSxcbiAgICBsZXZlbDogbWluaS5sdixcbiAgICBsYW5ndWFnZTogbWluaS5sLFxuICAgIHRpbWU6IG1pbmkudCxcbiAgICBjb21tZW50OiBtaW5pLmMsXG4gICAgZWxhcHNlZF90aW1lOiBtaW5pLmV0LFxuICB9O1xufVxuXG4vKipcbiAqIOWun+mam+OBq+mFjeS/oeOBleOCjOOCi+ODhOOCpOODvOODiOODh+ODvOOCv1xuICovXG5leHBvcnQgY29uc3QgelJhaWRUd2VldE1pbmkgPSB6Lm9iamVjdCh7XG4gIG46IHouc3RyaW5nKCksIC8vIG5hbWVcbiAgc246IHouc3RyaW5nKCksIC8vIHNjcmVlbl9uYW1lXG4gIHVpOiB6LnN0cmluZygpLCAvLyB1c2VyX2lkXG4gIHRpOiB6LnN0cmluZygpLCAvLyB0d2VldF9pZFxuICBiaTogei5zdHJpbmcoKSwgLy8gYmF0dGxlX2lkXG4gIGVpOiB6Lm51bWJlcigpLCAvLyBlbmVteV9pZCgtMeOBr+ODquOCueODiOWklilcbiAgbHY6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gbGV2ZWxcbiAgZW46IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gZW5lbXlfbmFtZVxuICBsOiB6LmVudW0oWydlbicsICdqYSddKSwgLy8gbGFuZ3VhZ2VcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxuICBldDogei5udW1iZXIoKSwgLy8gZWxhcHNlZF90aW1lXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKOWIneWbnuaKleeov+aZgumWkylcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBlaTogZW5lbXlfaWQoLTHjga/jg6rjgrnjg4jlpJYpXFxcbiAqIGw6IGxhbmd1YWdlXFxcbiAqIHQ6IHRpbWVcXFxuICogZnQ6IGZpcnN0X3RpbWUo5Yid5Zue5oqV56i/5pmC6ZaTXFxcbiAqIGM6IGNvbW1lbnRcXFxuICog44Oq44K544OI5aSW44Gu44G/6L+95YqgXFxcbiAqIGVuPzogZW5lbXlfbmFtZVxcXG4gKiBsdj86IGxldmVsXG4gKi9cbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XG4iXX0=