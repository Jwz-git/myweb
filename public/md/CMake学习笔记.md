CMake的使用方法（举例说明）：
1. 创建build和src两个文件夹，build存放中间文件，src存放源代码文件
2. 首先在src中创建main.cpp和CMakeLists.txt，在CMakeLists.txt文件中添加以下代码
	```
	#设置CMake最低版本
	cmake_minimum_required(VERSION 3.15)
	
	#项目名称，版本号，语言
	project(Demo VERSION 1.0 LANGUAGES CXX)
	
	# 添加可执行文件（可执行文件名 源文件（空格分割））
	add_executable(Demo main.cpp)
	```
3. 之后在build目录下执行以下命令
	```
	#生成构建目录
	cmake ..\src
	#生成可执行程序
	cmake --build .
	```
4. CMake相关语法（局部）：
	```
	#使用变量需要通过${variable}实现
	# PROJECT_NAME : 项目名
	# PROJECT_SOURCE_DIR : 项目源文件位置
	# PROJECT_BINARY_DIR : 可执行文件所在文件夹
	# PROJECT_VERSION : 版本号（若已定义）
	# PROJECT_VERSION_MAJOR/MINOR : 主/次版本号（若已定义）
	
	#在创建可构建目录时输出信息指定信息
	message([<mode>] "message_text")
	# STATUS : 将前缀设置为'--',<mode>
	
	# 设置变量值
	set(<variable> <value>)
	# 设置c++标准
	set(CMAKE_CXX_STANDARD 11)
	# 设置可执行文件、动态库输出位置
	set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
	# 设置静态库文件存放位置
	set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
	
	# 开关,value(ON/OFF)默认为OFF，可以通过命令行修改 -D<name>=ON/OFF
	option(<variable> "<help_text>" [value])
	
	# 将输入文件替换再输出成文件,input在src中，output会出现在build中
	# 替换规则：会将 @VAR@ 和 ${VAR}替换成VAR的值，若VAR未定义则替换为空字符串
	config_file(<input> <output>)

	'''
	#cmakedefine VAR ...
	会被替换为
	#def VAR ... 或
	/* #undef VAR */
	'''
	
	# 判断语句，类似C
	if()
		# code
	endif
	
	# 为 所有目标 指定头文件目录
	include_directories(dir1 [dir2 ...])
	
	# 为 指定目标 指定头文件目录，一般用public(=interface+private)
	target_include_directories(<target(可执行文件)>
	  <INTERFACE|PUBLIC|PRIVATE>(目录属性) [items1...]
	  [<INTERFACE|PUBLIC|PRIVATE> [items2...] ...])
	  
	# 添加源文件目录，比如在src中运行CMakeLists时他会跳转到dir中运行其中的CMakelists
	add_subdirectory(dir)
	
	# 用指定的源文件生成库
	add_library(<name(想生成的库的名字)>
				<STATIC|SHARED|MODULE(库的类型)>
				[SOURCE ...(使用的文件)])
				
	# 连接内/外部库，其实很少用到
	target_link_libraries(<target>
				<STATIC|SHARED|MODULE>
				[item ...])
				
	# 安装，可认为软件安装，将文件存放在系统文件夹中
	intall(TARGETS <target> DESTINATION <dir>)   #可执行文件
	install(FILES <file> DESTINATION <dir>)    #静/动态库
	install(FILES <file> DESTINATION <dir>)    #外部库
	
	'''
	安装指令，build之后执行
	cmake --install .    #安装到默认目录
	cmake --install . --prefix <dir>    #安装到指定目录
	'''
	```
5. 动态库必须和可执行文件同一个目录或系统指定目录，静态库位置无硬性要求
---
### 参考资料
1. 官方：<a style="color: #008000;" href="https://cmake.org/cmake/help/latest/manual/cmake.1.html" target="_blank">CMake官方文档</a>、<a style="color: #008000;" href="https://cmake.org/cmake/help/latest/guide/tutorial/index.html" target="_blank">CMake Tutorial</a>。
2. B站：<a style="color: #008000;" href="https://www.bilibili.com/video/BV1nU4y1B7mJ/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click" target="_blank">CMake入门教程</a>。