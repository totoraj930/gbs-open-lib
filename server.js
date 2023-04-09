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
      if (json === "updateGbsList") {
        receiver.emit("updateGbsList");
      }
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
      if (json === "updateGbsList") {
        receiver.emit("updateGbsList");
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2dicy1vcGVuL3NyYy9yZWRpcy9jb25maWcudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvaW5kZXgudHMiLCIuLi9nYnMtb3Blbi9zcmMvcmVkaXMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbInoiXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLGVBQWUsRUFBRSxPQUFPO0FBQUEsRUFDbkMsWUFBWSxFQUFFLE9BQU87QUFBQSxFQUNyQixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQ3ZCLENBQUM7QUFFTSxJQUFNLFdBQVcsYUFBYSxNQUFNLFFBQVEsR0FBRzs7O0FDUnRELE9BQU8sV0FBVzs7O0FDRGxCLFNBQVMsS0FBQUEsVUFBUztBQUtYLElBQU0sb0JBQW9CQSxHQUFFLE9BQU87QUFBQSxFQUN4QyxHQUFHQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUdBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBR0EsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQ3pCLENBQUM7QUFrQk0sU0FBUyxtQkFBbUIsT0FBdUM7QUFDeEUsU0FBTztBQUFBLElBQ0wsR0FBRyxNQUFNO0FBQUEsSUFDVCxJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVixJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVixHQUFHLE1BQU07QUFBQSxJQUNULEdBQUcsTUFBTTtBQUFBLElBQ1QsSUFBSSxNQUFNO0FBQUEsSUFDVixHQUFHLE1BQU07QUFBQSxFQUNYO0FBQ0Y7QUFFTyxTQUFTLHVCQUF1QixNQUFzQztBQUMzRSxTQUFPO0FBQUEsSUFDTCxNQUFNLEtBQUs7QUFBQSxJQUNYLGFBQWEsS0FBSztBQUFBLElBQ2xCLFlBQVksS0FBSztBQUFBLElBQ2pCLFNBQVMsS0FBSztBQUFBLElBQ2QsVUFBVSxLQUFLO0FBQUEsSUFDZixXQUFXLEtBQUs7QUFBQSxJQUNoQixPQUFPLEtBQUs7QUFBQSxJQUNaLFVBQVUsS0FBSztBQUFBLElBQ2YsTUFBTSxLQUFLO0FBQUEsSUFDWCxTQUFTLEtBQUs7QUFBQSxJQUNkLGNBQWMsS0FBSztBQUFBLEVBQ3JCO0FBQ0Y7QUFLTyxJQUFNLGlCQUFpQkEsR0FBRSxPQUFPO0FBQUEsRUFDckMsR0FBR0EsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQUEsRUFDeEIsSUFBSUEsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQUEsRUFDeEIsR0FBR0EsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUdBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUdBLEdBQUUsT0FBTyxFQUFFLFNBQVM7QUFBQTtBQUN6QixDQUFDOzs7QUQzRUQsT0FBTyxVQUFVO0FBRVYsSUFBTSxXQUFXO0FBQUEsRUFDdEIsTUFBTSxTQUFTO0FBQUEsRUFDZixVQUFVLFNBQVM7QUFBQSxFQUNuQixNQUFNLE9BQU8sU0FBUyxTQUFTLFVBQVU7QUFDM0M7QUFTTyxTQUFTLGVBQWUsU0FBUyxnQkFBZ0I7QUFDdEQsUUFBTSxXQUFXLEtBQWtCO0FBQ25DLFFBQU0sV0FBVyxJQUFJLE1BQU0sUUFBUTtBQUNuQyxXQUFTLFVBQVUsTUFBTTtBQUN6QixXQUFTLEdBQUcsV0FBVyxDQUFDLElBQUksU0FBUztBQUNuQyxRQUFJO0FBQ0YsWUFBTSxPQUFPLGtCQUFrQixNQUFNLEtBQUssTUFBTSxJQUFJLENBQUM7QUFFckQsZUFBUyxLQUFLLFNBQVMsSUFBSTtBQUFBLElBQzdCLFFBQUU7QUFDQSxVQUFJLFNBQVMsaUJBQWlCO0FBQzVCLGlCQUFTLEtBQUssZUFBZTtBQUFBLE1BQy9CO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNELFNBQU87QUFDVDtBQVNPLFNBQVMscUJBQXFCLFNBQVMsa0JBQWtCO0FBQzlELFFBQU0sV0FBVyxLQUF3QjtBQUN6QyxRQUFNLFdBQVcsSUFBSSxNQUFNLFFBQVE7QUFDbkMsV0FBUyxVQUFVLE1BQU07QUFDekIsV0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLFNBQVM7QUFDbkMsUUFBSTtBQUNGLFlBQU0sT0FBTyxlQUFlLE1BQU0sS0FBSyxNQUFNLElBQUksQ0FBQztBQUNsRCxlQUFTLEtBQUssU0FBUyxJQUFJO0FBQUEsSUFDN0IsUUFBRTtBQUNBLFVBQUksU0FBUyxpQkFBaUI7QUFDNUIsaUJBQVMsS0FBSyxlQUFlO0FBQUEsTUFDL0I7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0QsU0FBTztBQUNUO0FBS0EsSUFBTSxXQUFXLElBQUksTUFBTSxRQUFRO0FBSzVCLFNBQVMsaUJBQWlCLE9BQXFCLFNBQVMsZ0JBQWdCO0FBQzdFLFFBQU0sT0FBTyxtQkFBbUIsS0FBSztBQUNyQyxRQUFNLE9BQU8sS0FBSyxVQUFVLElBQUk7QUFDaEMsV0FBUyxRQUFRLFFBQVEsSUFBSTtBQUMvQjtBQUtPLFNBQVMsY0FBYyxPQUFzQixTQUFTLGtCQUFrQjtBQUM3RSxRQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUs7QUFDakMsV0FBUyxRQUFRLFFBQVEsSUFBSTtBQUMvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xyXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHpSZWRpc0NvbmZpZyA9IHoub2JqZWN0KHtcclxuICBSRURJU19IT1NUOiB6LnN0cmluZygpLFxyXG4gIFJFRElTX1BPUlQ6IHouc3RyaW5nKCksXHJcbiAgUkVESVNfUEFTUzogei5zdHJpbmcoKSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgcmVkaXNFbnYgPSB6UmVkaXNDb25maWcucGFyc2UocHJvY2Vzcy5lbnYpO1xyXG4iLCJpbXBvcnQgeyByZWRpc0VudiB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IFJhd1JhaWRUd2VldCB9IGZyb20gJ0AvdHdlZXQvcmVjZWl2ZXInO1xuaW1wb3J0IFJlZGlzIGZyb20gJ2lvcmVkaXMnO1xuaW1wb3J0IHtcbiAgbWluaWZ5UmF3UmFpZFR3ZWV0LFxuICBSYWlkVHdlZXRNaW5pLFxuICBSYXdSYWlkVHdlZXRNaW5pLFxuICB6UmFpZFR3ZWV0TWluaSxcbiAgelJhd1JhaWRUd2VldE1pbmksXG59IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCBtaXR0IGZyb20gJ21pdHQnO1xuXG5leHBvcnQgY29uc3QgcmVkaXNPcHMgPSB7XG4gIGhvc3Q6IHJlZGlzRW52LlJFRElTX0hPU1QsXG4gIHBhc3N3b3JkOiByZWRpc0Vudi5SRURJU19QQVNTLFxuICBwb3J0OiBOdW1iZXIucGFyc2VJbnQocmVkaXNFbnYuUkVESVNfUE9SVCksXG59O1xuXG50eXBlIFJhd0NoRXZlbnRzID0ge1xuICB0d2VldDogUmF3UmFpZFR3ZWV0TWluaTtcbiAgdXBkYXRlR2JzTGlzdDogdm9pZDtcbn07XG4vKipcbiAqIOeUn+OBruODhOOCpOODvOODiOWPl+S/oeapn1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmF3Q2hDbGllbnQoY2hOYW1lID0gJ2dicy1vcGVuLXJhdycpIHtcbiAgY29uc3QgcmVjZWl2ZXIgPSBtaXR0PFJhd0NoRXZlbnRzPigpO1xuICBjb25zdCBzdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG4gIHN1YlJlZGlzLnN1YnNjcmliZShjaE5hbWUpO1xuICBzdWJSZWRpcy5vbignbWVzc2FnZScsIChjaCwganNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5pID0gelJhd1JhaWRUd2VldE1pbmkucGFyc2UoSlNPTi5wYXJzZShqc29uKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpIC0gbWluaS50LCBtaW5pLmJpLCBgTHYuJHttaW5pLmx2fWAsIG1pbmkuZW4pO1xuICAgICAgcmVjZWl2ZXIuZW1pdCgndHdlZXQnLCBtaW5pKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGlmIChqc29uID09PSAndXBkYXRlR2JzTGlzdCcpIHtcbiAgICAgICAgcmVjZWl2ZXIuZW1pdCgndXBkYXRlR2JzTGlzdCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZWNlaXZlcjtcbn1cblxudHlwZSBSYWlkVHdlZXRDaEV2ZW50cyA9IHtcbiAgdHdlZXQ6IFJhaWRUd2VldE1pbmk7XG4gIHVwZGF0ZUdic0xpc3Q6IHZvaWQ7XG59O1xuLyoqXG4gKiDlrozmiJDmuIjjgb/jga7jg4TjgqTjg7zjg4jlj5fkv6HmqZ9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhaWRUd2VldENoQ2xpZW50KGNoTmFtZSA9ICdnYnMtb3Blbi10d2VldCcpIHtcbiAgY29uc3QgcmVjZWl2ZXIgPSBtaXR0PFJhaWRUd2VldENoRXZlbnRzPigpO1xuICBjb25zdCBzdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG4gIHN1YlJlZGlzLnN1YnNjcmliZShjaE5hbWUpO1xuICBzdWJSZWRpcy5vbignbWVzc2FnZScsIChjaCwganNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5pID0gelJhaWRUd2VldE1pbmkucGFyc2UoSlNPTi5wYXJzZShqc29uKSk7XG4gICAgICByZWNlaXZlci5lbWl0KCd0d2VldCcsIG1pbmkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgaWYgKGpzb24gPT09ICd1cGRhdGVHYnNMaXN0Jykge1xuICAgICAgICByZWNlaXZlci5lbWl0KCd1cGRhdGVHYnNMaXN0Jyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlY2VpdmVyO1xufVxuXG4vKipcbiAqIOmAgeS/oeeUqFJlZGlz44Kv44Op44Kk44Ki44Oz44OIXG4gKi9cbmNvbnN0IHB1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcblxuLyoqXG4gKiDnlJ/jga7jg4TjgqTjg7zjg4jjg4fjg7zjgr/jgpLpgIHkv6FcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCwgY2hOYW1lID0gJ2dicy1vcGVuLXJhdycpIHtcbiAgY29uc3QgbWluaSA9IG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldCk7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShtaW5pKTtcbiAgcHViUmVkaXMucHVibGlzaChjaE5hbWUsIGpzb24pO1xufVxuXG4vKipcbiAqIOWKoOW3pea4iOOBv+OBruODhOOCpOODvOODiOODh+ODvOOCv+OCkumAgeS/oVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZFJhaWRUd2VldCh0d2VldDogUmFpZFR3ZWV0TWluaSwgY2hOYW1lID0gJ2dicy1vcGVuLXR3ZWV0Jykge1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodHdlZXQpO1xuICBwdWJSZWRpcy5wdWJsaXNoKGNoTmFtZSwganNvbik7XG59XG4iLCJpbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFJlZGlz6YCB5L+h55So44Gu5paH5a2X5pWw44KS5oqR44GI44GfUmFpZFR3ZWV0XG4gKi9cbmV4cG9ydCBjb25zdCB6UmF3UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgZW46IHouc3RyaW5nKCksIC8vIGVuZW15X25hbWVcbiAgdWk6IHouc3RyaW5nKCksIC8vIHVzZXJfaWRcbiAgdGk6IHouc3RyaW5nKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGV0OiB6Lm51bWJlcigpLCAvLyBlbGFwc2VkX3RpbWVcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiBlbjogZW5lbXlfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBsdjogbGV2ZWxcXFxuICogbDogbGFuZ3VhZ2VcXFxuICogdDogdGltZVxcXG4gKiBldDogZWxhcHNlZF90aW1lXFxcbiAqIGM6IGNvbW1lbnRcbiAqL1xuZXhwb3J0IHR5cGUgUmF3UmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYXdSYWlkVHdlZXRNaW5pPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldDogUmF3UmFpZFR3ZWV0KTogUmF3UmFpZFR3ZWV0TWluaSB7XG4gIHJldHVybiB7XG4gICAgbjogdHdlZXQubmFtZSxcbiAgICBzbjogdHdlZXQuc2NyZWVuX25hbWUsXG4gICAgZW46IHR3ZWV0LmVuZW15X25hbWUsXG4gICAgdWk6IHR3ZWV0LnVzZXJfaWQsXG4gICAgdGk6IHR3ZWV0LnR3ZWV0X2lkLFxuICAgIGJpOiB0d2VldC5iYXR0bGVfaWQsXG4gICAgbHY6IHR3ZWV0LmxldmVsLFxuICAgIGw6IHR3ZWV0Lmxhbmd1YWdlLFxuICAgIHQ6IHR3ZWV0LnRpbWUsXG4gICAgZXQ6IHR3ZWV0LmVsYXBzZWRfdGltZSxcbiAgICBjOiB0d2VldC5jb21tZW50LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmF3UmFpZFR3ZWV0TWluaShtaW5pOiBSYXdSYWlkVHdlZXRNaW5pKTogUmF3UmFpZFR3ZWV0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBtaW5pLm4sXG4gICAgc2NyZWVuX25hbWU6IG1pbmkuc24sXG4gICAgZW5lbXlfbmFtZTogbWluaS5lbixcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxuICAgIHR3ZWV0X2lkOiBtaW5pLnRpLFxuICAgIGJhdHRsZV9pZDogbWluaS5iaSxcbiAgICBsZXZlbDogbWluaS5sdixcbiAgICBsYW5ndWFnZTogbWluaS5sLFxuICAgIHRpbWU6IG1pbmkudCxcbiAgICBjb21tZW50OiBtaW5pLmMsXG4gICAgZWxhcHNlZF90aW1lOiBtaW5pLmV0LFxuICB9O1xufVxuXG4vKipcbiAqIOWun+mam+OBq+mFjeS/oeOBleOCjOOCi+ODhOOCpOODvOODiOODh+ODvOOCv1xuICovXG5leHBvcnQgY29uc3QgelJhaWRUd2VldE1pbmkgPSB6Lm9iamVjdCh7XG4gIG46IHouc3RyaW5nKCksIC8vIG5hbWVcbiAgc246IHouc3RyaW5nKCksIC8vIHNjcmVlbl9uYW1lXG4gIHVpOiB6LnN0cmluZygpLCAvLyB1c2VyX2lkXG4gIHRpOiB6LnN0cmluZygpLCAvLyB0d2VldF9pZFxuICBiaTogei5zdHJpbmcoKSwgLy8gYmF0dGxlX2lkXG4gIGVpOiB6Lm51bWJlcigpLCAvLyBlbmVteV9pZCgtMeOBr+ODquOCueODiOWklilcbiAgbHY6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gbGV2ZWxcbiAgZW46IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gZW5lbXlfbmFtZVxuICBsOiB6LmVudW0oWydlbicsICdqYSddKSwgLy8gbGFuZ3VhZ2VcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxuICBldDogei5udW1iZXIoKSwgLy8gZWxhcHNlZF90aW1lXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKOWIneWbnuaKleeov+aZgumWkylcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcblxuLyoqXG4gKiDlr77lv5xcXFxuICogbjogbmFtZVxcXG4gKiBzbjogc2NyZWVfbmFtZVxcXG4gKiB1aTogdXNlcl9pZFxcXG4gKiB0aTogdHdlZXRfaWRcXFxuICogYmk6IGJhdHRsZV9pZFxcXG4gKiBlaTogZW5lbXlfaWQoLTHjga/jg6rjgrnjg4jlpJYpXFxcbiAqIGw6IGxhbmd1YWdlXFxcbiAqIHQ6IHRpbWVcXFxuICogZnQ6IGZpcnN0X3RpbWUo5Yid5Zue5oqV56i/5pmC6ZaTXFxcbiAqIGM6IGNvbW1lbnRcXFxuICog44Oq44K544OI5aSW44Gu44G/6L+95YqgXFxcbiAqIGVuPzogZW5lbXlfbmFtZVxcXG4gKiBsdj86IGxldmVsXG4gKi9cbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XG4iXX0=