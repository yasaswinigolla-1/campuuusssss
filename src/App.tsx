import { useState } from 'react';
import { useStore } from './store';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { LoginRegister } from './pages/LoginRegister';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { Browse } from './pages/Browse';
import { ItemDetail } from './pages/ItemDetail';
import { ClaimRequests } from './pages/ClaimRequests';
import { Chat } from './pages/Chat';
import type { Page, ReportedItem } from './types';

function AppContent() {
  const store = useStore();
  const [page, setPage] = useState<Page>('login');
  const [selectedItem, setSelectedItem] = useState<ReportedItem | null>(null);
  const [chatItem, setChatItem] = useState<ReportedItem | null>(null);

  function navigate(p: Page) {
    setPage(p);
  }

  function handleLoginSuccess() {
    setPage('home');
  }

  function handleLogout() {
    store.logout();
    setPage('login');
  }

  function handleSelectItem(item: ReportedItem) {
    setSelectedItem(item);
    setPage('detail');
  }

  function handleOpenChat(item: ReportedItem) {
    setChatItem(item);
    setPage('chat');
  }

  // Not logged in → show login/register
  if (!store.currentUser || page === 'login') {
    return <LoginRegister store={store} onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        user={store.currentUser}
        onLogout={handleLogout}
      />
      <main>
        {page === 'home' && <Home onNavigate={navigate} userName={store.currentUser.name} />}
        {page === 'report' && <Report store={store} onDone={() => navigate('browse')} />}
        {page === 'browse' && <Browse store={store} onSelectItem={handleSelectItem} />}
        {page === 'detail' && selectedItem && (
          <ItemDetail
            store={store}
            item={selectedItem}
            onBack={() => navigate('browse')}
            onOpenChat={handleOpenChat}
            onNavigateClaims={() => navigate('claims')}
          />
        )}
        {page === 'claims' && <ClaimRequests store={store} onOpenChat={handleOpenChat} />}
        {page === 'chat' && chatItem && (
          <Chat store={store} item={chatItem} onBack={() => navigate('claims')} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
