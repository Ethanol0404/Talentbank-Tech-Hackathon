'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CohortAnalytics() {
  const chartData = {
    labels: ['Sem 1, 2024', 'Sem 2, 2024', 'Sem 1, 2025', 'Sem 2, 2025'],
    datasets: [
      {
        label: 'Technical Core (SQL/Python)',
        data: [62, 70, 78, 85],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      },
      {
        label: 'Agile & Industry PM',
        data: [50, 58, 62, 74],
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  const applyUpdates = () => {
    alert("Applying curriculum updates to academic matrices. Reloading matrix mappings...");
  };

  return (
    <div className="view-panel active">
      <div className="mb-24">
        <h2>Academic Analytics & Optimization Hub</h2>
        <p>Cohort performance trends and system generated curriculum improvement recommendations.</p>
      </div>

      <div className="split-grid">
        {/* Left Side Card Panel: Line Graph */}
        <div className="card">
          <div className="card-title">Lecturer Analytics: Cohort Skill Attainment Trends</div>
          <div style={{ height: '300px', position: 'relative' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Right Side Card Panel: AI Recommendations Checklist */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">AI Curriculum Improvements</div>
          <p className="mb-12" style={{ fontSize: '0.85rem' }}>Select optimization updates to apply to the syllabus mapping:</p>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }} id="curriculum-improvements-list">
            <div className="checklist-item">
              <label className="checklist-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" defaultChecked style={{ marginRight: '8px', marginTop: '4px' }} />
                <div>
                  <strong>Append 'Kubernetes Deployments' to SEC-4001 Cloud Lab.</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Reason: Required in 45% of partner job listings.</p>
                </div>
              </label>
            </div>
            <div className="checklist-item">
              <label className="checklist-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" style={{ marginRight: '8px', marginTop: '4px' }} />
                <div>
                  <strong>Add 'Tableau Dashboard' visual models to SEC-3013 SQL.</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Reason: Highlighted as gap in 30% of Student cohort analytics.</p>
                </div>
              </label>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button className="btn btn-primary" id="apply-system-updates-btn" onClick={applyUpdates}>Apply System Updates</button>
          </div>
        </div>
      </div>
    </div>
  );
}
