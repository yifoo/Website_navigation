# 关于导航

- 本人非计算机专业，对代码比较感兴趣，水平有限大牛勿喷，平常花在这上面的时间不多;
- 导航的设计原则是风格简洁，前端基于react，后端接口采用node编写；
 
## update 2021-12-29
- 基于react版本导航更新(umijs+dva+egg)
## update 2021-10-09
- 再次代码重构了导航，努力做最简洁的个人网址导航；
- 本次采用Umijs+dva+egg,前后端分离，jwt鉴权token验证；
- 适当的时候将开源。


## Update 2020-03-02
> 去掉了Redis (如需恢复请切换`develop`分支)

## 安装

克隆项目：`git clone https://github.com/yifoo/Website_navigation.git`

安装依赖：`yarn`

开发模式：`yarn dev`

生产模式：`yarn pro`



初始化`sql`文件在跟文件夹，导入`mysql`数据库即可,数据库访问配置在server/config中

## 使用

1. 账号：

   超级管理员:admin ,密码：123456；
   普通访客:guest,密码：123456；
   登录guest账号后即可管理公共账号的网址，也是为了便于管理公共网址而设计;

2. 注册使用：用户需要使用真实邮箱注册，注册后会初始化公共网址数据，然后自定义自己的网址库

3. 搜索引擎

   搜索部分只做了读取数据库，没有做前端配置，添加新的搜索引擎需要自行在数据库修改，有兴趣的同学可以做一个后台管理把前后端连接起来；

4. 网址部分
  
  网址结构:  分类（sort）——二级分类（subSort)——网址（sites）三级去设计的；
  
  布局：一开始采用了瀑布流，但添加网址时重新计算高度时体验很不好，这里是参考了一个国外网站布局做的，分两列展示，感觉还不错，有好的建议希望大家提出来；
  
  编辑模式：
  
  - 设计这个导航的初衷就是希望一切操作从简，最简单添加、分类网址，就有了编辑模式而未采用后台管理的形式。
  - 添加分类可以选择内置的背景颜色，目前内置了8种背景，应该满足了大部分需求
  - 添加网址：一般新注册的用户无法手动编辑网站图标，图标是所有用户共用的，admin账号有图标编辑权限，权限是role字段控制
  - 排序：网址和二级分类可以直接拖动排序，一级分类排序在右侧浮窗拖动排序即可；
  
4. 适配：适配了PC端和移动端屏幕，移动模式下不能拖动排序







MIT License

Copyright (c) 2019 Daniel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.





