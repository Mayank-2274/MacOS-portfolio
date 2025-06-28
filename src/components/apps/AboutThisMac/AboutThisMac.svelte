<script lang="ts">
import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
import TrafficLights from '🍎/components/Desktop/Window/TrafficLights.svelte';
import { apps } from '🍎/state/apps.svelte';

let activeTab = 'Overview';
const tabs = ['Overview', 'Display', 'Storage'];

function closeApp() {
  apps.open['about-this-mac'] = false;
}
function minimizeApp() {
  apps.open['about-this-mac'] = false;
}
function maximizeApp() {
  // About This Mac doesn't support maximize
}
</script>

<div class="about-mac-window">
  <header class="titlebar app-window-drag-handle">
    
    <span class="window-title">About This Mac</span>
  </header>
  <nav class="tabs">
    {#each tabs as tab}
      <button class:active={activeTab === tab} on:click={() => (activeTab = tab)}>{tab}</button>
    {/each}
  </nav>
  <main class="content">
    {#if activeTab === 'Overview'}
      <div class="left">
        <img class="profile-img" src="/app-icons/mayank-profile/256.webp" alt="Profile" />
      </div>
      <div class="right">
        <h1>macOS Sequoia</h1>
        <div class="version">Version 14.0 Beta (23A5043h)</div>
        <div class="info">
          <div>MacBook Air (M2, 2022)</div>
          <div>Chip Apple M2</div>
          <div>Memory 8 GB</div>
          <div>Serial Number xxxxxxxx</div>
        </div>
        <div class="buttons">
          <button class="system-report">System Report...</button>
          <button class="software-update">Software Update...</button>
        </div>
      </div>
    {:else if activeTab === 'Display'}
      <div class="display-content">
        <h2>Displays</h2>
        <div class="display-info">
          <div class="display-item">
            <div class="display-name">Built-in Retina Display</div>
            <div class="display-details">
              <div>13.6-inch (diagonal) LED-backlit display</div>
              <div>2560-by-1664 native resolution at 224 pixels per inch</div>
              <div>Support for millions of colors</div>
              <div>500 nits brightness</div>
              <div>True Tone technology</div>
            </div>
          </div>
          <div class="display-item">
            <div class="display-name">Graphics</div>
            <div class="display-details">
              <div>Apple M2 integrated graphics</div>
              <div>8-core GPU</div>
              <div>Up to 10-core GPU with 10-core Neural Engine</div>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'Storage'}
      <div class="storage-content">
        <h2>Storage</h2>
        <div class="storage-info">
          <div class="storage-item">
            <div class="storage-name">Macintosh HD</div>
            <div class="storage-bar">
              <div class="storage-used" style="width: 65%"></div>
            </div>
            <div class="storage-details">
              <div>Used: 289.5 GB of 512 GB</div>
              <div>Available: 222.5 GB</div>
            </div>
          </div>
          <div class="storage-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">Applications:</span>
              <span class="breakdown-size">55.2 GB</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Documents:</span>
              <span class="breakdown-size">187 GB</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">System:</span>
              <span class="breakdown-size">15.3 GB</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Other:</span>
              <span class="breakdown-size">32 GB</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
  <footer class="footer">
    <span>* and © 1983 – 2025 Apple Inc. All rights reserved.  License  Agreement</span>
  </footer>
</div>

<style>
.about-mac-window {
  width: 480px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  border: 1px solid #e0e0e0;
}
.titlebar {
  display: flex;
  align-items: center;
  height: 36px;
  background: #f5f5f7;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 12px;
  gap: 12px;
}


.window-title {
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: #5f5f5f;
}
.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f7;
  padding-left: 24px;
  gap: 2px;
}
.tabs button {
  background: none;
  border: none;
  padding: 8px 18px 7px 18px;
  font-size: 15px;
  color: #555;
  border-radius: 8px 8px 0 0;
  margin-bottom: -1px;
  cursor: pointer;
  transition: background 0.15s;
}
.tabs button.active {
  background: #fff;
  color: #222;
  border-bottom: 2px solid #fff;
  font-weight: 500;
}
.content {
  display: flex;
  flex-direction: row;
  padding: 32px 32px 16px 32px;
  gap: 32px;
}
.left {
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-img {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
}
.right h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2px 0;
}
.version {
  color: #888;
  font-size: 1rem;
  margin-bottom: 10px;
}
.info {
  color: #444;
  font-size: 1rem;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.system-report, .software-update {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 0.98rem;
  color: #222;
  cursor: pointer;
  transition: background 0.15s;
}
.system-report:hover, .software-update:hover {
  background: #e9e9eb;
}

/* Display tab styles */
.display-content {
  width: 100%;
}
.display-content h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #222;
}
.display-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.display-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}
.display-item:last-child {
  border-bottom: none;
}
.display-name {
  font-weight: 600;
  font-size: 1rem;
  color: #222;
  margin-bottom: 8px;
}
.display-details {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Storage tab styles */
.storage-content {
  width: 100%;
}
.storage-content h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #222;
}
.storage-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.storage-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}
.storage-name {
  font-weight: 600;
  font-size: 1rem;
  color: #222;
  margin-bottom: 8px;
}
.storage-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}
.storage-used {
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #5856D6);
  border-radius: 4px;
  transition: width 0.3s ease;
}
.storage-details {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.storage-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}
.breakdown-label {
  color: #666;
  font-size: 0.9rem;
}
.breakdown-size {
  color: #222;
  font-size: 0.9rem;
  font-weight: 500;
}

.footer {
  background: #f5f5f7;
  color: #888;
  font-size: 0.85rem;
  text-align: center;
  padding: 8px 0 7px 0;
  border-top: 1px solid #e0e0e0;
}
</style> 