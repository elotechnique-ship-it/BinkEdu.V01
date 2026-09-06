import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Platform = 'ios' | 'android-desktop' | 'installed';
type InstallStatus = 'idle' | 'installing' | 'installed' | 'dismissed';

const BRAND_COLOR = '#2563eb';
const BRAND_COLOR_DARK = '#1d4ed8';

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<Platform>('android-desktop');
  const [installStatus, setInstallStatus] = useState<InstallStatus>('idle');

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setPlatform('installed');
      return;
    }

    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIOS) {
      setPlatform('ios');
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android-desktop');
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => setInstallStatus('installed');
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstallStatus('installing');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setInstallStatus(outcome === 'accepted' ? 'installed' : 'dismissed');
    setDeferredPrompt(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logoWrap}>
          <img src="/icon-192.png" alt="BinkEdu" style={styles.logo} />
        </div>

        <h1 style={styles.title}>BinkEdu</h1>
        <p style={styles.subtitle}>Portail de gestion scolaire</p>
        <p style={styles.tagline}>
          Élèves, classes, bulletins, comptabilité — pensé pour le Sénégal
        </p>

        <div style={styles.divider} />

        {platform === 'installed' || installStatus === 'installed' ? (
          <div style={styles.statusCard}>
            <div style={styles.checkIcon}>✓</div>
            <p style={styles.statusText}>BinkEdu est déjà installé sur cet appareil.</p>
          </div>
        ) : platform === 'ios' ? (
          <div style={styles.instructionCard}>
            <p style={styles.instructionTitle}>Installer sur iPhone / iPad</p>
            <ol style={styles.list}>
              <li>
                Appuyez sur <strong>Partager</strong>{' '}
                <span style={styles.iconInline}>⬆️</span> en bas de Safari
              </li>
              <li>
                Faites défiler puis appuyez sur <strong>« Sur l'écran d'accueil »</strong>
              </li>
              <li>
                Appuyez sur <strong>« Ajouter »</strong> en haut à droite
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <button style={styles.installButton} onClick={handleInstall}>
            Installer l'application
          </button>
        ) : installStatus === 'dismissed' ? (
          <div style={styles.instructionCard}>
            <p style={styles.statusText}>Installation annulée.</p>
            <button style={styles.retryButton} onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        ) : (
          <div style={styles.instructionCard}>
            <p style={styles.instructionTitle}>Installer sur Android / PC</p>
            <p style={styles.instructionText}>
              Ouvrez cette page avec <strong>Chrome</strong> ou <strong>Edge</strong>, puis
              utilisez le menu <strong>⋮</strong> en haut à droite et choisissez{' '}
              <strong>« Installer l'application »</strong>.
            </p>
          </div>
        )}

        <Link to="/" style={styles.skipLink}>
          Continuer sans installer →
        </Link>
      </div>

      <p style={styles.footer}>
        © 2026 BinkEdu — Plateforme de gestion scolaire. Tous droits réservés.
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    padding: '24px',
  },
  container: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    background: `linear-gradient(135deg, ${BRAND_COLOR}, ${BRAND_COLOR_DARK})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: `0 8px 24px ${BRAND_COLOR}33`,
    overflow: 'hidden',
  },
  logo: { width: '100%', height: '100%', objectFit: 'cover' },
  title: { fontSize: 26, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 15, color: '#4b5563', marginTop: 4, marginBottom: 8, fontWeight: 500 },
  tagline: { fontSize: 13, color: '#9ca3af', marginBottom: 28, lineHeight: 1.5 },
  divider: { width: 40, height: 3, borderRadius: 2, background: BRAND_COLOR, marginBottom: 28 },
  installButton: {
    background: BRAND_COLOR,
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    padding: '16px 36px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    boxShadow: `0 4px 14px ${BRAND_COLOR}4d`,
  },
  retryButton: {
    marginTop: 12,
    background: 'transparent',
    color: BRAND_COLOR,
    border: `1.5px solid ${BRAND_COLOR}`,
    borderRadius: 10,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  statusCard: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 14,
    padding: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  checkIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#22c55e',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
  },
  statusText: { fontSize: 14, color: '#166534', margin: 0 },
  instructionCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '22px',
    width: '100%',
    textAlign: 'left',
  },
  instructionTitle: { fontSize: 15, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 12 },
  instructionText: { fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: 0 },
  list: { paddingLeft: 20, margin: 0, color: '#4b5563', fontSize: 14, lineHeight: 2 },
  iconInline: { fontSize: 14 },
  skipLink: { marginTop: 24, color: '#9ca3af', fontSize: 13, textDecoration: 'none' },
  footer: { marginTop: 40, fontSize: 12, color: '#d1d5db' },
};
