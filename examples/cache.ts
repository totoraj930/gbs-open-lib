import axios from 'axios';
import { z } from 'zod';
import { zRaidTweetMini } from '../index'; // index -> gbs-open-lib

const zCacheApiResponse = z.array(
  z.object({
    id: z.number(),
    tweets: z.array(zRaidTweetMini),
  })
);

async function main() {
  const url = 'https://gbs-open.eriri.net/api/cache';
  const { data } = await axios.get(url, {
    params: { q: '55,66' },
  });
  const apiRes = zCacheApiResponse.parse(data);
  console.log(apiRes);
}

main();
