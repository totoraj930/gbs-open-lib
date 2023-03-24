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
  ui: _zod.z.number(),
  // user_id
  ti: _zod.z.number(),
  // tweet_id
  bi: _zod.z.string(),
  // battle_id
  lv: _zod.z.string(),
  // level
  l: _zod.z.enum(["en", "ja"]),
  // language
  t: _zod.z.number(),
  // time
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
    comment: mini.c
  };
}
var zRaidTweetMini = _zod.z.object({
  n: _zod.z.string(),
  // name
  sn: _zod.z.string(),
  // screen_name
  ui: _zod.z.number(),
  // user_id
  ti: _zod.z.number(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2dicy1vcGVuL3NyYy9jb25maWcudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvaW5kZXgudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbInoiXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLFVBQVUsRUFBRSxPQUFPO0FBQUEsRUFDOUIsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQTtBQUFBO0FBQUEsRUFHL0IsY0FBYyxFQUFFLE9BQU87QUFBQSxFQUN2QixpQkFBaUIsRUFBRSxPQUFPO0FBQUEsRUFDMUIsTUFBTSxFQUFFLE9BQU87QUFBQSxFQUVmLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsYUFBYSxFQUFFLE9BQU87QUFBQSxFQUV0QixVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQSxFQUV6QixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsWUFBWSxFQUFFLE9BQU87QUFDdkIsQ0FBQztBQUVNLElBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxHQUFHOzs7QUNwQjVDLE9BQU8sV0FBVzs7O0FDRGxCLFNBQVMsS0FBQUEsVUFBUztBQUtYLElBQU0sb0JBQW9CQSxHQUFFLE9BQU87QUFBQSxFQUN4QyxHQUFHQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVB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LElBQUk7QUFDaEMsV0FBUyxRQUFRLGdCQUFnQixJQUFJO0FBQ3ZDO0FBS08sU0FBUyxjQUFjLE9BQXNCO0FBQ2xELFFBQU0sT0FBTyxLQUFLLFVBQVUsS0FBSztBQUNqQyxXQUFTLFFBQVEsa0JBQWtCLElBQUk7QUFDekMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnO1xuZG90ZW52LmNvbmZpZygpO1xuXG5leHBvcnQgY29uc3QgekNvbmZpZyA9IHoub2JqZWN0KHtcbiAgT0FVVEhfQ0FMTEJBQ0s6IHouc3RyaW5nKCkudXJsKCksXG4gIC8vIENMSUVOVF9JRDogei5zdHJpbmcoKSxcbiAgLy8gQ0xJRU5UX1NFQ1JFVDogei5zdHJpbmcoKSxcbiAgQ09OU1VNRVJfS0VZOiB6LnN0cmluZygpLFxuICBDT05TVU1FUl9TRUNSRVQ6IHouc3RyaW5nKCksXG4gIFBPUlQ6IHouc3RyaW5nKCksXG5cbiAgQ0FDSEVfUE9SVDogei5zdHJpbmcoKSxcbiAgU1RSRUFNX1BPUlQ6IHouc3RyaW5nKCksXG5cbiAgR0JTX0xJU1Q6IHouc3RyaW5nKCkudXJsKCksXG5cbiAgUkVESVNfSE9TVDogei5zdHJpbmcoKSxcbiAgUkVESVNfUE9SVDogei5zdHJpbmcoKSxcbiAgUkVESVNfUEFTUzogei5zdHJpbmcoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZW52ID0gekNvbmZpZy5wYXJzZShwcm9jZXNzLmVudik7XG4iLCJpbXBvcnQgeyBlbnYgfSBmcm9tICdAL2NvbmZpZyc7XG5pbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCBSZWRpcyBmcm9tICdpb3JlZGlzJztcbmltcG9ydCB7XG4gIG1pbmlmeVJhd1JhaWRUd2VldCxcbiAgUmFpZFR3ZWV0TWluaSxcbiAgUmF3UmFpZFR3ZWV0TWluaSxcbiAgelJhaWRUd2VldE1pbmksXG4gIHpSYXdSYWlkVHdlZXRNaW5pLFxufSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQgbWl0dCBmcm9tICdtaXR0JztcblxuZXhwb3J0IGNvbnN0IHJlZGlzT3BzID0ge1xuICBob3N0OiBlbnYuUkVESVNfSE9TVCxcbiAgcGFzc3dvcmQ6IGVudi5SRURJU19QQVNTLFxuICBwb3J0OiBOdW1iZXIucGFyc2VJbnQoZW52LlJFRElTX1BPUlQpLFxufTtcblxudHlwZSBSYXdDaEV2ZW50cyA9IHtcbiAgdHdlZXQ6IFJhd1JhaWRUd2VldE1pbmk7XG59O1xuLyoqXG4gKiDnlJ/jga7jg4TjgqTjg7zjg4jlj5fkv6HmqZ9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhd0NoQ2xpZW50KCkge1xuICBjb25zdCByZWNlaXZlciA9IG1pdHQ8UmF3Q2hFdmVudHM+KCk7XG4gIGNvbnN0IHN1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcbiAgc3ViUmVkaXMuc3Vic2NyaWJlKCdnYnMtb3Blbi1yYXcnKTtcbiAgc3ViUmVkaXMub24oJ21lc3NhZ2UnLCAoY2gsIGpzb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWluaSA9IHpSYXdSYWlkVHdlZXRNaW5pLnBhcnNlKEpTT04ucGFyc2UoanNvbikpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSAtIG1pbmkudCwgbWluaS5iaSwgYEx2LiR7bWluaS5sdn1gLCBtaW5pLmVuKTtcbiAgICAgIHJlY2VpdmVyLmVtaXQoJ3R3ZWV0JywgbWluaSk7XG4gICAgfSBjYXRjaCB7fVxuICB9KTtcbiAgcmV0dXJuIHJlY2VpdmVyO1xufVxuXG50eXBlIFJhaWRUd2VldENoRXZlbnRzID0ge1xuICB0d2VldDogUmFpZFR3ZWV0TWluaTtcbn07XG4vKipcbiAqIOWujOaIkOa4iOOBv+OBruODhOOCpOODvOODiOWPl+S/oeapn1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFpZFR3ZWV0Q2hDbGllbnQoKSB7XG4gIGNvbnN0IHJlY2VpdmVyID0gbWl0dDxSYWlkVHdlZXRDaEV2ZW50cz4oKTtcbiAgY29uc3Qgc3ViUmVkaXMgPSBuZXcgUmVkaXMocmVkaXNPcHMpO1xuICBzdWJSZWRpcy5zdWJzY3JpYmUoJ2dicy1vcGVuLXR3ZWV0Jyk7XG4gIHN1YlJlZGlzLm9uKCdtZXNzYWdlJywgKGNoLCBqc29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1pbmkgPSB6UmFpZFR3ZWV0TWluaS5wYXJzZShKU09OLnBhcnNlKGpzb24pKTtcbiAgICAgIHJlY2VpdmVyLmVtaXQoJ3R3ZWV0JywgbWluaSk7XG4gICAgfSBjYXRjaCB7fVxuICB9KTtcbiAgcmV0dXJuIHJlY2VpdmVyO1xufVxuXG4vKipcbiAqIOmAgeS/oeeUqFJlZGlz44Kv44Op44Kk44Ki44Oz44OIXG4gKi9cbmNvbnN0IHB1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcblxuLyoqXG4gKiDnlJ/jga7jg4TjgqTjg7zjg4jjg4fjg7zjgr/jgpLpgIHkv6FcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCkge1xuICBjb25zdCBtaW5pID0gbWluaWZ5UmF3UmFpZFR3ZWV0KHR3ZWV0KTtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KG1pbmkpO1xuICBwdWJSZWRpcy5wdWJsaXNoKCdnYnMtb3Blbi1yYXcnLCBqc29uKTtcbn1cblxuLyoqXG4gKiDliqDlt6XmuIjjgb/jga7jg4TjgqTjg7zjg4jjg4fjg7zjgr/jgpLpgIHkv6FcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRSYWlkVHdlZXQodHdlZXQ6IFJhaWRUd2VldE1pbmkpIHtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHR3ZWV0KTtcbiAgcHViUmVkaXMucHVibGlzaCgnZ2JzLW9wZW4tdHdlZXQnLCBqc29uKTtcbn1cbiIsImltcG9ydCB7IFJhd1JhaWRUd2VldCB9IGZyb20gJ0AvdHdlZXQvcmVjZWl2ZXInO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbi8qKlxuICogUmVkaXPpgIHkv6HnlKjjga7mloflrZfmlbDjgpLmipHjgYjjgZ9SYWlkVHdlZXRcbiAqL1xuZXhwb3J0IGNvbnN0IHpSYXdSYWlkVHdlZXRNaW5pID0gei5vYmplY3Qoe1xuICBuOiB6LnN0cmluZygpLCAvLyBuYW1lXG4gIHNuOiB6LnN0cmluZygpLCAvLyBzY3JlZW5fbmFtZVxuICBlbjogei5zdHJpbmcoKSwgLy8gZW5lbXlfbmFtZVxuICB1aTogei5udW1iZXIoKSwgLy8gdXNlcl9pZFxuICB0aTogei5udW1iZXIoKSwgLy8gdHdlZXRfaWRcbiAgYmk6IHouc3RyaW5nKCksIC8vIGJhdHRsZV9pZFxuICBsdjogei5zdHJpbmcoKSwgLy8gbGV2ZWxcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXG4gIHQ6IHoubnVtYmVyKCksIC8vIHRpbWVcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcbmV4cG9ydCB0eXBlIFJhd1JhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmF3UmFpZFR3ZWV0TWluaT47XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW5pZnlSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCk6IFJhd1JhaWRUd2VldE1pbmkge1xuICByZXR1cm4ge1xuICAgIG46IHR3ZWV0Lm5hbWUsXG4gICAgc246IHR3ZWV0LnNjcmVlbl9uYW1lLFxuICAgIGVuOiB0d2VldC5lbmVteV9uYW1lLFxuICAgIHVpOiB0d2VldC51c2VyX2lkLFxuICAgIHRpOiB0d2VldC50d2VldF9pZCxcbiAgICBiaTogdHdlZXQuYmF0dGxlX2lkLFxuICAgIGx2OiB0d2VldC5sZXZlbCxcbiAgICBsOiB0d2VldC5sYW5ndWFnZSxcbiAgICB0OiB0d2VldC50aW1lLFxuICAgIGM6IHR3ZWV0LmNvbW1lbnQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnBhY2tSYXdSYWlkVHdlZXRNaW5pKG1pbmk6IFJhd1JhaWRUd2VldE1pbmkpOiBSYXdSYWlkVHdlZXQge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IG1pbmkubixcbiAgICBzY3JlZW5fbmFtZTogbWluaS5zbixcbiAgICBlbmVteV9uYW1lOiBtaW5pLmVuLFxuICAgIHVzZXJfaWQ6IG1pbmkudWksXG4gICAgdHdlZXRfaWQ6IG1pbmkudGksXG4gICAgYmF0dGxlX2lkOiBtaW5pLmJpLFxuICAgIGxldmVsOiBtaW5pLmx2LFxuICAgIGxhbmd1YWdlOiBtaW5pLmwsXG4gICAgdGltZTogbWluaS50LFxuICAgIGNvbW1lbnQ6IG1pbmkuYyxcbiAgfTtcbn1cblxuLyoqXG4gKiDlrp/pmpvjgavphY3kv6HjgZXjgozjgovjg4TjgqTjg7zjg4jjg4fjg7zjgr9cbiAqL1xuZXhwb3J0IGNvbnN0IHpSYWlkVHdlZXRNaW5pID0gei5vYmplY3Qoe1xuICBuOiB6LnN0cmluZygpLCAvLyBuYW1lXG4gIHNuOiB6LnN0cmluZygpLCAvLyBzY3JlZW5fbmFtZVxuICB1aTogei5udW1iZXIoKSwgLy8gdXNlcl9pZFxuICB0aTogei5udW1iZXIoKSwgLy8gdHdlZXRfaWRcbiAgYmk6IHouc3RyaW5nKCksIC8vIGJhdHRsZV9pZFxuICBlaTogei5udW1iZXIoKSwgLy8gZW5lbXlfaWQoLTHjga/jg6rjgrnjg4jlpJYpXG4gIGx2OiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGxldmVsXG4gIGVuOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGVuZW15X25hbWVcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXG4gIHQ6IHoubnVtYmVyKCksIC8vIHRpbWVcbiAgZnQ6IHoubnVtYmVyKCksIC8vIGZpcnN0IHRpbWUo5Yid5Zue5oqV56i/5pmC6ZaTKVxuICBjOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGNvbW1lbnRcbn0pO1xuZXhwb3J0IHR5cGUgUmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYWlkVHdlZXRNaW5pPjtcbiJdfQ==