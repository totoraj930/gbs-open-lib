import { z } from 'zod';

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
    ft: z.ZodNumber;
    c: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    n: string;
    sn: string;
    ui: string;
    ti: string;
    bi: string;
    l: "en" | "ja";
    t: number;
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
    l: "en" | "ja";
    t: number;
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

declare const EnemyElement: {
    readonly None: 0;
    readonly Fire: 1;
    readonly Water: 2;
    readonly Earch: 3;
    readonly Wind: 4;
    readonly Light: 5;
    readonly Dark: 6;
};
declare const zGbsListItem: z.ZodObject<{
    id: z.ZodNumber;
    attr: z.ZodNativeEnum<{
        readonly None: 0;
        readonly Fire: 1;
        readonly Water: 2;
        readonly Earch: 3;
        readonly Wind: 4;
        readonly Light: 5;
        readonly Dark: 6;
    }>;
    ja: z.ZodString;
    en: z.ZodString;
    image: z.ZodNullable<z.ZodString>;
    level: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    en: string;
    ja: string;
    id: number;
    attr: 0 | 2 | 1 | 3 | 4 | 5 | 6;
    image: string | null;
    level: string;
    tags: string[];
}, {
    en: string;
    ja: string;
    id: number;
    attr: 0 | 2 | 1 | 3 | 4 | 5 | 6;
    image: string | null;
    level: string;
    tags: string[];
}>;
type GbsListItem = z.infer<typeof zGbsListItem>;
declare const zGbsList: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    attr: z.ZodNativeEnum<{
        readonly None: 0;
        readonly Fire: 1;
        readonly Water: 2;
        readonly Earch: 3;
        readonly Wind: 4;
        readonly Light: 5;
        readonly Dark: 6;
    }>;
    ja: z.ZodString;
    en: z.ZodString;
    image: z.ZodNullable<z.ZodString>;
    level: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    en: string;
    ja: string;
    id: number;
    attr: 0 | 2 | 1 | 3 | 4 | 5 | 6;
    image: string | null;
    level: string;
    tags: string[];
}, {
    en: string;
    ja: string;
    id: number;
    attr: 0 | 2 | 1 | 3 | 4 | 5 | 6;
    image: string | null;
    level: string;
    tags: string[];
}>, "many">;
type GbsList = z.infer<typeof zGbsList>;
declare function getEnemyData(enemyId: number, list: GbsList): {
    en: string;
    ja: string;
    id: number;
    attr: 0 | 2 | 1 | 3 | 4 | 5 | 6;
    image: string | null;
    level: string;
    tags: string[];
} | null;

declare const _default: {};

export { EnemyElement, GbsList, GbsListItem, RaidTweetMini, _default as default, getEnemyData, zGbsList, zGbsListItem, zRaidTweetMini };
