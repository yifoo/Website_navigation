/*
 Navicat Premium Data Transfer

 Source Server         : 本地mysql
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:8889
 Source Schema         : nav

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 05/10/2019 22:01:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for nav_feed
-- ----------------------------
DROP TABLE IF EXISTS `nav_feed`;
CREATE TABLE `nav_feed` (
  `fid` int(5) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `uid` int(5) DEFAULT NULL,
  `time` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for nav_img
-- ----------------------------
DROP TABLE IF EXISTS `nav_img`;
CREATE TABLE `nav_img` (
  `logo_id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(255) DEFAULT NULL,
  `site_name` varchar(255) DEFAULT NULL,
  `hasBig` int(8) DEFAULT '0',
  PRIMARY KEY (`logo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=828 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of nav_img
-- ----------------------------
BEGIN;
INSERT INTO `nav_img` VALUES (790, 'http://www.jd.com/favicon.ico', '京 东', 0);
INSERT INTO `nav_img` VALUES (791, 'https://meituan.com/favicon.ico', '美 团', 0);
INSERT INTO `nav_img` VALUES (792, 'https://www.ifeng.com/favicon.ico', '凤凰网', 0);
INSERT INTO `nav_img` VALUES (793, 'https://www.solidot.org/favicon.ico', 'Solidot', 0);
INSERT INTO `nav_img` VALUES (794, 'https://www.sina.com.cn/favicon.ico', '新浪网', 0);
INSERT INTO `nav_img` VALUES (795, '//mat1.gtimg.com/www/icon/favicon2.ico', '腾讯网', 0);
INSERT INTO `nav_img` VALUES (796, 'http://www.163.com/favicon.ico', '网 易', 0);
INSERT INTO `nav_img` VALUES (797, '//statics.itc.cn/web/static/images/pic/sohu-logo/favicon.ico', '搜 狐', 0);
INSERT INTO `nav_img` VALUES (798, 'https://www.thepaper.cn/favicon.ico', '澎 湃', 0);
INSERT INTO `nav_img` VALUES (799, 'https://static0.tuicool.com/favicon.ico', '推酷网', 0);
INSERT INTO `nav_img` VALUES (800, 'https://www.cnbeta.com/favicon.ico', 'cbBeta', 0);
INSERT INTO `nav_img` VALUES (801, '//www.xiaobaipan.com/static/assets/ico/favicon.png', '小白盘', 0);
INSERT INTO `nav_img` VALUES (802, 'https://search.chongbuluo.com/favicon.ico', '虫部落', 0);
INSERT INTO `nav_img` VALUES (803, 'https://raw.githubusercontent.com/yifoo/img-cloud/master/img/blankico.jpg', '自在饭', 0);
INSERT INTO `nav_img` VALUES (804, 'http://www.xiaoso.net/template/img/favicon.ico', '小不点', 0);
INSERT INTO `nav_img` VALUES (805, 'https://so.mezw.com/favicon.ico', '聚合搜', 0);
INSERT INTO `nav_img` VALUES (806, 'http://118.89.171.88:8085/favicon.ico', '如风搜', 0);
INSERT INTO `nav_img` VALUES (807, 'https://map.baidu.com/favicon.ico', '百度地图', 0);
INSERT INTO `nav_img` VALUES (808, 'https://kyfw.12306.cn/otn/resources/images/ots/favicon.ico', '火车票', 0);
INSERT INTO `nav_img` VALUES (809, '//fanyi.bdstatic.com/static/translation/img/favicon/favicon-32x32_ca689c3.png', '百度翻译', 0);
INSERT INTO `nav_img` VALUES (810, 'https://static.guahao.cn/favicon.ico', '挂号网', 0);
INSERT INTO `nav_img` VALUES (811, 'https://www.islide.cc/favicon.ico', 'iSlide', 0);
INSERT INTO `nav_img` VALUES (812, 'http://smallpdf.com/favicon.png', 'SmallPDF', 0);
INSERT INTO `nav_img` VALUES (813, 'https://background.cowtransfer.com/favicon.ico', '奶牛快传', 0);
INSERT INTO `nav_img` VALUES (814, 'https://www.office-converter.com/images/favicon.ico', '文件转换器', 0);
INSERT INTO `nav_img` VALUES (815, 'https://tool.lu/favicon.ico', '在线工具', 0);
INSERT INTO `nav_img` VALUES (816, 'https://www.iqiyipic.com/common/images/PCW-72X72.png', '爱奇艺', 0);
INSERT INTO `nav_img` VALUES (817, '//img.mgtv.com/imgotv-channel/6.1.0/pcweb-head/favicon.ico', '芒果TV', 0);
INSERT INTO `nav_img` VALUES (818, '//v.qq.com/favicon.ico', '腾讯视频', 0);
INSERT INTO `nav_img` VALUES (819, 'https://img.alicdn.com/tfs/TB1WeJ9Xrj1gK0jSZFuXXcrHpXa-195-195.png', '优酷网', 0);
INSERT INTO `nav_img` VALUES (820, 'http://www.cctv.com/favicon.ico', '央视网', 0);
INSERT INTO `nav_img` VALUES (821, '//s1.music.126.net/style/favicon.ico', '网易音乐', 0);
INSERT INTO `nav_img` VALUES (822, 'https://y.qq.com/favicon.ico', 'QQ音乐', 0);
INSERT INTO `nav_img` VALUES (823, 'https://douban.fm/favicon.ico', '豆瓣FM', 0);
INSERT INTO `nav_img` VALUES (824, '//www.dpfile.com/app/pc-common/dp_favicon.a4af753914321c8e82e402e2b4be01d7.ico', '大众点评', 0);
INSERT INTO `nav_img` VALUES (825, 'https://www.taobao.com/favicon.ico', '淘 宝', 0);
INSERT INTO `nav_img` VALUES (826, 'http://58.com/favicon.ico', '58同城', 0);
INSERT INTO `nav_img` VALUES (827, '//g.alicdn.com/ju/common/1.3.6/favicon.ico', '聚划算', 0);
COMMIT;

-- ----------------------------
-- Table structure for nav_search
-- ----------------------------
DROP TABLE IF EXISTS `nav_search`;
CREATE TABLE `nav_search` (
  `sid` int(2) NOT NULL AUTO_INCREMENT,
  `key_active` int(1) DEFAULT '0',
  `text` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `placeholder` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `s_index` int(2) DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of nav_search
-- ----------------------------
BEGIN;
INSERT INTO `nav_search` VALUES (1, 1, '网页', '网页搜搜', 1, 1);
INSERT INTO `nav_search` VALUES (2, 0, '社交', '社交搜索', 2, 1);
INSERT INTO `nav_search` VALUES (3, 0, '视频', '视频搜索', 3, 1);
INSERT INTO `nav_search` VALUES (4, 0, '素材', '素材搜索', 4, 1);
INSERT INTO `nav_search` VALUES (5, 0, '音乐', '音乐搜索', 5, 1);
INSERT INTO `nav_search` VALUES (6, 0, '网盘', '网盘搜索', 6, 1);
INSERT INTO `nav_search` VALUES (7, 0, 'Ebook', '电子书搜索', 7, 1);
INSERT INTO `nav_search` VALUES (8, 0, '专业', '专业搜索', 8, 1);
INSERT INTO `nav_search` VALUES (9, 0, '生活', '生活搜索', 9, 1);
COMMIT;

-- ----------------------------
-- Table structure for nav_search_history
-- ----------------------------
DROP TABLE IF EXISTS `nav_search_history`;
CREATE TABLE `nav_search_history` (
  `kid` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `keyword` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `uid` int(5) DEFAULT NULL,
  `count` int(8) DEFAULT '1',
  `status` int(1) DEFAULT NULL,
  `time` bigint(16) DEFAULT NULL,
  `update_time` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for nav_search_item
-- ----------------------------
DROP TABLE IF EXISTS `nav_search_item`;
CREATE TABLE `nav_search_item` (
  `sitem_id` int(2) NOT NULL AUTO_INCREMENT,
  `sitem_active` int(1) DEFAULT '0',
  `name` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `query` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sid` int(2) DEFAULT NULL,
  `sitem_index` int(2) DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`sitem_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of nav_search_item
-- ----------------------------
BEGIN;
INSERT INTO `nav_search_item` VALUES (1, 0, 'Bing', 'https://cn.bing.com/search?q={key}', 1, 4, 1);
INSERT INTO `nav_search_item` VALUES (2, 0, 'Google', 'https://www.google.com/search?q={key}', 1, 2, 1);
INSERT INTO `nav_search_item` VALUES (3, 1, 'Doge', 'https://dogedoge.com/results?q={key}&lang=auto', 1, 1, 1);
INSERT INTO `nav_search_item` VALUES (4, 1, '公众号', 'https://weixin.sogou.com/weixin?type=2&query={key}', 2, 1, 1);
INSERT INTO `nav_search_item` VALUES (5, 0, '小程序', 'https://minapp.com/miniapp/search/?query={key}', 2, 2, 1);
INSERT INTO `nav_search_item` VALUES (6, 0, '知 乎', 'https://www.zhihu.com/search?q={key}&type=content', 2, 3, 1);
INSERT INTO `nav_search_item` VALUES (7, 0, '果 壳', 'https://www.guokr.com/search/all/?wd={key}', 2, 4, 1);
INSERT INTO `nav_search_item` VALUES (8, 0, '贴 吧', 'https://tieba.baidu.com/f/search/res?ie=utf-8&qw={key}', 2, 5, 1);
INSERT INTO `nav_search_item` VALUES (9, 1, '腾讯视频', 'https://v.qq.com/x/search/?q={key}', 3, 1, 1);
INSERT INTO `nav_search_item` VALUES (10, 0, '爱奇艺', 'https://so.iqiyi.com/so/q_{key}', 3, 2, 1);
INSERT INTO `nav_search_item` VALUES (11, 0, '豆瓣电影', 'https://movie.douban.com/subject_search?search_text={key}&cat=1002', 3, 3, 1);
INSERT INTO `nav_search_item` VALUES (12, 0, '疯狂影视', 'http://ifkdy.com/?q={key}', 3, 4, 1);
INSERT INTO `nav_search_item` VALUES (13, 1, 'iconfont', 'http://www.iconfont.cn/search/index?q={key}', 4, 1, 1);
INSERT INTO `nav_search_item` VALUES (14, 0, '花 瓣', 'https://huaban.com/search/?q={key}', 4, 2, 1);
INSERT INTO `nav_search_item` VALUES (15, 0, 'Pixabay', 'https://pixabay.com/zh/photos/?&q={key}', 4, 3, 1);
INSERT INTO `nav_search_item` VALUES (16, 0, '百度搜图', 'https://image.baidu.com/search/index?tn=baiduimage&word={key}', 4, 4, 1);
INSERT INTO `nav_search_item` VALUES (17, 1, 'QQ音乐', 'https://y.qq.com/portal/search.html#page=1&t=song&w={key}', 5, 1, 1);
INSERT INTO `nav_search_item` VALUES (18, 0, '网易音乐', 'https://music.163.com/#/search/m/?s={key}', 5, 2, 1);
INSERT INTO `nav_search_item` VALUES (19, 0, '音悦台', 'https://so.yinyuetai.com/?keyword={key}', 5, 3, 1);
INSERT INTO `nav_search_item` VALUES (20, 1, '鸵鸟搜索', 'http://www.tuoniao.me/search/{key}/list', 6, 1, 1);
INSERT INTO `nav_search_item` VALUES (21, 0, '小不点', 'https://www.xiaobd.net/m/search?wd={key}', 6, 2, 1);
INSERT INTO `nav_search_item` VALUES (22, 0, '胖 次', 'https://www.panc.cc/s/{key}', 6, 3, 1);
INSERT INTO `nav_search_item` VALUES (23, 1, '豆瓣图书', 'https://book.douban.com/subject_search?search_text={key}&cat=1001', 7, 1, 1);
INSERT INTO `nav_search_item` VALUES (24, 0, 'Epubee', 'http://cn.epubee.com/books/?s={key}', 7, 2, 1);
INSERT INTO `nav_search_item` VALUES (25, 0, '小书屋', 'http://mebook.cc/?s={key}', 7, 3, 1);
INSERT INTO `nav_search_item` VALUES (26, 0, 'PDFDrive', 'https://www.pdfdrive.com/search?q={key}&more=true', 7, 4, 1);
INSERT INTO `nav_search_item` VALUES (27, 0, '谷歌学术', 'https://scholar.google.com.hk/scholar?hl=zh-CN&q={key}', 8, 1, 1);
INSERT INTO `nav_search_item` VALUES (28, 0, 'GitHub', 'https://github.com/search?q={key}', 8, 3, 1);
INSERT INTO `nav_search_item` VALUES (30, 0, 'Pubmed', 'http://www.medlive.cn/pubmed/pubmed_search.do?q={key}', 8, 4, 1);
INSERT INTO `nav_search_item` VALUES (31, 0, '佰腾专利', 'https://www.patexplorer.com/results/s.html?sc=&q={key}&type=s', 8, 5, 1);
INSERT INTO `nav_search_item` VALUES (32, 1, '豆果美食', 'https://www.douguo.com/search/recipe/{key}', 9, 1, 1);
INSERT INTO `nav_search_item` VALUES (33, 0, '淘 宝', 'https://s.taobao.com/search?q={key}', 9, 2, 1);
INSERT INTO `nav_search_item` VALUES (34, 0, '京 东', 'https://search.jd.com/Search?keyword={key}&enc=utf-8', 9, 3, 1);
INSERT INTO `nav_search_item` VALUES (35, 0, '百 度', 'https://www.baidu.com/s?wd={key}&ie=utf-8&tn=simple#', 1, 3, 1);
INSERT INTO `nav_search_item` VALUES (36, 1, '知 网', 'https://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw={key}&korder=&sel=1', 8, 2, 1);
COMMIT;

-- ----------------------------
-- Table structure for nav_sites
-- ----------------------------
DROP TABLE IF EXISTS `nav_sites`;
CREATE TABLE `nav_sites` (
  `site_id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_sort_id` int(11) DEFAULT NULL,
  `site_name` varchar(64) DEFAULT NULL,
  `logo_id` int(11) DEFAULT NULL,
  `site_url` varchar(255) DEFAULT NULL,
  `site_tips` varchar(64) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `com_code` int(11) DEFAULT '0',
  `site_index` int(11) DEFAULT NULL,
  `site_tag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`site_id`) USING BTREE,
  KEY `logo_id` (`logo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12295 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of nav_sites
-- ----------------------------
BEGIN;
INSERT INTO `nav_sites` VALUES (12256, 1184, '京 东', 790, 'http://www.jd.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12257, 1184, '美 团', 791, 'https://meituan.com', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12258, 1179, '凤凰网', 792, 'https://www.ifeng.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12259, 1179, 'Solidot', 793, 'https://www.solidot.org/', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12260, 1179, '新浪网', 794, 'https://www.sina.com.cn/', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12261, 1179, '腾讯网', 795, 'https://www.qq.com/', '', 100000, 1, 4, NULL);
INSERT INTO `nav_sites` VALUES (12262, 1179, '网 易', 796, 'http://www.163.com/', '', 100000, 1, 5, NULL);
INSERT INTO `nav_sites` VALUES (12263, 1179, '搜 狐', 797, 'http://www.sohu.com/', '', 100000, 1, 6, NULL);
INSERT INTO `nav_sites` VALUES (12264, 1179, '澎 湃', 798, 'https://www.thepaper.cn/', '', 100000, 1, 7, NULL);
INSERT INTO `nav_sites` VALUES (12265, 1179, '推酷网', 799, 'https://www.tuicool.com/', '', 100000, 1, 8, NULL);
INSERT INTO `nav_sites` VALUES (12266, 1179, 'cbBeta', 800, 'https://www.cnbeta.com/', '', 100000, 1, 9, NULL);
INSERT INTO `nav_sites` VALUES (12267, 1185, '小白盘', 801, 'https://www.xiaobaipan.com', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12268, 1185, '虫部落', 802, 'https://search.chongbuluo.com/', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12269, 1185, '自在饭', 803, 'https://www.zizaifan.com/cloud.html', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12270, 1185, '小不点', 804, 'http://www.xiaoso.net/', '', 100000, 1, 4, NULL);
INSERT INTO `nav_sites` VALUES (12272, 1185, '聚合搜', 805, 'https://so.mezw.com/', '', 100000, 1, 5, NULL);
INSERT INTO `nav_sites` VALUES (12273, 1185, '如风搜', 806, 'http://www.rufengso.net/', '', 100000, 1, 6, NULL);
INSERT INTO `nav_sites` VALUES (12274, 1186, '百度地图', 807, 'https://map.baidu.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12275, 1186, '火车票', 808, 'https://kyfw.12306.cn/otn', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12276, 1186, '百度翻译', 809, 'http://fanyi.baidu.com/', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12277, 1186, '挂号网', 810, 'https://www.guahao.com/', '', 100000, 1, 4, NULL);
INSERT INTO `nav_sites` VALUES (12278, 1187, 'iSlide', 811, 'https://www.islide.cc/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12279, 1187, 'SmallPDF', 812, 'http://smallpdf.com/cn', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12280, 1187, '奶牛快传', 813, 'https://cowtransfer.com/', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12281, 1187, '文件转换器', 814, 'http://cn.office-converter.com/', '', 100000, 1, 4, NULL);
INSERT INTO `nav_sites` VALUES (12282, 1187, '在线工具', 815, 'https://tool.lu/', '', 100000, 1, 5, NULL);
INSERT INTO `nav_sites` VALUES (12283, 1188, '爱奇艺', 816, 'http://www.iqiyi.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12284, 1188, '芒果TV', 817, 'https://www.mgtv.com/', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12285, 1188, '腾讯视频', 818, 'http://v.qq.com/', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12286, 1188, '优酷网', 819, 'http://www.youku.com/', '', 100000, 1, 4, NULL);
INSERT INTO `nav_sites` VALUES (12287, 1188, '央视网', 820, 'http://www.cctv.com/', '', 100000, 1, 5, NULL);
INSERT INTO `nav_sites` VALUES (12288, 1189, '网易音乐', 821, 'https://music.163.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12289, 1189, 'QQ音乐', 822, 'https://y.qq.com/', '', 100000, 1, 2, NULL);
INSERT INTO `nav_sites` VALUES (12290, 1189, '豆瓣FM', 823, 'https://douban.fm/', '', 100000, 1, 0, NULL);
INSERT INTO `nav_sites` VALUES (12291, 1184, '大众点评', 824, 'http://www.dianping.com/', '', 100000, 1, 3, NULL);
INSERT INTO `nav_sites` VALUES (12292, 1184, '淘 宝', 825, 'https://www.taobao.com/', '', 100000, 1, 0, NULL);
INSERT INTO `nav_sites` VALUES (12293, 1190, '58同城', 826, 'http://58.com/', '', 100000, 1, 1, NULL);
INSERT INTO `nav_sites` VALUES (12294, 1184, '聚划算', 827, 'https://ju.taobao.com/', '', 100000, 1, 4, NULL);
COMMIT;

-- ----------------------------
-- Table structure for nav_sort
-- ----------------------------
DROP TABLE IF EXISTS `nav_sort`;
CREATE TABLE `nav_sort` (
  `sort_id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_name` varchar(32) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `com_code` int(11) DEFAULT '0',
  `sort_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`sort_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10011 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of nav_sort
-- ----------------------------
BEGIN;
INSERT INTO `nav_sort` VALUES (10001, '资讯阅读', 100000, 'kongquelan', 1, 0);
INSERT INTO `nav_sort` VALUES (10002, '购物生活', 100000, 'yellow', 1, 1);
INSERT INTO `nav_sort` VALUES (10004, '搜索工具', 100000, 'blue', 1, 2);
INSERT INTO `nav_sort` VALUES (10009, '效率工具', 100000, 'green', 1, 2);
INSERT INTO `nav_sort` VALUES (10010, '多媒体', 100000, 'red', 1, 3);
COMMIT;

-- ----------------------------
-- Table structure for nav_subSort
-- ----------------------------
DROP TABLE IF EXISTS `nav_subSort`;
CREATE TABLE `nav_subSort` (
  `sub_sort_id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_id` int(11) DEFAULT NULL,
  `sub_title` varchar(32) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `com_code` int(8) DEFAULT '0',
  `sub_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`sub_sort_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1191 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of nav_subSort
-- ----------------------------
BEGIN;
INSERT INTO `nav_subSort` VALUES (1179, 10001, '资讯', 100000, 1, 7);
INSERT INTO `nav_subSort` VALUES (1184, 10002, '购物', 100000, 1, 0);
INSERT INTO `nav_subSort` VALUES (1185, 10004, '多功能', 100000, 1, 0);
INSERT INTO `nav_subSort` VALUES (1186, 10009, '日常', 100000, 1, 0);
INSERT INTO `nav_subSort` VALUES (1187, 10009, '小工具', 100000, 1, 1);
INSERT INTO `nav_subSort` VALUES (1188, 10010, '视频', 100000, 1, 0);
INSERT INTO `nav_subSort` VALUES (1189, 10010, '音乐', 100000, 1, 1);
INSERT INTO `nav_subSort` VALUES (1190, 10002, '生活', 100000, 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for nav_users
-- ----------------------------
DROP TABLE IF EXISTS `nav_users`;
CREATE TABLE `nav_users` (
  `uid` int(11) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `uname` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `upwd` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `time` varchar(64) DEFAULT NULL,
  `login_time` varchar(64) DEFAULT NULL,
  `role` int(2) DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=100001 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of nav_users
-- ----------------------------
BEGIN;
INSERT INTO `nav_users` VALUES (00000100000, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '123123123@qq.com', '公共账号', NULL, '2019-10-05 21:32:01', 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
