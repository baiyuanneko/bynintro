<template>
  <!-- Full viewport slider: two pages stacked vertically -->
  <div
    class="page-slider"
    :class="a11yClass"
    :style="{ transform: onSecondPage ? 'translateY(calc(var(--page-h, 100vh) * -1))' : 'translateY(0)' }"
  >
    <!-- ═══════════════════════════════════════ -->
    <!--  PAGE 1 · First Screen                 -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-screen h-screen overflow-hidden" style="height: var(--page-h, 100vh);">
      <!-- Background layers, cross-fade -->
      <div
        v-for="(bg, i) in FIRST_SCREEN_BACKGROUNDS"
        :key="bg"
        class="first-screen-layer absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in-out"
        :style="{ backgroundImage: `url(${bg})`, opacity: i === currentIndex ? 1 : 0 }"
      ></div>

      <!-- Overlay -->
      <div class="first-screen-overlay absolute inset-0 bg-black/20"></div>

      <!-- Centered Cards -->
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <!-- Title Card -->
        <div
          class="ripple-card wobble-card bg-gray-600/80 rounded-3xl px-6 py-6 md:px-16 md:py-10 text-white text-center"
          style="box-shadow: 0 8px 40px 8px rgba(0,0,0,0.55), 0 2px 8px 0 rgba(0,0,0,0.4);"
          @mousedown="createRipple($event, 'title')"
          @click="goToSecondPage"
          @mouseenter="showTooltip($event, t('common.clickToView'))"
          @mousemove="moveTooltip($event)"
          @mouseleave="hideTooltip"
        >
          <h1 class="hero-title font-bold tracking-widest drop-shadow-lg select-none">{{ SITE_TITLE }}</h1>
          <span v-for="r in ripples.title" :key="r.id" class="ripple-circle" :style="{ left: r.x + 'px', top: r.y + 'px' }"></span>
        </div>

        <!-- Bio Card -->
        <div
          class="ripple-card wobble-card bg-gray-600/80 rounded-3xl px-6 md:px-10 py-4 text-white text-center"
          style="box-shadow: 0 8px 40px 8px rgba(0,0,0,0.55), 0 2px 8px 0 rgba(0,0,0,0.4);"
          @mousedown="createRipple($event, 'bio')"
          @click="goToSecondPage"
          @mouseenter="showTooltip($event, t('common.clickToView'))"
          @mousemove="moveTooltip($event)"
          @mouseleave="hideTooltip"
        >
          <p class="text-lg tracking-wide text-white/80 select-none">
            {{ typedBio }}<span class="typewriter-cursor">|</span>
          </p>
          <span v-for="r in ripples.bio" :key="r.id" class="ripple-circle" :style="{ left: r.x + 'px', top: r.y + 'px' }"></span>
        </div>

        <!-- Mobile hint (仅移动端显示) -->
        <p class="md:hidden text-white text-xs font-bold tracking-wide select-none text-center px-6">
          {{ t('common.mobileHint') }}
        </p>
      </div>

      <!-- Bottom Arrow -->
      <div class="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2">
        <span class="last-updated text-white/90 text-sm tracking-wider select-none pointer-events-none bg-black/40 rounded-full px-3 py-0.5">{{ t('common.lastUpdated') }}</span>
        <div
          class="ripple-card bg-gray-600/80 rounded-full w-14 h-14 flex items-center justify-center arrow-bounce"
          style="box-shadow: 0 8px 40px 8px rgba(0,0,0,0.55), 0 2px 8px 0 rgba(0,0,0,0.4);"
          @mousedown="createRipple($event, 'arrow')"
          @click="goToSecondPage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span v-for="r in ripples.arrow" :key="r.id" class="ripple-circle" :style="{ left: r.x + 'px', top: r.y + 'px' }"></span>
        </div>
        <span class="text-white/70 text-sm tracking-widest select-none">Start Tour</span>
      </div>

    </section>

    <!-- ═══════════════════════════════════════ -->
    <!--  PAGE 2 · Main Content                 -->
    <!-- ═══════════════════════════════════════ -->
    <section
      class="relative w-screen h-screen flex flex-col overflow-hidden"
      style="height: var(--page-h, 100vh);"
      :class="{ 'waifus-mode': activePage === 'waifus' || activePage === 'contact' || activePage === 'links' }"
    >
      <!-- Background layers (same slideshow, shared index) -->
      <div
        v-for="(bg, i) in FIRST_SCREEN_BACKGROUNDS"
        :key="'p2-' + bg"
        class="page-background-layer absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in-out"
        :style="{ backgroundImage: `url(${bg})`, opacity: i === currentIndex ? 1 : 0 }"
      ></div>
      <!-- Semi-transparent overlay -->
      <div class="page-background-overlay absolute inset-0 bg-black/40"></div>

      <!-- Top Navigation Bar -->
      <nav
        class="page-nav relative flex items-center h-16 px-4 shrink-0 border-b z-10"
        style="background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.18);"
      >
        <mdui-button variant="outlined" icon="home" @click="backToFirstPage" style="--mdui-color-outline: rgba(255,255,255,0.6); color: white;">
          {{ t('common.backHome') }}
        </mdui-button>
        <span class="last-updated ml-3 text-white/90 text-sm tracking-wider select-none bg-black/40 rounded-full px-3 py-0.5">{{ t('common.lastUpdated') }}</span>
      </nav>

      <!-- Mobile tab bar (横向可滑动,独立一行,仅移动端) -->
      <div
        class="mobile-nav-scroll md:hidden flex items-center gap-2 px-4 py-2 shrink-0 border-b overflow-x-auto flex-nowrap z-10"
        style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12);"
      >
        <button
          v-for="item in navItems" :key="'mtab-' + item.key"
          class="mobile-tab ripple-card"
          :class="{ 'mobile-tab--active': activePage === item.key }"
          @mousedown="createRipple($event, 'mtab-' + item.key)"
          @click="selectPage(item.key)"
        >
          <span class="material-icons-round mobile-tab__icon">{{ item.icon }}</span>
          <span class="mobile-tab__label">{{ t(item.labelKey) }}</span>
        </button>
      </div>

      <!-- Body: Sidebar + Content -->
      <div class="relative flex flex-1 overflow-hidden z-10">
        <!-- Sidebar (resident) -->
        <aside
          class="page-sidebar w-64 shrink-0 h-full hidden md:flex flex-col py-3 px-3 gap-1"
          style="background: transparent;"
        >
          <button
            v-for="item in navItems" :key="item.key"
            class="nav-item ripple-card"
            :class="{ 'nav-item--active': activePage === item.key }"
            @mousedown="createRipple($event, 'nav-' + item.key)"
            @click="selectPage(item.key)"
          >
            <span class="material-icons-round nav-item__icon">{{ item.icon }}</span>
            <span class="nav-item__label">{{ t(item.labelKey) }}</span>
            <span
              v-for="r in (ripples['nav-' + item.key] ?? [])"
              :key="r.id"
              class="ripple-circle"
              :style="{ left: r.x + 'px', top: r.y + 'px' }"
            ></span>
          </button>
        </aside>

        <!-- Main content -->
        <main class="page-main flex-1 overflow-auto p-4 md:p-12">
          <div v-if="activePage === 'intro'" class="h-full flex flex-col items-stretch justify-start">
            <div
              class="content-card--notebook-enter-wrap w-full"
              :class="{
                'content-card--notebook-enter': onSecondPage,
                'content-card--notebook-enter--tab': introEntryMode === 'tab'
              }"
            >
              <div class="content-card content-card--notebook w-full">
                <h2 class="content-card__title">{{ t('intro.title') }}</h2>
                <div class="space-y-6 notebook-lines">
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.status.label') }}</span>
                  <span class="notebook-text">{{ t('intro.status.body') }}</span>
                  <mdui-chip icon="place" style="background-color: #ffebee; color: #c62828;" class="my-0.5">{{ t('intro.status.city') }}</mdui-chip>{{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.languages.label') }}</span>
                  <span class="notebook-text">{{ t('intro.languages.dailyUse') }}</span>
                  <mdui-chip icon="translate" style="background-color: #e8f5e9; color: #2e7d32;" class="my-0.5">zh_CN</mdui-chip>
                  <span class="notebook-text">{{ t('intro.languages.and') }}</span>
                  <mdui-chip icon="translate" style="background-color: #e8f5e9; color: #2e7d32;" class="my-0.5">en_US</mdui-chip>{{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.techStack.label') }}</span>
                  <span class="notebook-text">{{ t('intro.techStack.skilledAt') }}</span>
                  <mdui-chip
                    icon="code"
                    style="background-color: #e3f2fd; color: #1565c0;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('intro.techStack.javaTooltip'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                  >Java</mdui-chip>{{ sep }}
                  <mdui-chip icon="code" style="background-color: #fff3e0; color: #ef6c00;" class="my-0.5">Python</mdui-chip>{{ sep }}
                  <mdui-chip icon="code" style="background-color: #ede7f6; color: #6a1b9a;" class="my-0.5">Vue</mdui-chip>{{ sep }}
                  <mdui-chip
                    icon="code"
                    style="background-color: #fbe9e7; color: #d84315;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('intro.techStack.rustTooltip'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                  >Rust</mdui-chip>{{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.devTools.label') }}</span>
                  <span class="notebook-text">{{ t('intro.devTools.body') }}</span>
                  <mdui-chip icon="terminal" style="background-color: #e0f7fa; color: #00838f;" class="my-0.5">IDEA</mdui-chip>{{ sep }}
                  <mdui-chip icon="terminal" style="background-color: #e0f2f1; color: #00695c;" class="my-0.5">VS Code</mdui-chip>{{ sep }}
                  <mdui-chip icon="terminal" style="background-color: #f1f8e9; color: #558b2f;" class="my-0.5">Kimi Code</mdui-chip>{{ sep }}
                  <mdui-chip icon="terminal" style="background-color: #f1f8e9; color: #558b2f;" class="my-0.5">ZCode</mdui-chip>{{ sep }}
                  <mdui-chip icon="terminal" style="background-color: #f1f8e9; color: #558b2f;" class="my-0.5">Deepseek Harness</mdui-chip>
                  {{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.runtime.label') }}</span>
                  <span class="notebook-text">{{ t('intro.runtime.body') }}</span>
                  <mdui-chip
                    icon="settings_suggest"
                    style="background-color: #eceff1; color: #37474f;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('intro.runtime.archTooltip'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                  >Arch Linux</mdui-chip>
                  <span class="notebook-text">{{ t('intro.runtime.and') }}</span>
                  <mdui-chip icon="phone_android" style="background-color: #f9fbe7; color: #9e9d24;" class="my-0.5">Android</mdui-chip>{{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.interests.label') }}</span>
                  <span class="notebook-text">{{ t('intro.interests.likes') }}</span>
                  <mdui-chip icon="auto_awesome" style="background-color: #fce4ec; color: #c2185b;" class="my-0.5">{{ t('intro.interests.acg') }}</mdui-chip>{{ sep }}
                  <span class="notebook-text">{{ t('intro.interests.is') }}</span>
                  <mdui-chip icon="pets" style="background-color: #fffde7; color: #f57f17;" class="my-0.5">{{ t('intro.interests.catLover') }}</mdui-chip>{{ period }}
                </p>
                <p class="content-card__body flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span class="notebook-label w-20 md:w-32 shrink-0">{{ t('intro.games.label') }}</span>
                  <span class="notebook-text">{{ t('intro.games.is') }}</span>
                  <mdui-chip icon="sports_esports" style="background-color: #f3e5f5; color: #4a148c;" class="my-0.5">{{ t('games.rotaeno') }}</mdui-chip>{{ sep }}
                  <mdui-chip icon="sports_esports" style="background-color: #f3e5f5; color: #4a148c;" class="my-0.5">maimai DX</mdui-chip>{{ sep }}
                  <mdui-chip
                    icon="sports_esports"
                    style="background-color: #f3e5f5; color: #4a148c;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('games.tooltip.cnFriendCode'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                    @click="openFriendCodeDialog"
                  >{{ t('games.blueArchive') }}</mdui-chip>{{ sep }}
                  <mdui-chip icon="sports_esports" style="background-color: #f3e5f5; color: #4a148c;" class="my-0.5">{{ t('games.minecraft') }}</mdui-chip>{{ sep }}
                  <button
                    v-if="!droppedGamesVisible"
                    type="button"
                    class="dropped-games-toggle"
                    @click="droppedGamesVisible = true"
                  >{{ t('games.showDroppedGames') }}</button>
                  <template v-if="droppedGamesVisible">
                  <mdui-chip
                    icon="sports_esports"
                    style="background-color: #eceff1; color: #37474f;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('games.tooltip.cnUid'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                    @click="openUidDialog('games.neverness')"
                  >{{ t('games.neverness') }}{{ t('games.droppedSuffix') }}</mdui-chip>{{ sep }}
                  <mdui-chip
                    icon="sports_esports"
                    style="background-color: #eceff1; color: #37474f;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('games.tooltip.cnUid'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                    @click="openUidDialog('games.genshin', '276060503')"
                  >{{ t('games.genshin') }}{{ t('games.droppedSuffix') }}</mdui-chip>{{ sep }}
                  <mdui-chip
                    icon="sports_esports"
                    style="background-color: #eceff1; color: #37474f;"
                    class="my-0.5"
                    @mouseenter="showTooltip($event, t('games.tooltip.osuProfile'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                    @click="osuDialogVisible = true"
                  >{{ t('games.osu') }}{{ t('games.droppedSuffix') }}</mdui-chip>
                  </template>
                  <span class="notebook-text">{{ t('intro.games.player') }}</span>
                </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activePage === 'waifus'" class="waifus-content">
            <div class="waifus-heading">
              <h2 class="waifus-title">Waifus</h2>
              <button
                type="button"
                class="waifus-help"
                :aria-label="t('waifus.help')"
                @mouseenter="showTooltip($event, t('waifus.help'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
              >?</button>
            </div>
            <div class="waifus-grid">
              <article
                v-for="(waifu, index) in waifus"
                :key="waifu.nameKey"
                class="waifu-card"
                :class="`waifu-card--${waifu.tone}`"
                @mousedown="createRipple($event, `waifu-${index}`)"
              >
                <img class="waifu-avatar" :src="waifu.avatar" :alt="t(waifu.nameKey + '.name') + t('waifus.altSuffix')" />
                <div class="waifu-info">
                  <h3 class="waifu-name">{{ t(waifu.nameKey + '.name') }}</h3>
                  <p v-if="t(waifu.nameKey + '.bio')" class="waifu-bio">{{ t(waifu.nameKey + '.bio') }}</p>
                </div>
                <span
                  v-for="r in (ripples[`waifu-${index}`] ?? [])"
                  :key="r.id"
                  class="ripple-circle"
                  :style="{ left: `${r.x}px`, top: `${r.y}px` }"
                ></span>
              </article>
            </div>
          </div>

          <div v-else-if="activePage === 'blog'" class="blog-content">
            <div class="blog-heading">
              <h2 class="blog-title">My Blog</h2>
              <mdui-button-icon
                icon="open_in_new"
                :aria-label="t('blog.openHome')"
                @mouseenter="showTooltip($event, t('blog.openHome'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="openNekomoSite"
              ></mdui-button-icon>
              <mdui-button-icon
                icon="refresh"
                :aria-label="t('blog.refresh')"
                @mouseenter="showTooltip($event, t('blog.refresh'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="refreshBlogArticles"
              ></mdui-button-icon>
            </div>

            <div v-if="blogLoading" class="blog-state blog-loading">
              <mdui-circular-progress></mdui-circular-progress>
              <span>{{ t('blog.loading') }}</span>
            </div>
            <div v-else-if="blogError" class="blog-state blog-state--error">{{ blogError }}</div>
            <div
              v-else-if="blogArticles.length"
              class="blog-grid"
              :style="{ gridTemplateColumns: `repeat(${blogColumns.length}, minmax(0, 1fr))` }"
            >
              <div v-for="(column, columnIndex) in blogColumns" :key="columnIndex" class="blog-column">
                <article
                  v-for="item in column"
                  :key="item.article.link"
                  :class="['blog-card', `blog-card--tone-${item.index % blogCardTones.length}`]"
                  role="button"
                  tabindex="0"
                  @mouseenter="showTooltip($event, t('blog.readTooltip'))"
                  @mousemove="moveTooltip($event)"
                  @mouseleave="hideTooltip"
                  @mousedown="createRipple($event, `blog-${item.index}`)"
                  @click="openBlogLink(item.article)"
                  @keydown.enter="openBlogLink(item.article)"
                >
                  <h3 class="blog-card__title">
                    <span class="blog-card__title-text">{{ item.article.title }}</span>
                  </h3>
                  <time class="blog-card__date" :datetime="item.article.updatedAt">
                    <span class="material-icons-round blog-card__date-icon" aria-hidden="true">update</span>
                    {{ item.article.date }}
                  </time>
                  <p class="blog-card__summary">{{ item.article.summary }}</p>
                  <span
                    v-for="r in (ripples[`blog-${item.index}`] ?? [])"
                    :key="r.id"
                    class="ripple-circle blog-ripple"
                    :style="{ left: `${r.x}px`, top: `${r.y}px` }"
                  ></span>
                </article>
              </div>
            </div>
            <div v-else class="blog-state">{{ t('blog.empty') }}</div>
          </div>

          <div v-else-if="activePage === 'play'" class="works-content">
            <h2 class="works-title">{{ t('works.title') }}</h2>
            <div class="works-timeline">
              <div v-for="timeline in workTimeline" :key="timeline.year" class="works-timeline__item">
                <span class="works-timeline__node"></span>
                <div class="works-timeline__year">{{ timeline.year }}</div>
                <div class="works-timeline__content">
                  <article
                    v-for="work in timeline.works"
                    :key="work.name"
                    class="works-card"
                    :class="{ 'works-card--static': !work.link }"
                    :role="work.link ? 'button' : undefined"
                    :tabindex="work.link ? 0 : undefined"
                    @mouseenter="work.link && showTooltip($event, t('works.visitTooltip'))"
                    @mousemove="moveTooltip($event)"
                    @mouseleave="hideTooltip"
                    @mousedown="work.link && createRipple($event, `work-${timeline.year}-${work.name}`)"
                    @click="work.link && openWorkLink(work)"
                    @keydown.enter="work.link && openWorkLink(work)"
                  >
                    <h3>
                      <span>{{ work.name }}</span>
                      <span v-for="status in work.statuses" :key="status" class="works-card__tag" :class="{ 'works-card__tag--warning': status !== 'active' }">
                        <span class="material-icons-round" aria-hidden="true">{{ status === 'active' ? 'check' : 'warning' }}</span>
                        {{ t('works.status.' + status) }}
                      </span>
                    </h3>
                    <p v-if="work.descKey">{{ t(work.descKey) }}</p>
                    <span
                      v-for="r in (ripples[`work-${timeline.year}-${work.name}`] ?? [])"
                      :key="r.id"
                      class="ripple-circle works-ripple"
                      :style="{ left: `${r.x}px`, top: `${r.y}px` }"
                    ></span>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activePage === 'contact'" class="contact-content">
            <h2 class="contact-title">{{ t('contact.title') }}</h2>
            <div class="contact-grid">
              <article
                v-for="(contact, index) in contactItems"
                :key="contact.label"
                class="contact-card"
                role="button"
                tabindex="0"
                @mouseenter="showTooltip($event, contact.label === 'PGP Key' ? t('contact.downloadPgp') : t('contact.visitTooltip'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @mousedown="createRipple($event, `contact-${index}`)"
                @click="openContactLink(contact)"
                @keydown.enter="openContactLink(contact)"
              >
                <span class="material-icons-round contact-card__icon" aria-hidden="true">{{ contact.icon }}</span>
                <span class="contact-card__content">
                  <span class="contact-card__label">{{ contact.label }}</span>
                  <span class="contact-card__value">{{ contact.value }}</span>
                </span>
                <span class="material-icons-round contact-card__arrow" aria-hidden="true">open_in_new</span>
                <span
                  v-for="r in (ripples[`contact-${index}`] ?? [])"
                  :key="r.id"
                  class="ripple-circle contact-ripple"
                  :style="{ left: `${r.x}px`, top: `${r.y}px` }"
                ></span>
              </article>
            </div>
          </div>

          <div v-else-if="activePage === 'links'" class="friends-content">
            <div class="friends-heading">
              <h2 class="friends-title">My Friends</h2>
              <mdui-button-icon
                icon="refresh"
                :aria-label="t('friends.refresh')"
                @mouseenter="showTooltip($event, t('friends.refresh'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="refreshFriendItems"
              ></mdui-button-icon>
              <mdui-button-icon
                icon="person_add"
                :aria-label="t('friends.apply')"
                @mouseenter="showTooltip($event, t('friends.apply'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="openFriendApplyDialog"
              ></mdui-button-icon>
            </div>
            <div v-if="friendsLoading" class="blog-state blog-loading">
              <mdui-circular-progress></mdui-circular-progress>
              <span>{{ t('friends.loading') }}</span>
            </div>
            <div v-else-if="friendsError" class="blog-state blog-state--error">
              <span>{{ friendsError }}</span>
              <a href="#" class="friends-retry" @click.prevent="refreshFriendItems">{{ t('friends.retry') }}</a>
            </div>
            <div v-else-if="friendItems.length" class="friends-grid">
              <article
                v-for="(friend, index) in friendItems"
                :key="friend.url"
                class="friend-card"
                role="button"
                tabindex="0"
                @mouseenter="showTooltip($event, t('friends.visitTooltip'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @mousedown="createRipple($event, `friend-${index}`)"
                @click="openFriendLink(friend)"
                @keydown.enter="openFriendLink(friend)"
              >
                <img v-if="friend.avatar" class="friend-card__avatar" :src="friend.avatar" :alt="friend.name + t('friends.altSuffix')" />
                <span v-else class="material-icons-round friend-card__avatar-placeholder" aria-hidden="true">person</span>
                <span class="friend-card__content">
                  <span class="friend-card__name">{{ friend.name }}</span>
                  <span v-if="friend.description" class="friend-card__description">{{ friend.description }}</span>
                </span>
                <span class="material-icons-round friend-card__arrow" aria-hidden="true">open_in_new</span>
                <span
                  v-for="r in (ripples[`friend-${index}`] ?? [])"
                  :key="r.id"
                  class="ripple-circle friend-ripple"
                  :style="{ left: `${r.x}px`, top: `${r.y}px` }"
                ></span>
              </article>
            </div>
            <div v-else class="blog-state">{{ t('friends.empty') }}</div>
          </div>

          <!-- 其他页占位 -->
          <div v-else class="h-full flex items-center justify-center">
            <p class="text-lg select-none text-white/50">{{ t('common.underConstruction') }}</p>
          </div>
        </main>
      </div>

    </section>

    <Teleport to="body">
      <!-- 语言切换 + 无障碍设置悬浮按钮(移出滑块,两屏常驻) -->
      <div class="float-fabs" :class="a11yClass">
        <mdui-dropdown>
          <mdui-button-icon
            slot="trigger"
            icon="translate"
            class="a11y-fab"
            :aria-label="t('lang.title')"
          ></mdui-button-icon>
          <mdui-menu>
            <mdui-menu-item :icon="locale === 'zh' ? 'check' : ''" @click="setLocale('zh')">简体中文</mdui-menu-item>
            <mdui-menu-item :icon="locale === 'en' ? 'check' : ''" @click="setLocale('en')">English</mdui-menu-item>
          </mdui-menu>
        </mdui-dropdown>
        <mdui-button-icon
          icon="accessibility_new"
          class="a11y-fab"
          :aria-label="t('a11y.title')"
          @click="a11yDialogVisible = true"
        ></mdui-button-icon>
      </div>
      <div
        v-if="tooltip.visible"
        class="cursor-tooltip"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
      >
        {{ tooltip.text }}
      </div>
      <Transition name="blog-dialog">
        <div v-if="blogLinkDialog.visible" class="blog-link-dialog-backdrop" @click.self="closeBlogLinkDialog">
          <section class="blog-link-dialog" role="dialog" aria-modal="true" aria-labelledby="blog-link-dialog-title">
            <span class="material-icons-round blog-link-dialog__icon" aria-hidden="true">open_in_new</span>
            <h2 id="blog-link-dialog-title">{{ t(blogLinkDialog.headingKey) }}</h2>
            <p class="blog-link-dialog__title">{{ blogLinkDialog.title }}</p>
            <p class="blog-link-dialog__url">{{ blogLinkDialog.link }}</p>
            <div class="blog-link-dialog__actions">
              <mdui-button variant="text" @click="closeBlogLinkDialog">{{ t('common.cancel') }}</mdui-button>
              <mdui-button variant="filled" @click="confirmBlogLink">{{ t('dialog.openLink') }}</mdui-button>
            </div>
          </section>
        </div>
      </Transition>
      <Transition name="blog-dialog">
        <div v-if="friendCodeDialogVisible" class="blog-link-dialog-backdrop" @click.self="closeFriendCodeDialog">
          <section class="blog-link-dialog friend-code-dialog" role="dialog" aria-modal="true" aria-labelledby="friend-code-dialog-title">
            <span class="material-icons-round blog-link-dialog__icon" aria-hidden="true">sports_esports</span>
            <h2 id="friend-code-dialog-title">{{ t('friendcode.title') }}</h2>
            <div class="friend-code-value">
              <span>{{ t('friendcode.label') }}</span>
              <code>slja40d</code>
              <mdui-button-icon
                icon="content_copy"
                :aria-label="t('friendcode.copyAria')"
                @mouseenter="showTooltip($event, friendCodeCopied ? t('copy.copied') : t('copy.clickToCopy'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="copyFriendCode"
              ></mdui-button-icon>
            </div>
            <div class="blog-link-dialog__actions">
              <mdui-button variant="text" @click="closeFriendCodeDialog">{{ t('common.close') }}</mdui-button>
            </div>
          </section>
        </div>
      </Transition>
      <Transition name="blog-dialog">
        <div v-if="uidDialog.visible" class="blog-link-dialog-backdrop" @click.self="closeUidDialog">
          <section class="blog-link-dialog friend-code-dialog" role="dialog" aria-modal="true" aria-labelledby="uid-dialog-title">
            <span class="material-icons-round blog-link-dialog__icon" aria-hidden="true">sports_esports</span>
            <h2 id="uid-dialog-title">{{ t(uidDialog.titleKey) }}</h2>
            <div class="friend-code-value">
              <span>{{ t('uid.label') }}</span>
              <code>{{ uidDialog.value }}</code>
              <mdui-button-icon
                icon="content_copy"
                :aria-label="t('uid.copyAria')"
                @mouseenter="showTooltip($event, uidCopied ? t('copy.copied') : t('copy.clickToCopy'))"
                @mousemove="moveTooltip($event)"
                @mouseleave="hideTooltip"
                @click="copyUid"
              ></mdui-button-icon>
            </div>
            <div class="blog-link-dialog__actions">
              <mdui-button variant="text" @click="closeUidDialog">{{ t('common.close') }}</mdui-button>
            </div>
          </section>
        </div>
      </Transition>
      <Transition name="blog-dialog">
        <div v-if="osuDialogVisible" class="blog-link-dialog-backdrop" @click.self="osuDialogVisible = false">
          <section class="blog-link-dialog friend-code-dialog" role="dialog" aria-modal="true" aria-labelledby="osu-dialog-title">
            <span class="material-icons-round blog-link-dialog__icon" aria-hidden="true">sports_esports</span>
            <h2 id="osu-dialog-title">{{ t('games.osu') }}</h2>
            <p class="osu-profile-link">
              <a
                class="ripple-card"
                href="https://osu.ppy.sh/users/20482107"
                target="_blank"
                rel="noopener noreferrer"
                @mousedown="createRipple($event, 'osu-profile')"
              >
                <span class="material-icons-round osu-profile-link__icon" aria-hidden="true">open_in_new</span>
                {{ t('games.osuProfileLink') }}
                <span
                  v-for="r in (ripples['osu-profile'] ?? [])"
                  :key="r.id"
                  class="ripple-circle ripple-dark"
                  :style="{ left: r.x + 'px', top: r.y + 'px' }"
                ></span>
              </a>
            </p>
            <div class="blog-link-dialog__actions">
              <mdui-button variant="text" @click="osuDialogVisible = false">{{ t('common.close') }}</mdui-button>
            </div>
          </section>
        </div>
      </Transition>

      <!-- 无障碍设置弹窗 -->
      <Transition name="blog-dialog">
        <div v-if="a11yDialogVisible" class="blog-link-dialog-backdrop" @click.self="a11yDialogVisible = false">
          <section class="blog-link-dialog a11y-dialog" role="dialog" aria-modal="true" aria-labelledby="a11y-dialog-title">
            <h2 id="a11y-dialog-title">{{ t('a11y.title') }}</h2>
            <div class="a11y-row">
              <div class="a11y-row__text">
                <span class="a11y-label">{{ t('a11y.reduceMotion') }}</span>
                <span class="a11y-desc">{{ t('a11y.reduceMotionDesc') }}</span>
              </div>
              <mdui-switch
                :checked="a11y.reduceMotion"
                @change="(e: Event) => updateA11y('reduceMotion', (e.target as HTMLInputElement).checked)"
              ></mdui-switch>
            </div>
            <div class="a11y-row">
              <div class="a11y-row__text">
                <span class="a11y-label">{{ t('a11y.highContrast') }}</span>
                <span class="a11y-desc">{{ t('a11y.highContrastDesc') }}</span>
              </div>
              <mdui-switch
                :checked="a11y.highContrast"
                @change="(e: Event) => updateA11y('highContrast', (e.target as HTMLInputElement).checked)"
              ></mdui-switch>
            </div>
            <div class="a11y-row">
              <div class="a11y-row__text">
                <span class="a11y-label">{{ t('a11y.forceWhiteBg') }}</span>
                <span class="a11y-desc">{{ t('a11y.forceWhiteBgDesc') }}</span>
              </div>
              <mdui-switch
                :checked="a11y.forceWhiteBg"
                @change="(e: Event) => updateA11y('forceWhiteBg', (e.target as HTMLInputElement).checked)"
              ></mdui-switch>
            </div>
            <div class="blog-link-dialog__actions">
              <mdui-button variant="text" @click="a11yDialogVisible = false">{{ t('common.close') }}</mdui-button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { snackbar } from 'mdui/functions/snackbar.js'
import { setLocale } from './i18n'
import { a11y, updateA11y } from './accessibility'

const { t, locale } = useI18n()

// ── 无障碍设置(驱动根 div class) ────────────────────────────
const a11yClass = computed(() => ({
  'a11y-reduce-motion': a11y.reduceMotion,
  'a11y-high-contrast': a11y.highContrast,
  'a11y-force-white': a11y.forceWhiteBg,
}))
const a11yDialogVisible = ref(false)

// 列表分隔符:中文用「、」「。」,英文用「, 」「.」
const sep = computed(() => (locale.value === 'zh' ? '、' : ', '))
const period = computed(() => (locale.value === 'zh' ? '。' : '.'))

// ── Site info ────────────────────────────────────────────────
const SITE_TITLE = computed(() => t('site.title'))
const SITE_BIO   = computed(() => t('site.bio'))

// ── Backgrounds ──────────────────────────────────────────────
const FIRST_SCREEN_BACKGROUNDS = [
  'https://assets-cdn.nekovanilla.top/bynintro/saiba.webp',
  'https://assets-cdn.nekovanilla.top/bynintro/salt.webp',
  'https://assets-cdn.nekovanilla.top/bynintro/rotaeno.webp',
]

const currentIndex = ref(0)
let bgTimer: ReturnType<typeof setInterval> | null = null

function startBgCarousel() {
  if (bgTimer) clearInterval(bgTimer)
  bgTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % FIRST_SCREEN_BACKGROUNDS.length
  }, 3000)
}

function stopBgCarousel() {
  if (bgTimer) {
    clearInterval(bgTimer)
    bgTimer = null
  }
}

onMounted(() => {
  if (!a11y.reduceMotion) startBgCarousel()
  startTypewriter()
  updateBlogColumnCount()
  window.addEventListener('resize', updateBlogColumnCount)
})

onUnmounted(() => {
  stopBgCarousel()
  window.removeEventListener('resize', updateBlogColumnCount)
})

// ── Typewriter ───────────────────────────────────────────────
const BIO_FULL = computed(() => SITE_BIO.value)
const typedBio = ref('')
let typeTimer: ReturnType<typeof setInterval> | null = null

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  text: 'Ciallo～(∠・ω< )⌒☆',
})
const friendCodeDialogVisible = ref(false)
const friendCodeCopied = ref(false)
let friendCodeResetTimer: ReturnType<typeof setTimeout> | null = null
const uidDialog = ref({ visible: false, titleKey: 'games.neverness', value: '220063418046' })
const uidCopied = ref(false)
let uidResetTimer: ReturnType<typeof setTimeout> | null = null
const osuDialogVisible = ref(false)
const droppedGamesVisible = ref(false)

function showTooltip(e: MouseEvent, text = 'Ciallo～(∠・ω< )⌒☆') {
  tooltip.value.text = text
  moveTooltip(e)
  tooltip.value.visible = true
}

function moveTooltip(e: MouseEvent) {
  tooltip.value.x = e.clientX + 14
  tooltip.value.y = e.clientY + 14
}

function hideTooltip() {
  tooltip.value.visible = false
}

function openFriendCodeDialog() {
  if (friendCodeResetTimer) clearTimeout(friendCodeResetTimer)
  friendCodeCopied.value = false
  friendCodeDialogVisible.value = true
}

function closeFriendCodeDialog() {
  friendCodeDialogVisible.value = false
}

function openUidDialog(titleKey = 'games.neverness', value = '220063418046') {
  if (uidResetTimer) clearTimeout(uidResetTimer)
  uidCopied.value = false
  uidDialog.value = { visible: true, titleKey, value }
}

function closeUidDialog() {
  uidDialog.value.visible = false
}

async function copyFriendCode() {
  try {
    await navigator.clipboard.writeText('slja40d')
    friendCodeCopied.value = true
    tooltip.value.text = t('copy.copied')
    snackbar({
      message: t('copy.friendCodeSnackbar'),
      placement: 'bottom',
      autoCloseDelay: 2200,
    })
    if (friendCodeResetTimer) clearTimeout(friendCodeResetTimer)
    friendCodeResetTimer = setTimeout(() => {
      friendCodeCopied.value = false
      if (tooltip.value.visible) tooltip.value.text = t('copy.clickToCopy')
    }, 2200)
  } catch (error) {
    console.error('Failed to copy friend code:', error)
  }
}

async function copyUid() {
  try {
    await navigator.clipboard.writeText(uidDialog.value.value)
    uidCopied.value = true
    tooltip.value.text = t('copy.copied')
    snackbar({
      message: t('copy.uidSnackbar'),
      placement: 'bottom',
      autoCloseDelay: 2200,
    })
    if (uidResetTimer) clearTimeout(uidResetTimer)
    uidResetTimer = setTimeout(() => {
      uidCopied.value = false
      if (tooltip.value.visible) tooltip.value.text = t('copy.clickToCopy')
    }, 2200)
  } catch (error) {
    console.error('Failed to copy UID:', error)
  }
}

function startTypewriter() {
  if (typeTimer) clearInterval(typeTimer)
  // 减少动画:直接显示完整文本,不跑打字机
  if (a11y.reduceMotion) {
    typedBio.value = BIO_FULL.value
    return
  }
  let i = 0
  typedBio.value = ''
  typeTimer = setInterval(() => {
    if (i < BIO_FULL.value.length) {
      typedBio.value += BIO_FULL.value[i++]
    } else {
      if (typeTimer) clearInterval(typeTimer)
    }
  }, 80)
}

// ── Page switching ───────────────────────────────────────────
const onSecondPage = ref(false)
const activePage = ref('intro')
const introEntryMode = ref<'page' | 'tab'>('page')

const navItems = [
  { key: 'intro',  icon: 'person',         labelKey: 'nav.intro' },
  { key: 'waifus', icon: 'favorite',        labelKey: 'nav.waifus' },
  { key: 'blog',   icon: 'article',         labelKey: 'nav.blog' },
  { key: 'channel', icon: 'send',            labelKey: 'nav.channel' },
  { key: 'play',   icon: 'collections',     labelKey: 'nav.works' },
  { key: 'contact', icon: 'contact_mail',   labelKey: 'nav.contact' },
  { key: 'links',  icon: 'group',           labelKey: 'nav.links' },
]

const workTimeline = [
  {
    year: 2026,
    works: [
      {
        name: 'jiallo-platform',
        descKey: 'works.desc.jiallo',
        link: 'https://github.com/baiyuanneko/jiallo-platform',
        statuses: ['active'],
      },
      {
        name: 'LegacyYSM (Unofficial Fork)',
        descKey: 'works.desc.legacyysm',
        link: 'https://github.com/baiyuanneko/legacyysm_unofficial_fork',
        statuses: ['active'],
      },
    ],
  },
  {
    year: 2025,
    works: [
      {
        name: 'Bangumium',
        descKey: 'works.desc.bangumium',
        link: 'https://github.com/Bangumium/Bangumium',
        statuses: ['deprecated'],
      },
    ],
  },
  {
    year: 2024,
    works: [
      {
        name: 'ocr.byn.moe',
        descKey: 'works.desc.ocr',
        link: 'https://github.com/baiyuanneko/ocr.byn.moe',
        statuses: ['deprecated'],
      },
    ],
  },
  {
    year: 2023,
    works: [
      {
        name: 'bocchi',
        descKey: 'works.desc.bocchi',
        link: 'https://github.com/baiyuanneko/bocchi',
        statuses: ['deprecated'],
      },
    ],
  },
  {
    year: 2022,
    works: [
      {
        name: 'Converter',
        descKey: 'works.desc.converter',
        link: 'https://github.com/baiyuanneko/Converter',
        statuses: ['noPlan'],
      },
      {
        name: 'my-bot',
        descKey: 'works.desc.mybot',
        link: 'https://github.com/baiyuanneko/my-bot',
        statuses: ['deprecated'],
      },
    ],
  },
  {
    year: 2021,
    works: [
      {
        name: 'bbg',
        descKey: 'works.desc.bbg',
        link: 'https://github.com/bbg-contributors/bbg',
        statuses: ['active'],
      },
      {
        name: 'electron-note',
        descKey: 'works.desc.electronnote',
        link: 'https://gitee.com/baiyang-lzy/electron-note',
        statuses: ['deprecated', 'vulnerable'],
      },
      {
        name: 'community',
        descKey: 'works.desc.community',
        link: 'https://gitee.com/baiyang-lzy/community',
        statuses: ['deprecated', 'vulnerable'],
      },
    ],
  },
]

const contactItems = [
  { label: 'GitHub', value: 'github.com/baiyuanneko', href: 'https://github.com/baiyuanneko', icon: 'code', external: true },
  { label: 'Telegram', value: 't.me/baiyuanneko', href: 'https://t.me/baiyuanneko', icon: 'send', external: true },
  { label: 'Email', value: 'i@nekomoe.xyz', href: 'mailto:i@nekomoe.xyz', icon: 'mail', external: false },
  { label: 'Email', value: 'baiyang-lzy@outlook.com', href: 'mailto:baiyang-lzy@outlook.com', icon: 'mail', external: false },
  { label: 'PGP Key', value: '5B31AE9B3B7421EE851878BC12FC7165238A4CB1', href: 'https://keys.openpgp.org/vks/v1/by-fingerprint/5B31AE9B3B7421EE851878BC12FC7165238A4CB1', icon: 'vpn_key', external: true },
]

interface FriendItem {
  name: string
  url: string
  avatar: string
  description: string
}

const FRIENDS_FEED_URL = 'https://friends.nekomoe.xyz/linklist.json'
const friendItems = ref<FriendItem[]>([])
const friendsLoading = ref(false)
const friendsError = ref('')
let friendsLoaded = false

async function loadFriendItems() {
  if (friendsLoaded || friendsLoading.value) return

  const loadingStartedAt = performance.now()
  friendsLoading.value = true
  friendsError.value = ''

  try {
    const response = await fetch(FRIENDS_FEED_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const payload = await response.json() as {
      '友人帐': Array<{
        '名称': string
        '链接': string
        '简介': string
        '图标': string
      }>
    }

    if (!Array.isArray(payload['友人帐'])) throw new Error('友人帐字段格式错误')

    friendItems.value = payload['友人帐'].map((friend) => ({
      name: friend['名称'],
      url: friend['链接'],
      avatar: friend['图标'],
      description: friend['简介'],
    }))

    friendsLoaded = true
  } catch (error) {
    friendsError.value = t('friends.loadError')
    console.error('Failed to load friend links:', error)
  } finally {
    const elapsed = performance.now() - loadingStartedAt
    const remaining = Math.max(0, 1000 - elapsed)
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining))
    }
    friendsLoading.value = false
  }
}

function refreshFriendItems() {
  if (friendsLoading.value) return
  friendsLoaded = false
  friendItems.value = []
  loadFriendItems()
}

function openFriendApplyDialog() {
  blogLinkTarget.value = 'https://github.com/baiyuanneko/my-friends'
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openExternal',
    title: t('dialog.applyFriendLink'),
    link: 'https://github.com/baiyuanneko/my-friends',
  }
}

const waifus = [
  { nameKey: 'waifus.vanilla', tone: 'blue', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/vanilla-2.webp' },
  { nameKey: 'waifus.yiluo', tone: 'purple', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/yiluo.webp' },
  { nameKey: 'waifus.salt', tone: 'pink', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/salt.webp' },
  { nameKey: 'waifus.plana', tone: 'purple', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/plana-2.webp' },
  { nameKey: 'waifus.kirara', tone: 'green', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/kirara.webp' },
  { nameKey: 'waifus.momoi', tone: 'pink', avatar: 'https://assets-cdn.nekovanilla.top/bynintro/avatars/momoi.webp' },
]

interface BlogArticle {
  title: string
  summary: string
  link: string
  updatedAt: string
  date: string
}

const BLOG_FEED_URL = 'https://nekomoe.xyz/atom.xml'
const blogCardTones = ['rose', 'peach', 'mint', 'blue', 'lavender', 'yellow']
const blogArticles = ref<BlogArticle[]>([])
const blogLoading = ref(false)
const blogError = ref('')
const blogColumnCount = ref(1)
const blogLinkDialog = ref({
  visible: false,
  headingKey: 'dialog.openArticle',
  title: '',
  link: '',
})
const blogLinkTarget = ref('')
let blogLoaded = false

function updateBlogColumnCount() {
  // 移动端:侧边栏隐藏,内容更宽,直接用 1 列瀑布流
  if (window.innerWidth < 768) {
    blogColumnCount.value = 1
    return
  }
  const contentWidth = Math.max(360, window.innerWidth - 420)
  blogColumnCount.value = Math.max(1, Math.floor((contentWidth + 28) / 388))
}

const blogColumns = computed(() => {
  const columns: Array<Array<{ article: BlogArticle; index: number }>> = Array.from(
    { length: blogColumnCount.value },
    () => [],
  )

  blogArticles.value.forEach((article, index) => {
    columns[index % columns.length].push({ article, index })
  })

  return columns
})

function openBlogLink(article: BlogArticle) {
  blogLinkTarget.value = article.link
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openArticle',
    title: article.title,
    link: article.link,
  }
}

function openNekomoSite() {
  blogLinkTarget.value = 'https://nekomoe.xyz'
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openExternal',
    title: 'nekomoe.xyz',
    link: 'https://nekomoe.xyz',
  }
}

function openWorkLink(work: { name: string; descKey: string; link: string }) {
  blogLinkTarget.value = work.link
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openProject',
    title: work.name,
    link: work.link,
  }
}

function openContactLink(contact: { label: string; value: string; href: string }) {
  blogLinkTarget.value = contact.href
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openExternal',
    title: contact.label,
    link: contact.value,
  }
}

function openFriendLink(friend: FriendItem) {
  blogLinkTarget.value = friend.url
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openExternal',
    title: friend.name,
    link: friend.url,
  }
}

function openChannelDialog() {
  blogLinkTarget.value = 'https://t.me/forest_neko_hall'
  blogLinkDialog.value = {
    visible: true,
    headingKey: 'dialog.openExternal',
    title: t('dialog.channelTitle'),
    link: 'https://t.me/forest_neko_hall',
  }
}

function closeBlogLinkDialog() {
  blogLinkDialog.value.visible = false
}

function refreshBlogArticles() {
  if (blogLoading.value) return
  blogLoaded = false
  blogArticles.value = []
  loadBlogArticles()
}

function confirmBlogLink() {
  window.open(blogLinkTarget.value || blogLinkDialog.value.link, '_blank', 'noopener,noreferrer')
  closeBlogLinkDialog()
}

function extractText(value: string) {
  const htmlDocument = new DOMParser().parseFromString(value, 'text/html')
  return (htmlDocument.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function formatBlogDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('blog.dateUnknown')

  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

async function loadBlogArticles() {
  if (blogLoaded || blogLoading.value) return

  const loadingStartedAt = performance.now()
  blogLoading.value = true
  blogError.value = ''

  try {
    const response = await fetch(BLOG_FEED_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const xml = await response.text()
    const feed = new DOMParser().parseFromString(xml, 'application/xml')
    const parserError = feed.querySelector('parsererror')
    if (parserError) throw new Error(t('blog.parseError'))

    blogArticles.value = Array.from(feed.querySelectorAll('entry')).map((entry) => {
      const linkElement = entry.querySelector('link[rel="alternate"]') ?? entry.querySelector('link')
      const rawSummary = entry.querySelector('summary')?.textContent
        ?? entry.querySelector('content')?.textContent
        ?? ''

      return {
        title: entry.querySelector('title')?.textContent?.trim() || t('blog.noTitle'),
        summary: extractText(rawSummary) || t('blog.noSummary'),
        link: linkElement?.getAttribute('href') || '#',
        updatedAt: entry.querySelector('updated')?.textContent?.trim()
          || entry.querySelector('published')?.textContent?.trim()
          || '',
        date: formatBlogDate(
          entry.querySelector('updated')?.textContent?.trim()
            || entry.querySelector('published')?.textContent?.trim()
            || '',
        ),
      }
    }).filter((article) => article.link !== '#').sort((a, b) => {
      const timeA = Date.parse(a.updatedAt)
      const timeB = Date.parse(b.updatedAt)
      if (Number.isNaN(timeA)) return 1
      if (Number.isNaN(timeB)) return -1
      return timeB - timeA
    })

    blogLoaded = true
  } catch (error) {
    blogError.value = t('blog.loadError')
    console.error('Failed to load blog Atom feed:', error)
  } finally {
    const elapsed = performance.now() - loadingStartedAt
    const remaining = Math.max(0, 1000 - elapsed)
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining))
    }
    blogLoading.value = false
  }
}

watch(activePage, (page) => {
  if (page === 'blog') loadBlogArticles()
  if (page === 'links') loadFriendItems()
})

function goToSecondPage() {
  introEntryMode.value = 'page'
  onSecondPage.value = true
}

function backToFirstPage() {
  onSecondPage.value = false
}

function selectPage(page: string) {
  if (page === 'channel') {
    openChannelDialog()
    return
  }
  if (page === 'intro' && onSecondPage.value) {
    introEntryMode.value = 'tab'
  }
  activePage.value = page
}

// 语言切换后重启打字机动画
watch(locale, () => {
  if (typeTimer) clearInterval(typeTimer)
  startTypewriter()
})

// 减少动画开关变化时:启停背景轮播 + 重置打字机
watch(() => a11y.reduceMotion, (reduced) => {
  if (reduced) {
    stopBgCarousel()
  } else {
    startBgCarousel()
    currentIndex.value = 0
  }
  if (typeTimer) clearInterval(typeTimer)
  startTypewriter()
})

// ── Ripple ───────────────────────────────────────────────────
interface RippleItem { id: number; x: number; y: number }
const ripples = ref<Record<string, RippleItem[]>>({
  title: [], bio: [], arrow: [],
})
let rippleId = 0

function createRipple(e: MouseEvent, target: string = 'title') {
  // 减少动画:不生成涟漪
  if (a11y.reduceMotion) return
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const id = rippleId++
  if (!ripples.value[target]) ripples.value[target] = []
  ripples.value[target].push({ id, x, y })
  setTimeout(() => {
    ripples.value[target] = ripples.value[target].filter(r => r.id !== id)
  }, 600)
}
</script>

<style scoped>
/* ── Page slider ── */
.page-slider {
  /* 移动端 Chrome 地址栏会占用可视高度,100vh 会把页面底部顶出屏幕且 body 禁止滚动,
     用 dvh(不支持时回退 100vh)让每页高度始终等于实际可视高度 */
  --page-h: 100vh;
  width: 100vw;
  height: 200vh;
  height: calc(var(--page-h) * 2);
  display: flex;
  flex-direction: column;
  transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1);
}
@supports (height: 100dvh) {
  .page-slider {
    --page-h: 100dvh;
  }
}

