import type { SiteConfig } from "@/config/site";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}

export interface Update {
  slug: string;
  version: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}

export const articles: Article[] = [
  {
    slug: 'erangel-remastered-guide',
    title: 'Mastering Erangel: A Guide to the Remastered Classic',
    summary: 'The classic map of Erangel has been remastered. Discover the new locations, strategies, and secrets to dominate the battlefield.',
    content: `>The iconic Erangel map has received a significant visual and tactical overhaul. Familiar locations now boast new structures, better cover, and enhanced graphical fidelity.

# Key Changes
- **Mylta Power, Quarry, and Prison:** These areas are now more complex, offering new opportunities for ambushes and strategic positioning.
- **Georgopol Crates:** Previously overlooked, this area now offers more verticality.

### Pro-Tips
1.  **Ledge Grab:** Remember to use the new ledge grab mechanic to access rooftops and unexpected vantage points. This can give you a significant advantage in the final circles.
2.  **Weapon Choice:** The M416 remains a versatile choice, but the Beryl M762 now packs an even bigger punch up close. Practice controlling its recoil in the training grounds to unlock its full potential.`,
    author: 'PlayerUnknown',
    date: 'August 15, 2024',
    imageUrl: 'https://cdn.apks.cc/blinko/unnamed.webp',
    imageHint: 'battlefield landscape',
  },
  {
    slug: 'squad-tactics-101',
    title: 'Squad Tactics 101: Communication is Key',
    summary: 'Teamwork makes the dream work. Learn essential communication and positioning strategies to lead your squad to a chicken dinner.',
    content: `Winning in squad mode is less about individual skill and more about coordinated teamwork. The foundation of any successful squad is clear, concise communication.

### Roles & Communication
- **Establish Roles:** Before the match begins: a leader/shot-caller, a sniper/support, and two entry fraggers.
- **Use Markers:** Use the in-game markers religiously. Call out enemy positions using compass bearings ("Enemy at 285"), describe their equipment ("Level 3 helmet"), and state your intentions ("Pushing the blue house").

### Positioning
Avoid bunching up to minimize vulnerability to grenades and sprays. Maintain a perimeter, with each member covering a different angle. This "spread" allows you to gather more information and control a larger area.

> When engaging, focus fire on a single target to down them quickly. A 4v3 advantage is a massive game-changer.`,
    author: 'The Commander',
    date: 'August 10, 2024',
    imageUrl: 'https://cdn.apks.cc/blinko/unnamed.webp',
    imageHint: 'team soldiers',
  },
  {
    slug: 'new-weapon-analysis',
    title: 'Weapon Analysis: The P90 Has Arrived',
    summary: 'The P90 SMG is now available in airdrops. Is it worth chasing? We break down its strengths and weaknesses.',
    content: `The latest addition to the airdrop-exclusive weapon pool is the P90 SMG. Chambered in 5.7mm, this weapon boasts a massive 50-round magazine and an incredibly high rate of fire.

**Strengths:**
- Its main strength is in close-quarters combat. The P90 can shred through opponents before they have a chance to react.
- The large magazine means you can take on multiple enemies without reloading.

**Weaknesses:**
- Significant damage drop-off at medium to long ranges.
- Its unique ammunition type means you can't restock from fallen enemies. You get what's in the crate, and that's it.

***

*Our verdict:* The P90 is a situational monster. If you're playing an aggressive, building-clearing style, it's one of the best weapons in the game. For players who prefer to fight from a distance, it might be better to stick with an AR.`,
    author: 'Gunner',
    date: 'August 5, 2024',
    imageUrl: 'https://cdn.apks.cc/blinko/unnamed.webp',
    imageHint: 'futuristic weapon',
  },
];

