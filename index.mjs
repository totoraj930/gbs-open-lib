// src/redis/schema.ts
import { z } from "zod";
var zRawRaidTweetMini = z.object({
  n: z.string(),
  // name
  sn: z.string(),
  // screen_name
  en: z.string(),
  // enemy_name
  ui: z.string(),
  // user_id
  ti: z.string(),
  // tweet_id
  bi: z.string(),
  // battle_id
  lv: z.string(),
  // level
  l: z.enum(["en", "ja"]),
  // language
  t: z.number(),
  // time
  et: z.number(),
  // elapsed_time
  c: z.string().optional()
  // comment
});
var zRaidTweetMini = z.object({
  n: z.string(),
  // name
  sn: z.string(),
  // screen_name
  ui: z.string(),
  // user_id
  ti: z.string(),
  // tweet_id
  bi: z.string(),
  // battle_id
  ei: z.number(),
  // enemy_id(-1はリスト外)
  lv: z.string().optional(),
  // level
  en: z.string().optional(),
  // enemy_name
  l: z.enum(["en", "ja"]),
  // language
  t: z.number(),
  // time
  et: z.number(),
  // elapsed_time
  ft: z.number(),
  // first time(初回投稿時間)
  c: z.string().optional()
  // comment
});

// src/utils/schema.ts
import { z as z2 } from "zod";
var EnemyElement = {
  None: 0,
  Fire: 1,
  Water: 2,
  Earch: 3,
  Wind: 4,
  Light: 5,
  Dark: 6
};
var zGbsListItem = z2.object({
  id: z2.number(),
  attr: z2.nativeEnum(EnemyElement),
  ja: z2.string(),
  en: z2.string(),
  image: z2.string().nullable(),
  level: z2.string(),
  tags: z2.array(z2.string())
});
var zGbsList = z2.array(zGbsListItem);
function getEnemyData(enemyId, list) {
  return list.find((enemy) => enemy.id === enemyId) ?? null;
}