/* ── Ripple ── */
.hero-title {
  /* 英文站名较长,小屏下用 clamp 缩字号防止标题卡片撑出屏幕 */
  font-size: clamp(1.5rem, 8vw, 3.75rem);
}

.ripple-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.cursor-tooltip {
  position: fixed;
  z-index: 120;
  padding: 7px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(25, 25, 25, 0.88);
  color: white;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.ripple-circle {
  position: absolute;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  pointer-events: none;
  animation: ripple-expand 0.6s ease-out forwards;
}

.ripple-dark {
  background: rgba(0, 0, 0, 0.12);
}

@keyframes ripple-expand {
  0%   { transform: scale(0); opacity: 1; }
  100% { transform: scale(80); opacity: 0; }
}

/* ── Wobble ── */
.wobble-card {
  transition: transform 0.15s ease;
}
.wobble-card:hover {
  animation: wobble 0.4s ease;
}
@keyframes wobble {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(-1.5deg); }
  40%  { transform: rotate(1.5deg); }
  60%  { transform: rotate(-1deg); }
  80%  { transform: rotate(0.8deg); }
  100% { transform: rotate(0deg); }
}

/* ── Arrow bounce ── */
.arrow-bounce {
  animation: arrow-bounce 2s ease-in-out infinite;
}
.arrow-bounce:hover {
  animation: wobble 0.4s ease;
}
@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(6px); }
}

