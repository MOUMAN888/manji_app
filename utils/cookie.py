from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
import time
import os
import psutil

def kill_edge_processes():
    """关闭所有残留的Edge浏览器和驱动进程"""
    try:
        for proc in psutil.process_iter(['pid', 'name']):
            if proc.info['name'] in ['msedge.exe', 'msedgedriver.exe']:
                os.kill(proc.info['pid'], 9)
        print("✅ 已清理残留的Edge浏览器/驱动进程")
    except Exception as e:
        print(f"⚠️ 清理进程时出现小问题：{str(e)}")

def get_douyin_cookies():
    """
    使用指定路径的Edge驱动获取抖音登录Cookie并打印（修复会话创建失败问题）
    """
    # 第一步：先清理残留进程（关键！）
    kill_edge_processes()
    
    # 配置Edge浏览器选项（禁用会话复用，新建干净会话）
    edge_options = Options()
    # 禁用自动化提示，避免被抖音检测
    edge_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    edge_options.add_experimental_option("useAutomationExtension", False)
    # 禁用GPU加速，提升稳定性
    edge_options.add_argument("--disable-gpu")
    # 禁用沙箱模式（Windows下解决浏览器启动失败的关键）
    edge_options.add_argument("--no-sandbox")
    # 禁用共享内存（避免进程冲突）
    edge_options.add_argument("--disable-dev-shm-usage")
    # 强制新建会话，不复用现有浏览器（核心修复点）
    edge_options.add_argument("--new-window")
    # 关闭自动保存密码提示（减少干扰）
    edge_options.add_experimental_option('prefs', {
        'credentials_enable_service': False,
        'profile.password_manager_enabled': False
    })

    # 配置你指定的Edge驱动路径
    driver_path = r'C:\WebDriver\edge\msedgedriver.exe'
    service = Service(executable_path=driver_path)
    # 增加驱动日志（可选，方便排查问题）
    service.log_path = "edge_driver.log"

    # 启动浏览器
    try:
        driver = webdriver.Edge(service=service, options=edge_options)
    except Exception as e:
        print(f"❌ 浏览器启动失败：{str(e)}")
        return None
    
    # 设置隐式等待（最长等待15秒）
    driver.implicitly_wait(15)

    try:
        # 打开抖音网页版登录页
        driver.get("https://www.douyin.com/")
        print("="*50)
        print("✅ 已打开抖音网页版，请在60秒内完成扫码登录！")
        print("="*50)
        
        # 等待你手动扫码登录（60秒足够操作）
        time.sleep(60)

        # 验证登录状态（简单判断：页面标题不含"登录"且包含"抖音"）
        if "登录" not in driver.title and "抖音" in driver.title:
            # 提取所有Cookie
            cookies = driver.get_cookies() 
            print("\n🎉 登录成功！以下是抖音登录Cookie（列表格式）：")
            print("-"*50)
            for cookie in cookies:
                print(cookie)
            
            # 额外打印：可直接用于requests的Cookie字符串格式（更实用）
            print("\n📌 Cookie字符串格式（可直接复制到请求头）：")
            print("-"*50)
            cookie_str = "; ".join([f"{c['name']}={c['value']}" for c in cookies])
            print(cookie_str)
            
            return cookies
        else:
            print("\n❌ 登录超时或未完成登录，请重新运行程序！")
            return None

    except Exception as e:
        print(f"\n❌ 程序异常：{str(e)}")
        return None

    finally:
        # 可选：登录完成后手动关闭浏览器，注释掉避免自动关闭
        # driver.quit()
        pass

# 执行函数获取并打印Cookie
if __name__ == "__main__":
    get_douyin_cookies()