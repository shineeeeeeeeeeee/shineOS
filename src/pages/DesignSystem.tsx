import React from 'react'
import IconButton from '../components/IconButton'
import Tooltip from '../components/Tooltip'
import BasicButton from '../components/BasicButton'
import Panel from '../components/Panel'
import WindowFrame from '../components/WindowFrame'
import './DesignSystem.css'

const DesignSystem: React.FC = () => {
  return (
    <div className="design-system">
      <header className="design-system__header">
        <h1 className="design-system__title">is-not.cool</h1>
        <p className="design-system__subtitle">Design System — Phase 1</p>
      </header>

      <main className="design-system__content">
        {/* Typography */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Typography</h2>
          <Panel title="Font Families">
            <div className="design-system__type-sample">
              <span className="design-system__type-label">UI Font (Inter / System)</span>
              <p className="design-system__type-ui">
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
            <div className="design-system__type-sample">
              <span className="design-system__type-label">Display Font (Caveat / Handwritten)</span>
              <p className="design-system__type-display">
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
          </Panel>
        </section>

        {/* Colors */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Colors</h2>
          <Panel title="Palette">
            <div className="design-system__color-grid">
              {[
                { name: 'Background', var: '--color-bg' },
                { name: 'Foreground', var: '--color-fg' },
                { name: 'Muted', var: '--color-muted' },
                { name: 'Accent', var: '--color-accent' },
                { name: 'Window BG', var: '--color-window-bg' },
                { name: 'Window Border', var: '--color-window-border' },
                { name: 'Desktop BG', var: '--color-desktop-bg' },
                { name: 'Selection', var: '--color-selection' },
                { name: 'Success', var: '--color-success' },
                { name: 'Warning', var: '--color-warning' },
                { name: 'Error', var: '--color-error' },
              ].map((color) => (
                <div key={color.var} className="design-system__color-swatch">
                  <div
                    className="design-system__color-preview"
                    style={{ backgroundColor: `var(${color.var})` }}
                  />
                  <span className="design-system__color-name">{color.name}</span>
                  <code className="design-system__color-var">{color.var}</code>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Spacing */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Spacing</h2>
          <Panel title="Scale (4px base)">
            <div className="design-system__spacing-list">
              {[
                { name: 'space-1', value: '4px' },
                { name: 'space-2', value: '8px' },
                { name: 'space-3', value: '12px' },
                { name: 'space-4', value: '16px' },
                { name: 'space-5', value: '20px' },
                { name: 'space-6', value: '24px' },
                { name: 'space-8', value: '32px' },
                { name: 'space-10', value: '40px' },
                { name: 'space-12', value: '48px' },
                { name: 'space-16', value: '64px' },
              ].map((s) => (
                <div key={s.name} className="design-system__spacing-item">
                  <div className="design-system__spacing-bar" style={{ width: s.value }} />
                  <span className="design-system__spacing-name">{s.name}</span>
                  <code className="design-system__spacing-value">{s.value}</code>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Radii */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Radii</h2>
          <Panel title="Corner Radius">
            <div className="design-system__radius-list">
              {[
                { name: 'radius-sm', value: '4px' },
                { name: 'radius-md', value: '8px' },
                { name: 'radius-lg', value: '12px' },
                { name: 'radius-xl', value: '16px' },
                { name: 'radius-full', value: '9999px' },
              ].map((r) => (
                <div key={r.name} className="design-system__radius-item">
                  <div className="design-system__radius-preview" style={{ borderRadius: r.value }} />
                  <span className="design-system__radius-name">{r.name}</span>
                  <code className="design-system__radius-value">{r.value}</code>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Shadows */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Shadows</h2>
          <Panel title="Elevation">
            <div className="design-system__shadow-list">
              {[
                { name: 'shadow-sm', value: 'var(--shadow-sm)' },
                { name: 'shadow-md', value: 'var(--shadow-md)' },
                { name: 'shadow-lg', value: 'var(--shadow-lg)' },
                { name: 'shadow-window', value: 'var(--shadow-window)' },
                { name: 'shadow-inset', value: 'var(--shadow-inset)' },
              ].map((s) => (
                <div key={s.name} className="design-system__shadow-item">
                  <div className="design-system__shadow-preview" style={{ boxShadow: s.value }} />
                  <span className="design-system__shadow-name">{s.name}</span>
                  <code className="design-system__shadow-value">{s.value}</code>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Buttons */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Buttons</h2>
          <Panel title="BasicButton Variants">
            <div className="design-system__button-row">
              <BasicButton variant="default">Default</BasicButton>
              <BasicButton variant="primary">Primary</BasicButton>
              <BasicButton variant="secondary">Secondary</BasicButton>
              <BasicButton variant="danger">Danger</BasicButton>
            </div>
            <div className="design-system__button-row">
              <BasicButton variant="primary" size="sm">Small</BasicButton>
              <BasicButton variant="primary" size="md">Medium</BasicButton>
              <BasicButton variant="primary" size="lg">Large</BasicButton>
            </div>
            <div className="design-system__button-row">
              <BasicButton variant="primary" disabled>Disabled</BasicButton>
            </div>
          </Panel>

          <Panel title="IconButton Variants" className="design-system__panel-gap">
            <div className="design-system__button-row">
              <Tooltip text="Default">
                <IconButton variant="default" label="Default">★</IconButton>
              </Tooltip>
              <Tooltip text="Primary">
                <IconButton variant="primary" label="Primary">★</IconButton>
              </Tooltip>
              <Tooltip text="Ghost">
                <IconButton variant="ghost" label="Ghost">★</IconButton>
              </Tooltip>
            </div>
            <div className="design-system__button-row">
              <Tooltip text="Small">
                <IconButton variant="default" size="sm" label="Small">★</IconButton>
              </Tooltip>
              <Tooltip text="Medium">
                <IconButton variant="default" size="md" label="Medium">★</IconButton>
              </Tooltip>
              <Tooltip text="Large">
                <IconButton variant="default" size="lg" label="Large">★</IconButton>
              </Tooltip>
            </div>
            <div className="design-system__button-row">
              <Tooltip text="Disabled">
                <IconButton variant="default" disabled label="Disabled">★</IconButton>
              </Tooltip>
            </div>
          </Panel>
        </section>

        {/* Window Frame */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Window Frame</h2>
          <Panel title="Window Component">
            <div className="design-system__window-demo">
              <WindowFrame title="Hello World" width={320} onClose={() => {}}>
                <div style={{ padding: '16px' }}>
                  <p style={{ marginBottom: '12px' }}>
                    This is a sample window frame with traffic lights and a close button.
                  </p>
                  <BasicButton variant="primary" fullWidth>Action</BasicButton>
                </div>
              </WindowFrame>
            </div>
          </Panel>
        </section>

        {/* Focus States */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Focus States</h2>
          <Panel title="Keyboard Navigation">
            <p className="design-system__hint">
              Tab through the elements below to verify focus rings.
            </p>
            <div className="design-system__focus-row">
              <BasicButton variant="primary">Focusable Button</BasicButton>
              <IconButton variant="default" label="Focusable Icon">★</IconButton>
            </div>
          </Panel>
        </section>

        {/* Reduced Motion */}
        <section className="design-system__section">
          <h2 className="design-system__section-title">Reduced Motion</h2>
          <Panel title="Accessibility">
            <p className="design-system__hint">
              If your system has reduced motion enabled, all animations and transitions
              should be suppressed. Toggle it in your OS accessibility settings to verify.
            </p>
          </Panel>
        </section>
      </main>

      <footer className="design-system__footer">
        <p>is-not.cool — Phase 1 Visual Foundation</p>
      </footer>
    </div>
  )
}

export default DesignSystem