/* ── Typewriter cursor ── */
.typewriter-cursor {
  display: inline-block;
  animation: blink 0.8s step-end infinite;
  font-weight: 300;
  opacity: 0.7;
}
@keyframes blink {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 0; }
}

/* ── Sidebar slide ── */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}

/* ── Backdrop fade ── */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}
/* ── Sidebar nav items (MDUI-style) ── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 100px;
  border: none;
  background: transparent;
  color: white;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
  outline: none;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
}
.nav-item--active {
  background: rgba(255, 255, 255, 0.22);
}
.nav-item--active:hover {
  background: rgba(255, 255, 255, 0.28);
}
.nav-item__icon {
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
}
.nav-item__label {
  flex: 1;
}

/* ── Mobile tab bar (第二屏顶部横向标签栏) ── */
.mobile-nav-scroll {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.mobile-nav-scroll::-webkit-scrollbar {
  display: none;
}
.mobile-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 6px 14px;
  border-radius: 100px;
  border: none;
  background: transparent;
  color: white;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease;
  outline: none;
}
.mobile-tab:hover {
  background: rgba(255, 255, 255, 0.12);
}
.mobile-tab--active {
  background: rgba(255, 255, 255, 0.22);
}
.mobile-tab--active:hover {
  background: rgba(255, 255, 255, 0.28);
}
.mobile-tab__icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

