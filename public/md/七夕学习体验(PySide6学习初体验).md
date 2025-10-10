&emsp;&emsp;又到了一年一度的七夕。为了有个不一样的七夕体验<a style="text-decoration: line-through;color: #d0d0d0;">（掩饰单身的尴尬）</a>，我决定在七夕这天学一些东西。碰巧我想试着做一个小型软件，于是我决定学习PySide6（Python中GUI库，可以认为是Python中的Qt），学着做软件的界面。

&emsp;&emsp;先分享我学习这个库时看的教学视频：<a style="color: #008000;" href="https://www.bilibili.com/video/BV1c84y1N7iL/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click&amp;vd_source=3aa36fe5332c3a1abbd4eadd1053a0d0" target="_blank">相关链接😎</a>。好的资源还是挺难找的<a style="text-decoration: line-through;color: #d0d0d0;">（只看得懂这个）</a>。个人感觉讲得还是挺详细的<a style="text-decoration: line-through;color: #d0d0d0;">（虽然我还没看完）</a>。

&emsp;&emsp;没学GUI库前，我还以为这玩意是什么很高大上的东西，极其考验代码能力，毕竟我之前稍微学了一点前端，定位元素之类的搞得我心力交瘁😫。

&emsp;&emsp;刚开始学GUI时，也确实遇到过元素定位的困难。后来看到这个视频之后才知道有Qt Designer这个工具，这个工具可以快速设计界面，省去了元素定位这个极其恶心的事情<a style="text-decoration: line-through;color: #d0d0d0;">（其实还是我太菜了）</a>。设计完界面后会生成 .ui 文件，之后要做的就是绑定代码里的函数和GUI里面的元素，也还算简单😊。

&emsp;&emsp;学完GUI，搞定代码，基本的功能能实现。剩下的就是打包文件了。Python的常用打包插件是pyinstaller，但是我推荐的是另一个：auto-py-to-exe。他是基于pyinstaller的图形化操作打包插件，用起来很简单，唯一的问题就是打包后的文件太大了<a style="text-decoration: line-through;color: #d0d0d0;">（虽然pyinstaller也有这个问题，当然可能只是我用不来）</a>。对了，打包文件的话最好把 .ui 文件转化为 .py 文件，不然 .exe 程序可能无法载入UI<a style="text-decoration: line-through;color: #d0d0d0;">（也不知道是不是我的问题）</a>，不过教学视频里用的就是 .py 文件，不会遇到这个问题（其实 .ui 文件能直接用，不过稍微有点麻烦）。

&emsp;&emsp;总的来说，七夕过的还是挺充实的<a style="text-decoration: line-through;color: #d0d0d0;">（其实依旧"无能"）</a>。
