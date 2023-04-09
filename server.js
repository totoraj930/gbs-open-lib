"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/redis/config.ts
var _zod = require('zod');
var _dotenv = require('dotenv'); var dotenv = _interopRequireWildcard(_dotenv);
dotenv.config();
var zRedisConfig = _zod.z.object({
  REDIS_HOST: _zod.z.string(),
  REDIS_PORT: _zod.z.string(),
  REDIS_PASS: _zod.z.string()
});
var redisEnv = zRedisConfig.parse(process.env);

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
  host: redisEnv.REDIS_HOST,
  password: redisEnv.REDIS_PASS,
  port: Number.parseInt(redisEnv.REDIS_PORT)
};
function getRawChClient(chName = "gbs-open-raw") {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe(chName);
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch (e) {
    }
  });
  return receiver;
}
function getRaidTweetChClient(chName = "gbs-open-tweet") {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe(chName);
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
function sendRawRaidTweet(tweet, chName = "gbs-open-raw") {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish(chName, json);
}
function sendRaidTweet(tweet, chName = "gbs-open-tweet") {
  const json = JSON.stringify(tweet);
  pubRedis.publish(chName, json);
}










exports.getRaidTweetChClient = getRaidTweetChClient; exports.getRawChClient = getRawChClient; exports.minifyRawRaidTweet = minifyRawRaidTweet; exports.redisOps = redisOps; exports.sendRaidTweet = sendRaidTweet; exports.sendRawRaidTweet = sendRawRaidTweet; exports.unpackRawRaidTweetMini = unpackRawRaidTweetMini; exports.zRaidTweetMini = zRaidTweetMini; exports.zRawRaidTweetMini = zRawRaidTweetMini;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2dicy1vcGVuL3NyYy9yZWRpcy9jb25maWcudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvaW5kZXgudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbInoiXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLGVBQWUsRUFBRSxPQUFPO0FBQUEsRUFDbkMsWUFBWSxFQUFFLE9BQU87QUFBQSxFQUNyQixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQ3ZCLENBQUM7QUFFTSxJQUFNLFdBQVcsYUFBYSxNQUFNLFFBQVEsR0FBRzs7O0FDUnRELE9BQU8sV0FBVzs7O0FDRGxCLFNBQVMsS0FBQUEsVUFBUztBQUtYLElBQU0sb0JBQW9CQSxHQUFFLE9BQU87QUFBQSxFQUN4QyxHQUFHQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUdBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQ3pCLENBQUM7QUFrQk0sU0FBUyxtQkFBbUIsT0FBdUM7QUFDeEUsU0FBTztBQUFBLElBQ0wsR0FBRyxNQUFNO0FBQUEsSUFDVCxJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElB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N0UsUUFBTSxPQUFPLEtBQUssVUFBVSxLQUFLO0FBQ2pDLFdBQVMsUUFBUSxRQUFRLElBQUk7QUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcclxuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gJ2RvdGVudic7XHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmV4cG9ydCBjb25zdCB6UmVkaXNDb25maWcgPSB6Lm9iamVjdCh7XHJcbiAgUkVESVNfSE9TVDogei5zdHJpbmcoKSxcclxuICBSRURJU19QT1JUOiB6LnN0cmluZygpLFxyXG4gIFJFRElTX1BBU1M6IHouc3RyaW5nKCksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZGlzRW52ID0gelJlZGlzQ29uZmlnLnBhcnNlKHByb2Nlc3MuZW52KTtcclxuIiwiaW1wb3J0IHsgcmVkaXNFbnYgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCBSZWRpcyBmcm9tICdpb3JlZGlzJztcbmltcG9ydCB7XG4gIG1pbmlmeVJhd1JhaWRUd2VldCxcbiAgUmFpZFR3ZWV0TWluaSxcbiAgUmF3UmFpZFR3ZWV0TWluaSxcbiAgelJhaWRUd2VldE1pbmksXG4gIHpSYXdSYWlkVHdlZXRNaW5pLFxufSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQgbWl0dCBmcm9tICdtaXR0JztcblxuZXhwb3J0IGNvbnN0IHJlZGlzT3BzID0ge1xuICBob3N0OiByZWRpc0Vudi5SRURJU19IT1NULFxuICBwYXNzd29yZDogcmVkaXNFbnYuUkVESVNfUEFTUyxcbiAgcG9ydDogTnVtYmVyLnBhcnNlSW50KHJlZGlzRW52LlJFRElTX1BPUlQpLFxufTtcblxudHlwZSBSYXdDaEV2ZW50cyA9IHtcbiAgdHdlZXQ6IFJhd1JhaWRUd2VldE1pbmk7XG59O1xuLyoqXG4gKiDnlJ/jga7jg4TjgqTjg7zjg4jlj5fkv6HmqZ9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhd0NoQ2xpZW50KGNoTmFtZSA9ICdnYnMtb3Blbi1yYXcnKSB7XG4gIGNvbnN0IHJlY2VpdmVyID0gbWl0dDxSYXdDaEV2ZW50cz4oKTtcbiAgY29uc3Qgc3ViUmVkaXMgPSBuZXcgUmVkaXMocmVkaXNPcHMpO1xuICBzdWJSZWRpcy5zdWJzY3JpYmUoY2hOYW1lKTtcbiAgc3ViUmVkaXMub24oJ21lc3NhZ2UnLCAoY2gsIGpzb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWluaSA9IHpSYXdSYWlkVHdlZXRNaW5pLnBhcnNlKEpTT04ucGFyc2UoanNvbikpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSAtIG1pbmkudCwgbWluaS5iaSwgYEx2LiR7bWluaS5sdn1gLCBtaW5pLmVuKTtcbiAgICAgIHJlY2VpdmVyLmVtaXQoJ3R3ZWV0JywgbWluaSk7XG4gICAgfSBjYXRjaCB7fVxuICB9KTtcbiAgcmV0dXJuIHJlY2VpdmVyO1xufVxuXG50eXBlIFJhaWRUd2VldENoRXZlbnRzID0ge1xuICB0d2VldDogUmFpZFR3ZWV0TWluaTtcbn07XG4vKipcbiAqIOWujOaIkOa4iOOBv+OBruODhOOCpOODvOODiOWPl+S/oeapn1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFpZFR3ZWV0Q2hDbGllbnQoY2hOYW1lID0gJ2dicy1vcGVuLXR3ZWV0Jykge1xuICBjb25zdCByZWNlaXZlciA9IG1pdHQ8UmFpZFR3ZWV0Q2hFdmVudHM+KCk7XG4gIGNvbnN0IHN1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcbiAgc3ViUmVkaXMuc3Vic2NyaWJlKGNoTmFtZSk7XG4gIHN1YlJlZGlzLm9uKCdtZXNzYWdlJywgKGNoLCBqc29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1pbmkgPSB6UmFpZFR3ZWV0TWluaS5wYXJzZShKU09OLnBhcnNlKGpzb24pKTtcbiAgICAgIHJlY2VpdmVyLmVtaXQoJ3R3ZWV0JywgbWluaSk7XG4gICAgfSBjYXRjaCB7fVxuICB9KTtcbiAgcmV0dXJuIHJlY2VpdmVyO1xufVxuXG4vKipcbiAqIOmAgeS/oeeUqFJlZGlz44Kv44Op44Kk44Ki44Oz44OIXG4gKi9cbmNvbnN0IHB1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcblxuLyoqXG4gKiDnlJ/jga7jg4TjgqTjg7zjg4jjg4fjg7zjgr/jgpLpgIHkv6FcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCwgY2hOYW1lID0gJ2dicy1vcGVuLXJhdycpIHtcbiAgY29uc3QgbWluaSA9IG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldCk7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShtaW5pKTtcbiAgcHViUmVkaXMucHVibGlzaChjaE5hbWUsIGpzb24pO1xufVxuXG4vKipcbiAqIOWKoOW3pea4iOOBv+OBruODhOOCpOODvOODiOODh+ODvOOCv+OCkumAgeS/oVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZFJhaWRUd2VldCh0d2VldDogUmFpZFR3ZWV0TWluaSwgY2hOYW1lID0gJ2dicy1vcGVuLXR3ZWV0Jykge1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodHdlZXQpO1xuICBwdWJSZWRpcy5wdWJsaXNoKGNoTmFtZSwganNvbik7XG59XG4iLCJpbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFJlZGlz6YCB5L+h55So44Gu5paH5a2X5pWw44KS5oqR44GI44GfUmFpZFR3ZWV0XG4gKi9cbmV4cG9ydCBjb25zdCB6UmF3UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgZW46IHouc3RyaW5nKCksIC8vIGVuZW15X25hbWVcbiAgdWk6IHouc3RyaW5nKCksIC8vIHVzZXJfaWRcbiAgdGk6IHouc3RyaW5nKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGV0OiB6Lm51bWJlcigpLCAvLyBlbGFwc2VkX3RpbWVcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiBlbjogZW5lbXlfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBsdjogbGV2ZWxcXFxuICogbDogbGFuZ3VhZ2VcXFxuICogdDogdGltZVxcXG4gKiBldDogZWxhcHNlZF90aW1lXFxcbiAqIGM6IGNvbW1lbnRcbiAqL1xuZXhwb3J0IHR5cGUgUmF3UmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYXdSYWlkVHdlZXRNaW5pPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldDogUmF3UmFpZFR3ZWV0KTogUmF3UmFpZFR3ZWV0TWluaSB7XG4gIHJldHVybiB7XG4gICAgbjogdHdlZXQubmFtZSxcbiAgICBzbjogdHdlZXQuc2NyZWVuX25hbWUsXG4gICAgZW46IHR3ZWV0LmVuZW15X25hbWUsXG4gICAgdWk6IHR3ZWV0LnVzZXJfaWQsXG4gICAgdGk6IHR3ZWV0LnR3ZWV0X2lkLFxuICAgIGJpOiB0d2VldC5iYXR0bGVfaWQsXG4gICAgbHY6IHR3ZWV0LmxldmVsLFxuICAgIGw6IHR3ZWV0Lmxhbmd1YWdlLFxuICAgIHQ6IHR3ZWV0LnRpbWUsXG4gICAgZXQ6IHR3ZWV0LmVsYXBzZWRfdGltZSxcbiAgICBjOiB0d2VldC5jb21tZW50LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmF3UmFpZFR3ZWV0TWluaShtaW5pOiBSYXdSYWlkVHdlZXRNaW5pKTogUmF3UmFpZFR3ZWV0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBtaW5pLm4sXG4gICAgc2NyZWVuX25hbWU6IG1pbmkuc24sXG4gICAgZW5lbXlfbmFtZTogbWluaS5lbixcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxuICAgIHR3ZWV0X2lkOiBtaW5pLnRpLFxuICAgIGJhdHRsZV9pZDogbWluaS5iaSxcbiAgICBsZXZlbDogbWluaS5sdixcbiAgICBsYW5ndWFnZTogbWluaS5sLFxuICAgIHRpbWU6IG1pbmkudCxcbiAgICBjb21tZW50OiBtaW5pLmMsXG4gICAgZWxhcHNlZF90aW1lOiBtaW5pLmV0LFxuICB9O1xufVxuXG4vKipcbiAqIOWun+mam+OBq+mFjeS/oeOBleOCjOOCi+ODhOOCpOODvOODiOODh+ODvOOCv1xuICovXG5leHBvcnQgY29uc3QgelJhaWRUd2VldE1pbmkgPSB6Lm9iamVjdCh7XG4gIG46IHouc3RyaW5nKCksIC8vIG5hbWVcbiAgc246IHouc3RyaW5nKCksIC8vIHNjcmVlbl9uYW1lXG4gIHVpOiB6LnN0cmluZygpLCAvLyB1c2VyX2lkXG4gIHRpOiB6LnN0cmluZygpLCAvLyB0d2VldF9pZFxuICBiaTogei5zdHJpbmcoKSwgLy8gYmF0dGxlX2lkXG4gIGVpOiB6Lm51bWJlcigpLCAvLyBlbmVteV9pZCgtMeOBr+ODquOCueODiOWklilcbiAgbHY6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gbGV2ZWxcbiAgZW46IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gZW5lbXlfbmFtZVxuICBsOiB6LmVudW0oWydlbicsICdqYSddKSwgLy8gbGFuZ3VhZ2VcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxuICBldDogei5udW1iZXIoKSwgLy8gZWxhcHNlZF90aW1lXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKOWIneWbnuaKleeov+aZgumWkylcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBlaTogZW5lbXlfaWQoLTHjga/jg6rjgrnjg4jlpJYpXFxcbiAqIGw6IGxhbmd1YWdlXFxcbiAqIHQ6IHRpbWVcXFxuICogZnQ6IGZpcnN0X3RpbWUo5Yid5Zue5oqV56i/5pmC6ZaTXFxcbiAqIGM6IGNvbW1lbnRcXFxuICog44Oq44K544OI5aSW44Gu44G/6L+95YqgXFxcbiAqIGVuPzogZW5lbXlfbmFtZVxcXG4gKiBsdj86IGxldmVsXG4gKi9cbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XG4iXX0=