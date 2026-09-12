---
title: Feedback
description: Tell us what broke in the Scry Figma plugin or the Scry CLI.
editLink: false
lastUpdated: false
---

<script setup>
import { ref, onMounted } from 'vue'

const ENDPOINT = 'https://scry-feedback.epinnock.workers.dev/submit'
const SUPPORT_EMAIL = 'feedback@scrymore.com'

const form = ref({
  q1_linked: '',
  q2_suggest: '',
  q3_expected: '',
  q4_tools: '',
  q5_would_miss: '',
  email: '',
  website: '', // honeypot, hidden from people
})

const state = ref('idle') // idle | sending | sent | error
const error = ref('')
const source = ref('docs')
const pluginVersion = ref('')

onMounted(() => {
  // The plugin links here as /feedback?src=plugin-footer&v=1.4.0, so a reply
  // can be traced back to the surface and build it came from.
  const params = new URLSearchParams(window.location.search)
  source.value = (params.get('src') || 'docs').slice(0, 40)
  pluginVersion.value = (params.get('v') || '').slice(0, 40)
})

const answered = () =>
  Boolean(
    form.value.q1_linked ||
      form.value.q2_suggest ||
      form.value.q3_expected ||
      form.value.q4_tools ||
      form.value.q5_would_miss,
  )

async function submit() {
  if (state.value === 'sending') return
  if (!answered()) {
    error.value = 'Answer at least one question, then send.'
    state.value = 'error'
    return
  }
  state.value = 'sending'
  error.value = ''
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        source: source.value,
        plugin_version: pluginVersion.value,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Something went wrong (${res.status}).`)
    state.value = 'sent'
  } catch (e) {
    error.value = e.message || 'Could not reach the server.'
    state.value = 'error'
  }
}
</script>

# Feedback

I'm one person building this, and I read every reply. Nothing here is required —
answer the questions you have an answer for and skip the rest. If something broke,
question 3 is the one I care about most.

<div v-if="state === 'sent'" class="scry-sent">
  <p><strong>Got it — thank you.</strong></p>
  <p>
    If you left an email I'll come back to you within a day or two. If you'd rather
    talk it through, mail me at <a :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>.
  </p>
</div>

<form v-else class="scry-form" @submit.prevent="submit">
  <label class="scry-field">
    <span class="scry-q">1. What did you link first, and did it work?</span>
    <textarea v-model="form.q1_linked" rows="3" placeholder="e.g. our Button component — linked fine, but the preview was blank"></textarea>
  </label>

  <label class="scry-field">
    <span class="scry-q">2. Did Suggest links get the matches right? Roughly what share?</span>
    <textarea v-model="form.q2_suggest" rows="3" placeholder="e.g. about half; screens were good, icons were wrong"></textarea>
  </label>

  <label class="scry-field">
    <span class="scry-q">3. What did you expect to happen that didn't?</span>
    <textarea v-model="form.q3_expected" rows="3" placeholder="The bad news goes here."></textarea>
  </label>

  <label class="scry-field">
    <span class="scry-q">4. Do you use Chromatic or Storybook Connect today?</span>
    <input v-model="form.q4_tools" type="text" placeholder="e.g. Chromatic in CI, no Storybook Connect" />
  </label>

  <fieldset class="scry-field">
    <legend class="scry-q">5. Would you miss this plugin if it disappeared tomorrow?</legend>
    <div class="scry-choices">
      <label v-for="choice in ['yes', 'a little', 'no']" :key="choice" class="scry-choice">
        <input v-model="form.q5_would_miss" type="radio" :value="choice" />
        <span>{{ choice }}</span>
      </label>
    </div>
  </fieldset>

  <label class="scry-field">
    <span class="scry-q">Your email — optional, only if you're open to a 15-minute call</span>
    <input v-model="form.email" type="email" placeholder="you@company.com" />
  </label>

  <!-- Honeypot: hidden from people, catnip for bots. -->
  <label class="scry-hp" aria-hidden="true">
    Leave this empty
    <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
  </label>

  <div class="scry-actions">
    <button type="submit" :disabled="state === 'sending'">
      {{ state === 'sending' ? 'Sending…' : 'Send feedback' }}
    </button>
    <span v-if="state === 'error'" class="scry-error">{{ error }}</span>
  </div>
</form>

## Other ways to reach me

- **Email** — <a :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>. Always works, including if the form above fails on you.
- **Figma Community** — comment on the [plugin listing](https://www.figma.com/community/plugin/1602918953997015259). Public, and I answer within a day.
- **Something already broken?** [Troubleshooting](/guide/figma-plugin#troubleshooting) covers the three failures people actually hit: CORS on connect, "File unidentified", and a stale plugin build.

<style scoped>
.scry-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
  max-width: 44rem;
}
.scry-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 0;
  padding: 0;
  margin: 0;
}
.scry-q {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  padding: 0;
}
.scry-form textarea,
.scry-form input[type='text'],
.scry-form input[type='email'] {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font: inherit;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.2s;
}
.scry-form textarea:focus,
.scry-form input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.scry-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.5rem;
}
.scry-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  cursor: pointer;
}
.scry-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.scry-form button {
  padding: 0.55rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.scry-form button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}
.scry-form button:disabled {
  opacity: 0.6;
  cursor: default;
}
.scry-error {
  color: var(--vp-c-danger-1);
  font-size: 0.9rem;
}
.scry-sent {
  margin: 2rem 0;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.scry-sent p:first-child {
  margin-top: 0;
}
.scry-sent p:last-child {
  margin-bottom: 0;
}
.scry-hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