/* ── Waifus page ── */
.waifus-mode {
  background: white;
}

.waifus-mode .page-background-layer,
.waifus-mode .page-background-overlay {
  display: none;
}

.waifus-mode .page-nav {
  background: white !important;
  border-color: #e5e7eb !important;
}

.waifus-mode .page-nav mdui-button {
  color: #374151 !important;
  --mdui-color-outline: #9ca3af !important;
}

/* 移动端标签栏在白色背景页下的深色文字变体 */
.waifus-mode .mobile-nav-scroll {
  background: white !important;
  border-color: #e5e7eb !important;
}
.waifus-mode .mobile-tab {
  color: #374151;
}
.waifus-mode .mobile-tab:hover {
  background: rgba(17, 24, 39, 0.06);
}
.waifus-mode .mobile-tab--active {
  background: rgba(17, 24, 39, 0.1);
}
.waifus-mode .mobile-tab--active:hover {
  background: rgba(17, 24, 39, 0.14);
}

.waifus-mode .page-sidebar {
  background: white !important;
}

.waifus-mode .nav-item {
  color: #374151;
}

.waifus-mode .nav-item:hover {
  background: rgba(17, 24, 39, 0.06);
}

.waifus-mode .nav-item--active {
  background: rgba(17, 24, 39, 0.1);
}

