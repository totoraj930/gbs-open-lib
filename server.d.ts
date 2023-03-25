import * as mitt from 'mitt';
import { z } from 'zod';

type RawRaidTweet = {
    name: string;
    screen_name: string;
    user_id: string;
    tweet_id: string;
    battle_id: string;
    comment?: string;
    enemy_name: string;
    level: string;
    language: 'ja' | 'en';
    time: number;
    elapsed_time: number;
};

/**
 * Redis送信用の文字数を抑えたRaidTweet
 */
declare const zRawRaidTweetMini: z.ZodObject<{
    n: z.ZodString;
    sn: z.ZodString;
    en: z.ZodString;
    ui: z.ZodString;
    ti: z.ZodString;
    bi: z.ZodString;
    lv: z.ZodString;
    l: z.ZodEnum<["en", "ja"]>;
    t: z.ZodNumber;
    et: z.ZodNumber;
    c: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    en: string;
    n: string;
    sn: string;
    ui: string;
    ti: string;
    bi: string;
    lv: string;
    l: "ja" | "en";
    t: number;
    et: number;
    c?: string | undefined;
}, {
    en: string;
    n: string;
    sn: string;
    ui: string;
    ti: string;
    bi: string;
    lv: string;
    l: "ja" | "en";
    t: number;
    et: number;
    c?: string | undefined;
}>;
/**
 * 対応\
 * n: name\
 * sn: scree_name\
 * en: enemy_name\
 * ui: user_id\
 * ti: tweet_id\
 * bi: battle_id\
 * lv: level\
 * l: language\
 * t: time\
 * et: elapsed_time\
 * c: comment
 */
type RawRaidTweetMini = z.infer<typeof zRawRaidTweetMini>;
declare function minifyRawRaidTweet(tweet: RawRaidTweet): RawRaidTweetMini;
declare function unpackRawRaidTweetMini(mini: RawRaidTweetMini): RawRaidTweet;
/**
 * 実際に配信されるツイートデータ
 */
declare const zRaidTweetMini: z.ZodObject<{
    n: z.ZodString;
    sn: z.ZodString;
    ui: z.ZodString;
    ti: z.ZodString;
    bi: z.ZodString;
    ei: z.ZodNumber;
    lv: z.ZodOptional<z.ZodString>;
    en: z.ZodOptional<z.ZodString>;
    l: z.ZodEnum<["en", "ja"]>;
    t: z.ZodNumber;
    et: z.ZodNumber;
    ft: z.ZodNumber;
    c: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    n: string;
    sn: string;
    ui: string;
    ti: string;
    bi: string;
    l: "ja" | "en";
    t: number;
    et: number;
    ei: number;
    ft: number;
    lv?: string | undefined;
    en?: string | undefined;
    c?: string | undefined;
}, {
    n: string;
    sn: string;
    ui: string;
    ti: string;
    bi: string;
    l: "ja" | "en";
    t: number;
    et: number;
    ei: number;
    ft: number;
    lv?: string | undefined;
    en?: string | undefined;
    c?: string | undefined;
}>;
/**
 * 対応\
 * n: name\
 * sn: scree_name\
 * ui: user_id\
 * ti: tweet_id\
 * bi: battle_id\
 * ei: enemy_id(-1はリスト外)\
 * l: language\
 * t: time\
 * ft: first_time(初回投稿時間\
 * c: comment\
 * リスト外のみ追加\
 * en?: enemy_name\
 * lv?: level
 */
type RaidTweetMini = z.infer<typeof zRaidTweetMini>;

declare const redisOps: {
    host: string;
    password: string;
    port: number;
};
type RawChEvents = {
    tweet: RawRaidTweetMini;
};
/**
 * 生のツイート受信機
 */
declare function getRawChClient(): mitt.Emitter<RawChEvents>;
type RaidTweetChEvents = {
    tweet: RaidTweetMini;
};
/**
 * 完成済みのツイート受信機
 */
declare function getRaidTweetChClient(): mitt.Emitter<RaidTweetChEvents>;
/**
 * 生のツイートデータを送信
 */
declare function sendRawRaidTweet(tweet: RawRaidTweet): void;
/**
 * 加工済みのツイートデータを送信
 */
declare function sendRaidTweet(tweet: RaidTweetMini): void;

declare const zConfig: z.ZodObject<{
    OAUTH_CALLBACK: z.ZodString;
    CONSUMER_KEY: z.ZodString;
    CONSUMER_SECRET: z.ZodString;
    PORT: z.ZodString;
    CACHE_PORT: z.ZodString;
    STREAM_PORT: z.ZodString;
    GBS_LIST: z.ZodString;
    REDIS_HOST: z.ZodString;
    REDIS_PORT: z.ZodString;
    REDIS_PASS: z.ZodString;
}, "strip", z.ZodTypeAny, {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
}, {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
}>;
declare const env: {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
};

export { RaidTweetMini, RawRaidTweet, RawRaidTweetMini, env, getRaidTweetChClient, getRawChClient, minifyRawRaidTweet, redisOps, sendRaidTweet, sendRawRaidTweet, unpackRawRaidTweetMini, zConfig, zRaidTweetMini, zRawRaidTweetMini };
