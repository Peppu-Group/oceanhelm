---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "OceanHelm's Blog"
  text: "Smart Maritime Software"
  tagline: Marine operations digitalization, update on global maritime news and OceanHelm.
  image:
    src: https://github-production-user-asset-6210df.s3.amazonaws.com/62933980/485815498-1eec2add-cb6d-43ae-a83a-a7453d26d530.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250904%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250904T185041Z&X-Amz-Expires=300&X-Amz-Signature=eda6234f573c39e4e4e159979fd87855b186769dec6255937c64e87658dbb00f&X-Amz-SignedHeaders=host
    alt: VitePress
  actions:
    - theme: brand
      text: Latest Posts
      link: /markdown-examples
    - theme: alt
      text: Try OceanHelm
      link: /api-examples

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
