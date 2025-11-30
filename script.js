document.addEventListener('DOMContentLoaded', function() {
    // 图片懒加载和错误处理
    const coupleImages = document.querySelectorAll('.couple-image');
    
    coupleImages.forEach(img => {
        // 添加加载占位
        img.style.backgroundColor = '#f5f5f5';
        
        // 图片加载失败时的处理
        img.onerror = function() {
            this.style.display = 'none';
            const container = this.parentElement;
            if (container) {
                container.innerHTML = `
                    <div style="
                        width: 100%; 
                        height: 100%; 
                        background: linear-gradient(135deg, #d4af37, #f4c842); 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: white; 
                        font-size: 48px;
                        flex-direction: column;
                        text-align: center;
                    ">
                        <div style="font-size: 64px; margin-bottom: 10px;">💕</div>
                        <div style="font-size: 16px; font-weight: 300;">照片加载中...</div>
                    </div>
                `;
            }
        };
        
        // 图片加载成功时的淡入效果
        img.onload = function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        };
    });

    // 背景图片处理
    const backgroundOverlay = document.querySelector('.background-overlay');
    const backgroundImg = new Image();
    backgroundImg.src = './images/background.jpg';
    
    backgroundImg.onerror = function() {
        // 如果背景图加载失败，使用优雅的渐变背景
        backgroundOverlay.style.background = `
            linear-gradient(135deg, 
                #f8f5f0 0%, 
                #f5f1ea 25%, 
                #f2ede6 50%, 
                #f5f1ea 75%, 
                #f8f5f0 100%)
        `;
    };
    
    // 微信分享配置（需要微信JS-SDK）
    if (typeof wx !== 'undefined') {
        wx.ready(function() {
            const shareData = {
                title: '马剑栋 ♥ 屠晨霞 | 我们的婚礼',
                desc: '诚邀您见证我们的爱情盛典 💕',
                link: window.location.href,
                imgUrl: window.location.origin + '/images/share-cover.jpg'
            };
            
            // 分享给朋友
            wx.updateAppMessageShareData(shareData);
            
            // 分享到朋友圈
            wx.updateTimelineShareData({
                title: shareData.title + ' - ' + shareData.desc,
                link: shareData.link,
                imgUrl: shareData.imgUrl
            });
        });
    }
    
    // 添加照片点击放大效果
    coupleImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 创建全屏预览
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const enlargedImg = document.createElement('img');
            enlargedImg.src = this.src;
            enlargedImg.style.cssText = `
                max-width: 95%;
                max-height: 95%;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
            
            // 关闭提示
            const closeHint = document.createElement('div');
            closeHint.textContent = '轻触屏幕关闭';
            closeHint.style.cssText = `
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 14px;
                opacity: 0.7;
                font-family: inherit;
            `;
            
            overlay.appendChild(enlargedImg);
            overlay.appendChild(closeHint);
            document.body.appendChild(overlay);
            
            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            // 图片加载完成后显示
            setTimeout(() => {
                enlargedImg.style.transform = 'scale(1)';
            }, 50);
            
            // 点击关闭
            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fadeIn 0.3s ease reverse';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    if (document.head.contains(style)) {
                        document.head.removeChild(style);
                    }
                }, 300);
            });
            
            // 防止滚动
            document.body.style.overflow = 'hidden';
            overlay.addEventListener('click', function() {
                document.body.style.overflow = '';
            });
        });
    });
    
    // 优雅的滚动效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // 观察各个区域
    const sections = document.querySelectorAll('.photo-section, .invitation-section, .wedding-details, .blessing-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        observer.observe(section);
    });
    
    // 添加滚动动画CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // 叶子摆动动画增强
    const leafGroups = document.querySelectorAll('.leaf-group path');
    leafGroups.forEach((leaf, index) => {
        leaf.style.transformOrigin = '50% 50%';
        leaf.style.animationDelay = `${-index * 0.5}s`;
    });
    
    // 性能优化：减少动画在低性能设备上的帧率
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // 如果用户偏好减少动画，则禁用复杂动画
        const floatingElements = document.querySelector('.floating-elements');
        if (floatingElements) {
            floatingElements.style.display = 'none';
        }
        
        // 禁用滚动动画
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
        
        // 禁用叶子摆动
        leafGroups.forEach(leaf => {
            leaf.style.animation = 'none';
        });
    }
    
    // 页面加载完成处理
    window.addEventListener('load', function() {
        console.log('马剑栋 ♥ 屠晨霞 婚礼请柬加载完成 💕');
        
        // 预加载关键图片
        const criticalImages = [
            './images/couple-photo-1.jpg',
            './images/couple-photo-2.jpg',
            './images/background.jpg',
            './images/share-cover.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        // 添加页面加载完成的微动画
        const container = document.querySelector('.container');
        if (container && !prefersReducedMotion.matches) {
            container.style.animation = 'fadeIn 1s ease';
        }
    });
    
    // 触摸设备优化
    if ('ontouchstart' in window) {
        // 为触摸设备优化hover效果
        const hoverElements = document.querySelectorAll('.detail-card, .photo-frame');
        hoverElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                if (el.classList.contains('detail-card')) {
                    this.style.transform = 'translateY(-3px)';
                } else {
                    this.style.transform = 'scale(1.02)';
                }
            });
            
            el.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // 触摸设备上的照片overlay效果
        const photoFrames = document.querySelectorAll('.photo-frame');
        photoFrames.forEach(frame => {
            frame.addEventListener('touchstart', function() {
                const overlay = this.querySelector('.photo-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
            });
            
            frame.addEventListener('touchend', function() {
                const overlay = this.querySelector('.photo-overlay');
                if (overlay) {
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                    }, 2000);
                }
            });
        });
    }
    
    // 添加一些细节的用户体验优化
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停动画以节省性能
            document.body.style.animationPlayState = 'paused';
        } else {
            // 页面显示时恢复动画
            document.body.style.animationPlayState = 'running';
        }
    });
});