---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "OceanHelm's Blog"
  text: "Smart Maritime Software"
  tagline: Marine operations digitalization, update on global maritime news and OceanHelm.
  image:
    src: https://github.com/user-attachments/assets/3ce04ace-8c11-494f-bc3a-dcb44e8dd473
    alt: VitePress
  actions:
    - theme: brand
      text: Latest Post
      link: /posts/digitalizing-vessel-operations-tracking
    - theme: alt
      text: Try OceanHelm
      link: https://www.oceanhelmtech.com

---

## Latest Posts

<script setup>
import { data as posts } from './.vitepress/posts.data.ts'
</script>

<div class="posts-grid">
  <div v-for="post in posts" :key="post.slug" class="post-card">
    <img v-if="post.image" :src="post.image" :alt="post.title" />
    <h3><a :href="post.url">{{ post.title }}</a></h3>
    <p>{{ post.description }}</p>
    <small>{{ post.date.string }}</small>
  </div>
</div>
