'use client';

import React from 'react';

export default function GlobalFooter() {
  return (
    <footer className="global-footer">
      <div className="footer-left">
        <div>© 2026 UniOS. All rights reserved.</div>
        <div className="system-status-row">
          <span>⚙️ Background Architecture Layer Active: Connected to UniOS Core AI Engine</span>
        </div>
      </div>
      <div className="footer-right">
        <a href="#">System Docs v1.0</a>
        <span className="divider">|</span>
        <div className="footer-status-token">
          <span className="status-dot"></span>
          <a href="#">API Status</a>
        </div>
        <span className="divider">|</span>
        <a href="#">Support</a>
      </div>
    </footer>
  );
}