export const updates: Update[] = [
    {
        slug: 'version-3-2-0',
        version: '3.2.0',
        title: 'Version 3.2: Mecha Fusion',
        summary: 'The Mecha Fusion update is here! Pilot giant mechs, explore the new Steel Ark, and master the new jetpack mechanics.',
        content: `Version 3.2 introduces the thrilling Mecha Fusion mode. Players can now find and pilot powerful mechs, each with unique abilities. 

- **The Strider:** An agile mech perfect for scouting.
- **The Leviathan:** A heavily armed beast capable of laying down devastating firepower.

A new point of interest, the **Steel Ark**, has been added to Erangel. This massive flying fortress is a high-risk, high-reward drop location packed with top-tier loot.

To help traverse the battlefield, all players are now equipped with a personal jetpack, allowing for short bursts of flight and incredible mobility.

This update also includes various quality-of-life improvements, a new season pass, and a rebalancing of several assault rifles.`,
        date: 'July 28, 2024',
        imageUrl: 'https://cdn.apks.cc/blinko/unnamed.webp',
        imageHint: 'giant robot',
    },
    {
        slug: 'version-3-1-0',
        version: '3.1.0',
        title: 'Version 3.1: Arabian Nights',
        summary: 'Step into a world of magic and mystery with the Arabian Nights update. Discover the new Nimbus Island and ride the flying carpet.',
        content: `The Arabian Nights update brings a touch of magic to the battlegrounds. The new Nimbus Island is a vibrant, treasure-filled location with interactive elements. Ring gongs to summon supplies or search for the magical genie who can grant you a wish for powerful loot.

The **flying carpet** is a new two-person vehicle that allows for silent and swift transportation across the map. It's perfect for stealthy rotations.

This patch also introduced the new **AMR sniper rifle**, capable of one-shotting even a Level 3 helmet, and a host of bug fixes and performance optimizations.`,
        date: 'June 15, 2024',
        imageUrl: 'https://cdn.apks.cc/blinko/unnamed.webp',
        imageHint: 'desert city',
    },
];

