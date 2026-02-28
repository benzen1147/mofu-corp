// Header Component
class CommonHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="container header-container">
          <a href="/index.html" class="logo">
            <img src="/images/mofullclogo.png" alt="mofu llc" style="height: 55px; width: auto; display: block;">
          </a>
          
          <button class="hamburger" aria-label="Menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav class="nav-links">
            <a href="/index.html">ホーム</a>
            <a href="/business.html">事業内容</a>
            <a href="/pricing.html">料金プラン</a>
            <a href="/company.html">会社概要</a>
            <a href="/team.html">運営体制</a>
            <a href="/achievements.html">実績</a>
            <a href="/blog/index.html">ブログ</a>
            <a href="/contact.html" class="btn btn-primary" style="padding: 8px 20px; font-size: 0.9rem;">お問い合わせ</a>
          </nav>
        </div>
      </header>
    `;

    // Highlight active link
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll('.nav-links a');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
        link.classList.add('active');
      }
    });

    // Scroll effect for header
    window.addEventListener('scroll', () => {
      const headerEl = this.querySelector('.header');
      if (window.scrollY > 10) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    });

    // Mobile Menu Toggle
    const hamburger = this.querySelector('.hamburger');
    const navLinks = this.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }
  }
}
customElements.define('common-header', CommonHeader);

// Footer Component
class CommonFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-info">
              <h3>合同会社mofu</h3>
              <p>〒563-0043</p>
              <p>大阪府池田市神田1-1-12-A</p>
              <p>Tel: 070-8977-8452</p>
              <p>Email: info@mofu-llc.co.jp</p>
              <div style="margin-top: 16px;">
                <span class="badge-ai">AI活用支援対応</span>
              </div>
            </div>
            
            <div class="footer-links">
              <div class="footer-links-col">
                <h4>企業情報</h4>
                <ul>
                  <li><a href="/company.html">会社概要</a></li>
                  <li><a href="/greeting.html">代表挨拶</a></li>
                  <li><a href="/team.html">運営体制</a></li>
                </ul>
              </div>
              <div class="footer-links-col">
                <h4>事業内容</h4>
                <ul>
                  <li><a href="/business.html">Webサイト制作</a></li>
                  <li><a href="/business.html">マーケティング</a></li>
                  <li><a href="/business.html">システム開発</a></li>
                  <li><a href="/business.html">AI活用支援</a></li>
                </ul>
              </div>
              <div class="footer-links-col">
                <h4>サポート</h4>
                <ul>
                  <li><a href="/contact.html">お問い合わせ</a></li>
                  <li><a href="/privacy.html">プライバシーポリシー</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            &copy; 2026 合同会社mofu. All Rights Reserved.
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('common-footer', CommonFooter);

// Pricing Slider (mobile only)
function initPricingSliders() {
  if (window.innerWidth > 768) return;

  document.querySelectorAll('.pricing-grid').forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.pricing-card'));
    if (cards.length < 2) return;

    // ドットインジケーターを生成
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'pricing-slider-dots';
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 1 ? ' active' : '');
      dotsContainer.appendChild(dot);
    });
    grid.after(dotsContainer);

    // スタンダードプラン（2枚目）を初期表示
    requestAnimationFrame(() => {
      const featured = cards[1];
      grid.scrollLeft = featured.offsetLeft - (grid.offsetWidth - featured.offsetWidth) / 2;
    });

    // スクロール時にドットを更新
    grid.addEventListener('scroll', () => {
      const centerX = grid.scrollLeft + grid.offsetWidth / 2;
      let activeIndex = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - centerX);
        if (dist < minDist) { minDist = dist; activeIndex = i; }
      });
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    }, { passive: true });
  });
}

document.addEventListener('DOMContentLoaded', initPricingSliders);

// Scroll Animation Observer
document.addEventListener("DOMContentLoaded", () => {
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (entry.target.classList.contains('fade-in-left')) {
        entry.target.classList.add('animate-fade-in-left');
      } else if (entry.target.classList.contains('fade-in-right')) {
        entry.target.classList.add('animate-fade-in-right');
      } else {
        entry.target.classList.add('animate-fade-in');
      }

      // stagger: グリッド内の子要素を順番にアニメーション
      if (entry.target.classList.contains('stagger-children')) {
        entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
          child.style.opacity = '0';
          child.style.animationDelay = `${i * 0.12}s`;
          child.classList.add('animate-fade-in');
        });
      }

      observer.unobserve(entry.target);
    });
  }, appearOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-children').forEach(el => {
    appearOnScroll.observe(el);
  });
});