// src/utils/index.ts
var utils_default = {};
export {
  EnemyElement,
  utils_default as default,
  getEnemyData,
  zGbsList,
  zGbsListItem,
  zRaidTweetMini
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZ2JzLW9wZW4vc3JjL3JlZGlzL3NjaGVtYS50cyIsICIuLi9nYnMtb3Blbi9zcmMvdXRpbHMvc2NoZW1hLnRzIiwgIi4uL2dicy1vcGVuL3NyYy91dGlscy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUmF3UmFpZFR3ZWV0IH0gZnJvbSAnQC90d2VldC9yZWNlaXZlcic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuLyoqXG4gKiBSZWRpc1x1OTAwMVx1NEZFMVx1NzUyOFx1MzA2RVx1NjU4N1x1NUI1N1x1NjU3MFx1MzA5Mlx1NjI5MVx1MzA0OFx1MzA1RlJhaWRUd2VldFxuICovXG5leHBvcnQgY29uc3QgelJhd1JhaWRUd2VldE1pbmkgPSB6Lm9iamVjdCh7XG4gIG46IHouc3RyaW5nKCksIC8vIG5hbWVcbiAgc246IHouc3RyaW5nKCksIC8vIHNjcmVlbl9uYW1lXG4gIGVuOiB6LnN0cmluZygpLCAvLyBlbmVteV9uYW1lXG4gIHVpOiB6LnN0cmluZygpLCAvLyB1c2VyX2lkXG4gIHRpOiB6LnN0cmluZygpLCAvLyB0d2VldF9pZFxuICBiaTogei5zdHJpbmcoKSwgLy8gYmF0dGxlX2lkXG4gIGx2OiB6LnN0cmluZygpLCAvLyBsZXZlbFxuICBsOiB6LmVudW0oWydlbicsICdqYSddKSwgLy8gbGFuZ3VhZ2VcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxuICBldDogei5udW1iZXIoKSwgLy8gZWxhcHNlZF90aW1lXG4gIGM6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gY29tbWVudFxufSk7XG5cbi8qKlxuICogXHU1QkZFXHU1RkRDXFxcbiAqIG46IG5hbWVcXFxuICogc246IHNjcmVlX25hbWVcXFxuICogZW46IGVuZW15X25hbWVcXFxuICogdWk6IHVzZXJfaWRcXFxuICogdGk6IHR3ZWV0X2lkXFxcbiAqIGJpOiBiYXR0bGVfaWRcXFxuICogbHY6IGxldmVsXFxcbiAqIGw6IGxhbmd1YWdlXFxcbiAqIHQ6IHRpbWVcXFxuICogZXQ6IGVsYXBzZWRfdGltZVxcXG4gKiBjOiBjb21tZW50XG4gKi9cbmV4cG9ydCB0eXBlIFJhd1JhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmF3UmFpZFR3ZWV0TWluaT47XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW5pZnlSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCk6IFJhd1JhaWRUd2VldE1pbmkge1xuICByZXR1cm4ge1xuICAgIG46IHR3ZWV0Lm5hbWUsXG4gICAgc246IHR3ZWV0LnNjcmVlbl9uYW1lLFxuICAgIGVuOiB0d2VldC5lbmVteV9uYW1lLFxuICAgIHVpOiB0d2VldC51c2VyX2lkLFxuICAgIHRpOiB0d2VldC50d2VldF9pZCxcbiAgICBiaTogdHdlZXQuYmF0dGxlX2lkLFxuICAgIGx2OiB0d2VldC5sZXZlbCxcbiAgICBsOiB0d2VldC5sYW5ndWFnZSxcbiAgICB0OiB0d2VldC50aW1lLFxuICAgIGV0OiB0d2VldC5lbGFwc2VkX3RpbWUsXG4gICAgYzogdHdlZXQuY29tbWVudCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucGFja1Jhd1JhaWRUd2VldE1pbmkobWluaTogUmF3UmFpZFR3ZWV0TWluaSk6IFJhd1JhaWRUd2VldCB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogbWluaS5uLFxuICAgIHNjcmVlbl9uYW1lOiBtaW5pLnNuLFxuICAgIGVuZW15X25hbWU6IG1pbmkuZW4sXG4gICAgdXNlcl9pZDogbWluaS51aSxcbiAgICB0d2VldF9pZDogbWluaS50aSxcbiAgICBiYXR0bGVfaWQ6IG1pbmkuYmksXG4gICAgbGV2ZWw6IG1pbmkubHYsXG4gICAgbGFuZ3VhZ2U6IG1pbmkubCxcbiAgICB0aW1lOiBtaW5pLnQsXG4gICAgY29tbWVudDogbWluaS5jLFxuICAgIGVsYXBzZWRfdGltZTogbWluaS5ldCxcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTVCOUZcdTk2OUJcdTMwNkJcdTkxNERcdTRGRTFcdTMwNTVcdTMwOENcdTMwOEJcdTMwQzRcdTMwQTRcdTMwRkNcdTMwQzhcdTMwQzdcdTMwRkNcdTMwQkZcbiAqL1xuZXhwb3J0IGNvbnN0IHpSYWlkVHdlZXRNaW5pID0gei5vYmplY3Qoe1xuICBuOiB6LnN0cmluZygpLCAvLyBuYW1lXG4gIHNuOiB6LnN0cmluZygpLCAvLyBzY3JlZW5fbmFtZVxuICB1aTogei5zdHJpbmcoKSwgLy8gdXNlcl9pZFxuICB0aTogei5zdHJpbmcoKSwgLy8gdHdlZXRfaWRcbiAgYmk6IHouc3RyaW5nKCksIC8vIGJhdHRsZV9pZFxuICBlaTogei5udW1iZXIoKSwgLy8gZW5lbXlfaWQoLTFcdTMwNkZcdTMwRUFcdTMwQjlcdTMwQzhcdTU5MTYpXG4gIGx2OiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGxldmVsXG4gIGVuOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGVuZW15X25hbWVcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXG4gIHQ6IHoubnVtYmVyKCksIC8vIHRpbWVcbiAgZXQ6IHoubnVtYmVyKCksIC8vIGVsYXBzZWRfdGltZVxuICBmdDogei5udW1iZXIoKSwgLy8gZmlyc3QgdGltZShcdTUyMURcdTU2REVcdTYyOTVcdTdBM0ZcdTY2NDJcdTk1OTMpXG4gIGM6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gY29tbWVudFxufSk7XG5cbi8qKlxuICogXHU1QkZFXHU1RkRDXFxcbiAqIG46IG5hbWVcXFxuICogc246IHNjcmVlX25hbWVcXFxuICogdWk6IHVzZXJfaWRcXFxuICogdGk6IHR3ZWV0X2lkXFxcbiAqIGJpOiBiYXR0bGVfaWRcXFxuICogZWk6IGVuZW15X2lkKC0xXHUzMDZGXHUzMEVBXHUzMEI5XHUzMEM4XHU1OTE2KVxcXG4gKiBsOiBsYW5ndWFnZVxcXG4gKiB0OiB0aW1lXFxcbiAqIGZ0OiBmaXJzdF90aW1lKFx1NTIxRFx1NTZERVx1NjI5NVx1N0EzRlx1NjY0Mlx1OTU5M1xcXG4gKiBjOiBjb21tZW50XFxcbiAqIFx1MzBFQVx1MzBCOVx1MzBDOFx1NTkxNlx1MzA2RVx1MzA3Rlx1OEZGRFx1NTJBMFxcXG4gKiBlbj86IGVuZW15X25hbWVcXFxuICogbHY/OiBsZXZlbFxuICovXG5leHBvcnQgdHlwZSBSYWlkVHdlZXRNaW5pID0gei5pbmZlcjx0eXBlb2YgelJhaWRUd2VldE1pbmk+O1xuIiwgImltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVuZW15RWxlbWVudCA9IHtcclxuICBOb25lOiAwLFxyXG4gIEZpcmU6IDEsXHJcbiAgV2F0ZXI6IDIsXHJcbiAgRWFyY2g6IDMsXHJcbiAgV2luZDogNCxcclxuICBMaWdodDogNSxcclxuICBEYXJrOiA2LFxyXG59IGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpHYnNMaXN0SXRlbSA9IHoub2JqZWN0KHtcclxuICBpZDogei5udW1iZXIoKSxcclxuICBhdHRyOiB6Lm5hdGl2ZUVudW0oRW5lbXlFbGVtZW50KSxcclxuICBqYTogei5zdHJpbmcoKSxcclxuICBlbjogei5zdHJpbmcoKSxcclxuICBpbWFnZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxyXG4gIGxldmVsOiB6LnN0cmluZygpLFxyXG4gIHRhZ3M6IHouYXJyYXkoei5zdHJpbmcoKSksXHJcbn0pO1xyXG5leHBvcnQgdHlwZSBHYnNMaXN0SXRlbSA9IHouaW5mZXI8dHlwZW9mIHpHYnNMaXN0SXRlbT47XHJcblxyXG5leHBvcnQgY29uc3Qgekdic0xpc3QgPSB6LmFycmF5KHpHYnNMaXN0SXRlbSk7XHJcbmV4cG9ydCB0eXBlIEdic0xpc3QgPSB6LmluZmVyPHR5cGVvZiB6R2JzTGlzdD47XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW5lbXlEYXRhKGVuZW15SWQ6IG51bWJlciwgbGlzdDogR2JzTGlzdCkge1xyXG4gIHJldHVybiBsaXN0LmZpbmQoKGVuZW15KSA9PiBlbmVteS5pZCA9PT0gZW5lbXlJZCkgPz8gbnVsbDtcclxufVxyXG4iLCAiLy8gXHU1OTE2XHU5MEU4XHU1NDExXHUzMDUxXHUzMDZFZXhwb3J0KFx1NEUzQlx1MzA2Qlx1NTc4Qlx1MzA2OFx1MzBEMVx1MzBGQ1x1MzBCNVx1MzBGQylcblxuZXhwb3J0IHsgUmFpZFR3ZWV0TWluaSB9IGZyb20gJ0AvcmVkaXMvc2NoZW1hJztcbmV4cG9ydCB7IHpSYWlkVHdlZXRNaW5pIH0gZnJvbSAnQC9yZWRpcy9zY2hlbWEnO1xuZXhwb3J0IHtcbiAgekdic0xpc3QsXG4gIHpHYnNMaXN0SXRlbSxcbiAgR2JzTGlzdCxcbiAgR2JzTGlzdEl0ZW0sXG4gIEVuZW15RWxlbWVudCxcbiAgZ2V0RW5lbXlEYXRhLFxufSBmcm9tICcuL3NjaGVtYSc7XG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsU0FBUztBQUtYLElBQU0sb0JBQW9CLEVBQUUsT0FBTztBQUFBLEVBQ3hDLEdBQUcsRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUcsRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQ3pCLENBQUM7QUFxRE0sSUFBTSxpQkFBaUIsRUFBRSxPQUFPO0FBQUEsRUFDckMsR0FBRyxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTO0FBQUE7QUFBQSxFQUN4QixJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVM7QUFBQTtBQUFBLEVBQ3hCLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBQ3RCLEdBQUcsRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUksRUFBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQ3pCLENBQUM7OztBQ3JGRCxTQUFTLEtBQUFBLFVBQVM7QUFFWCxJQUFNLGVBQWU7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxNQUFNO0FBQ1I7QUFFTyxJQUFNLGVBQWVBLEdBQUUsT0FBTztBQUFBLEVBQ25DLElBQUlBLEdBQUUsT0FBTztBQUFBLEVBQ2IsTUFBTUEsR0FBRSxXQUFXLFlBQVk7QUFBQSxFQUMvQixJQUFJQSxHQUFFLE9BQU87QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBLEVBQ2IsT0FBT0EsR0FBRSxPQUFPLEVBQUUsU0FBUztBQUFBLEVBQzNCLE9BQU9BLEdBQUUsT0FBTztBQUFBLEVBQ2hCLE1BQU1BLEdBQUUsTUFBTUEsR0FBRSxPQUFPLENBQUM7QUFDMUIsQ0FBQztBQUdNLElBQU0sV0FBV0EsR0FBRSxNQUFNLFlBQVk7QUFHckMsU0FBUyxhQUFhLFNBQWlCLE1BQWU7QUFDM0QsU0FBTyxLQUFLLEtBQUssQ0FBQyxVQUFVLE1BQU0sT0FBTyxPQUFPLEtBQUs7QUFDdkQ7OztBQ2ZBLElBQU8sZ0JBQVEsQ0FBQzsiLAogICJuYW1lcyI6IFsieiJdCn0K