export const fallbackSiteConfig: SiteConfig = {
    name: 'PUBG Mobile',
    seo: {
        title: '地铁逃生手游官网 | 下载、更新、攻略 - 官方正版入口',
        description: '欢迎访问PUBG Mobile中心，提供最新游戏下载、更新日志、游戏攻略和玩家社区，支持安卓与iOS系统，一站式掌握刺激战场动态。',
        keywords: ['PUBG Mobile', 'PUBG Mobile 官网', 'PUBG Mobile 下载', '吃鸡手游', '刺激战场', '地铁逃生', '和平精英国际服', 'PUBG Mobile 更新', 'PUBG Mobile 攻略', 'pubgm apk', 'pubgm 安卓下载', 'PUBG Mobile iOS下载'],
        ogImage: 'https://cdn.apks.cc/blinko/1753974441995-1753974441505-share.jpg',
    },
    analytics: {
        baiduVerification: 'codeva-9XyV2k6cAS',
        googleVerification: 'wheyJrkeJteNmtsowo1dyWiAtd18QqJR0VGilx25600',
        qihuVerification: '999219046b1b9e0ef3a7f7c0f481fe20',
        sogouVerification: '2rU7VTaXRK',
        baiduAnalyticsId: 'b2e255a5512aa46a4f692adf9c8bfe00',
    },
    header: {
        logo: {
            url: 'https://cdn.apks.cc/blinko/1753973194134-1753973193794-nav_logo.png',
            alt: 'PUBG Mobile Logo',
        },
    },
    hero: {
        backgroundImage: 'https://cdn.apks.cc/blinko/1753975129551-1753975127906-downloadbj.png',
        title: '史诗级大逃杀巨作-已更新4.1版本',
        description: '超多活动，等你游玩, 在PUBG MOBILE登上颠峰，尽情开火。 PUBG MOBILE是原创的大逃杀手机游戏，也是手机射击游戏巅峰之作。',
    },
    downloads: {
        googlePlay: {
            url: 'https://play.google.com/store/apps/details?id=com.tencent.ig',
            backgroundImage: 'https://cdn.apks.cc/blinko/1753972567787-1753972566208-google_apk_download.png',
            srText: '在 Google Play 下载',
        },
        appStore: {
            url: 'https://apps.apple.com/hk/app/pubg-mobile/id1330123889',
            backgroundImage: 'https://cdn.apks.cc/blinko/1753972022261-1753972021905-app_store.png',
            srText: '在 App Store 下载',
        },
        apk: {
            backgroundImage: 'https://cdn.apks.cc/blinko/1753971933326-1753971932556-apk_download.png',
            line1: 'Android Download',
            line2: '安卓下载',
            dialog: {
                title: '选择下载渠道',
                description: '请选择您偏好的下载方式。',
                panUrl: 'https://www.123pan.com/s/4H3LVv-gUpI',
                officialUrl: 'https://f.gbcass.com/PUBGMOBILE_Global_4.1.0_uawebsite_livik01_84140693A.apk',
            }
        },
    },
    video: {
        id: 'video',
        title: '地铁逃生4.1版本！',
        url: 'https://cdn.apks.cc/blinko/UoqSybS2lrOrQIS4.mp4',
        playerTitle: 'pubgm4.1版本',
        navLabel: '官方频道',
        enabled: true,
    },
    footer: {
        description: '推荐收藏，分享给您的好友吧！这里是您获取《PUBG Mobile》新闻、更新和社区信息的最终目的地。这是一个非官方的粉丝自制网站。',
        copyright: '© {year} PUBG Mobile. 保留所有权利. 游戏内容和材料均为其各自发行商及其许可人的商标和版权。',
        feedback: {
            email: 'apkscc-feedback@foxmail.com',
            buttonText: '反馈建议',
            dialogTitle: '提交您的反馈',
            dialogDescription: '我们非常重视您的意见，请填写以下信息。您的建议将帮助我们改进网站。',
        }
    },
    sections: [
        {
            id: 'community',
            title: '交流广场',
            navLabel: '社区',
            enabled: false,
            items: [],
        },
        {
            id: 'articles',
            title: '最新文章',
            navLabel: '资讯',
            items: [
                {
                    slug: 'pubgm-4.1-apk',
                    title: '地铁逃生更新全新「极地动物城」 活动日历 线路图',
                    summary: '地铁新赛季活动日历',
                    content: `
                    \n\nPUBG MOBILE 4.1版本 极地动物城 活动日历 线路图
                            11月3日 全新荣耀系列套装
                            11月6日 4.1版本上线
                            11月11日 新赛季、C9S27、RPA16
                            11月21日 ? IP联动
                            11月22日 赛博周折扣活动
                            11月27日 全新鎏金套装上线 1
                            12月10日 Creative Vision Awards 2025（2025 创作愿景颁奖典礼）
                            12月12日-14日 冰雪节、Prize Path 上线、PMGC 总决赛
                            12月19日 伙伴更新
                            12月26日 全新鎏金套装上线 2
                            12月31日 烟火盛典（2026）
                    ![image](6ba622a8ee270b96046b33b4da75ef56581766333.jpg@1052w_!web-dynamic.avif "地铁逃生，pubg apk下载")
                    `,
                    author: '猫咪蒲公英',
                    date: '2025年11月6日',
                    imageUrl: 'https://cdn.apks.cc/blinko/6ba622a8ee270b96046b33b4da75ef56581766333.jpg@1052w_!web-dynamic.avif',
                    imageHint: 'apk',
                }
            ]
        },
        {
            id: 'updates',
            title: '版本更新日志',
            navLabel: '更新日志',
            items: [
                {
                    slug: 'version-4-1',
                    version: '4.1',
                    title: '4.1版本',
                    summary: '地铁逃生新赛季，4.1版本',
                    content: `
               # PUBG MOBILE 4.1版本更新公告

**PUBG MOBILE 运营团队**  
2025年11月5日
                    `,
                    date: '2025年9月06日',
                    imageUrl: 'https://cdn.apks.cc/blinko/1920x800_1757173410_0001.jpg',
                    imageHint: 'giant robot',
                },
                
            ]
        }
    ]
};

export const getArticleBySlugFromData = (slug: string) => {
    const allItems = [...articles, ...updates];
    return allItems.find(a => a.slug === slug);
}