.waifus-mode .nav-item--active:hover {
  background: rgba(17, 24, 39, 0.14);
}

.waifus-mode .page-main {
  background: white;
}

.waifus-content {
  min-height: 100%;
  color: #111827;
  animation: waifus-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes waifus-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.waifus-title {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.waifus-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.waifus-help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  padding: 0;
  border: 1px solid #9ca3af;
  border-radius: 50%;
  background: white;
  color: #4b5563;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.waifus-help:hover {
  background: #f3f4f6;
  color: #111827;
}

/* ── Blog page ── */
.blog-content {
  min-height: 100%;
  box-sizing: border-box;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  color: white;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.06);
  animation: waifus-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.blog-title {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.blog-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
}

.blog-heading mdui-button-icon {
  --mdui-color-on-surface: #4f46e5;
  color: #4f46e5;
}

.blog-grid {
  display: grid;
  gap: 28px;
  align-items: start;
}

.blog-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blog-card {
  display: block;
  position: relative;
  overflow: hidden;
  min-height: 130px;
  width: 100%;
  box-sizing: border-box;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #1f2937;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07), 0 6px 14px rgba(0, 0, 0, 0.05);
  transition: background-color 0.12s ease;
}

.blog-card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.45);
  outline-offset: 3px;
}

.blog-card--tone-0 { background: #fff7f7; }
.blog-card--tone-1 { background: #fffaf2; }
.blog-card--tone-2 { background: #f4fbf7; }
.blog-card--tone-3 { background: #f4f8ff; }
.blog-card--tone-4 { background: #faf7ff; }
.blog-card--tone-5 { background: #fffdf2; }

.blog-card--tone-0:hover { background: #f5eeee; }
.blog-card--tone-1:hover { background: #f5f0e9; }
.blog-card--tone-2:hover { background: #eaf1ed; }
.blog-card--tone-3:hover { background: #e9eef5; }
.blog-card--tone-4:hover { background: #efedf4; }
.blog-card--tone-5:hover { background: #f5f2e5; }

.blog-card--tone-0 .blog-card__title-text { color: #e11d48; }
.blog-card--tone-1 .blog-card__title-text { color: #c2410c; }
.blog-card--tone-2 .blog-card__title-text { color: #059669; }
.blog-card--tone-3 .blog-card__title-text { color: #2563eb; }
.blog-card--tone-4 .blog-card__title-text { color: #7c3aed; }
.blog-card--tone-5 .blog-card__title-text { color: #a16207; }

.blog-card__title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.4;
}

.blog-card__title-text {
  display: inline;
  margin-left: -8px;
  padding: 4px 8px;
  border-radius: 8px;
  color: #6366f1;
  transition: background-color 0.15s ease;
}

.blog-card__title-text:hover {
  background: #eef2ff;
}

.blog-card--tone-0 .blog-card__title-text:hover { background: #fbe1e4; }
.blog-card--tone-1 .blog-card__title-text:hover { background: #f8eadb; }
.blog-card--tone-2 .blog-card__title-text:hover { background: #e2f0e7; }
.blog-card--tone-3 .blog-card__title-text:hover { background: #e3ebf8; }
.blog-card--tone-4 .blog-card__title-text:hover { background: #eee9f6; }
.blog-card--tone-5 .blog-card__title-text:hover { background: #f4eedc; }

.blog-card__date {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 10px;
  color: #6b7280;
  font-size: 12px;
}

.blog-card__date-icon {
  font-size: 15px;
}

.blog-card__summary {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.blog-ripple {
  background: rgba(37, 99, 235, 0.18);
}

.blog-link-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.42);
}

.blog-dialog-enter-active,
.blog-dialog-leave-active {
  transition: opacity 0.22s ease;
}

.blog-dialog-enter-active .blog-link-dialog,
.blog-dialog-leave-active .blog-link-dialog {
  transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}

.blog-dialog-enter-from,
.blog-dialog-leave-to {
  opacity: 0;
}

.blog-dialog-enter-from .blog-link-dialog,
.blog-dialog-leave-to .blog-link-dialog {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}

.blog-link-dialog {
  width: min(100%, 480px);
  padding: 28px;
  border-radius: 24px;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
}

.blog-link-dialog__icon {
  display: block;
  margin-bottom: 14px;
  color: #6366f1;
  font-size: 28px;
}

.blog-link-dialog h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.blog-link-dialog__title {
  margin: 14px 0 8px;
  color: #374151;
  font-size: 15px;
}

.blog-link-dialog__url {
  margin: 0;
  overflow-wrap: anywhere;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.friend-code-value {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: #374151;
  font-size: 15px;
}

.friend-code-value code {
  padding: 4px 8px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #4f46e5;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
}

.friend-code-value mdui-button-icon {
  --mdui-color-on-surface: #4f46e5;
  color: #4f46e5;
}

.osu-profile-link {
  margin: 18px 0 0;
}

.osu-profile-link a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  border-radius: 8px;
  color: #4f46e5;
  font-size: 15px;
  overflow-wrap: anywhere;
}

.osu-profile-link__icon {
  font-size: 18px;
}

.blog-link-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.blog-state {
  padding: 40px 0;
  color: #4b5563;
  font-size: 15px;
  text-align: center;
}

.blog-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.blog-loading mdui-circular-progress {
  width: 40px;
  height: 40px;
  --mdui-color-primary: 99 102 241;
}

/* ── Works page ── */
.works-content {
  min-height: 100%;
  color: white;
  animation: waifus-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.works-title {
  margin: 0 0 32px;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.works-timeline {
  position: relative;
  max-width: 900px;
  padding: 8px 0;
}

.works-timeline::before {
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 104px;
  width: 2px;
  background: rgba(255, 255, 255, 0.42);
  content: "";
}

.works-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 96px 1fr;
  min-height: 86px;
  padding-bottom: 28px;
  align-items: start;
}

.works-timeline__node {
  position: absolute;
  top: 5px;
  left: 97px;
  z-index: 1;
  width: 14px;
  height: 14px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.22);
}

.works-timeline__year {
  grid-column: 1;
  color: white;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
}

.works-timeline__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  grid-column: 2;
  min-height: 48px;
  padding-left: 24px;
  border-radius: 12px;
}
@media (max-width: 767px) {
  .works-timeline::before {
    left: 72px;
  }
  .works-timeline__item {
    grid-template-columns: 64px 1fr;
  }
  .works-timeline__node {
    left: 65px;
  }
  .works-timeline__content {
    padding-left: 16px;
  }
}

.works-card {
  display: block;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: 16px 18px;
  border: none;
  border-radius: 14px;
  background: rgba(24, 28, 36, 0.72);
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: background-color 0.15s ease;
}

.works-card:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.55);
  outline-offset: 3px;
}

.works-card:hover {
  background: rgba(24, 28, 36, 0.82);
}

.works-card--static {
  cursor: default;
}

.works-ripple {
  background: rgba(255, 255, 255, 0.24);
}

.works-card h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
}

.works-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.86);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.works-card__tag .material-icons-round {
  font-size: 13px;
}

.works-card__tag--warning {
  background: rgba(127, 29, 29, 0.5);
  color: #fecaca;
}

.works-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 14px;
  line-height: 1.6;
}

/* ── Contact page ── */
.contact-content {
  min-height: 100%;
  color: #111827;
  animation: waifus-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.contact-title {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 860px;
  margin-top: 32px;
}

.contact-card {
  display: flex;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  gap: 14px;
  min-height: 82px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f8fafc;
  color: #1f2937;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.contact-card:hover {
  background: #eef2f7;
}

.contact-card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.35);
  outline-offset: 3px;
}

.contact-ripple {
  background: rgba(99, 102, 241, 0.18);
}

.contact-card__icon {
  color: #6366f1;
  font-size: 28px;
}

.contact-card__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.contact-card__label {
  color: #6b7280;
  font-size: 13px;
}

.contact-card__value {
  overflow-wrap: anywhere;
  color: #111827;
  font-size: 15px;
}

.contact-card__arrow {
  color: #9ca3af;
  font-size: 20px;
}

/* ── Friends page ── */
.friends-content {
  min-height: 100%;
  color: #111827;
  animation: waifus-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.friends-title {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.friends-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
}

.friends-heading mdui-button-icon {
  --mdui-color-on-surface: #4f46e5;
  color: #4f46e5;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 980px;
}

.friend-card {
  display: flex;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  gap: 14px;
  min-height: 82px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f8fafc;
  color: #1f2937;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.friend-card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.35);
  outline-offset: 3px;
}

.friend-card:hover {
  background: #eef2f7;
}

.friend-card__avatar,
.friend-card__avatar-placeholder {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 50%;
}

.friend-card__avatar {
  object-fit: cover;
}

.friend-card__avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 26px;
}

.friend-card__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.friend-card__name {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
}

.friend-card__description {
  overflow: hidden;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-card__arrow {
  color: #9ca3af;
  font-size: 20px;
}

.friends-retry {
  display: inline-block;
  margin-left: 8px;
  color: #4f46e5;
  text-decoration: underline;
  cursor: pointer;
}

.friend-ripple {
  background: rgba(99, 102, 241, 0.18);
}

.blog-state--error {
  color: #b91c1c;
}

.waifus-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 767px) {
  .waifus-grid {
    grid-template-columns: 1fr;
  }
}

.waifu-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 118px;
  padding: 18px 20px;
  border: none;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.14s ease;
  animation: waifu-card-enter 0.4s ease-out both;
}

.waifu-card:nth-child(1) { animation-delay: 0.04s; }
.waifu-card:nth-child(2) { animation-delay: 0.08s; }
.waifu-card:nth-child(3) { animation-delay: 0.12s; }
.waifu-card:nth-child(4) { animation-delay: 0.16s; }
.waifu-card:nth-child(5) { animation-delay: 0.20s; }

@keyframes waifu-card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.waifu-card:hover {
  background: #f1f5f9;
}

.waifu-card--red:hover {
  background: #fef2f2;
}

.waifu-card--green:hover {
  background: #f0fdf4;
}

.waifu-card--pink:hover {
  background: #fdf2f8;
}

.waifu-card--blue:hover {
  background: #eff6ff;
}

.waifu-card--purple:hover {
  background: #faf5ff;
}

.waifu-avatar {
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  object-fit: cover;
}

.waifu-info {
  min-width: 0;
}

.waifu-name {
  margin: 0;
  color: #111827;
  font-size: 19px;
  font-weight: 700;
}

.waifu-bio {
  margin: 6px 0 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
}

/* ── Content card (Notebook style) ── */
.content-card--notebook {
  background: rgba(253, 252, 247, 0.90); /* 90% 半透明象牙白纸底 */
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0;
  padding: 40px 48px;
  position: relative;
  overflow: hidden;
  transform: rotate(-0.8deg); /* 微微倾斜 */
  box-shadow: 0 12px 50px 8px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(0, 0, 0, 0.25); /* 更重、更立体的物理纸张双层阴影 */
  /* 制作信纸的横线 */
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 94, 32, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 94, 32, 0.25) 1px, transparent 1px);
  background-size: 100% 48px, 100% 100%, 100% 100%;
  background-position: 0 0, 160px 0, 164px 0; /* 左侧 160px 处有深绿色的装订线 */
}
@media (max-width: 767px) {
  .content-card--notebook {
    padding: 24px 16px;
    /* 标签列缩小至 w-20(80px),装订线同步左移 */
    background-position: 0 0, 112px 0, 116px 0;
  }
  /* label 强制占满整行,后面内容换行显示 */
  .content-card--notebook .notebook-label {
    width: 100% !important;
    flex: 0 0 100% !important;
  }
}

.content-card--notebook-enter-wrap {
  opacity: 1;
}

.content-card--notebook-enter {
  animation: notebook-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
}

.content-card--notebook-enter--tab {
  animation-delay: 0s;
}

.content-card--notebook:hover {
  transform: rotate(0deg);
}

.content-card--notebook {
  transition: transform 0.35s ease-out;
}

@keyframes notebook-enter {
  from {
    opacity: 0;
    transform: translateY(36px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-card--notebook::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* 极轻微的纸张噪点纹理感 */
  opacity: 0.02;
  background-image: radial-gradient(rgba(0,0,0,1) 1px, transparent 0);
  background-size: 4px 4px;
}

.content-card__title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #2c2a29; /* 优雅的铅灰色 */
  margin-bottom: 32px;
  padding-bottom: 12px;
  border-bottom: 2px solid #1565c0; /* 深蓝色主题横线 */
  position: relative;
  z-index: 2;
}

.notebook-lines {
  position: relative;
  z-index: 2;
}

.notebook-label {
  font-weight: 700;
  color: #7d726b; /* 棕灰色标签 */
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notebook-text {
  color: #3a3532; /* 钢笔黑色墨水质感 */
  font-size: 15px;
  line-height: 1.6;
}

.dropped-games-toggle {
  background: none;
  border: none;
  padding: 0 2px;
  color: #4a148c;
  font-size: 15px;
  line-height: 1.6;
  text-decoration: underline dashed;
  cursor: pointer;
}

.dropped-games-toggle:hover {
  opacity: 0.75;
}

/* ── 悬浮按钮组:语言切换 + 无障碍(两屏常驻) ── */
.float-fabs {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 60;
  display: flex;
  gap: 0.25rem;
}

.a11y-fab {
  color: white;
  --mdui-color-outline: rgba(255, 255, 255, 0.6);
  /* 强制黑色卡片底色 + 投影,任何背景下都保持可读 */
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  box-shadow: 0 8px 40px 8px rgba(0, 0, 0, 0.55), 0 2px 8px 0 rgba(0, 0, 0, 0.4);
}

/* ── 无障碍:减少动画效果 ── */
/* 用极短时长而非 animation:none,保证进场动画到达最终态(避免卡在 opacity:0) */
.a11y-reduce-motion *,
.a11y-reduce-motion *::before,
.a11y-reduce-motion *::after {
  animation-duration: 0.001ms !important;
  animation-delay: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  transition-delay: 0ms !important;
  scroll-behavior: auto !important;
}
/* 消除装饰性 transform */
.a11y-reduce-motion .content-card--notebook { transform: rotate(0deg) !important; }

/* ── 无障碍:提高背景对比度 ── */
/* 首页遮罩 20% → 70% */
.a11y-high-contrast .first-screen-overlay {
  background-color: rgba(0, 0, 0, 0.7) !important;
}
/* 第二屏遮罩 40% → 75% */
.a11y-high-contrast .page-background-overlay {
  background-color: rgba(0, 0, 0, 0.75) !important;
}

/* ── 无障碍:强制白色背景 ── */
/* 隐藏所有背景图层与遮罩 */
.a11y-force-white .first-screen-layer,
.a11y-force-white .first-screen-overlay,
.a11y-force-white .page-background-layer,
.a11y-force-white .page-background-overlay {
  display: none !important;
}
/* section 设白底 */
.a11y-force-white section {
  background: white !important;
}
/* 导航栏 / 侧边栏 / 主内容区 强制白底 */
.a11y-force-white .page-nav,
.a11y-force-white .mobile-nav-scroll,
.a11y-force-white .page-sidebar,
.a11y-force-white .page-main {
  background: white !important;
  border-color: #e5e7eb !important;
}
/* 按钮文字 / 图标在白底下变深色(悬浮按钮强制黑底白图标,不受影响) */
.a11y-force-white .page-nav mdui-button {
  color: #374151 !important;
  --mdui-color-outline: #9ca3af !important;
}
/* 「最后更新」文字在白底下变深色,并去掉黑色胶囊底 */
.a11y-force-white .last-updated {
  color: #374151 !important;
  background: transparent !important;
}
/* 导航项 / 移动标签 在白底下变深色 */
.a11y-force-white .nav-item,
.a11y-force-white .mobile-tab {
  color: #374151 !important;
}
.a11y-force-white .nav-item:hover,
.a11y-force-white .mobile-tab:hover {
  background: rgba(17, 24, 39, 0.06) !important;
}
.a11y-force-white .nav-item--active,
.a11y-force-white .mobile-tab--active {
  background: rgba(17, 24, 39, 0.1) !important;
}

/* ── 无障碍:弹窗内部样式 ── */
.a11y-dialog h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}
.a11y-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid #f3f4f6;
}
.a11y-row__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.a11y-label {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
}
.a11y-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}


</style>
